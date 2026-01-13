import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./addFile.css";

const AddFile = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [fileType, setFileType] = useState("txt");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!filename.trim()) {
      setError("Filename is required");
      return;
    }

    if (!content.trim()) {
      setError("File content cannot be empty");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`https://repovault.onrender.com/repo/${repoId}/file`, {
        filename: filename.trim(),
        content,
        fileType
      });

      navigate(`/repo/${repoId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-file-container">
      <div className="add-file-header">
        <h1>Add New File</h1>
        <button 
          className="cancel-btn"
          onClick={() => navigate(`/repo/${repoId}`)}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-file-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="filename">Filename *</label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="e.g., index.js, README.md"
            className="file-input"
            disabled={loading}
          />
          <small>Include the file extension (e.g., .js, .md, .txt)</small>
        </div>

        <div className="form-group">
          <label htmlFor="fileType">File Type</label>
          <select
            id="fileType"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="file-select"
            disabled={loading}
          >
            <option value="txt">Text (.txt)</option>
            <option value="js">JavaScript (.js)</option>
            <option value="jsx">React (.jsx)</option>
            <option value="ts">TypeScript (.ts)</option>
            <option value="tsx">TypeScript React (.tsx)</option>
            <option value="py">Python (.py)</option>
            <option value="java">Java (.java)</option>
            <option value="cpp">C++ (.cpp)</option>
            <option value="html">HTML (.html)</option>
            <option value="css">CSS (.css)</option>
            <option value="json">JSON (.json)</option>
            <option value="md">Markdown (.md)</option>
            <option value="yml">YAML (.yml)</option>
            <option value="xml">XML (.xml)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">File Content *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your code or text here..."
            className="file-textarea"
            rows={20}
            disabled={loading}
          />
          <small>Lines: {content.split('\n').length} | Characters: {content.length}</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/repo/${repoId}`)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Adding File..." : "Add File"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFile;