import { HttpClient } from 'aurelia-http-client';

export class SearchApi {

    constructor() {
        this.httpClient = new HttpClient()
            .configure(x => {
                x.withBaseUrl('https://azuresearchfree.search.windows.net/indexes/beersv1/docs/search?api-version=2015-02-28')
                x.withHeader('api-key', '5655AB55C4E55DBE67C691F376482D8C');
            })
    }

    search(query) {
        return new Promise(resolve => {
            this.httpClient
                .post("", {
                    "count": true,
                    "search": query
                })
                .then(result => {
                    let rawResult = result.response;
                    let jsonResult = JSON.parse(rawResult);
                    resolve({
                        count: jsonResult["@odata.count"],
                        results: jsonResult["value"].map(x => {
                            return {
                                name: x.name,
                                style: x.style,
                                brewery: x.breweries[0]
                            }
                        }),
                        raw: rawResult
                    });
                });
        });
    }

    suggest(query) {
        return new Promise(resolve => {
            resolve(['nissefar', 'bestefar', 'oldefar'])
        })
    }
}