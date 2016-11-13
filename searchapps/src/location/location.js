import { SearchApi } from "../services/search-api";

export class Location {
    static inject = [SearchApi];

    constructor(searchApi) {
        this.searchApi = searchApi;
        this.queryText = "";
        this.location = {};
        this.results = []
        this.count = [];
    }

    search() {
        this.searchApi
            .nearest(this.queryText, this.location)
            .then(x => {
                this.results = x.results;
                this.count = x.count;
            });
    }

    attached() {
        this.initializeMap();
    }

    onMapInitialized() {
        this.location = { lat: 59.917081, lng: 10.727702 };

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: this.location,
            zoom: 10,
            styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#b4d4e1" }, { "visibility": "on" }] }]
        });

        this.map.addListener('zoom_changed', () => {
            console.log("zoom changed");
            console.log(this.map.getBounds());
            console.log(this.map.getBounds().toJSON());
        });

        this.map.addListener("dragend", () => {
            console.log("drag ended");
            console.log(this.map.getBounds());
        });
    }

    // findCurrentPosition() {
    //     if (navigator.geolocation) {
    //         return navigator.geolocation.getCurrentPosition(function(position) {
    //             var pos = {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude
    //             };

    //             return {
    //                 success = true,
    //                 position = pos
    //             }
    //         }, () => { success = false });
    //     }
    //     else {
    //         return { success = false };
    //     }
    // }

    initializeMap() {
        window.initMap = () => this.onMapInitialized();
        let scriptElement = document.createElement('script');
        scriptElement.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCpc-ixRTVtC3qx-55OvECcX01bEw9siCA&callback=initMap";
        document.querySelector('body').appendChild(scriptElement);
    }
}