import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Page.css'; // shared CSS styles
import { FiDownload } from 'react-icons/fi';
import Modal from './Modal';

const DataPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProjects = async () => {
    const res = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Data');
    setProjects(res.data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const thumbnail = e.target.files[1] || null;
    const formData = new FormData();
    formData.append('category', 'Data');
    formData.append('projectFile', file);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    await axios.post('/api/projects', formData);
    fetchProjects();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    const formData = new FormData();
    formData.append('category', 'Data');
    formData.append('projectFile', file);
    axios.post('/api/projects', formData).then(fetchProjects);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      <h2>Data Projects</h2>
      <input type="file" onChange={handleFileUpload} />
      <div className="project-grid">
        {projects.map((p) => (
          <div key={p._id} className="project-card">
            <img src={p.thumbnailUrl} alt="thumb" onClick={() => setSelectedImage(p.thumbnailUrl)} />
            <div className="project-info">
              <p>{p.uploader}</p>
              <p>{new Date(p.date).toLocaleDateString()}</p>
              <a href={p.fileUrl} download>
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

export default DataPage;
