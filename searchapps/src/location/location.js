export class Location {
    attached() {
        //initMap();

        let scriptURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCpc-ixRTVtC3qx-55OvECcX01bEw9siCA&callback=initMap";
        let scriptElement = document.createElement('script');
        scriptElement.src = scriptURL;
        scriptElement.onload = () => {
            // console.log($('#map'));
        };

        document.querySelector('body').appendChild(scriptElement);
    }
}