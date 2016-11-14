import { HttpClient } from "aurelia-http-client";
import { RequestInterceptor } from "../common/request-interceptor";

export class SearchApi {
    static inject = [RequestInterceptor];

    constructor(interceptor) {
        this.httpClient = new HttpClient()
            .configure(x => {
                x.withBaseUrl("https://azuresearchfree.search.windows.net/indexes/beersv1/docs")
                x.withParams({ "api-version": "2015-02-28" });
                x.withHeader("api-key", "5655AB55C4E55DBE67C691F376482D8C");
                x.withInterceptor(interceptor)
            })
    }

    faceted(query, filter) {
        return new Promise(resolve => {
            var mapped = {
                facets: null,
                results: [],
                count: 0,
            };
            resolve(mapped)
        });

        //demo2facetquery
    }
}