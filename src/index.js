import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PixabayApi from './js/PixabayApiFetch';


Notiflix.Notify.init({
  width: '280px',
  position: 'right-top', // 'right-top' - 'right-bottom' - 'left-top' - 'left-bottom' - 'center-top' - 'center-bottom' - 'center-center'
  distance: '10px',
  opacity: 1,
  borderRadius: '5px',
  rtl: false,
  timeout: 3000,
  messageMaxLength: 110,
  backOverlay: false,
  backOverlayColor: 'rgba(0,0,0,0.5)',
  plainText: true,
  showOnlyTheLastOne: false,
  clickToClose: true,
  pauseOnHover: true,

  ID: 'NotiflixNotify',
  className: 'notiflix-notify',
  zindex: 10000000,
  fontFamily: 'Quicksand',
  fontSize: '13px',
  cssAnimation: true,
  cssAnimationDuration: 400,
  cssAnimationStyle: 'fade', // 'fade' - 'zoom' - 'from-right' - 'from-top' - 'from-bottom' - 'from-left'
  closeButton: false,
  useIcon: true,
  useFontAwesome: false,
  fontAwesomeIconStyle: 'basic', // 'basic' - 'shadow'
  fontAwesomeIconSize: '34px',

  success: {
    background: '#32c682',
    textColor: '#fff',
    childClassName: 'notiflix-notify-success',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-check-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(50,198,130,0.2)',
  },

  failure: {
    background: '#ff5549',
    textColor: '#fff',
    childClassName: 'notiflix-notify-failure',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-times-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(255,85,73,0.2)',
  },

  warning: {
    background: '#eebf31',
    textColor: '#fff',
    childClassName: 'notiflix-notify-warning',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-exclamation-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(238,191,49,0.2)',
  },

  info: {
    background: '#26c0d3',
    textColor: '#fff',
    childClassName: 'notiflix-notify-info',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-info-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(38,192,211,0.2)',
  },
});



const pixabayApiService = new PixabayApi();



const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more')
}


refs.searchForm.addEventListener('submit', onSearch)
refs.loadMoreBtn.addEventListener('click', loadMore)




async function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value;
clearGallery()
  queryCheck()
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

  


function renderMarkup(api) {

  const murkup = api.map((photo) => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = photo;

    return `<div class="photo-card"><a href='${largeImageURL}' class='large-image' ><img src="${webformatURL}" alt="${tags}" width='300' height='200' loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
     <b>Likes</b><span>${likes}</span> 
    </p>
    <p class="info-item">
     <b>Views</b><span>${views}</span> 
    </p>
    <p class="info-item">
     <b>Comments</b><span>${comments}</span> 
    </p>
    <p class="info-item">
     <b>Downloads</b><span>${downloads}</span> 
    </p>
  </div>
</div>`
  }).join('')

  refs.gallery.insertAdjacentHTML('beforeend', murkup)
 
}


function clearGallery() {
  refs.gallery.innerHTML = ''
}

async function loadMore(e) {
  e.preventDefault();

  pixabayApiService.incrementPage()
  
 try {
   const images = await pixabayApiService.fetchImages();
    const render = await renderMarkup(images.hits);
 } catch (error) {
   refs.loadMoreBtn.classList.add('is-hidden');
   Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
    console.log(error);
  }
  
}


function queryCheck() {
  if (pixabayApiService.query === '') {
    return alert('введіте запрос')
  }
}

function onSuccess(api) {
   const notiflix= Notiflix.Notify.success(`Okay!We found ${api.totalHits} matches `);
}

function onFailure() {
   Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
}

