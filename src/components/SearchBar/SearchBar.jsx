import { useState } from 'react';
import { PropTypes } from 'prop-types';
import css from './SearchBar.module.css';

const SearchBar = ({ onSubmit }) => {
  const [search, setSearch] = useState('');
  const handleChange = e => {
    setSearch(e.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (search.trim() !== '') {
      onSubmit(search);
      setSearch('');
    }
  };
  return (
    <header className={css.SearchBar}>
      <form className={css.SearchForm} onSubmit={handleSubmit}>
        <button type="submit" className={css.button}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="25"
            width="25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53 1.96 2.36 2.75-3.54zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89zM15.5 9a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path>
          </svg>
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          onChange={handleChange}
          value={search}
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};
SearchBar.propTypes = {
  onSubmit: PropTypes.func,
};
export default SearchBar;
