import css from './ImageGalleryItem.module.css';
import { PropTypes } from 'prop-types';

const ImageGalleryItem = ({ item: { tags, webformatURL }, id, onModal }) => {
  return (
    <li
      className={css.gallery_item}
      onClick={() => {
        onModal(id);
      }}
    >
      <img src={webformatURL} alt={tags} />
    </li>
  );
};
ImageGalleryItem.propTypes = {
  item: PropTypes.object,
  id: PropTypes.number,
  onModal: PropTypes.func,
};
export default ImageGalleryItem;
