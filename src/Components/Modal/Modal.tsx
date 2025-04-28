import React from 'react';
import './Modal.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal-button" onClick={onClose}>
          &times;
        </button>
        <h2>{title}</h2>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
