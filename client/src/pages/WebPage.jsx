import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Page.css';
import { FiDownload } from 'react-icons/fi';
import Modal from './Modal';

const WebPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Web');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching Web projects', err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">All Uploaded Web Projects</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <img
              src={`https://project-drop-backend.onrender.com${project.thumbnails[0]}`}
              alt="thumbnail"
              onClick={() => setSelectedImage(`https://project-drop-backend.onrender.com${project.thumbnails[0]}`)}
              className="project-thumbnail"
            />
            <div className="project-info">
              <p className="project-uploader">{project.uploadedBy?.name || 'Unknown'}</p>
              <p className="project-date">{new Date(project.createdAt).toLocaleDateString()}</p>
              <a
                href={`https://project-drop-backend.onrender.com${project.fileUrl}`}
                download
                className="download-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
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

export default WebPage;
