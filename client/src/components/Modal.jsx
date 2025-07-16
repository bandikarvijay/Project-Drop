import React from 'react';
import './Modal.css';

const Modal = ({ image, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <img src={image} alt="Full View" className="modal-image" />
    </div>
  );
};

export default Modal;
