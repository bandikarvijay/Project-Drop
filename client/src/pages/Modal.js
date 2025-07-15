import React from 'react';
import './Modal.css';

const Modal = ({ image, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <img src={image} alt="Full Preview" className="modal-image" />
  </div>
);

export default Modal;
