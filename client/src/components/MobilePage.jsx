import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './WebPage.css';
import DarkVeil from '../backgrounds/DarkVeil';

function MobilePage() {
  const [title, setTitle] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const fileInputRef = useRef();
  const thumbnailInputRef = useRef();

  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://project-drop.onrender.com/api/projects?category=Mobile');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleThumbnailChange = (e) => {
    setThumbnails(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || thumbnails.length === 0 || files.length === 0) {
      alert('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', 'Mobile');
    thumbnails.forEach((thumb) => formData.append('thumbnail', thumb));
    files.forEach((file) => formData.append('file', file));

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://project-drop.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setTitle('');
      setThumbnails([]);
      setFiles([]);
      fileInputRef.current.value = '';
      thumbnailInputRef.current.value = '';
      fetchProjects();
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    }
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const isCodeFile = (fileName) => {
    return /\.(js|jsx|ts|tsx|html|css|json|py|java|cpp|c|cs|php|rb)$/.test(fileName);
  };

  const getFileExtension = (fileName) => {
    return fileName.split('.').pop().toLowerCase();
  };

  return (
    <div className="page-container">
      <DarkVeil />
      <h2 className="heading">Upload Mobile Project</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          multiple
          ref={thumbnailInputRef}
          onChange={handleThumbnailChange}
        />
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button type="submit">Submit Project</button>
      </form>

      <h2 className="heading">All Uploaded Mobile Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <div className="project-card" key={project._id} onClick={() => handleCardClick(project)}>
            {project.thumbnailUrls && project.thumbnailUrls.length > 0 ? (
              <img src={project.thumbnailUrls[0]} alt="thumbnail" className="thumbnail" />
            ) : (
              <div className="thumbnail-placeholder">No Thumbnail</div>
            )}
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>By {project.user?.name || 'Unknown'}</p>
              <p>{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedProject.title}</h2>
            <p>By {selectedProject.user?.name || 'Unknown'}</p>
            <p>{new Date(selectedProject.createdAt).toLocaleDateString()}</p>

            <div className="modal-thumbnails">
              {selectedProject.thumbnailUrls?.map((url, idx) => (
                <img key={idx} src={url} alt="thumb" />
              ))}
            </div>

            <div className="modal-files">
              {selectedProject.fileUrls?.map((url, idx) => {
                const fileName = url.split('/').pop();
                const ext = getFileExtension(fileName);
                return (
                  <div key={idx} className="file-preview">
                    {isCodeFile(fileName) ? (
                      <div className="code-preview">
                        <iframe
                          title={fileName}
                          src={url}
                          frameBorder="0"
                          style={{ width: '100%', height: '200px' }}
                        />
                      </div>
                    ) : (
                      <p>{fileName}</p>
                    )}
                    <a href={url} download>
                      <button>Download</button>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobilePage;
