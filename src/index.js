import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';


const ref = {
    input: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
    
}

let page = null;
// let perPage = null;
let searchQuery = '';

ref.input.addEventListener('submit', onSubmit);
ref.loadMore.addEventListener('click', onLoadMmore);



function onSubmit(evt) {
  evt.preventDefault();
    notHiden();
    clearGallery();
    page = 1;
    // perPage = 40;
  
  if (evt.currentTarget.searchQuery.value === '') {
      Notiflix.Notify.failure('Sorry, please enter the image search value.');
      return
    }

    searchQuery = evt.currentTarget.searchQuery.value;
    // console.log(evt.currentTarget.searchQuery.value);

    onFetch(searchQuery)
      .then(response => {
        if (response.data.total === 0) {
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          return
        }
        // console.log(response.data.total);
        renderGallery(response)
      })
    .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

  evt.currentTarget.searchQuery.value = '';
};

function onLoadMmore(evt) {
    page += 1;
    // perPage += 40;

    onFetch(searchQuery)
        .then(response => {
          
          renderGallery(response);
          gallery.refresh();
          
          
        })
    .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });


};



function isHiden() {
    ref.loadMore.classList.add('is-hiden');
};

function notHiden() {
    ref.loadMore.classList.remove('is-hiden');
}

function onFetch(searchQuery) {
  return  axios.get('https://pixabay.com/api/', {
    params: {
        key: '35579810-55fc44ce50f1d75978380d9a0',
        q: `${searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: 40,
        // pretty: 'true',
    }
  })
};

function renderGallery(response) {
    const arrHits = response.data.hits;

    const markupHits = arrHits.map(hit => {
    
        return `<div class="photo-card">
    <div class=""gallery>    
        <a href="${hit.largeImageURL}"><img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy"/></a>    
    </div>
    <div class="info">
    <p class="info-item">
      <b>Likes ${hit.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${hit.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${hit.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${hit.downloads}</b>
    </p>
    </div>
    </div>`}).join('');

    ref.gallery.insertAdjacentHTML("beforeend", markupHits);
    isHiden();
    // new SimpleLightbox('.gallery a', {});

    let gallery = new SimpleLightbox('.gallery a');
    // gallery.refresh();

};

function clearGallery() {
    ref.gallery.innerHTML = '';
};

