import { fetchImages } from './pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let currentPage = 1;
let currentQuery = '';
let isFirstLoad = true;

searchForm.addEventListener('submit', handleFormSubmit);

function scrollNewImages() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isFirstLoad) {
        loadMoreImages();
      }
    });
  },
  { threshold: [0, 0.2] }
);
observer.observe(document.querySelector('.gallery'));

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const searchQuery = formData.get('searchQuery').trim();

  if (!searchQuery) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (searchQuery !== currentQuery) {
    clearGallery();
    currentPage = 1;
    currentQuery = searchQuery;
  }
  try {
    const images = await fetchImages(searchQuery, currentPage);

    if (images.length > 0) {
      renderImages(images);
      isFirstLoad = false;
    } else {
    }
  } catch (error) {
    console.log(error);
  }

  observer.observe(document.querySelector('.gallery'));
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

async function loadMoreImages() {
  try {
    const images = await fetchImages(currentQuery, currentPage);
    if (images && images.length > 0) {
      renderImages(images);
    } else {
      if (images && images.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (images && images.totalHits) {
        if (currentPage === 1 || gallery.children.length < images.totalHits) {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function refreshLighBox() {
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}
