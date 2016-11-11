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

        this.selectedBrewery = [];
        this.selectedStyle = [];
        this.selectedAbv = [];
        this.selectedCreated = [];
    }

    search() {
        this.api
            .faceted(this.query, this.filter)
            .then(result => {
                this.count = result.count;
                this.results = result.results;
                this.facets = result.facets;
                // for (var facetName in this.facets) {
                //     this.facets[facetName].map(x => {
                //         x.isChecked = false;
                //         return x;
                //     })
                // }

                console.log(this.facets);
            })
    }

    attached() {
        this.search();
    }
}