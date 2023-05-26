import { refs } from './refs';

export function renderMarkup(api) {

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