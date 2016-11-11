import { SearchApi } from "services/search-api";
import { MultiCollectionSubscriber } from "common/multi-subscriber";


export class Facets {
    static inject = [SearchApi, MultiCollectionSubscriber];
    constructor(api, subscriber) {
        this.api = api;
        this.subscriber = subscriber;

        this.query = "";
        this.results = [];
        this.count = null;
        this.facets = null;

        this.selectedBrewery = [];
        this.selectedStyle = [];
        this.selectedAbv = [];
        this.selectedCreated = [];

        this.subscriber
            .observe([this.selectedBrewery, this.selectedStyle, this.selectedAbv, this.selectedCreated])
            .onChanged(change => this.search());
    }


    search() {
        var filter = this.buildFilter();

        this.api
            .faceted(this.query, filter)
            .then(result => {
                this.count = result.count;
                this.results = result.results;
                this.facets = result.facets;
            })
    }

    buildFilter() {
        // var stylenameFilter = this.selectedStyle.reduce((aggregated, curr) => {
        //     return aggregated += 'stylename eq ${expression}'
        // })

        var stylenameFilter = this.selectedStyle[0] === undefined ? "" : "stylename eq '" + this.selectedStyle[0] + "'";
        console.log(stylenameFilter);
        return stylenameFilter;
    }

    attached() {
        this.search();
    }

    detached() {
        this.subscriber.dispose();
    }
}