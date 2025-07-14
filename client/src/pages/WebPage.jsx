import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './WebPage.css';

function WebPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [thumbs, setThumbs] = useState([]);
  const [file, setFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const logout = () => { localStorage.removeItem('token'); navigate('/'); };

  const handleSubmit = async e => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('category', 'Web');
    thumbs.forEach(t => form.append('thumbnail', t));
    form.append('file', file);
    try {
      await axios.post('https://project-drop-backend.onrender.com/api/projects/upload', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTitle(''); setThumbs([]); setFile(null);
      fetchProjects();
    } catch (err) { alert('Upload failed'); }
  };

  const fetchProjects = async () => {
    const { data } = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Web');
    setProjects(data);
  };

  useEffect(fetchProjects, []);

  return (
    <div>
      <nav className="web-navbar">
        <div className="web-navbar-left">
          <img src="/images/pd logo.png" alt="Logo" className="navbar-logo"/>
          <h3>Project Drop - Web</h3>
        </div>
        <div className="web-navbar-center">
          <input className="search-input" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={logout} className="logout-button">Logout</button>
      </nav>

      <div className="web-upload-container">
        <h2>Upload Your Web Project</h2>
        <form onSubmit={handleSubmit} className="web-upload-box">
          <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Title" />
          <label>Select Thumbnails:</label>
          <input type="file" multiple accept="image/*" onChange={e => setThumbs([...e.target.files])} required />
          <label>Select ZIP file:</label>
          <input type="file" accept=".zip" onChange={e => setFile(e.target.files[0])} required />
          <button type="submit">Submit</button>
        </form>
      </div>

      <h3>All Uploaded Web Projects</h3>
      <div className="web-project-list">
        {projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
          <div key={p._id} className="web-project-card">
            <h4>{p.title}</h4>
            <p>By {p.uploadedBy?.name || 'Unknown'}</p>
            <p>{new Date(p.createdAt).toLocaleDateString()}</p>
            <a href={`https://project-drop-backend.onrender.com${p.fileUrl}`} download>Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WebPage;
