import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web');
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('file', file);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      setUploading(true);
      await axios.post('https://project-drop-backend.onrender.com/api/projects/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploading(false);
      alert('✅ Upload successful!');
      setTitle('');
      setDescription('');
      setFile(null);
      setThumbnail(null);
    } catch (err) {
      setUploading(false);
      console.error('Upload failed:', err.response?.data || err.message);
      alert('❌ Upload failed! Please check your login or file type.');
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>📤 Upload Project</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 10 }}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 10 }}
      />

      <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', marginBottom: 10 }}>
        <option value="Web">Web</option>
        <option value="Mobile">Mobile</option>
        <option value="Data">Data</option>
      </select>

      <input type="file" onChange={e => setFile(e.target.files[0])} required style={{ marginBottom: 10 }} />
      <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="image/*" style={{ marginBottom: 10 }} />

      <button type="submit" disabled={uploading} style={{ width: '100%', padding: 10 }}>
        {uploading ? 'Uploading...' : 'Upload Project'}
      </button>
    </form>
  );
}

export default Upload;
