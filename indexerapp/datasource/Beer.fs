namespace DataSource.Beers

open System
open System.Text
open FSharp.Data
open DataSource.Styles

[<AutoOpen>]
type Beer(id:string, name: string, breweries: seq<string>, style: string, created: DateTimeOffset) =
    member this.id = id
    member this.name = name
    member this.breweries = breweries
    member this.style = style
    member this.created = created

[<AutoOpen>]
type BeerPage(page: int, totalPages: int, beers: seq<Beer>) =
    member this.Page = page
    member this.TotalPages = totalPages
    member this.Beers = beers

type BeerJson = JsonProvider<"../data/beers.json">

[<AutoOpen>]
type Beers =
    static member Load(apiKey: string, style: Style, page: int) = 

        let uri = String.Format("http://api.brewerydb.com/v2/beers?key={0}&p={1}&styleId={2}&withBreweries=Y", apiKey, page, style.Id)
        let beer = BeerJson.Load(uri)
        
        let beers = 
            query {
                for b in beer.Data do
                let id = b.Id
                let name = b.Name
                let breweries = query {
                    for bb in b.Breweries do
                    select bb.Name
                    }
                let created = DateTimeOffset.UtcNow
                select (Beer(id, name, breweries, style.Name, created))
            }

        BeerPage(beer.CurrentPage, beer.NumberOfPages, beers)