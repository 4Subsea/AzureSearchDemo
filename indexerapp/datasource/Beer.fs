namespace datasource

open System
open FSharp.Data

[<AutoOpen>]
type Beer(name: string, breweries: string, page: int) =
    member this.Name = name
    member this.Breweries = breweries
    member this.Page = page

[<AutoOpen>]
type BeerPage(page: int, totalPages: int, beers: seq<Beer>) =
    member this.Page = page
    member this.TotalPages = totalPages
    member this.Beers = beers

type BeerJson = JsonProvider<"../data/beers.json">

[<AutoOpen>]
type Beers =
    static member Load(uri: string) = 
        let beer = BeerJson.Load(uri)
        
        let beers = 
            query {
                for b in beer.Data do
                let name = b.Name
                let breweries = query {
                    for bb in b.Breweries do
                    select bb.Name
                    }
                let brewery = String.concat "\n" breweries
                select (Beer(name, brewery, beer.CurrentPage))
            }

        BeerPage(beer.CurrentPage, beer.NumberOfPages, beers)