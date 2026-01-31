import React from 'react';
import '../styles/notification.css';

const Notification = ({ mensaje, tipo, visible }) => {
  const icono = tipo === 'success' ? '🍰' : '🛑';

  return (
    <div className={`notificacion-container ${visible ? 'notificacion-visible' : ''} tipo-${tipo}`}>
      <span className="icono-noti">{icono}</span>
      <div>{mensaje}</div>
    </div>
  );
};

export default Notification;