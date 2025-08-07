import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './WebPage.css'; // shared styling
import DarkVeil from './DarkVeil';
import { FaDownload } from 'react-icons/fa';

function MobilePage() {
  const [title, setTitle] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const handleThumbnailChange = (e) => setThumbnails([...e.target.files]);
  const handleFileChange = (e) => setFiles([...e.target.files]);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('https://project-drop.onrender.com/api/upload?category=Mobile');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Login required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', 'Mobile');
    thumbnails.forEach(file => formData.append('thumbnail', file));
    files.forEach(file => formData.append('file', file));

    try {
      await axios.post('https://project-drop.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setTitle('');
      setThumbnails([]);
      setFiles([]);
      thumbInputRef.current.value = '';
      fileInputRef.current.value = '';
      fetchProjects();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  };

  const isImage = (filename) => /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename);
  const isCodeFile = (filename) => /\.(js|jsx|ts|tsx|html|css|py|java|c|cpp|json)$/i.test(filename);

  return (
    <div className="page-container">
      <DarkVeil />
      <h2 className="heading">Upload Your Mobile Project</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" required />
        <input type="file" multiple onChange={handleThumbnailChange} ref={thumbInputRef} accept="image/*" />
        <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
        <button type="submit">Submit Project</button>
      </form>

      <h2 className="heading">Uploaded Mobile Projects</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card" onClick={() => setSelectedProject(project)}>
            {project.thumbnails && project.thumbnails.length > 0 ? (
              <img src={project.thumbnails[0]} alt="thumb" className="project-thumbnail" />
            ) : (
              <div className="project-placeholder">No Thumbnail</div>
            )}
            <div className="project-title">{project.title}</div>
            <div className="project-meta">
              <span>{project.uploader?.name || 'Unknown'}</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedProject.title}</h3>
            <p>Uploaded by: {selectedProject.uploader?.name || 'Unknown'}</p>
            <div className="modal-thumbnails">
              {selectedProject.thumbnails?.map((thumb, idx) => (
                <img key={idx} src={thumb} alt={`thumb-${idx}`} className="modal-thumbnail" />
              ))}
            </div>
            <div className="modal-files">
              {selectedProject.files?.map((fileUrl, idx) => {
                const filename = fileUrl.split('/').pop();
                return (
                  <div key={idx} className="file-item">
                    {isImage(filename) ? (
                      <img src={fileUrl} alt={`file-${idx}`} className="modal-image" />
                    ) : isCodeFile(filename) ? (
                      <CodePreview fileUrl={fileUrl} filename={filename} />
                    ) : (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="download-icon" download>
                        <FaDownload /> {filename}
                      </a>
                    )}
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

const CodePreview = ({ fileUrl, filename }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    axios.get(fileUrl).then(res => setCode(res.data)).catch(() => setCode('// Unable to preview this file'));
  }, [fileUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied!');
  };

  return (
    <div className="code-preview">
      <div className="code-header">
        <span>{filename}</span>
        <button onClick={handleCopy}>Copy</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

export default MobilePage;
