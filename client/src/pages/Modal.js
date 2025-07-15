import React from 'react';
import './Modal.css';

const Modal = ({ image, onClose }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-image-wrapper">
      <img src={image} alt="Preview" />
    </div>
  </div>
);

export default Modal;
