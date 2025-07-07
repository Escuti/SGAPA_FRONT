import React from 'react';
import './TopBar.css';
import { FiBell, FiUser } from 'react-icons/fi';

const TopBar = () => {
  return (
    <header className="topbar-container">
      <div className="topbar-left">
        <a href="#">Información</a>
        <a href="#">Texto Ejemplo</a>
      </div>

      <div className="topbar-right">
        <button className="icon-button" title="Notificaciones">
          <FiBell size={20} />
        </button>
        <button className="icon-button" title="Perfil de usuario">
          <FiUser size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;