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

    nearest(query, location) {
        return new Promise(resolve => {
            this.httpClient
                .post("/search", {
                    count: true,
                    search: query,
                    orderby: `geo.distance(brewerylocation, geography'POINT(${location.lng} ${location.lat})')`,
                    top: 100
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