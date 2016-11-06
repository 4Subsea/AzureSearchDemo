import { HttpClient } from 'aurelia-http-client';

export class SearchApi {

    constructor() {
        this.httpClient = new HttpClient()
            .configure(x => {
                x.withBaseUrl('https://azuresearchfree.search.windows.net/indexes/beersv1/docs')
                x.withParams({ 'api-version': '2015-02-28' })
                x.withHeader('api-key', '5655AB55C4E55DBE67C691F376482D8C');
            })
    }

    search(query) {
        return new Promise(resolve => {
            this.httpClient
                .get("?search=" + query)
                .then(result => {
                    console.log(result);
                    resolve(result);
                });
        });
    }

    suggest(query) {
        return new Promise(resolve => {
            resolve(['nissefar', 'bestefar', 'oldefar'])
        })
    }
}