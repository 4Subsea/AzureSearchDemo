import { SearchApi } from "../services/search-api";

export class Location {
    static inject = [SearchApi];

    constructor(searchApi) {
        this.searchApi = searchApi;
        this.queryText = "";

        this.results = []
        this.count = [];
    }

    search() {
        this.searchApi
            .searchRequireLocation(this.queryText)
            .then(x => {
                this.results = x.results;
                this.count = x.count;
            });
    }

    attached() {
        this.initializeMap();
    }

    onMapInitialized() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 59.917081, lng: 10.727702 },
            zoom: 1,
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

        // var map;
        // function initMap() {
        //     map = new google.maps.Map(document.getElementById('map'), {
        //         center: { lat: -34.397, lng: 150.644 },
        //         zoom: 12
        //     });
        //     var infoWindow = new google.maps.InfoWindow({ map: map });

        //     // Try HTML5 geolocation.
        //     if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition(function(position) {
        //             var pos = {
        //                 lat: position.coords.latitude,
        //                 lng: position.coords.longitude
        //             };

        //             infoWindow.setPosition(pos);
        //             infoWindow.setContent('Location found.');
        //             map.setCenter(pos);
        //         }, function() {
        //             handleLocationError(true, infoWindow, map.getCenter());
        //         });
        //     } else {
        //         // Browser doesn't support Geolocation
        //         handleLocationError(false, infoWindow, map.getCenter());
        //     }
        // }

        // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        //     infoWindow.setPosition(pos);
        //     infoWindow.setContent(browserHasGeolocation ?
        //         'Error: The Geolocation service failed.' :
        //         'Error: Your browser doesn\'t support geolocation.');
        // }
    }

    initializeMap() {
        window.initMap = () => this.onMapInitialized();
        let scriptElement = document.createElement('script');
        scriptElement.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCpc-ixRTVtC3qx-55OvECcX01bEw9siCA&callback=initMap";
        document.querySelector('body').appendChild(scriptElement);
    }
}