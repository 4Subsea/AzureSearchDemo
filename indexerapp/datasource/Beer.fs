namespace DataSource.Beers

open System
open System.Text
open FSharp.Data
open DataSource.Styles
open Microsoft.Spatial

[<AutoOpen>]
type Location(lat: float, long: float) =
    member this.lat = lat
    member this.long = long

[<AutoOpen>]
type Beer(id:string, name: string, description: string, abv:Nullable<decimal>, breweries: seq<string>, styleName: string, styleDescription: string, isOrganic: bool, breweryLocation: GeographyPoint, labelIcon: string, labelMediumImage: string, labelLargeImage: string, created: DateTimeOffset, updated: DateTimeOffset) =
    member this.id = id
    member this.name = name
    member this.description = description
    member this.abv = abv
    member this.labelicon = labelIcon
    member this.labelmediumimage = labelMediumImage
    member this.labellargeimage = labelLargeImage
    member this.breweries = breweries
    member this.stylename = styleName
    member this.styledescription = styleDescription
    member this.isorganic = isOrganic
    member this.brewerylocation = breweryLocation
    member this.created = created
    member this.updated = updated

[<AutoOpen>]
type BeerPage(page: int, totalPages: int, beers: seq<Beer>) =
    member this.Page = page
    member this.TotalPages = totalPages
    member this.Beers = beers

type BeerJson = JsonProvider<"../data/beers.json">

[<AutoOpen>]
type Beers =
    static member Load(apiKey: string, style: Style, page: int) = 

        let uri = String.Format("https://api.brewerydb.com/v2/beers?key={0}&p={1}&styleId={2}&withBreweries=Y", apiKey, page, style.Id)
        let beer = BeerJson.Load(uri)
        
        let beers = 
            query {
                for b in beer.Data do
                let id = b.Id
                let name = b.Name
                let breweryGeographyPoint = b.Breweries |> 
                                            Seq.collect(fun x -> x.Locations) |> 
                                            Seq.filter(fun x -> match x.JsonValue.TryGetProperty("latitude") with
                                                                | Some x -> true
                                                                | None -> false) |> 
                                            Seq.map(fun x -> GeographyPoint.Create((float)x.Latitude, (float)x.Longitude)) |> 
                                            Seq.tryFind(fun _ -> true)
                let breweryLocation = match breweryGeographyPoint with
                                      | Some x -> x
                                      | None -> null
                let breweries = query {
                    for bb in b.Breweries do
                    select bb.Name
                    }
                let abv = match b.JsonValue.TryGetProperty("abv") with
                          | Some x -> (Nullable<decimal>)b.Abv
                          | None -> System.Nullable()
                let isOrganic = b.IsOrganic.Equals("Y")
                let haveLabels = match b.JsonValue.TryGetProperty("labels") with 
                                 | Some x -> true
                                 | None -> false
                let icon = if haveLabels then b.Labels.Icon else null
                let medium = if haveLabels then b.Labels.Medium else null
                let large = if haveLabels then b.Labels.Large else null
                let created =  new DateTimeOffset(b.CreateDate)
                let updated = new DateTimeOffset(b.UpdateDate)
                select (Beer(b.Id, b.Name, b.Description, abv, breweries, b.Style.Name, b.Style.Description, isOrganic, breweryLocation, icon, medium, large, created, updated))
            }
        BeerPage(beer.CurrentPage, beer.NumberOfPages, beers)