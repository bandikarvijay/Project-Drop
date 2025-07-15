import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload } from 'react-icons/fi';
import Modal from './Modal';
import './Page.css';

const MobilePage = () => {
  const [title, setTitle] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [projectFile, setProjectFile] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchProjects = async () => {
    const res = await axios.get('https://project-drop-backend.onrender.com/api/projects?category=Mobile');
    setAllProjects(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', 'Mobile');
    for (let i = 0; i < thumbnails.length; i++) {
      formData.append('thumbnail', thumbnails[i]);
    }
    formData.append('file', projectFile);

    try {
      await axios.post('https://project-drop-backend.onrender.com/api/projects/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setThumbnails([]);
      setProjectFile(null);
      fetchProjects();
    } catch (err) {
      alert('Upload failed');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="page-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="file" accept="image/*" multiple onChange={e => setThumbnails(e.target.files)} required />
        <input type="file" onChange={e => setProjectFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>

      <div className="project-list">
        {allProjects.map(p => (
          <div className="project-card" key={p._id}>
            {p.thumbnails?.[0] && (
              <img
                src={`https://project-drop-backend.onrender.com${p.thumbnails[0]}`}
                alt="thumb"
                onClick={() => setPreviewImage(`https://project-drop-backend.onrender.com${p.thumbnails[0]}`)}
              />
            )}
            <div className="project-info">
              <p>{p.title}</p>
              <small>{p.uploadedBy?.name}</small>
              <small>{new Date(p.createdAt).toLocaleDateString()}</small>
              {p.fileUrl && (
                <a href={`https://project-drop-backend.onrender.com${p.fileUrl}`} download>
                  <FiDownload size={22} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {previewImage && <Modal image={previewImage} onClose={() => setPreviewImage(null)} />}
    </div>
  );
};

export default MobilePage;
