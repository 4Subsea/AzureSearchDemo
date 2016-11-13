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
                        })
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
                    highlightPreTag: "<strong>",
                    highlightPostTag: "</strong>"
                })
                .then(result => {
                    var results = JSON.parse(result.response).value;
                    resolve(results.map(x => x["@search.text"]));
                });
        })
    }

    faceted(query, filter) {
        return new Promise(resolve => {
            this.httpClient
                .post("/search", {
                    facets: [
                        "stylename",
                        "abv,values:5|10|15",
                        "breweries",
                        "created,interval:year"
                    ],
                    search: query,
                    filter: filter,
                    count: true
                })
                .then(result => {
                    var jsonResponse = JSON.parse(result.response);
                    var facets = jsonResponse["@search.facets"];
                    var mapped = {
                        facets: {
                            stylename: facets.stylename,
                            abv: facets.abv,
                            breweries: facets.breweries,
                            created: facets.created.map(x => {
                                return {
                                    value: new Date(x.value).getFullYear(),
                                    count: x.count
                                }
                            }),
                        },
                        results: jsonResponse.value.map(x => {
                            return {
                                name: x.name,
                                description: x.description,
                                alcoholPercentage: x.abv,
                                label: x.labelmediumimage,
                                style: x.stylename,
                                brewery: x.breweries[0]
                            }
                        }),
                        count: jsonResponse["@odata.count"],
                    }

                    resolve(mapped);
                });
        })
    }

    nearest(query, location) {
        return new Promise(resolve => {
            this.httpClient
                .post("/search", {
                    count: true,
                    search: query,
                    filter: "brewerylocation ne null",
                    orderby: `geo.distance(brewerylocation, geography'POINT(${location.lng} ${location.lat})')`
                })
                .then(result => {
                    let jsonResult = JSON.parse(result.response);
                    resolve({
                        count: jsonResult["@odata.count"],
                        results: jsonResult["value"].map(x => {
                            return {
                                name: x.name,
                                label: x.labelmediumimage,
                                style: x.stylename,
                                alcoholPercentage: x.abv,
                                brewery: x.breweries[0],
                                lng: x.brewerylocation.coordinates[0],
                                lat: x.brewerylocation.coordinates[1]
                            }
                        })
                    });
                });
        });
    }
}