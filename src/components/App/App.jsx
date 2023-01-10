import { useState } from 'react';
import ImageGallery from 'components/ImageGallery';
import SearchBar from 'components/SearchBar';
import css from './App.module.css';

const App = () => {
  const [searchParam, setSearchParam] = useState(null);
  const handleSubmit = search => {
    setSearchParam(search);
  };
  return (
    <div className={css.App}>
      <SearchBar onSubmit={handleSubmit} />
      <ImageGallery searchParam={searchParam} />
    </div>
  );
};

export default App;
