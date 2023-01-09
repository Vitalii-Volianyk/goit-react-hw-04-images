export const fetchImage = (search, page, signal) => {
  return fetch(
    `https://pixabay.com/api/?q=${search}&page=${page}&key=31198912-785fc91d0a48dd5c6d0fb52b2&image_type=photo&orientation=horizontal&per_page=12`,
    { signal }
  );
};
const API = {
  fetchImage,
};
export default API;
