import { fetchImage } from 'services/api';
import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ImageGalleryItem from './ImageGalleryItem';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loader from 'components/Loader';
import EmptyView from 'components/EmptyView';
import ErrorView from 'components/ErrorView';
import css from './ImageGallery.module.css';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVE: 'resolve',
  REJECT: 'reject',
};
const controller = new AbortController();
const signal = controller.signal;

const ImageGallery = ({ searchParam }) => {
  const [imageList, setImageList] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [curStatus, setCurStatus] = useState(STATUS.IDLE);
  const [currentPage, setCurrentPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };
  const loadModal = id => {
    setId(id);
    toggleModal();
  };
  useEffect(() => {
    getImages(true);
  }, [searchParam]);

  useEffect(() => {
    if (currentPage > 1) {
      getImages();
    }
  }, [currentPage]);

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  const getImages = (statusShow = false) => {
    if (statusShow) {
      setCurStatus(STATUS.PENDING);
      setCurrentPage(1);
    }
    fetchImage(searchParam, currentPage, signal)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return new Error('Image not found.Try again');
      })
      .then(response => {
        setImageList(prevList => {
          if (currentPage > 1) {
            setCurStatus(STATUS.RESOLVE);
            return [...prevList, ...response.hits];
          }
          setCurStatus(STATUS.RESOLVE);
          setTotalHits(response.totalHits);
          return response.hits;
        });
      })
      .catch(error => {
        setCurStatus(STATUS.REJECT);
        setErrorMessage(error);
      });
  };
  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };
  const reloadRequest = () => {
    getImages(true);
  };
  if (curStatus === STATUS.IDLE) {
    return <EmptyView />;
  }
  if (curStatus === STATUS.PENDING) {
    return <Loader />;
  }
  if (curStatus === STATUS.RESOLVE) {
    const classes = showModal
      ? css.container + ' ' + css.no_scroll
      : css.container;
    return (
      <div className={classes}>
        <ul className={css.gallery}>
          {imageList.map((el, index) => (
            <ImageGalleryItem
              key={el.id}
              onModal={loadModal}
              id={index}
              item={el}
            />
          ))}
        </ul>
        {totalHits > currentPage * 12 && <Button onLoadMore={handleLoadMore} />}
        {showModal && <Modal item={imageList[id]} onClose={toggleModal} />}
      </div>
    );
  }
  if (curStatus === STATUS.REJECT) {
    return <ErrorView message={errorMessage} tryAgain={reloadRequest} />;
  }
};

ImageGallery.propTypes = {
  searchParam: PropTypes.string,
};
export default ImageGallery;
