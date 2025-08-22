// src/components/WebPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import DarkVeil from "../DarkVeil/DarkVeil";
import "./WebPage.css";

function WebPage() {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewProject, setPreviewProject] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://project-drop.onrender.com/api/upload/web");
      setProjects(res.data || []);
    } catch (err) {
      console.error("fetchProjects err:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title || thumbnails.length === 0 || files.length === 0) {
      setErrorMsg("Please provide title, thumbnails and files.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("You must be logged in to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", "web");
    thumbnails.forEach((t) => formData.append("thumbnail", t));
    files.forEach((f) => formData.append("file", f));

    setLoading(true);
    try {
      await axios.post("https://project-drop.onrender.com/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      });
      setTitle("");
      setFiles([]);
      setThumbnails([]);
      fetchProjects();
    } catch (err) {
      console.error("upload error:", err);
      setErrorMsg(
        err.response?.data?.message || err.message || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (project, i = 0) => {
    setPreviewProject(project);
    if (project.thumbnails && project.thumbnails.length > 0) {
      const url = project.thumbnails[i].startsWith("http")
        ? project.thumbnails[i]
        : `https://project-drop.onrender.com${project.thumbnails[i]}`;
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closePreview = () => {
    setPreviewProject(null);
    setPreviewImage(null);
  };

  const downloadUrl = async (url) => {
    try {
      const fullUrl = url.startsWith("http")
        ? url
        : `https://project-drop.onrender.com${url}`;
      const token = localStorage.getItem("token");
      const res = await axios.get(fullUrl, {
        responseType: "blob",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const blob = res.data;
      const disposition = res.headers["content-disposition"] || "";
      let filename = fullUrl.split("/").pop();
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error("downloadUrl err", err);
      alert("Download failed");
    }
  };

  const downloadAllFiles = async (project) => {
    const token = localStorage.getItem("token");

    if (project.downloadZipUrl) {
      const zipUrl = project.downloadZipUrl.startsWith("http")
        ? project.downloadZipUrl
        : `https://project-drop.onrender.com${project.downloadZipUrl}`;
      try {
        const res = await axios.get(zipUrl, {
          responseType: "blob",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const blob = res.data;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${(project.title || "project").replace(/\s+/g, "_")}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
        return;
      } catch (err) {
        console.warn("zip download failed", err);
      }
    }

    try {
      const url = `https://project-drop.onrender.com/api/upload/${project._id}/download`;
      const res = await axios.get(url, {
        responseType: "blob",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 200) {
        const blob = res.data;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${(project.title || "project").replace(/\s+/g, "_")}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
        return;
      }
    } catch (err) {
      console.warn("fallback to individual file download", err);
    }

    if (!project.files || project.files.length === 0) {
      alert("No files to download");
      return;
    }

    for (const f of project.files) {
      // eslint-disable-next-line no-await-in-loop
      await downloadUrl(f);
    }
  };

  return (
    <div className="webpage-root">
      <div
        className="dark-veil-wrap"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <DarkVeil />
      </div>

      <div className="main-content">
        <div className="webpage-container">
          <h1 className="heading">Upload Web Project</h1>

          <form className="upload-form" onSubmit={handleSubmit}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
            />

            <label>Thumbnails (images)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setThumbnails(Array.from(e.target.files))}
            />
            <div className="selected-list">
              {thumbnails.map((t, i) => (
                <div key={i} className="selected-item">
                  {t.name}
                </div>
              ))}
            </div>

            <label>Project folder (select a folder or multiple files)</label>
            <input
              type="file"
              multiple
              webkitdirectory="true"
              directory="true"
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
            <div className="selected-list">
              {files.slice(0, 6).map((f, i) => (
                <div key={i} className="selected-item">
                  {f.webkitRelativePath || f.name}
                </div>
              ))}
              {files.length > 6 && (
                <div className="selected-item">+{files.length - 6} more</div>
              )}
            </div>

            {errorMsg && (
              <div className="error" style={{ color: "red" }}>
                {errorMsg}
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>

          <h2 className="heading">All Uploaded Web Projects</h2>

          <div className="project-grid-compact">
            {projects.map((p) => (
              <div
                key={p._id}
                className="project-tile"
                onClick={() => openPreview(p)}
              >
                <div className="tile-thumb">
                  {p.thumbnails && p.thumbnails.length ? (
                    <img
                      src={
                        p.thumbnails[0].startsWith("http")
                          ? p.thumbnails[0]
                          : `https://project-drop.onrender.com${p.thumbnails[0]}`
                      }
                      alt="thumb"
                      className="tile-thumb-img"
                    />
                  ) : (
                    <div className="tile-thumb-empty">No image</div>
                  )}
                </div>

                <div className="tile-info">
                  <div className="tile-title">{p.title}</div>
                  <div className="tile-meta">
                    {p.uploadedBy?.username || p.uploadedBy || "Unknown"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {previewProject && (
          <div className="preview-overlay" role="dialog" aria-modal="true">
            <div className="preview-card">
              <div className="preview-header">
                <div>
                  <strong>{previewProject.title}</strong>
                  <div className="preview-meta">
                    {previewProject.uploadedBy?.username ||
                      previewProject.uploadedBy ||
                      "Unknown"}{" "}
                    • {new Date(previewProject.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  className="btn small danger"
                  onClick={closePreview}
                >
                  ✖
                </button>
              </div>

              <div className="preview-image">
                {previewImage ? (
                  <img src={previewImage} alt="preview" />
                ) : (
                  <div className="no-preview">No image</div>
                )}
              </div>

              <div className="preview-thumbs">
                {previewProject.thumbnails?.map((img, i) => {
                  const src = img.startsWith("http")
                    ? img
                    : `https://project-drop.onrender.com${img}`;
                  const active = previewImage === src;
                  return (
                    <img
                      key={i}
                      src={src}
                      alt={`thumb-${i}`}
                      className={`preview-thumb ${active ? "active" : ""}`}
                      onClick={() => setPreviewImage(src)}
                    />
                  );
                })}
              </div>

              <div className="file-list">
                <h4>Files</h4>
                <ul>
                  {previewProject.files?.length ? (
                    previewProject.files.map((f, i) => (
                      <li key={i}>
                        <span className="file-name">{f.split("/").pop()}</span>
                        <button
                          className="btn tiny"
                          onClick={() => downloadUrl(f)}
                        >
                          ⤓ Download
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No files uploaded.</li>
                  )}
                </ul>
              </div>

              <div className="preview-actions">
                <button
                  className="btn zip"
                  onClick={() => downloadAllFiles(previewProject)}
                >
                  ⤓ Download ZIP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebPage;
