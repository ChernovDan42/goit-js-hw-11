
import PixabayApi from './js/PixabayApiFetch';


const pixabayApiService = new PixabayApi();



const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}


refs.searchForm.addEventListener('submit', onSearch)
refs.loadMoreBtn.addEventListener('click',loadMore)



 async function onSearch(e) {
    e.preventDefault();

    pixabayApiService.query = e.currentTarget.elements.searchQuery.value;

    if (pixabayApiService.query === '') {
        console.log('введіте запрос');
        return;
    }

    try {
        const images = await pixabayApiService.fetchImages();
        const render = await renderMarkup(images);
        console.log(images);
    } catch (error) {
        console.log(error);
    }

 }


function renderMarkup(api) {
    
    const murkup = api.map((photo) => {
const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = photo;

        return `<div class="photo-card"><a href='${largeImageURL} class='large-image' ><img src="${webformatURL}" alt="${tags}" width='300' height='200' loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
     ${likes} <b>Likes</b>
    </p>
    <p class="info-item">
      ${views}<b>Views</b>
    </p>
    <p class="info-item">
      ${comments}<b>Comments</b>
    </p>
    <p class="info-item">
      ${downloads}<b>Downloads</b>
    </p>
  </div>
</div>`
    }).join()
    
    // refs.galleryRef.innerHTML = murkup;
     refs.gallery.insertAdjacentHTML('beforeend',murkup)
}
 

function clearGallery() {
     refs.gallery.innerHTML=''
}

