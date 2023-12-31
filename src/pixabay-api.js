import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '41244785-17981172bc37ee7b733939999';

async function fetchImages(query, page = 1) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const data = response.data;

   
    return {
      images: data.hits,
      totalHits: data.totalHits,
    };
  } catch (error) {
    throw error;
  }
}

export { fetchImages };
