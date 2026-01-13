import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createRepo.css";

const CreateRepository = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Repository name is required");
      return false;
    }
    
    if (formData.name.length < 3) {
      setError("Repository name must be at least 3 characters");
      return false;
    }

    const validNamePattern = /^[a-zA-Z0-9_-]+$/;
    if (!validNamePattern.test(formData.name)) {
      setError("Repository name can only contain letters, numbers, hyphens, and underscores");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await fetch("https://repovault.onrender.com/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          isPrivate: formData.isPrivate,
          owner: userId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create repository");
      }

      const data = await response.json();
      
      // Redirect back to dashboard
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error("Error creating repository:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="create-repo-wrapper">
      <div className="create-repo-container">
        <div className="create-repo-header">
          <h1>Create a new repository</h1>
          <p>A repository contains all project files, including the revision history.</p>
        </div>

        <form onSubmit={handleSubmit} className="create-repo-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Repository Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Repository name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="my-awesome-project"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <p className="form-hint">
              Great repository names are short and memorable.
            </p>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="optional">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="A brief description of your project"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Visibility */}
          <div className="form-group">
            <label className="form-label">Visibility</label>
            <div className="visibility-options">
              <label className="visibility-option">
                <input
                  type="radio"
                  name="isPrivate"
                  checked={!formData.isPrivate}
                  onChange={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
                  disabled={loading}
                />
                <div className="visibility-content">
                  <div className="visibility-title">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"></path>
                    </svg>
                    <strong>Public</strong>
                  </div>
                  <p className="visibility-description">
                    Anyone on the internet can see this repository.
                  </p>
                </div>
              </label>

              <label className="visibility-option">
                <input
                  type="radio"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
                  disabled={loading}
                />
                <div className="visibility-content">
                  <div className="visibility-title">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5z"></path>
                    </svg>
                    <strong>Private</strong>
                  </div>
                  <p className="visibility-description">
                    You choose who can see and commit to this repository.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create repository"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRepository;