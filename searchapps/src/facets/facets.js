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

    abvFacetMatcher = (a, b) => a.from === b.from && a.to === b.to;

    search() {
        var filter = this.buildFilter();

        console.log("filter is:" + filter);

        this.api
            .faceted(this.query, filter)
            .then(result => {
                this.count = result.count;
                this.results = result.results;
                this.facets = result.facets;
            })
    }

    buildFilter() {
        var allFilters = [
            this.buildBreweryFilter(),
            this.buildStyleFilter(),
            this.buildAbvFilter(),
            this.buildCreatedFilter()
        ];

        return allFilters.reduce((aggregated, current) => current ? aggregated + ` (${current}) and` : aggregated, "")
            .trim()
            .replace(/ and$/, "");
    }

    attached() {
        this.search();
    }

    detached() {
        this.subscriber.dispose();
    }

    buildBreweryFilter() {
        return this.selectedBrewery
            .reduce((aggregated, current) => aggregated + ` (breweries/any(t: t eq '${current}')) or`, "")
            .trim()
            .replace(/ or$/, "");
    }

    buildAbvFilter() {
        return this.selectedAbv
            .reduce((aggregated, current) => {
                var from = current.from;
                var to = current.to;

                if (from && to) {
                    return aggregated + ` (abv ge ${from} and abv lt ${to}) or`;
                }
                else if (from) {
                    return aggregated + ` (abv ge ${from}) or`;
                }
                else if (to) {
                    return aggregated + ` (abv lt ${to}) or`
                }

            }, "")
            .trim()
            .replace(/ or$/, "");
    }

    buildStyleFilter() {
        return this.selectedStyle
            .reduce((aggregated, current) => aggregated + ` (stylename eq '${current}') or`, "")
            .trim()
            .replace(/ or$/, "");
    }


    buildCreatedFilter() {
        return this.selectedCreated
            .reduce((aggregated, current) => aggregated + ` (created ge ${new Date(current.toString()).toISOString()} and created lt ${new Date((current + 1).toString()).toISOString()}) or`, "")
            .trim()
            .replace(/ or$/, "");
    }
}