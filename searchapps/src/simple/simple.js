import { SearchApi } from 'services/search-api';

export class Simple {
    static inject = [SearchApi];

    constructor(api) {
        this.api = api;
        this.results = [];
        this.queryText = '';
        this.rawResult = '';
        this.count = null;
        this.rawJson = '';
    }

    search() {
        this.api
            .search(this.queryText)
            .then(x => {
                this.count = x.count;
                this.results = x.results;
                this.rawResult = JSON.stringify(x.raw, null, 4);
            });

    }

    clear() {
        this.results = [];
        this.queryText = '';
        this.rawResult = '';
        this.count = null;
    }

    attached() {
        let _class = this;
        $(".search-input").autocomplete({
            source: function(request, response) {
                _class.api
                    .suggest(request.term)
                    .then(results => response(results));
            },
            minLength: 2,
            select: function(event, ui) {
                _class.queryText = ui.item.value;
            }
        })
    }
}