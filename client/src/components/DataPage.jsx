import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DarkVeil from '../DarkVeil/DarkVeil'; // Adjust path as needed
import './ProjectPages.css';

function DataPage() {
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewProject, setPreviewProject] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await axios.get('https://project-drop.onrender.com/api/upload/data');
      setProjects(res.data || []);
    } catch (err) {
      console.error('fetchProjects err:', err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title || thumbnails.length === 0 || files.length === 0) {
      setErrorMsg('Please provide title, at least one thumbnail and at least one file.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('You must be logged in to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', 'data');
    thumbnails.forEach(t => formData.append('thumbnail', t));
    files.forEach(f => formData.append('file', f));

    setLoading(true);
    try {
      await axios.post('https://project-drop.onrender.com/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
      });
      setTitle('');
      setFiles([]);
      setThumbnails([]);
      fetchProjects();
    } catch (err) {
      console.error('upload error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (project, index = 0) => {
    setPreviewProject(project);
    if (project.thumbnails && project.thumbnails.length > 0) {
      const url = project.thumbnails[index].startsWith('http')
        ? project.thumbnails[index]
        : `https://project-drop.onrender.com${project.thumbnails[index]}`;
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePreview = () => {
    setPreviewProject(null);
    setPreviewImage(null);
  };

  const downloadUrl = async (url) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `https://project-drop.onrender.com${url}`;
      const res = await fetch(fullUrl, { method: 'GET' });
      if (!res.ok) throw new Error('Network response was not ok');
      const blob = await res.blob();
      const disp = res.headers.get('content-disposition');
      let filename = fullUrl.split('/').pop();
      if (disp) {
        const m = disp.match(/filename="?(.+)"?/);
        if (m) filename = m[1];
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('download failed', err);
      alert('Download failed');
    }
  };

  const downloadAllFiles = async (project) => {
    const token = localStorage.getItem('token');
    const zipUrl = `https://project-drop.onrender.com/api/upload/${project._id}/download`;

    if (token) {
      try {
        const res = await fetch(zipUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch zip');
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${project.title.replace(/\s+/g, '_') || 'project'}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
        return;
      } catch (err) {
        console.warn('zip protected download failed, falling back to single downloads', err);
      }
    }

    if (!project.files || project.files.length === 0) {
      alert('No files to download.');
      return;
    }
    for (const f of project.files) {
      await downloadUrl(f);
    }
  };

  return (
    <div className="data-page-root">
      {/* Background effect */}
      <div
        className="dark-veil-wrap"
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <DarkVeil />
      </div>

      {/* Foreground content */}
      <div className="main-content">
        <h1 className="heading">Upload Data Project</h1>

        <form className="upload-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Thumbnails (images)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setThumbnails(Array.from(e.target.files))} />
          {thumbnails.length > 0 && (
            <div className="selected-list">
              {thumbnails.map((t, i) => <div key={i} className="selected-item">{t.name}</div>)}
            </div>
          )}

          <label>Data files / folder</label>
          <input type="file" multiple webkitdirectory="true" directory="true" onChange={(e) => setFiles(Array.from(e.target.files))} />
          {files.length > 0 && (
            <div className="selected-list">
              {files.slice(0, 6).map((f, i) => <div key={i} className="selected-item">{f.webkitRelativePath || f.name}</div>)}
              {files.length > 6 && <div className="selected-item">+{files.length - 6} more</div>}
            </div>
          )}

          {errorMsg && <div className="error">{errorMsg}</div>}

          <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
        </form>

        <h2 className="heading">All Uploaded Data Projects</h2>
        <div className="project-grid-compact">
          {projects.map((p) => (
            <div key={p._id} className="project-tile" onClick={() => openPreview(p)}>
              <div className="tile-thumb">
                {p.thumbnails && p.thumbnails.length ? (
                  <img src={`https://project-drop.onrender.com${p.thumbnails[0]}`} alt="thumb" className="tile-thumb-img" />
                ) : <div className="tile-thumb-empty">No image</div>}
              </div>

              <div className="tile-info">
                <div className="tile-title">{p.title}</div>
                <div className="tile-meta">{p.uploadedBy?.username || p.uploadedBy || 'Unknown'}</div>
              </div>
            </div>
          ))}
        </div>

        {previewProject && (
          <div className="preview-overlay">
            <div className="preview-card">
              <div className="preview-header">
                <div>
                  <strong>{previewProject.title}</strong>
                  <div className="preview-meta">
                    {previewProject.uploadedBy?.username || previewProject.uploadedBy || 'Unknown'} • {new Date(previewProject.createdAt).toLocaleString()}
                  </div>
                </div>
                <button className="btn small danger" onClick={closePreview}>✖</button>
              </div>

              <div className="preview-body">
                {previewImage ? <img src={previewImage} alt="preview" className="preview-large" /> : <div className="no-preview">No image to preview</div>}

                <div className="preview-thumbs">
                  {previewProject.thumbnails?.map((img, i) => {
                    const url = img.startsWith('http') ? img : `https://project-drop.onrender.com${img}`;
                    return (
                      <img
                        key={i}
                        src={url}
                        alt={`thumb-${i}`}
                        className={`preview-thumb ${previewImage === url ? 'active' : ''}`}
                        onClick={() => setPreviewImage(url)}
                      />
                    );
                  })}
                </div>

                <div className="file-list">
                  <h4>Files</h4>
                  <ul>
                    {previewProject.files?.length ? previewProject.files.map((f, i) => (
                      <li key={i}>
                        <span className="file-name">{f.split('/').pop()}</span>
                        <button className="btn tiny" onClick={() => downloadUrl(f)}>Download</button>
                      </li>
                    )) : <li>No files uploaded.</li>}
                  </ul>
                </div>

                <div className="zip-download">
                  <button className="btn zip" onClick={() => downloadAllFiles(previewProject)}>⬇ Download ZIP</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataPage;
