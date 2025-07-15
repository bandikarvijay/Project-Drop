import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './WebPage.css'; // Reusing same styles

function DataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [projectFile, setProjectFile] = useState(null);
  const [allProjects, setAllProjects] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', 'Data'); // ✅ Category
    for (let i = 0; i < thumbnails.length; i++) {
      formData.append('thumbnail', thumbnails[i]);
    }
    formData.append('file', projectFile);

    try {
      await axios.post('https://noble-transformation-production-ba33.up.railway.app//api/projects/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Project uploaded!');
      setTitle('');
      setThumbnails([]);
      setProjectFile(null);
      fetchAllProjects();
    } catch (err) {
      alert('Upload failed!');
    }
  };

  const fetchAllProjects = async () => {
    try {
      const res = await axios.get('https://noble-transformation-production-ba33.up.railway.app//api/projects?category=Data');
      setAllProjects(res.data);
    } catch (err) {
      console.error('Error fetching Data projects', err);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="web-navbar">
        <div className="web-navbar-left">
          <img src="/images/pd logo.png" alt="Logo" className="navbar-logo" />
          <h3>Project Drop - Data</h3>
        </div>
        <div className="web-navbar-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="web-navbar-right">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {/* Upload Form */}
      <div className="web-main-container">
        <div className="web-upload-container">
          <h2 className="web-heading">Upload Your Data Project</h2>
          <form onSubmit={handleSubmit} className="web-upload-box">
            <input
              type="text"
              placeholder="Project Heading"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Choose Thumbnail Images (multiple):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setThumbnails(e.target.files)}
              required
            />

            <label>Choose ZIP Folder (Project):</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setProjectFile(e.target.files[0])}
              required
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* All Data Projects */}
      <h3 style={{ marginTop: '40px', textAlign: 'center' }}>📁 All Uploaded Data Projects</h3>
      <div className="web-project-list">
        {allProjects.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No public projects available.</p>
        ) : (
          allProjects
            .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((project) => (
              <div key={project._id} className="web-project-card">

                {/* ✅ Thumbnail Display */}
                {project.thumbnails && project.thumbnails.length > 0 ? (
                  <img
                    src={`https://noble-transformation-production-ba33.up.railway.app/${project.thumbnails[0]}`}
                    alt="Project Thumbnail"
                    className="project-thumbnail"
                  />
                ) : (
                  <div className="project-thumbnail placeholder">No Image</div>
                )}

                <h4>{project.title}</h4>

                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                  {project.uploadedBy?.name && (
                    <p>Uploaded by: <strong>{project.uploadedBy.name}</strong></p>
                  )}
                  {project.createdAt && (
                    <p>
                      Uploaded on:{' '}
                      <strong>
                        {new Date(project.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </strong>
                    </p>
                  )}
                </div>

                <a href={`https://noble-transformation-production-ba33.up.railway.app//${project.fileUrl}`} download>
                  Download Project
                </a>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default DataPage;
