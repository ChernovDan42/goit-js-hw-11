import { pixabayApiService } from './helpers/pixabayApiService'
import { refs } from './refs'
import Notiflix from 'notiflix';
import { renderMarkup } from "./renderMarkup";


export async function loadMore(e) {
  e.preventDefault();
  // lightbox.refresh();

  pixabayApiService.incrementPage()
  
 try {
   const fetchedImages = await pixabayApiService.fetchImages();
  const images = fetchedImages.data;
  renderMarkup(images.hits);
   
   if (images.hits.length < 40) {
     throw new Error
     }
 } catch (error) {
   refs.loadMoreBtn.classList.add('is-hidden');
   Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
    console.log(error);
  }
  
}