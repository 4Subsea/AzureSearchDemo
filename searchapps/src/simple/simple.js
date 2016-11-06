import { SearchApi } from 'services/search-api';

export class Simple {
    static inject = [SearchApi];

    constructor(api) {
        this.api = api;
        this.results = [];
        this.queryText = '';
        this.rawResult = '';
        this.count = null;
    }

    search() {
        this.api
            .search(this.queryText)
            .then(x => {
                this.count = x.count;
                this.results = x.results;
                this.rawResult = x.rawResult;
            });

    }

    clear() {
        this.results = [];
        this.queryText = '';
        this.rawResult = '';
        this.count = null;
    }

    attached() {
        let _api = this.api;
        $(".search-input").autocomplete({
            source: function(request, response) {
                _api
                    .suggest(request.term)
                    .then(results => response(results));

            },
            minLength: 2,
            select: function(event, ui) {
                console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
            }
        })
    }
}