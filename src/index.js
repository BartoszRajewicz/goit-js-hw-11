import { fetchImages } from './pixabay-api';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const seachQuery = formData.get('seachQuery').trim();

  if (seachQuery !== currentQuery) {
    clearGallery();
    currentPage = 1;
    currentQuery = searchQuery;
  }
  try {
    const images = await fetchImages(searchQuery, currentPage);

    if (images.length > 0) {
      renderImages(images);
      showLoadMoreButton();
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      hideLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
  }
}
