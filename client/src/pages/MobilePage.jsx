import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Page.css';
import { FiDownload } from 'react-icons/fi';
import Modal from './Modal';

const MobilePage = () => {
  const [title, setTitle] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [file, setFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    const res = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Mobile');
    setProjects(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('category', 'Mobile');
    form.append('file', file);
    for (let thumb of thumbnails) form.append('thumbnail', thumb);

    await axios.post('https://project-drop-backend.onrender.com/api/projects/upload', form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    setTitle('');
    setFile(null);
    setThumbnails([]);
    fetchProjects();
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="page-container">
      <h2>Upload Mobile Project</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="file" multiple accept="image/*" onChange={(e) => setThumbnails([...e.target.files])} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Submit</button>
      </form>

      <h3>All Mobile Projects</h3>
      <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="project-grid">
        {projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map(p => (
          <div className="project-card" key={p._id}>
            {p.thumbnails?.[0] && (
              <img src={`https://project-drop-backend.onrender.com${p.thumbnails[0]}`} onClick={() => setSelectedImage(`https://project-drop-backend.onrender.com${p.thumbnails[0]}`)} />
            )}
            <div className="info">
              <strong>{p.title}</strong>
              <p>{p.uploadedBy?.name}</p>
              <p>{new Date(p.createdAt).toLocaleDateString()}</p>
              <a href={`https://project-drop-backend.onrender.com${p.fileUrl}`} download title="Download File">
                <FiDownload size={22} />
              </a>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default MobilePage;
