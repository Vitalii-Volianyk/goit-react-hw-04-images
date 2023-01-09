import { fetchImage } from 'services/api';
import { Component } from 'react';
import { PropTypes } from 'prop-types';
import ImageGalleryItem from './ImageGalleryItem';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loader from 'components/Loader';
import EmptyView from 'components/EmptyView';
import ErrorView from 'components/ErrorView';
import css from './ImageGallery.module.css';

const status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVE: 'resolve',
  REJECT: 'reject',
};
const controller = new AbortController();
const signal = controller.signal;
class ImageGallery extends Component {
  state = {
    imageList: null,
    errorMessage: null,
    curStatus: status.IDLE,
    currentPage: 1,
    showModal: false,
    id: null,
    totalHits: 0,
  };
  toggleModal = () => {
    this.setState(prevState => {
      return {
        showModal: !prevState.showModal,
      };
    });
  };
  componentDidUpdate(
    { searchParam: prevSearchParam },
    { currentPage: prevCurrentPage }
  ) {
    const { searchParam } = this.props;
    const { currentPage } = this.state;

    if (prevSearchParam !== searchParam) {
      this.getImages(searchParam, currentPage, true);
    }
    if (prevCurrentPage < currentPage) {
      this.getImages(searchParam, currentPage);
    }
  }
  componentWillUnmount() {
    controller.abort();
  }
  getImages(search, page, statusShow = false) {
    if (statusShow) {
      this.setState({ curStatus: status.PENDING, currentPage: 1 });
    }
    fetchImage(search, page, signal)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return new Error('Image not found.Try again');
      })
      .then(response => {
        this.setState(({ imageList }) => {
          if (page > 1) {
            return {
              imageList: [...imageList, ...response.hits],
              curStatus: status.RESOLVE,
            };
          }
          return {
            imageList: response.hits,
            curStatus: status.RESOLVE,
            totalHits: response.totalHits,
          };
        });
      })
      .catch(error => {
        this.setState({ curStatus: status.REJECT, errorMessage: error });
      });
  }
  showModal = id => {
    this.setState({ showModal: true, id });
  };
  handleLoadMore = () => {
    this.setState(prevState => {
      return { currentPage: prevState.currentPage + 1 };
    });
  };
  reloadRequest = () => {
    const { searchParam } = this.props;
    const { currentPage } = this.state;

    this.getImages(searchParam, currentPage, true);
  };
  render() {
    const {
      curStatus,
      errorMessage,
      imageList,
      showModal,
      id,
      currentPage,
      totalHits,
    } = this.state;
    if (curStatus === status.IDLE) {
      return <EmptyView />;
    }
    if (curStatus === status.PENDING) {
      return <Loader />;
    }
    if (curStatus === status.RESOLVE) {
      const classes = showModal
        ? css.container + ' ' + css.no_scroll
        : css.container;
      return (
        <div className={classes}>
          <ul className={css.gallery}>
            {imageList.map((el, index) => (
              <ImageGalleryItem
                key={el.id}
                onModal={this.showModal}
                id={index}
                item={el}
              />
            ))}
          </ul>
          {totalHits > currentPage * 12 && (
            <Button onLoadMore={this.handleLoadMore} />
          )}
          {showModal && (
            <Modal item={imageList[id]} onClose={this.toggleModal} />
          )}
        </div>
      );
    }
    if (curStatus === status.REJECT) {
      return <ErrorView message={errorMessage} tryAgain={this.reloadRequest} />;
    }
  }
}
ImageGallery.propTypes = {
  searchParam: PropTypes.string,
};
export default ImageGallery;
