
import SimpleLightbox from "simplelightbox";
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";
import { refs } from './refs';
import { onSuccess, onFailure, onWarning } from './helpers/notiflyx';
import { renderMarkup } from "./renderMarkup";
import { clearGallery } from './helpers/clearGallery';
import { PixabayApi } from './PixabayApiFetch';
import {smoothScroll} from './helpers/smooth_scroll'


const pixabayApiService = new PixabayApi();

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

    if (images.hits.length < 40) {
      const render = renderMarkup(images.hits);
      onSuccess(images)
      return
    }
  
    refs.loadMoreBtn.classList.remove('is-hidden')
    onSuccess(images)
    
    const render = renderMarkup(images.hits);
    const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 })
   
  } catch (error) {
    onFailure()
    clearGallery()
    console.log(error);
  }
}


async function loadMore(e) {
  e.preventDefault();

  pixabayApiService.incrementPage()
  
 try {
   const images = await pixabayApiService.fetchImages();
    const render = renderMarkup(images.hits);
   if (images.hits.length < 40) {
     throw new Error
   }
    smoothScroll()
   
 } catch (error) {
   refs.loadMoreBtn.classList.add('is-hidden');
  onWarning()
    console.log(error);
  }
  
}

