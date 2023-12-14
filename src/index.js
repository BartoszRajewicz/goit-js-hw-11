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

function renderImages(images) {
  const imageCards = images.map(image => createImageCard(image));
  gallery.insertAdjacentHTML('beforeend', imageCards.join(''));
  refreshLighBox();
  currentPage += 1;
}

function createImageCard(image) {
  return;
  `<div class= "photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" data-source="${image.largeImageURL}" />
    <div class= "info">
        <p class="info-item"><b>Likes:</b> $(image.likes)</p>
        <p class="info-item"><b>Views:</b> $(image.views)</p>
        <p class="info-item"><b>Comments:</b> $(image.comments)</p>
        <p class="info-item"><b>Downloads:</b> $(image.downloads)<p>
        </div>
        </div>
    `;
}

function clearGallery() {
    gallery.innerHTML = '';
}


