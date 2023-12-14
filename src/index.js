import { fetchImages } from './pixabay-api';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);
