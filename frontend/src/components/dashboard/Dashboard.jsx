import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCommand, setCopiedCommand] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const url = `https://repovault.onrender.com/repo/user/${userId}`;
        const response = await fetch(url);

        if (!response.ok) {
          setRepositories([]);
          return;
        }

        const data = await response.json();
        setRepositories(Array.isArray(data) ? data : (data.repositories || []));
      } catch (err) {
        console.error("ERROR in fetchRepositories:", err);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      setSearchResults(
        repositories.filter(
          (repo) =>
            repo?.name &&
            repo.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, repositories]);

  const copyToClipboard = (text, commandId) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(commandId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading repositories...</p>
      </div>
    );
  }

  const userName = localStorage.getItem("userName") || "your-username";
  const exampleRepo = repositories.length > 0 ? repositories[0].name : "my-repo";

  return (
    <>
      <Navbar />
      <section id="dashboard-new">
        {/* Left Section - About RepoVault */}
        <aside className="dashboard-section about-section">
          <div className="section-header">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
              <path d="M8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <h2>About RepoVault</h2>
          </div>

          <div className="about-content">
            <div className="about-intro" style={{ textAlign: "center" }}>
              <h3 >Modern Version Control</h3>
              <p>
                RepoVault is a Git-inspired powerful and intuitive version control system built for developers.
              </p>
            </div>

            <div className="features-grid">


              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                    <path d="M9.5 7.5a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </div>
                <h4>Easy to Use</h4>
                <p>Intuitive CLI commands that feel familiar and are easy to remember.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                  </svg>
                </div>
                <h4>Secure</h4>
                <p>Your code is protected with industry-standard encryption and security practices.</p>
              </div>





              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0114.25 15H1.75A1.75 1.75 0 010 13.25V2.75z" />
                  </svg>
                </div>
                <h4>CLI Based</h4>
                <p>Powerful command-line interface for developers who love the terminal.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                  </svg>
                </div>
                <h4>Developer</h4>
                <p>
                  RepoVault is developed by <a href="https://github.com/ShubhamV-Codes">Shubham</a>   to explore and build a
                  Git-like version control system
                </p>

              </div>
            </div>


          </div>
        </aside>

        {/* Middle Section - My Repositories */}
        <main className="dashboard-section main-repos-section">
          <div className="section-header">
            <div className="header-left">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
              </svg>
              <h2>My Repositories</h2>
            </div>
            <Link to="/repo/create" className="create-repo-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 010 1.5H8.5v4.25a.75.75 0 01-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"></path>
              </svg>
              New
            </Link>
          </div>

          <div className="search-container">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M10.68 11.74a6 6 0 01-7.922-8.982 6 6 0 018.982 7.922l3.04 3.04a.749.749 0 01-.326 1.275.749.749 0 01-.734-.215ZM11.5 7a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0Z"></path>
            </svg>
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              placeholder="Find a repository..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="repositories-list">
            {searchResults.length === 0 ? (
              <div className="empty-state-large">
                {searchQuery ? (
                  <>
                    <h3>No repositories found</h3>
                    <p>Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <h3>You don't have any repositories yet</h3>
                    <p>Create your first repository to get started</p>
                    <Link to="/repo/create" className="create-first-repo-btn">
                      Create a repository
                    </Link>
                  </>
                )}
              </div>
            ) : (
              searchResults.map((repo) => (
                <div key={repo._id} className="repo-card">
                  <div className="repo-card-header">
                    <Link to={`/repo/${repo._id}`} className="repo-card-title">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                      </svg>
                      {repo.name}
                    </Link>
                    {repo.isPrivate !== undefined && (
                      <span
                        className={`repo-visibility ${repo.isPrivate ? "private" : "public"
                          }`}
                      >
                        {repo.isPrivate ? "Private" : "Public"}
                      </span>
                    )}
                  </div>
                  <p className="repo-card-description">
                    {repo.description || "No description provided"}
                  </p>
                  <div className="repo-card-footer">
                    {repo.language && (
                      <span className="repo-language">
                        <span className="language-dot"></span>
                        {repo.language}
                      </span>
                    )}
                    {repo.updatedAt && (
                      <span className="repo-updated">
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right Section - CLI Guide */}
        <aside className="dashboard-section cli-section">
          <div className="section-header">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0114.25 15H1.75A1.75 1.75 0 010 13.25V2.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H1.75zM7.25 8a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 01-1.06-1.06L5.44 8 3.72 6.28a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm1.5 1.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
            </svg>
            <h2>CLI Guide</h2>
          </div>

          <div className="install-banner">
            <div className="install-header">
              <div className="install-icon">
                <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8.75 2.75a.75.75 0 00-1.5 0v5.69L5.03 6.22a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 00-1.06-1.06L8.75 8.44V2.75z" />
                  <path d="M3.5 9.75a.75.75 0 00-1.5 0v1.5A2.75 2.75 0 004.75 14h6.5A2.75 2.75 0 0014 11.25v-1.5a.75.75 0 00-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5z" />
                </svg>
              </div>
              <h3 className="install-title">Firstly, install repovault CLI</h3>
            </div>

            <div className="code-block-install">
              <code>npm install -g repovault</code>
              <button className="copy-btn-install" onClick={() => copyToClipboard("npm i repovault", "install")}>
                {copiedCommand === "install" ? '✓' : '⎘'}
              </button>
            </div>
          </div>

          <div className="cli-steps-compact">
            {/* Step 1 */}
            <div className="cli-step-compact">
              <div className="step-indicator">1</div>
              <div className="step-info">
                <h4>Login</h4>
                <div className="code-block-compact">
                  <code>repovault login</code>
                  <button
                    className="copy-btn-compact"
                    onClick={() => copyToClipboard("repovault login", "login")}
                    title="Copy"
                  >
                    {copiedCommand === "login" ? "✓" : "⎘"}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="cli-step-compact">
              <div className="step-indicator">2</div>
              <div className="step-info">
                <h4>Initialize</h4>
                <div className="code-block-compact">
                  <code>repovault init &lt;repoID &gt;</code>
                  <button
                    className="copy-btn-compact"
                    onClick={() => copyToClipboard(`repovault init ${repoID}`, "init")}
                    title="Copy"
                  >
                    {copiedCommand === "init" ? "✓" : "⎘"}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="cli-step-compact">
              <div className="step-indicator">3</div>
              <div className="step-info">
                <h4>Add Remote</h4>
                <div className="code-block-compact">
                  <code>repovault remote add origin https://repovault.onrender.com &lt;repoID &gt;</code>
                  <button
                    className="copy-btn-compact"
                    onClick={() => copyToClipboard(`repovault remote add origin https://repovault.onrender.com ${repoID}`, "remote")}
                    title="Copy"
                  >
                    {copiedCommand === "remote" ? "✓" : "⎘"}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="cli-step-compact">
              <div className="step-indicator">4</div>
              <div className="step-info">
                <h4>Stage Files</h4>
                <div className="code-block-compact">
                  <code>repovault add [files]</code>
                  <button
                    className="copy-btn-compact"
                    onClick={() => copyToClipboard("repovault add [files]", "add")}
                    title="Copy"
                  >
                    {copiedCommand === "add" ? "✓" : "⎘"}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="cli-step-compact">
              <div className="step-indicator">5</div>
              <div className="step-info">
                <h4>Commit</h4>
                <div className="code-block-compact">
                  <code>repovault commit -m "message"</code>
                  <button
                    className="copy-btn-compact"
                    onClick={() => copyToClipboard('repovault commit -m "Initial commit"', "commit")}
                    title="Copy"
                  >
                    {copiedCommand === "commit" ? "✓" : "⎘"}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="cli-step-compact">
              <div className="step-indicator">6</div>
              <div className="step-info">
                <h4>Push</h4>
                <div className="code-block-compact">
                  <code>repovault push</code>
                  <button
                    className="copy-btn-compact"
                    onClick={() => copyToClipboard("repovault push", "push")}
                    title="Copy"
                  >
                    {copiedCommand === "push" ? "✓" : "⎘"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="cli-divider"></div>

          <div className="quick-commands">
            <h4>Quick Commands</h4>

            <div className="quick-cmd">
              <span className="cmd-label">Pull</span>
              <div className="code-block-compact">
                <code>repovault --version</code>
                <button
                  className="copy-btn-compact"
                  onClick={() => copyToClipboard("repovault --version", "version")}
                >
                  {copiedCommand === "version" ? "✓" : "⎘"}
                </button>
              </div>
            </div>


            <div className="quick-cmd">
              <span className="cmd-label">Pull</span>
              <div className="code-block-compact">
                <code>repovault pull</code>
                <button
                  className="copy-btn-compact"
                  onClick={() => copyToClipboard("repovault pull", "pull")}
                >
                  {copiedCommand === "pull" ? "✓" : "⎘"}
                </button>
              </div>
            </div>

            <div className="quick-cmd">
              <span className="cmd-label">Status</span>
              <div className="code-block-compact">
                <code>repovault status</code>
                <button
                  className="copy-btn-compact"
                  onClick={() => copyToClipboard("repovault status", "status")}
                >
                  {copiedCommand === "status" ? "✓" : "⎘"}
                </button>
              </div>
            </div>

            <div className="quick-cmd">
              <span className="cmd-label">Revert</span>
              <div className="code-block-compact">
                <code>repovault revert &lt;commitID&gt;</code>
                <button
                  className="copy-btn-compact"
                  onClick={() => copyToClipboard("repovault revert <commitID>", "revert")}
                >
                  {copiedCommand === "revert" ? "✓" : "⎘"}
                </button>
              </div>
            </div>

            <div className="quick-cmd">
              <span className="cmd-label">Help</span>
              <div className="code-block-compact">
                <code>repovault --help</code>
                <button
                  className="copy-btn-compact"
                  onClick={() => copyToClipboard("repovault --help", "help")}
                >
                  {copiedCommand === "help" ? "✓" : "⎘"}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </>
  );
};

export default Dashboard;