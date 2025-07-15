import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Page.css'; // shared styles
import { FiDownload } from 'react-icons/fi';
import Modal from './Modal';

const MobilePage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Mobile');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching Mobile projects:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    formData.append('category', 'Mobile');
    if (files[0]) formData.append('projectFile', files[0]);
    if (files[1]) formData.append('thumbnail', files[1]);
    try {
      await axios.post('https://project-drop-backend.onrender.com/api/projects', formData);
      fetchProjects();
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const formData = new FormData();
    formData.append('category', 'Mobile');
    formData.append('projectFile', file);
    axios.post('https://project-drop-backend.onrender.com/api/projects', formData)
      .then(fetchProjects)
      .catch(err => console.error('Drop upload error:', err));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      <h2 style={{ textAlign: 'center', marginTop: 30 }}>📱 Mobile Projects</h2>

      <div style={{ textAlign: 'center', margin: '20px auto' }}>
        <input type="file" onChange={handleFileUpload} multiple />
        <p>📥 Drag and drop a file or select manually (first = file, second = thumbnail)</p>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <img
              src={project.thumbnailUrl}
              alt="thumbnail"
              onClick={() => setSelectedImage(project.thumbnailUrl)}
              style={{ cursor: 'pointer' }}
            />
            <div className="project-info">
              <p>{project.uploadedBy?.name || 'Anonymous'}</p>
              <p>{new Date(project.createdAt).toLocaleDateString()}</p>
              <a href={project.fileUrl} download>
                <FiDownload size={20} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default MobilePage;
