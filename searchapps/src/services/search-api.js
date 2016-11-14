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
        // return new Promise(resolve => {
        //     var mapped = {
        //         facets: null,
        //         results: [],
        //         count: 0,
        //     };
        //     resolve(mapped)
        // });


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
}