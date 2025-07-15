import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Page.css';
import { FiDownload } from 'react-icons/fi';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

function WebPage() {
  const [title, setTitle] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [projectFile, setProjectFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const res = await axios.get(
      'https://project-drop-backend.onrender.com/api/projects?category=Web'
    );
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProjectFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', 'Web');
    for (let i = 0; i < thumbnails.length; i++) {
      formData.append('thumbnail', thumbnails[i]);
    }
    formData.append('file', projectFile);

    try {
      await axios.post('https://project-drop-backend.onrender.com/api/projects/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setThumbnails([]);
      setProjectFile(null);
      fetchProjects();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed!');
    }
  };

  return (
    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <nav className="web-navbar">
        <div className="web-navbar-left">
          <img src="/images/pd logo.png" alt="Logo" className="navbar-logo" />
          <h3>Project Drop - Web</h3>
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

      <div className="web-upload-container">
        <h2>Upload Your Web Project</h2>
        <form onSubmit={handleUpload} className="web-upload-box">
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
          <label>Upload Project File (any format):</label>
          <input
            type="file"
            onChange={(e) => setProjectFile(e.target.files[0])}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <h3 style={{ textAlign: 'center', marginTop: '40px' }}>📁 All Uploaded Web Projects</h3>
      <div className="web-project-list">
        {projects
          .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((project) => (
            <div key={project._id} className="web-project-card">
              <img
                src={`https://project-drop-backend.onrender.com${project.thumbnails?.[0] || ''}`}
                alt="Project Thumbnail"
                onClick={() => setPreviewImage(`https://project-drop-backend.onrender.com${project.thumbnails?.[0] || ''}`)}
              />
              <h4>{project.title}</h4>
              <p><strong>Uploaded by:</strong> {project.uploadedBy?.name}</p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(project.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <a
                href={`https://project-drop-backend.onrender.com${project.fileUrl}`}
                download
                title="Download File"
              >
                <FiDownload size={24} />
              </a>
            </div>
          ))}
      </div>

      {previewImage && <Modal image={previewImage} onClose={() => setPreviewImage(null)} />}
    </div>
  );
}

export default WebPage;
