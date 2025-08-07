import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectPages.css';
import DarkVeil from '../DarkVeil/DarkVeil';

const DataPage = () => {
  const [title, setTitle] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [codeContent, setCodeContent] = useState('');

  const API_URL = 'https://project-drop.onrender.com';

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/upload`);
      const dataProjects = res.data.filter(p => p.category === 'Data');
      setProjects(dataProjects.reverse());
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to upload projects.');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', 'Data');
    thumbnails.forEach(img => formData.append('thumbnail', img));
    files.forEach(file => formData.append('file', file));

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setTitle('');
      setThumbnails([]);
      setFiles([]);
      fetchProjects();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handlePreview = async (fileUrl, fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      setPreviewFile({ type: 'image', src: fileUrl });
    } else if (['txt', 'js', 'html', 'css', 'py', 'java', 'cpp', 'json', 'md'].includes(ext)) {
      try {
        const res = await axios.get(fileUrl);
        setPreviewFile({ type: 'code', name: fileName });
        setCodeContent(res.data);
      } catch (err) {
        alert('Failed to load code');
      }
    } else {
      setPreviewFile(null);
      window.open(fileUrl, '_blank');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeContent);
    alert('Code copied!');
  };

  return (
    <div className="page-container">
      <DarkVeil />
      <h2 className="heading">Upload Data Project</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setThumbnails(Array.from(e.target.files))}
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <button type="submit">Upload Project</button>
      </form>

      <h2 className="heading">All Uploaded Data Projects</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <div className="project-card" key={project._id}>
            {project.thumbnailUrls.length > 0 && (
              <img
                src={project.thumbnailUrls[0]}
                alt="thumbnail"
                className="thumbnail"
              />
            )}
            <h3>{project.title}</h3>
            <p><strong>Uploaded by:</strong> {project.uploader?.name}</p>
            <p><strong>Date:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
            <div className="file-list">
              {project.fileUrls.map((url, idx) => {
                const fileName = url.split('/').pop();
                return (
                  <div key={idx} className="file-item">
                    <button onClick={() => handlePreview(url, fileName)}>👁️</button>
                    <a href={url} download target="_blank" rel="noreferrer">⬇️</a>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {previewFile && (
        <div className="modal" onClick={() => setPreviewFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {previewFile.type === 'image' && (
              <img src={previewFile.src} alt="Preview" className="preview-image" />
            )}
            {previewFile.type === 'code' && (
              <>
                <pre>{codeContent}</pre>
                <button onClick={copyCode}>Copy Code</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPage;
