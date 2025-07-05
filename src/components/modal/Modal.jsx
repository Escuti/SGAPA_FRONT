import React from "react";
import "./Modal.css"; // Importa los estilos del modal

const Modal = ({ isOpen, onClose, title, children }) => {
    console.log("Modal renderizado, isOpen:", isOpen);
    if (!isOpen) return null; // No renderiza el modal si no está abierto


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <div className="modal-body">{children}</div>
                <button className="modal-close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default Modal;