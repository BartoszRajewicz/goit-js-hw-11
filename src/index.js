import { fetchImages } from './pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);

function scrollNewImages() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMoreImages();
  }
});

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const searchQuery = formData.get('searchQuery').trim();

  if (searchQuery !== currentQuery) {
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

function renderImages(images) {
  const imageCards = images.map(image => createImageCard(image));
  gallery.insertAdjacentHTML('beforeend', imageCards.join(''));
  refreshLighBox();
  scrollNewImages();
  currentPage += 1;
}

function createImageCard(image) {
  return `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" data-source="${image.largeImageURL}" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `;
}
function clearGallery() {
  gallery.innerHTML = '';
}

function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

async function loadMoreImages() {
  try {
    const images = await fetchImages(currentQuery, currentPage);
    if (images.length > 0) {
      renderImages(images);
    } else {
      hideLoadMoreButton();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function refreshLighBox() {
  const lightbox = new simpleLightbox('.gallery a');
  lightbox.refresh();
}
