import React from 'react';
import './Modal.css';

const Modal = ({ image, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <img src={image} alt="Fullscreen" className="fullscreen-image" />
        <button onClick={onClose} className="close-button">✖</button>
      </div>
    </div>
  );
};

export default Modal;
