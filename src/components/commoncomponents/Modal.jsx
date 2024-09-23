import React, { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const Modal = ({ visible, onClose, id, content, title }) => {
  const [showStyle, setShowStyle] = useState({ opacity: 0, transition: 'opacity 0.7s ease' });

  useEffect(() => {
    if (visible) {
      setTimeout(() => setShowStyle({ opacity: 1, transition: 'opacity 0.3s ease' }), 10); // Delay slightly for mount
    } else {
      setShowStyle({ opacity: 0, transition: 'opacity 0.3s ease' });
    }
  }, [visible]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) onClose(); // ESC key
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!visible) return null;

  const handleOnClose = (e) => {
    if (e.target.id === id) onClose();
  };

  return (
    <div
      id={id}
      onClick={handleOnClose}
      style={{ ...showStyle, position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '600px', width: '100%', margin: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center ">
          <div className="font-medium leading-none">{title}</div>
          <button className='leading-none' onClick={onClose} style={{ background: 'none', border: 'none', color: 'gray', cursor: 'pointer' }}>
          <IoIosCloseCircleOutline className='hover:text-red-700 text-xl' />
          </button>
        </div>
          <div className="w-full text-black bg-black border  my-3"></div>
        <div style={{ marginTop: '16px' }}>
          {content}
          
        </div>
      </div>
    </div>
  );
};

export default Modal;
