
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { PixabayApi } from './pixabayApiFetch';
import { refs } from './refs';
import { onSuccess, onFailure } from './helpers/notiflyx';
import { renderMarkup } from "./renderMarkup";
import { loadMore } from './loadMore';
import { clearGallery } from './helpers/clearGallery';

// /kkk

export const pixabayApiService = new PixabayApi();

refs.searchForm.addEventListener('submit', onSearch)
refs.loadMoreBtn.addEventListener('click', loadMore)


async function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value;
  clearGallery()
  if (pixabayApiService.query === '') {
    return alert('Введіть запрос')
  }
  
  refs.loadMoreBtn.classList.add('is-hidden')
  try {
    pixabayApiService.resetPage();
    const images = await pixabayApiService.fetchImages();
    if (images.totalHits === 0) {
      throw new Error
    }
    refs.loadMoreBtn.classList.remove('is-hidden')
    onSuccess(images)
    
    const render = await renderMarkup(images.hits);
    const lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt",captionDelay:250})
  } catch (error) {
    onFailure()
    clearGallery()
    console.log(error);
  }
}





