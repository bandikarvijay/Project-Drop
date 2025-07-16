import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Page.css';
import { FiDownload } from 'react-icons/fi';
import Modal from './Modal';

const WebPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Web');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching Web projects', err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!files) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', 'Web');
    formData.append('file', files);
    thumbnails.forEach((thumb) => formData.append('thumbnail', thumb));

    try {
      await axios.post('https://project-drop-backend.onrender.com/api/projects/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setDescription('');
      setFiles(null);
      setThumbnails([]);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Upload failed!');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFiles(droppedFile);
    }
  };

  return (
    <div
      className={`upload-container ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <h2>🚀 Web Projects</h2>

      <form onSubmit={handleFileUpload} className="upload-form">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />

        <input type="file" onChange={e => setFiles(e.target.files[0])} required />
        <input type="file" multiple accept="image/*" onChange={e => setThumbnails([...e.target.files])} />

        <button type="submit">Upload</button>
      </form>

      <div className="project-grid">
        {projects.map((p) => (
          <div key={p._id} className="project-card">
            {p.thumbnails.map((thumb, idx) => (
              <img
                key={idx}
                src={`https://project-drop-backend.onrender.com${thumb}`}
                alt="thumbnail"
                onClick={() => setSelectedImage(`https://project-drop-backend.onrender.com${thumb}`)}
              />
            ))}
            <div className="project-info">
              <p>{p.uploadedBy?.name || 'Unknown'}</p>
              <p>{new Date(p.createdAt).toLocaleDateString()}</p>
              <a href={`https://project-drop-backend.onrender.com${p.fileUrl}`} download>
                <FiDownload size={20} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default WebPage;
