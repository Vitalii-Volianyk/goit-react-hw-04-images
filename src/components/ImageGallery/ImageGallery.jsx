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
  const [currentPage, setCurrentPage] = useState(1);
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
    if (searchParam) {
      setCurrentPage(1);
      getImages(1, true);
    }
  }, [searchParam]);

  useEffect(() => {
    if (currentPage > 1) {
      getImages(currentPage);
    }
  }, [currentPage]);

  const getImages = (page, notif = false) => {
    if (!searchParam) {
      return;
    }
    if (notif) {
      setCurStatus(STATUS.PENDING);
    }
    fetchImage(searchParam, page, signal)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return new Error('Image not found. Try again');
      })
      .then(response => {
        if (response.totalHits < 1) {
          setCurStatus(STATUS.REJECT);
          setErrorMessage('Image not found. Try again with new request');
          return new Error('Image not found. Try again with new request');
        }
        setImageList(prevList => {
          if (notif) {
            setTotalHits(response.totalHits);
            return response.hits;
          }
          return [...prevList, ...response.hits];
        });
        setCurStatus(STATUS.RESOLVE);
      })
      .catch(error => {
        console.log(error);
        setCurStatus(STATUS.REJECT);
        setErrorMessage(error.message);
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
