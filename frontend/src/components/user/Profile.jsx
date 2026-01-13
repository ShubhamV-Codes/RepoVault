import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated"); // updated, name, created
  const { setCurrentUser } = useAuth();

  const fetchUserData = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (!userId) {
      console.log("No userId found, redirecting to auth");
      navigate("/auth");
      return;
    }

    console.log("Fetching data for userId:", userId);
    setLoading(true);
    setError("");

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch user profile
      const userResponse = await fetch(
        `http://localhost:3000/userprofile/${userId}`,
        { headers }
      );

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          navigate("/auth");
          return;
        }
        throw new Error(`Failed to fetch user profile: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      console.log("User data received:", userData);

      const extractedUserData = {
        username: userData.username || userData.user?.username || userData.name || userData.user?.name || 'Anonymous',
        email: userData.email || userData.user?.email || 'No email provided',
        _id: userData._id || userData.user?._id || userId,
        createdAt: userData.createdAt || userData.user?.createdAt
      };

      console.log("Extracted user data:", extractedUserData);
      setUserDetails(extractedUserData);

      // Fetch repositories
      const repoResponse = await fetch(
        `http://localhost:3000/repo/user/${userId}`,
        { headers }
      );

      if (!repoResponse.ok) {
        console.warn(`Failed to fetch repositories: ${repoResponse.status}`);
        setRepositories([]);
      } else {
        const repoData = await repoResponse.json();
        console.log("Repository data received:", repoData);
        
        let repoArray = [];
        if (Array.isArray(repoData)) {
          repoArray = repoData;
        } else if (repoData.repositories && Array.isArray(repoData.repositories)) {
          repoArray = repoData.repositories;
        } else if (repoData.data && Array.isArray(repoData.data)) {
          repoArray = repoData.data;
        } else if (repoData.repos && Array.isArray(repoData.repos)) {
          repoArray = repoData.repos;
        }
        
        setRepositories(repoArray);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load profile data");
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/auth");
  }, [navigate, setCurrentUser]);

  // Filter and sort repositories
  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repositories.filter(repo => 
      repo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "created":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "updated":
        default:
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      }
    });

    return sorted;
  }, [repositories, searchQuery, sortBy]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="profile-error">
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <button onClick={fetchUserData} className="retry-btn">
            Try Again
          </button>
        </div>
      </>
    );
  }

  if (!userDetails) {
    return (
      <>
        <Navbar />
        <div className="profile-error">
          <h2>Profile Not Found</h2>
          <p>Unable to load user profile</p>
          <button onClick={() => navigate("/auth")} className="retry-btn">
            Go to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-wrapper">
          {/* Left Sidebar - User Info */}
          <aside className="profile-sidebar">
            <div className="profile-avatar">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails.username || 'User')}&size=260&background=58a68f&color=fff&bold=true`}
                alt={userDetails.username || 'User'}
                loading="lazy"
              />
            </div>

            <div className="profile-info">
              <h1 className="profile-name">{userDetails.username || 'Repo-User'}</h1>
              <p className="profile-email">{userDetails.email || 'No email'}</p>
              {userDetails.createdAt && (
                <p className="profile-joined">
                  Joined {new Date(userDetails.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              )}
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"></path>
                </svg>
                <div>
                  <strong>{repositories.length}</strong>
                  <span>{repositories.length === 1 ? 'Repository' : 'Repositories'}</span>
                </div>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 012 13.25V2.75zm10.44 4.5l-1.97-1.97a.75.75 0 10-1.06 1.06l.72.72H6a.75.75 0 000 1.5h4.19l-.72.72a.75.75 0 101.06 1.06l1.97-1.97a.75.75 0 000-1.06z"></path>
              </svg>
              Logout
            </button>
          </aside>

          {/* Main Content */}
          <main className="profile-main">
            <div className="profile-header">
              <h2>Your Repositories</h2>
              <button 
                className="create-new-btn"
                onClick={() => navigate("/repo/create")}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a.75.75 0 01.75.75v6.5h6.5a.75.75 0 010 1.5h-6.5v6.5a.75.75 0 01-1.5 0v-6.5h-6.5a.75.75 0 010-1.5h6.5v-6.5A.75.75 0 018 0z"></path>
                </svg>
                New Repository
              </button>
            </div>

            {/* Search and Filter Controls */}
            {repositories.length > 0 && (
              <div className="repo-controls">
                <div className="search-box">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10.68 11.74a6 6 0 01-7.922-8.982 6 6 0 018.982 7.922l3.04 3.04a.749.749 0 01-.326 1.275.749.749 0 01-.734-.215l-3.04-3.04zm-4.68.46a4.5 4.5 0 100-9 4.5 4.5 0 000 9z"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="sort-controls">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="updated">Last updated</option>
                    <option value="name">Name</option>
                    <option value="created">Recently created</option>
                  </select>
                </div>
              </div>
            )}

            {/* Repositories Section */}
            <section className="repos-section">
              {repositories.length === 0 ? (
                <div className="empty-state">
                  <svg width="80" height="80" viewBox="0 0 16 16" fill="currentColor" opacity="0.4">
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"></path>
                  </svg>
                  <h3>No repositories yet</h3>
                  <p>Create your first repository to get started with version control</p>
                  <button 
                    className="create-first-btn"
                    onClick={() => navigate("/repo/create")}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a.75.75 0 01.75.75v6.5h6.5a.75.75 0 010 1.5h-6.5v6.5a.75.75 0 01-1.5 0v-6.5h-6.5a.75.75 0 010-1.5h6.5v-6.5A.75.75 0 018 0z"></path>
                    </svg>
                    Create Repository
                  </button>
                </div>
              ) : filteredAndSortedRepos.length === 0 ? (
                <div className="empty-state">
                  <svg width="80" height="80" viewBox="0 0 16 16" fill="currentColor" opacity="0.4">
                    <path d="M10.68 11.74a6 6 0 01-7.922-8.982 6 6 0 018.982 7.922l3.04 3.04a.749.749 0 01-.326 1.275.749.749 0 01-.734-.215l-3.04-3.04zm-4.68.46a4.5 4.5 0 100-9 4.5 4.5 0 000 9z"></path>
                  </svg>
                  <h3>No repositories found</h3>
                  <p>Try adjusting your search or filters</p>
                  <button 
                    className="create-first-btn"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <>
                  <div className="results-count">
                    Showing {filteredAndSortedRepos.length} of {repositories.length} {repositories.length === 1 ? 'repository' : 'repositories'}
                  </div>
                  <div className="repo-list">
                    {filteredAndSortedRepos.map((repo) => (
                      <div
                        key={repo._id}
                        className="repo-card"
                        onClick={() => navigate(`/repo/${repo._id}`)}
                      >
                        <div className="repo-card-header">
                          <div className="repo-title">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"></path>
                            </svg>
                            <h3>{repo.name}</h3>
                          </div>
                          <span className={`visibility-badge ${repo.visibility === false || repo.isPrivate ? 'private' : 'public'}`}>
                            {repo.visibility === false || repo.isPrivate ? 'Private' : 'Public'}
                          </span>
                        </div>
                        
                        <p className="repo-description">
                          {repo.description || "No description provided"}
                        </p>
                        
                        <div className="repo-footer">
                          <div className="repo-meta">
                            {repo.language && (
                              <span className="repo-language">
                                <span className="language-dot"></span>
                                {repo.language}
                              </span>
                            )}
                            {repo.content && Array.isArray(repo.content) && (
                              <span className="file-count">
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z"></path>
                                </svg>
                                {repo.content.length} {repo.content.length === 1 ? 'file' : 'files'}
                              </span>
                            )}
                          </div>
                          <span className="repo-updated">
                            Updated {formatDate(repo.updatedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;