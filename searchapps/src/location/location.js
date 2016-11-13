import { SearchApi } from "services/search-api";

export class Location {
    static inject = [SearchApi];

    constructor(searchApi) {
        this.searchApi = searchApi;

        this.queryText = "";
        this.location = {};
        this.results = []
        this.count = "";
        this.markers = [];
        this.radiusLimit = "";
        this.mapSearch = false;
    }

    search() {
        this.clearMapMarkers();

        this.searchApi
            .nearest(this.queryText, this.location, this.radiusLimit)
            .then(x => {
                this.results = x.results.map(x => {
                    x.distance = Math.round(this.calculateDistance(this.location.lat, this.location.lng, x.lat, x.lng));
                    return x;
                });
                this.count = x.count;

                this.createMapMarkers();
            });
    }

    searchWithinMapBoundaries() {
        this.clearMapMarkers();

        let mapBoundary = this.map.getBounds().toJSON();
        let rectangle = {
            topLeft: `${mapBoundary.west} ${mapBoundary.north}`,
            bottomLeft: `${mapBoundary.west} ${mapBoundary.south}`,
            bottomRight: `${mapBoundary.east} ${mapBoundary.south}`,
            topRight: `${mapBoundary.east} ${mapBoundary.north}`
        }
        this.searchApi.withinGeoBoundary(rectangle)
            .then(x => {
                this.results = x.results.map(x => {
                    x.distance = Math.round(this.calculateDistance(this.location.lat, this.location.lng, x.lat, x.lng));
                    return x;
                });
                this.count = x.count;

                this.createMapMarkers();
            });
    }

    createMapMarkers() {
        this.results.forEach(result => {
            var latLng = new google.maps.LatLng(result.lat, result.lng);
            var marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                animation: google.maps.Animation.DROP
            });

            this.markers.push(marker);

            var infowindow = new google.maps.InfoWindow({
                content: result.brewery
            });

            marker.addListener('mouseover', function() {
                infowindow.open(map, marker);
            });

            marker.addListener('mouseout', function() {
                infowindow.close();
            });
        });
    }

    clearMapMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
    }

    attached() {
        this.initializeMap();
    }

    onMapInitialized() {
        this.location = { lat: 59.917081, lng: 10.727702 };

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: this.location,
            zoom: 6,
            styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#b4d4e1" }, { "visibility": "on" }] }]
        });

        this.map.addListener('zoom_changed', () => {
            if (this.mapSearch === true) {
                this.searchWithinMapBoundaries();
            }
        });

        this.map.addListener("dragend", () => {
            if (this.mapSearch === true) {
                this.searchWithinMapBoundaries();
            }
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

    calculateDistance(lat1, lon1, lat2, lon2) {
        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }

        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        return d;
    }


}