import { HttpClient } from 'aurelia-http-client';

export class SearchApi {

    constructor() {
        this.httpClient = new HttpClient()
            .configure(x => {
                x.withBaseUrl("https://azuresearchfree.search.windows.net/indexes/beersv1/docs")
                x.withParams({ "api-version": "2015-02-28" });
                x.withHeader("api-key", "5655AB55C4E55DBE67C691F376482D8C");
                x.withInterceptor({
                    request(message) {
                        console.log(message);
                        return message;
                    },

                    requestError(error) {
                        console.log(error);
                        throw error;
                    },

                    response(message) {
                        console.log(message);
                        return message;
                    },

                    responseError(error) {
                        console.log(error);
                        throw error;
                    }
                })
            })
    }

    search(query) {
        return new Promise(resolve => {
            this.httpClient
                .post("/search", {
                    count: true,
                    search: query
                })
                .then(result => {
                    let jsonResult = JSON.parse(result.response);
                    resolve({
                        count: jsonResult["@odata.count"],
                        results: jsonResult["value"].map(x => {
                            return {
                                name: x.name,
                                description: x.description,
                                label: x.labelmediumimage,
                                style: x.stylename,
                                brewery: x.breweries[0]
                            }
                        }),
                        raw: jsonResult
                    });
                });
        });
    }

    suggest(query) {
        return new Promise(resolve => {
            this.httpClient
                .post("/suggest", {
                    search: query,
                    suggesterName: "suggestBeerName",
                    highlightPreTag: "<b>",
                    highlightPostTag: "</b>"
                })
                .then(result => {
                    var results = JSON.parse(result.response).value;
                    console.log(results);
                    resolve(results.map(x => x["@search.text"]));
                });
        })
    }
}