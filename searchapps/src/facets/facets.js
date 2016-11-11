import { SearchApi } from 'services/search-api';

export class Facets {
    static inject = [SearchApi];
    constructor(api) {
        this.api = api;
        this.query = "";
        this.filter = "";
        this.results = [];
        this.count = null;
        this.facets = null;
    }

    search() {
        this.api
            .faceted(this.query, this.filter)
            .then(result => {
                console.log(result);
                this.count = result.count;
                this.results = result.results;
                this.facets = result.facets;
            })
    }

    attached() {
        this.search();
    }
}