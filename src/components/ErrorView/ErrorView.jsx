import { PropTypes } from 'prop-types';
import css from './ErrorView.module.css';

const ErrorView = ({ message }) => {
  return (
    <div className={css.container}>
      <p className={css.text} data-text="Error, some went wrong...">
        Error, some went wrong...
      </p>
      <span className={css.message}>
        {message ? message : 'Image not found. Try again with new request'}
      </span>
    </div>
  );
};
ErrorView.propTypes = {
  message: PropTypes.string,
  tryAgain: PropTypes.func,
};
export default ErrorView;
