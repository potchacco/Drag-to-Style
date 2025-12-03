import React from 'react';
import './GameModal.css';

const GameModal = ({ open, title, message, confirmLabel = 'OK', cancelLabel,
  onConfirm, onCancel }) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    // optional: close on background click
    if (onCancel) onCancel();
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card" onClick={handleCardClick}>
        {title && <h3 className="modal-title">{title}</h3>}
        {message && <p className="modal-message">{message}</p>}

        <div className="modal-actions">
          {onCancel && cancelLabel && (
            <button
              type="button"
              className="modal-btn modal-btn-secondary"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className="modal-btn modal-btn-primary"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
