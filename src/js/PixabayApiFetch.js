
const axios = require('axios').default;
const API_KEY = '36720950-505b6a56a98a4bf11cd979a2a'
const BASE_URL='https://pixabay.com/api/'



export default class PixabayApi {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    

    async fetchImages() {
        try {
            const response = await axios({
                method: 'get',
                url: `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&page=${this.page}&per_page=40&safesearch=true&orientation=horizontal`,
                responseType: 'json'
            });
           
            const imgs = response.data
         return imgs
        } catch (error) {
            console.log(error);
        }

    }


    incrementPage() {
    this.page += 1;
    }
    
    resetPage() {
        this.page=1
    }


    get query() {
        return  this.searchQuery
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

}