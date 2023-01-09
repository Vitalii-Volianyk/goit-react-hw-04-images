import { Component } from 'react';
import { createPortal } from 'react-dom';
import { PropTypes } from 'prop-types';
import css from './Modal.module.css';

const port = document.querySelector('#modal-portal');

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handlerKey);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlerKey);
  }
  handlerKey = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };
  handlerOverlay = e => {
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };
  render() {
    const { largeImageURL, tags } = this.props.item;
    return createPortal(
      <div className={css.overlay} onClick={this.handlerOverlay}>
        <div className={css.modal}>
          <img src={largeImageURL} alt={tags} />
        </div>
      </div>,
      port
    );
  }
}
Modal.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func,
};
export default Modal;
