
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { refs } from './refs';
import { onSuccess, onFailure, onWarning } from './helpers/notiflyx';
import { renderMarkup } from "./renderMarkup";
import { clearGallery } from './helpers/clearGallery';
import { PixabayApi } from './PixabayApiFetch';
import {smoothScroll} from './helpers/smooth_scroll'


const pixabayApiService = new PixabayApi();
let currentPage = 1;

refs.searchForm.addEventListener('submit', onSearch)
refs.loadMoreBtn.addEventListener('click', loadMore)
 const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });


async function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  clearGallery()
  if (pixabayApiService.query === '') {
    return alert('Введіть запрос')
  }
  
  
  refs.loadMoreBtn.classList.add('is-hidden')
  try {
    currentPage = 1
    pixabayApiService.resetPage();
    const fetchedImages = await pixabayApiService.fetchImages();
    const images = fetchedImages.data;
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
    
 
     renderMarkup(images.hits);
   
     lightbox.refresh();
  } catch (error) {
    onFailure()
    clearGallery()
    console.log(error);
  }
 
}




async function loadMore(e) {
  e.preventDefault();

  pixabayApiService.incrementPage()
  refs.loadMoreBtn.classList.add('is-hidden');
 try {
   const fetchedImages = await pixabayApiService.fetchImages();
   const images = fetchedImages.data;
   renderMarkup(images.hits);
   const maxPages = Math.ceil(images.totalHits / images.hits.length);
   currentPage += 1;
   console.log(maxPages);
   console.log(currentPage);
   if (maxPages === currentPage) {
     throw new Error
   }

   if (images.hits.length < 40) {
     throw new Error
   }
   smoothScroll()
   refs.loadMoreBtn.classList.remove('is-hidden');
   
 } catch (error) {
   refs.loadMoreBtn.classList.add('is-hidden');
  onWarning()
   console.log(error);
   smoothScroll();
 }
  lightbox.refresh();
  
}

