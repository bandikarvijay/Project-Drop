import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web');
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (file) formData.append('file', file);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://project-drop-backend.onrender.com/api/projects/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Upload successful');
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <h2>Upload Project</h2>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" onChange={e => setDescription(e.target.value)} required />
      <select onChange={e => setCategory(e.target.value)}>
        <option value="Web">Web</option>
        <option value="Science">Science</option>
        <option value="Mobile">Mobile</option>
      </select>
      <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} required />
      <input type="file" onChange={e => setFile(e.target.files[0])} required />
      <button type="submit">Upload</button>
    </form>
  );
}

export default Upload;
