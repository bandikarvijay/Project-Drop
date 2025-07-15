import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Page.css'; // shared styles for all categories
import { FiDownload } from 'react-icons/fi';
import Modal from './Modal';

const DataPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Data');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching Data projects:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    formData.append('category', 'Data');
    if (files[0]) formData.append('projectFile', files[0]); // any file
    if (files[1]) formData.append('thumbnail', files[1]);   // optional image
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
    formData.append('category', 'Data');
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
      <h2 style={{ textAlign: 'center', marginTop: 30 }}>📊 Data Projects</h2>

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

export default DataPage;
