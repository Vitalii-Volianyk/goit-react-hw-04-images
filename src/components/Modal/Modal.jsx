import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PropTypes } from 'prop-types';
import css from './Modal.module.css';

const port = document.querySelector('#modal-portal');

const Modal = ({ onClose, item }) => {
  useEffect(() => {
    const handlerKey = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handlerKey);
    return () => {
      window.removeEventListener('keydown', handlerKey);
    };
  }, [onClose]);

  const handlerOverlay = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };
  const { largeImageURL, tags } = item;
  return createPortal(
    <div className={css.overlay} onClick={handlerOverlay}>
      <div className={css.modal}>
        <img src={largeImageURL} alt={tags} />
      </div>
    </div>,
    port
  );
};
Modal.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func,
};
export default Modal;
