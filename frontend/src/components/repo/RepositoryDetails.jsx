import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./repoDetails.css";

const RepositoryDetails = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();

  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRepositoryDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const repoResponse = await fetch(`http://localhost:3000/repo/${repoId}`);
      if (!repoResponse.ok) {
        throw new Error("Repository not found");
      }
      const repoData = await repoResponse.json();
      setRepository(repoData);

      try {
        const pullResponse = await fetch(`http://localhost:3000/repo/${repoId}/pull`);
        if (pullResponse.ok) {
          const pullData = await pullResponse.json();
          setFiles(pullData.files || []);
        } else {
          setFiles(repoData.content || []);
        }
      } catch (pullError) {
        console.warn("Pull error:", pullError);
        setFiles(repoData.content || []);
      }
    } catch (err) {
      console.error("Error fetching repository:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    fetchRepositoryDetails();
  }, [fetchRepositoryDetails]);

  const getLanguage = (filename) => {
    if (!filename) return 'plaintext';
    const ext = filename.split('.').pop().toLowerCase();
    const langMap = {
      js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
      html: 'html', xml: 'xml', css: 'css', scss: 'scss',
      json: 'json', md: 'markdown', py: 'python', java: 'java',
      cpp: 'cpp', c: 'c', go: 'go', rb: 'ruby', php: 'php',
      swift: 'swift', kt: 'kotlin', yml: 'yaml', yaml: 'yaml'
    };
    return langMap[ext] || 'plaintext';
  };

  const handleFileClick = useCallback((file) => {
    setSelectedFile(file.filename);
    setLoadingFile(true);

    if (file.content) {
      setFileContent(file.content);
      setLoadingFile(false);
    } else {
      fetchFileContent(file.filename);
    }
  }, []);

  const fetchFileContent = async (filename) => {
    try {
      const response = await fetch(
        `http://localhost:3000/repo/${repoId}/file/${filename}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch file content");
      }

      const data = await response.json();
      const content = data.content || data.file?.content || "";
      setFileContent(content);
    } catch (err) {
      console.error("Error fetching file content:", err);
      setFileContent("// Error loading file content");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target.result;
        const fileType = file.name.split('.').pop();

        try {
          const response = await fetch(`http://localhost:3000/repo/${repoId}/file`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              content: content,
              fileType: fileType
            })
          });

          if (response.ok) {
            alert('File uploaded successfully!');
            setShowUploadModal(false);
            await fetchRepositoryDetails();
          } else {
            const errorData = await response.json();
            alert(`Failed to upload file: ${errorData.error || 'Unknown error'}`);
          }
        } catch (error) {
          alert('Error uploading file');
          console.error(error);
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        alert('Error reading file');
        setUploading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading file:', error);
      setUploading(false);
    }
  };

  const handleDeleteFile = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/repo/${repoId}/file/${filename}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        alert('File deleted successfully!');
        if (selectedFile === filename) {
          setSelectedFile(null);
          setFileContent("");
        }
        await fetchRepositoryDetails();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete file: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error deleting file');
      console.error(error);
    }
  };

  const handleDeleteRepository = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${repository.name}"?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:3000/repo/delete/${repoId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        alert("Failed to delete repository");
        return;
      }

      alert("Repository deleted successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error deleting repository");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileContent);
    alert('Code copied to clipboard!');
  };

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="repo-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="repo-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-link">Back to Dashboard</Link>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="repo-details-error">
        <h2>Repository not found</h2>
        <Link to="/" className="back-link">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="repo-details-container">
      
      {/* Top Navigation Bar */}
      <div className="repo-top-bar">
        <div className="repo-top-left">
          <Link to="/" className="back-icon" title="Back to dashboard">
            <img src="../src/assets/RepoVault.svg" alt="RepoVault Logo" style={{ height: "2.4rem" }} />
          </Link>
          <h1 className="repo-title">{repository.name}</h1>
          <span className={`repo-badge ${repository.visibility ? "public" : "private"}`}>
            {repository.visibility ? "Public" : "Private"}
          </span>
          {/* <button
            className="repo-delete-btn"
            title="Delete repository"
            onClick={handleDeleteRepository}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675l.66 6.6a.25.25 0 00.249.225h5.19a.25.25 0 00.249-.225l.66-6.6a.75.75 0 011.492.149l-.66 6.6A1.748 1.748 0 0110.595 15h-5.19a1.75 1.75 0 01-1.741-1.575l-.66-6.6a.75.75 0 111.492-.15z" />
            </svg>
          </button> */}

          <div className="repo-top-right">
          <Link to="/profile" className="user-profile-link" title="View profile">
            <div className="user-avatar">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
              </svg>
            </div>
            <span className="user-name"></span>
          </Link>
        </div>
      </div>
        </div>
        
        {/* User Profile Section */}
        {/* <div className="repo-top-right">
          <Link to="/profile" className="user-profile-link" title="View profile">
            <div className="user-avatar">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
              </svg>
            </div>
            <span className="user-name"></span>
          </Link>
        </div>
      </div> */}

      {/* Secondary Bar */}
      <div className="repo-secondary-bar">
        <div className="secondary-left">
          <button className="branch-selector">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
            </svg>
            main
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" />
            </svg>
          </button>
          <button className="branch-info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
            </svg>
            1 Branch
          </button>
          <button className="branch-info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            0 Tags
          </button>
        </div>
        <div className="secondary-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Go to file"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd>t</kbd>
          </div>

          <button className="code-btn" onClick={() => setShowUploadModal(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.75 14A1.75 1.75 0 011 12.25v-2.5a.75.75 0 011.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25v-2.5a.75.75 0 011.5 0v2.5A1.75 1.75 0 0113.25 14H2.75z" />
              <path d="M7.25 7.689V2a.75.75 0 011.5 0v5.689l1.97-1.969a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 6.78a.75.75 0 111.06-1.06l1.97 1.969z" />
            </svg>
            Add File
          </button>
        </div>
      </div>

      {/* Commit Info Bar */}
      <div className="commit-info-bar">
        <div className="commit-info">
          <div className="commit-avatar">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
            </svg>
          </div>
          <div className="commit-details">
            <span className="commit-author">Files in "{repository.name}"</span>
            {repository.description && (
              <span className="commit-message">{repository.description}</span>
            )}
          </div>
        </div>
        <div className="commit-meta">
          <span className="commit-hash">
            {repository._id?.substring(0, 7) || ""}
          </span>
          <span className="commit-time">
            {repository.updatedAt
              ? new Date(repository.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })
              : ""}
          </span>
          <button className="commits-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32zM8 6a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {files.length} {files.length === 1 ? 'File' : 'Files'}
          </button>
        </div>
      </div>

      {/* Files Table */}
      <div className="files-container">
        {filteredFiles.length === 0 ? (
          <div className="no-files-state">
            <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z" />
            </svg>
            <h3>{searchQuery ? 'No files found' : 'No files yet'}</h3>
            <p>{searchQuery ? 'Try a different search term' : 'Add files to your repository to get started'}</p>
            {!searchQuery && (
              <button className="add-file-btn" onClick={() => setShowUploadModal(true)}>
                Add File
              </button>
            )}
          </div>
        ) : (
          <table className="files-table">
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr key={index} className="file-row">
                  <td className="file-icon-cell">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 019 4.25V1.5H3.75z" />
                    </svg>
                  </td>
                  <td className="file-name-cell">
                    <button
                      className="file-name-link"
                      onClick={() => handleFileClick(file)}
                    >
                      {file.filename}
                    </button>
                  </td>
                  <td className="file-message-cell">
                    {repository.description || "Add file"}
                  </td>
                  <td className="file-time-cell">
                    {file.uploadedAt
                      ? new Date(file.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                      : "recently"}
                  </td>
                  <td className="file-actions-cell">
                    <button
                      className="delete-file-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.filename);
                      }}
                      title="Delete file"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675l.66 6.6a.25.25 0 00.249.225h5.19a.25.25 0 00.249-.225l.66-6.6a.75.75 0 011.492.149l-.66 6.6A1.748 1.748 0 0110.595 15h-5.19a1.75 1.75 0 01-1.741-1.575l-.66-6.6a.75.75 0 111.492-.15zM6.5 1.75V3h3V1.75a.25.25 0 00-.25-.25h-2.5a.25.25 0 00-.25.25z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* File Viewer Section */}
      {selectedFile && (
        <div className="readme-section">
          <div className="readme-header">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 019 4.25V1.5H3.75z" />
            </svg>
            <span>{selectedFile}</span>
          </div>
          <div className="file-viewer-content">
            <div className="file-viewer-header">
              <div className="file-header-left">
                <span className="file-language-badge">{getLanguage(selectedFile)}</span>
                <span className="file-size">{(fileContent.length / 1024).toFixed(2)} KB</span>
              </div>
              <div className="file-header-right">
                <button className="copy-code-btn" onClick={copyToClipboard} title="Copy code">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
                    <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
                  </svg>
                  Copy
                </button>
                <button
                  className="close-viewer-btn"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileContent("");
                  }}
                  title="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                  </svg>
                </button>
              </div>
            </div>
            {loadingFile ? (
              <div className="file-loading-state">
                <div className="loading-spinner"></div>
                <p>Loading file content...</p>
              </div>
            ) : (
              <pre className="file-code-content">
                <code className={`language-${getLanguage(selectedFile)}`}>
                  {fileContent || "// No content available"}
                </code>
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="upload-modal-overlay" onClick={() => !uploading && setShowUploadModal(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="upload-modal-header">
              <h3>Upload File to {repository.name}</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                </svg>
              </button>
            </div>
            <div className="upload-modal-body">
              {uploading ? (
                <div className="uploading-state">
                  <div className="upload-spinner"></div>
                  <p>Uploading file...</p>
                </div>
              ) : (
                <>
                  <label htmlFor="file-upload" className="file-upload-label">
                    <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2.75 14A1.75 1.75 0 011 12.25v-2.5a.75.75 0 011.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25v-2.5a.75.75 0 011.5 0v2.5A1.75 1.75 0 0113.25 14H2.75z" />
                      <path d="M7.25 7.689V2a.75.75 0 011.5 0v5.689l1.97-1.969a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 6.78a.75.75 0 111.06-1.06l1.97 1.969z" />
                    </svg>
                    <span>Click to select file</span>
                    <small>Supported: .txt, .js, .jsx, .html, .css, .json, .md, .py, .java, etc.</small>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".txt,.js,.jsx,.ts,.tsx,.html,.css,.json,.md,.py,.java,.cpp,.c,.yml,.yaml,.xml,.go,.rb,.php,.swift,.kt"
                    style={{ display: 'none' }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryDetails;