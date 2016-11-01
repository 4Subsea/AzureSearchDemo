import { SearchApi } from 'services/search-api';

export class Simple {
    static inject = [SearchApi];

    constructor(api) {
        this.api = api;
        this.results = [];
        this.queryText = '';
    }

    search() {
        console.log(this.queryText);
        this.api.search(this.queryText).then(results => this.results = results);
    }
}