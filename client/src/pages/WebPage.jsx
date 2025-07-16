import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Page.css';
import { FiDownload } from 'react-icons/fi';
import Modal from './Modal';

const WebPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Web');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching Web projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="page-container">
      <h2>All Uploaded Web Projects</h2>
      <div className="project-grid">
        {projects.map(project => (
          <div className="project-card" key={project._id}>
            <div className="thumbnail-container">
              <img
                src={project.thumbnails?.[0]}
                alt="Thumbnail"
                className="project-thumbnail"
                onClick={() => setSelectedImage(project.thumbnails?.[0])}
              />
            </div>
            <div className="project-info">
              <p><strong>By:</strong> {project.uploadedBy?.name || 'Anonymous'}</p>
              <p><strong>Date:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
              {project.fileUrl && (
                <a
                  href={`https://project-drop-backend.onrender.com${project.fileUrl}`}
                  download
                  className="download-icon"
                >
                  <FiDownload size={20} />
                </a>
              )}
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

export default WebPage;
