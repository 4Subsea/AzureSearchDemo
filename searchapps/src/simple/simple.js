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
        let _ = this;
        $(".search-input").autocomplete({
                source: function(request, response) {
                    _.api
                        .suggest(request.term)
                        .then(results => response(results));
                },
                minLength: 2,
                select: function(event, ui) {
                    _.queryText = ui.item.value;
                }
            })
            .data('ui-autocomplete')
            ._renderItem = function(ul, item) {
                item.value = item.value.replace(/<\/?\w*>/g, "");

                return $("<li>")
                    .attr("data-value", item.value)
                    .append(item.label)
                    .appendTo(ul);
            }
    }
}