import { Component } from 'react';
import { PropTypes } from 'prop-types';
import css from './SearchBar.module.css';

class SearchBar extends Component {
  state = {
    search: '',
  };
  handleChange = e => {
    this.setState({ search: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.search.trim() !== '') {
      this.props.onSubmit(this.state.search);
      this.setState({ search: '' });
    }
  };
  render() {
    return (
      <header className={css.SearchBar}>
        <form className={css.SearchForm} onSubmit={this.handleSubmit}>
          <button type="submit" className={css.button}>
            <span className={css.Button_label}>Search</span>
          </button>

          <input
            className={css.input}
            type="text"
            autoComplete="off"
            autoFocus
            onChange={this.handleChange}
            value={this.state.search}
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}
SearchBar.propTypes = {
  onSubmit: PropTypes.func,
};
export default SearchBar;
