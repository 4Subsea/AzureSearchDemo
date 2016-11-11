import { SearchApi } from "services/search-api";
import { MultiCollectionSubscriber } from "common/multi-subscriber";


export class Facets {
    static inject = [SearchApi, MultiCollectionSubscriber];
    constructor(api, subscriber) {
        this.api = api;
        this.subscriber = subscriber;

        this.query = "";
        this.filter = "";
        this.results = [];
        this.count = null;
        this.facets = null;

        this.selectedBrewery = [];
        this.selectedStyle = [];
        this.selectedAbv = [];
        this.selectedCreated = [];

        this.subscriber
            .observe([this.selectedBrewery, this.selectedStyle, this.selectedAbv, this.selectedCreated])
            .onChanged(change => console.log(change));
    }


    search() {
        this.api
            .faceted(this.query, this.filter)
            .then(result => {
                this.count = result.count;
                this.results = result.results;
                this.facets = result.facets;
            })
    }

    attached() {
        this.search();
    }

    detached() {
        this.subscriber.dispose();
    }
}