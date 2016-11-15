define('app',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var App = exports.App = function () {
        function App() {
            _classCallCheck(this, App);
        }

        App.prototype.configureRouter = function configureRouter(config, router) {
            this.router = router;
            config.title = 'Azure Search Demo';
            config.map([{ route: ['', 'home'], name: 'home', moduleId: 'home/home', title: 'Home' }, { route: 'simple', name: 'simple', moduleId: 'simple/simple', title: 'Simple', nav: true }, { route: 'facets', name: 'facets', moduleId: 'facets/facets', title: 'Faceted', nav: true }, { route: 'location', name: 'location', moduleId: 'location/location', title: 'Location based', nav: true }]);
        };

        return App;
    }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('common/messages',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var RequestSent = exports.RequestSent = function RequestSent(requestMessage) {
        _classCallCheck(this, RequestSent);

        this.request = requestMessage;
    };

    var ResponseReceived = exports.ResponseReceived = function ResponseReceived(responseMessage) {
        _classCallCheck(this, ResponseReceived);

        this.response = responseMessage;
    };
});
define('common/multi-subscriber',["exports", "aurelia-binding"], function (exports, _aureliaBinding) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MultiCollectionSubscriber = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var MultiCollectionSubscriber = exports.MultiCollectionSubscriber = (_temp = _class = function () {
        function MultiCollectionSubscriber(bindingEngine) {
            _classCallCheck(this, MultiCollectionSubscriber);

            this.bindingEngine = bindingEngine;
            this.observers = [];
            this.subscriptions = [];
        }

        MultiCollectionSubscriber.prototype.observe = function observe(collection) {
            var _this = this;

            collection.forEach(function (x) {
                var observer = _this.bindingEngine.collectionObserver(x);
                _this.observers.push(observer);
            });

            return this;
        };

        MultiCollectionSubscriber.prototype.onChanged = function onChanged(execute) {
            var _this2 = this;

            this.observers.forEach(function (x) {
                return _this2.subscriptions.push(x.subscribe(function (change) {
                    return execute(change);
                }));
            });
        };

        MultiCollectionSubscriber.prototype.dispose = function dispose() {
            this.subscriptions.forEach(function (x) {
                return x.dispose();
            });
            this.observers = [];
        };

        return MultiCollectionSubscriber;
    }(), _class.inject = [_aureliaBinding.BindingEngine], _temp);
});
define('common/request-interceptor',["exports", "aurelia-event-aggregator", "./messages"], function (exports, _aureliaEventAggregator, _messages) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RequestInterceptor = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var RequestInterceptor = exports.RequestInterceptor = (_temp = _class = function () {
        function RequestInterceptor(ea) {
            _classCallCheck(this, RequestInterceptor);

            this.ea = ea;
        }

        RequestInterceptor.prototype.request = function request(message) {
            console.log(message);
            this.ea.publish(new _messages.RequestSent(message));
            return message;
        };

        RequestInterceptor.prototype.requestError = function requestError(error) {
            console.log(error);
            throw error;
        };

        RequestInterceptor.prototype.response = function response(message) {
            console.log(message);
            this.ea.publish(new _messages.ResponseReceived(JSON.parse(message.response)));
            return message;
        };

        RequestInterceptor.prototype.responseError = function responseError(error) {
            console.log(error);
            throw error;
        };

        return RequestInterceptor;
    }(), _class.inject = [_aureliaEventAggregator.EventAggregator], _temp);
});
define('common/request-log',['exports', 'aurelia-event-aggregator', './messages'], function (exports, _aureliaEventAggregator, _messages) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RequestLog = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _class, _temp;

    var RequestLog = exports.RequestLog = (_temp = _class = function () {
        function RequestLog(ea) {
            var _this = this;

            _classCallCheck(this, RequestLog);

            this.ea = ea;
            this.request = '';
            this.response = '';

            ea.subscribe(_messages.RequestSent, function (msg) {
                return _this.request = JSON.stringify(msg.request, null, 4);
            });
            ea.subscribe(_messages.ResponseReceived, function (msg) {
                return _this.response = JSON.stringify(msg.response, null, 4);
            });
        }

        _createClass(RequestLog, [{
            key: 'hasValues',
            get: function get() {
                return this.request || this.response;
            }
        }]);

        return RequestLog;
    }(), _class.inject = [_aureliaEventAggregator.EventAggregator], _temp);
});
define('facets/facets',["exports", "services/search-api", "common/multi-subscriber"], function (exports, _searchApi, _multiSubscriber) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Facets = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var Facets = exports.Facets = (_temp = _class = function () {
        function Facets(api, subscriber) {
            var _this = this;

            _classCallCheck(this, Facets);

            this.abvFacetMatcher = function (a, b) {
                return a.from === b.from && a.to === b.to;
            };

            this.api = api;
            this.subscriber = subscriber;

            this.query = "";
            this.results = [];
            this.count = null;
            this.facets = null;

            this.selectedBrewery = [];
            this.selectedStyle = [];
            this.selectedAbv = [];
            this.selectedCreated = [];

            this.subscriber.observe([this.selectedAbv]).onChanged(function (change) {
                return _this.search();
            });
        }

        Facets.prototype.clear = function clear() {
            this.query = "";
            this.results = [];
            this.count = null;
            this.facets = null;

            this.selectedBrewery = [];
            this.selectedStyle = [];
            this.selectedAbv = [];
            this.selectedCreated = [];

            this.search();
        };

        Facets.prototype.search = function search() {
            var _this2 = this;

            this.api.faceted(this.query, this.buildFilter()).then(function (result) {
                _this2.count = result.count;
                _this2.results = result.results;
                _this2.facets = result.facets;
            });
        };

        Facets.prototype.buildFilter = function buildFilter() {
            var allFilters = [this.buildBreweryFilter(), this.buildStyleFilter(), this.buildAbvFilter(), this.buildCreatedFilter()];

            return allFilters.reduce(function (aggregated, current) {
                return current ? aggregated + (" (" + current + ") and") : aggregated;
            }, "").trim().replace(/ and$/, "");
        };

        Facets.prototype.attached = function attached() {
            this.search();
        };

        Facets.prototype.detached = function detached() {
            this.subscriber.dispose();
        };

        Facets.prototype.buildBreweryFilter = function buildBreweryFilter() {
            return this.selectedBrewery.reduce(function (aggregated, current) {
                return aggregated + (" (breweries/any(t: t eq '" + current + "')) or");
            }, "").trim().replace(/ or$/, "");
        };

        Facets.prototype.buildAbvFilter = function buildAbvFilter() {
            return this.selectedAbv.reduce(function (aggregated, current) {
                var from = current.from;
                var to = current.to;

                if (from && to) {
                    return aggregated + (" (abv ge " + from + " and abv lt " + to + ") or");
                } else if (from) {
                    return aggregated + (" (abv ge " + from + ") or");
                } else if (to) {
                    return aggregated + (" (abv lt " + to + ") or");
                }
            }, "").trim().replace(/ or$/, "");
        };

        Facets.prototype.buildStyleFilter = function buildStyleFilter() {
            return this.selectedStyle.reduce(function (aggregated, current) {
                return aggregated + (" (stylename eq '" + current + "') or");
            }, "").trim().replace(/ or$/, "");
        };

        Facets.prototype.buildCreatedFilter = function buildCreatedFilter() {
            return this.selectedCreated.reduce(function (aggregated, current) {
                return aggregated + (" (created ge " + new Date(current.toString()).toISOString() + " and created lt " + new Date((current + 1).toString()).toISOString() + ") or");
            }, "").trim().replace(/ or$/, "");
        };

        return Facets;
    }(), _class.inject = [_searchApi.SearchApi, _multiSubscriber.MultiCollectionSubscriber], _temp);
});
define('home/home',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Home = exports.Home = function Home() {
    _classCallCheck(this, Home);
  };
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('location/location',["exports", "services/search-api"], function (exports, _searchApi) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Location = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var Location = exports.Location = (_temp = _class = function () {
        function Location(searchApi) {
            _classCallCheck(this, Location);

            this.searchApi = searchApi;

            this.queryText = "";
            this.location = {};
            this.results = [];
            this.count = "";
            this.markers = [];
            this.radiusLimit = "";
            this.mapSearch = false;
        }

        Location.prototype.search = function search() {
            var _this = this;

            this.clearMapMarkers();

            this.searchApi.nearest(this.queryText, this.location, this.radiusLimit).then(function (x) {
                _this.results = x.results.map(function (x) {
                    x.distance = Math.round(_this.calculateDistance(_this.location.lat, _this.location.lng, x.lat, x.lng));
                    return x;
                });
                _this.count = x.count;

                _this.createMapMarkers();
            });
        };

        Location.prototype.searchWithinMapBoundaries = function searchWithinMapBoundaries() {
            var _this2 = this;

            this.clearMapMarkers();

            var mapBoundary = this.map.getBounds().toJSON();
            var rectangle = {
                topLeft: mapBoundary.west + " " + mapBoundary.north,
                bottomLeft: mapBoundary.west + " " + mapBoundary.south,
                bottomRight: mapBoundary.east + " " + mapBoundary.south,
                topRight: mapBoundary.east + " " + mapBoundary.north
            };
            this.searchApi.withinGeoBoundary(this.queryText, rectangle).then(function (x) {
                _this2.results = x.results.map(function (x) {
                    x.distance = Math.round(_this2.calculateDistance(_this2.location.lat, _this2.location.lng, x.lat, x.lng));
                    return x;
                });
                _this2.count = x.count;

                _this2.createMapMarkers();
            });
        };

        Location.prototype.createMapMarkers = function createMapMarkers() {
            var _this3 = this;

            this.results.forEach(function (result) {
                var latLng = new google.maps.LatLng(result.lat, result.lng);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: _this3.map,
                    animation: google.maps.Animation.DROP
                });

                _this3.markers.push(marker);

                var infowindow = new google.maps.InfoWindow({
                    content: result.brewery
                });

                marker.addListener('mouseover', function () {
                    infowindow.open(map, marker);
                });

                marker.addListener('mouseout', function () {
                    infowindow.close();
                });
            });
        };

        Location.prototype.clearMapMarkers = function clearMapMarkers() {
            this.markers.forEach(function (marker) {
                return marker.setMap(null);
            });
            this.markers = [];
        };

        Location.prototype.attached = function attached() {
            this.initializeMap();
        };

        Location.prototype.onMapInitialized = function onMapInitialized() {
            var _this4 = this;

            this.location = { lat: 59.917081, lng: 10.727702 };
            this.tryRetrieveCurrentLocation().then(function (x) {
                _this4.map = new google.maps.Map(document.getElementById('map'), {
                    center: _this4.location,
                    zoom: 6,
                    styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#b4d4e1" }, { "visibility": "on" }] }]
                });

                _this4.map.addListener('idle', function () {
                    if (_this4.mapSearch === true) {
                        _this4.searchWithinMapBoundaries();
                    }
                });

                _this4.search();
            });
        };

        Location.prototype.tryRetrieveCurrentLocation = function tryRetrieveCurrentLocation() {
            var _this5 = this;

            return new Promise(function (resolve) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        _this5.location = { lat: position.coords.latitude, lng: position.coords.longitude };
                        console.log("Successfully found position");
                        console.log(_this5.location);

                        resolve();
                    }, function (error) {
                        return resolve();
                    });
                } else {
                    resolve();
                }
            });
        };

        Location.prototype.initializeMap = function initializeMap() {
            var _this6 = this;

            window.initMap = function () {
                return _this6.onMapInitialized();
            };
            var scriptElement = document.createElement('script');
            scriptElement.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCpc-ixRTVtC3qx-55OvECcX01bEw9siCA&callback=initMap";
            document.querySelector('body').appendChild(scriptElement);
        };

        Location.prototype.calculateDistance = function calculateDistance(lat1, lon1, lat2, lon2) {
            function deg2rad(deg) {
                return deg * (Math.PI / 180);
            }

            var R = 6371;
            var dLat = deg2rad(lat2 - lat1);
            var dLon = deg2rad(lon2 - lon1);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        };

        return Location;
    }(), _class.inject = [_searchApi.SearchApi], _temp);
});
define('simple/simple',['exports', 'services/search-api'], function (exports, _searchApi) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Simple = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _class, _temp;

    var Simple = exports.Simple = (_temp = _class = function () {
        function Simple(api) {
            _classCallCheck(this, Simple);

            this.api = api;
            this.results = [];
            this.queryText = '';
            this.count = null;
        }

        Simple.prototype.search = function search() {
            var _this = this;

            this.api.search(this.queryText).then(function (x) {
                console.log(x);
                _this.count = x.count;
                _this.results = x.results;
            });
        };

        Simple.prototype.tired = function tired() {
            this.queryText = "\"real kick\"";
            this.search();
        };

        Simple.prototype.attached = function attached() {
            var _ = this;
            $(".search-input").autocomplete({
                source: function source(request, response) {
                    _.api.suggest(request.term).then(function (results) {
                        return response(results);
                    });
                },
                minLength: 2,
                select: function select(event, ui) {
                    _.queryText = ui.item.value;
                }
            }).keyup(function (e) {
                if (e.which === 13) {
                    $(".ui-autocomplete").hide();
                }
            }).data('ui-autocomplete')._renderItem = function (ul, item) {
                item.value = item.value.replace(/<\/?\w*>/g, "");

                return $("<li>").attr("data-value", item.value).append(item.label).appendTo(ul);
            };
        };

        _createClass(Simple, [{
            key: 'hasResults',
            get: function get() {
                return this.results.length > 0;
            }
        }]);

        return Simple;
    }(), _class.inject = [_searchApi.SearchApi], _temp);
});
define('services/search-api',["exports", "aurelia-http-client", "../common/request-interceptor"], function (exports, _aureliaHttpClient, _requestInterceptor) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SearchApi = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var SearchApi = exports.SearchApi = (_temp = _class = function () {
        function SearchApi(interceptor) {
            _classCallCheck(this, SearchApi);

            this.httpClient = new _aureliaHttpClient.HttpClient().configure(function (x) {
                x.withBaseUrl("https://azuresearchfree.search.windows.net/indexes/beersv1/docs");
                x.withParams({ "api-version": "2015-02-28" });
                x.withHeader("api-key", "5655AB55C4E55DBE67C691F376482D8C");
                x.withInterceptor(interceptor);
            });
        }

        SearchApi.prototype.faceted = function faceted(query, filter) {
            var _this = this;

            return new Promise(function (resolve) {
                _this.httpClient.post("/search", {
                    facets: ["stylename", "abv,values:5|10|15", "breweries", "created,interval:year"],
                    search: query,
                    filter: filter,
                    count: true
                }).then(function (result) {
                    var jsonResponse = JSON.parse(result.response);
                    var facets = jsonResponse["@search.facets"];
                    var mapped = {
                        facets: {
                            stylename: facets.stylename,
                            abv: facets.abv,
                            breweries: facets.breweries,
                            created: facets.created.map(function (x) {
                                return {
                                    value: new Date(x.value).getFullYear(),
                                    count: x.count
                                };
                            })
                        },
                        results: jsonResponse.value.map(function (x) {
                            return {
                                name: x.name,
                                description: x.description,
                                alcoholPercentage: x.abv,
                                label: x.labelmediumimage,
                                style: x.stylename,
                                brewery: x.breweries[0]
                            };
                        }),
                        count: jsonResponse["@odata.count"]
                    };

                    resolve(mapped);
                });
            });
        };

        SearchApi.prototype.nearest = function nearest(query, location, radiusLimit) {
            var _this2 = this;

            var geoDistance = "geo.distance(brewerylocation, geography'POINT(" + location.lng + " " + location.lat + ")')";
            var filter = "(brewerylocation ne null)";

            if (radiusLimit) {
                filter += " and (" + geoDistance + " le " + radiusLimit + ")";
            }

            return new Promise(function (resolve) {
                _this2.httpClient.post("/search", {
                    count: true,
                    search: query,
                    filter: filter,
                    orderby: geoDistance,
                    top: 100
                }).then(function (result) {
                    var jsonResult = JSON.parse(result.response);
                    resolve({
                        count: jsonResult["@odata.count"],
                        results: jsonResult["value"].map(function (x) {
                            return {
                                name: x.name,
                                label: x.labelmediumimage,
                                style: x.stylename,
                                alcoholPercentage: x.abv,
                                brewery: x.breweries[0],
                                lng: x.brewerylocation.coordinates[0],
                                lat: x.brewerylocation.coordinates[1]
                            };
                        })
                    });
                });
            });
        };

        SearchApi.prototype.withinGeoBoundary = function withinGeoBoundary(queryText, polygon) {
            var _this3 = this;

            var polygonPoints = polygon.topLeft + ", " + polygon.bottomLeft + ", " + polygon.bottomRight + ", " + polygon.topRight + ", " + polygon.topLeft;

            return new Promise(function (resolve) {
                _this3.httpClient.post("/search", {
                    count: true,
                    search: queryText,
                    top: 1000,
                    filter: "geo.intersects(brewerylocation, geography'POLYGON((" + polygonPoints + "))')"
                }).then(function (result) {
                    var jsonResult = JSON.parse(result.response);
                    resolve({
                        count: jsonResult["@odata.count"],
                        results: jsonResult["value"].map(function (x) {
                            return {
                                name: x.name,
                                label: x.labelmediumimage,
                                style: x.stylename,
                                alcoholPercentage: x.abv,
                                brewery: x.breweries[0],
                                lng: x.brewerylocation.coordinates[0],
                                lat: x.brewerylocation.coordinates[1]
                            };
                        })
                    });
                });
            });
        };

        return SearchApi;
    }(), _class.inject = [_requestInterceptor.RequestInterceptor], _temp);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"common/request-log\"></require>\n  <require from=\"site.css\"></require>\n\n  <request-log></request-log>\n  <router-view></router-view>\n</template>"; });
define('text!site.css', ['module'], function(module) { module.exports = ""; });
define('text!common/request-log.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./request-log.css\"></require>\n\n    <div if.bind=\"hasValues\" class=\"container-fluid json-output-area\">\n        <a class=\"mini-bar\" data-toggle=\"collapse\" href=\"#buttonPane\" aria-expanded=\"true\" aria-controls=\"collapseOne\"></a>\n        <div id=\"buttonPane\" class=\"container text-xs-center json-output-trigger collapse\">\n            <a if.bind=\"request\" class=\"btn\" data-toggle=\"collapse\" href=\"#request\" aria-expanded=\"false\" aria-controls=\"collapseExample\">\n                    Request\t\t\t\n                </a>\n            <a if.bind=\"response\" class=\"btn\" data-toggle=\"collapse\" href=\"#response\" aria-expanded=\"false\" aria-controls=\"collapseExample\">\n                    Response\n                </a>\n            <a data-toggle=\"collapse\" href=\"#buttonPane\" aria-expanded=\"true\" aria-controls=\"collapseOne\">\n                <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n            </a>\n        </div>\n        <div class=\"container\">\n            <div class=\"collapse\" id=\"request\">\n                <div class=\"request json-output card\">\n                    <pre>${request}</pre>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"collapse\" id=\"response\">\n                <div class=\"response json-output card\">\n                    <pre>${response}</pre>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!common/request-log.css', ['module'], function(module) { module.exports = ".json-output-area {\n    background-color: #0B2841;\n}\n\n.mini-bar {\n    width: 100%;\n    height: 5px;\n    display: block;\n}\n\n.json-output-trigger {\n    padding: 10px;\n}\n\n.json-output-trigger a {\n    color: #E93F65;\n}\n.json-output-trigger .btn {\n    background-color: #E93F65;\n    padding: 5px;\n    color: #FFF;\n    font-size: 0.8em;\n    font-family: Montserrat;\n}\n\n.json-output {\n    padding: 10px;\n    background-color: #f5f5f5;\n    font-size: 0.8em;\n}"; });
define('text!facets/facets.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./facets.css\"></require>\n\n    <div class=\"main-container\">\n        <div class=\"container-fluid top-menu-bar\">\n            <div class=\"container\">\n                <div class=\"row\">\n                    <div class=\"left-menu col-xs-5\">\n                        <span>\n                            <span class=\"btn logo-text logo\">&nbsp</span>\n                        <span class=\"btn logo-text\">BEER</span>\n                        </span>\n                        <span class=\"slogan\">The Beer market</span>\n                    </div>\n                    <nav class=\"right-menu nav nav-inline col-xs-7 row\">\n                        <div class=\"col-xs-3\"><a class=\"nav-link\" href=\"#\"><i class=\"fa fa-lg fa-dot-circle-o\" aria-hidden=\"true\"></i> Me</a></div>\n                        <div class=\"col-xs-3\"><a class=\"nav-link\" href=\"#\"><i class=\"fa fa-lg fa-plus\" aria-hidden=\"true\"></i> Can</a></div>\n                        <div class=\"col-xs-3\"><a class=\"nav-link\" href=\"#\"><i class=\"fa fa-lg fa-bell\" aria-hidden=\"true\"></i> Haz</a></div>\n                        <div class=\"col-xs-3\"><a class=\"nav-link\" href=\"#\"><i class=\"fa fa-lg fa-user-circle\" aria-hidden=\"true\"></i> Beer</a></div>\n                    </nav>\n                </div>\n            </div>\n        </div>\n        <div class=\"container search-area\">\n            <div class=\"row\">\n                <div class=\"facet-pane col-sm-4 card\">\n                    <div class=\"sub-container\">\n                        <form submit.delegate=\"search()\" class=\"facet-form\">\n                            <input class=\"form-control search-input\" type=\"text\" value.bind=\"query\" placeholder=\"Search\" id=\"example-text-input\">\n\n                            <div>\n                                <div if.bind=\"facets.breweries\" class=\"facet-group-title\"><strong>Brewery</strong></div>\n                                <div repeat.for=\"facet of facets.breweries\" class=\"form-check\">\n                                    <label class=\"form-check-label\">\n                                <input class=\"form-check-input\" type=\"checkbox\" model.bind=\"facet.value\" checked.bind=\"selectedBrewery\">\n                                    ${facet.value} (${facet.count})\n                                </label>\n                                </div>\n\n                                <div if.bind=\"facets.stylename\" class=\"facet-group-title\"><strong>Style</strong></div>\n                                <div repeat.for=\"facet of facets.stylename\" class=\"form-check\">\n                                    <label class=\"form-check-label\">\n                                <input class=\"form-check-input\" type=\"checkbox\" model.bind=\"facet.value\" checked.bind=\"selectedStyle\">\n                                    ${facet.value} (${facet.count})\n                                </label>\n                                </div>\n\n                                <div if.bind=\"facets.abv\" class=\"facet-group-title\"><strong>Alcohol by Volume</strong></div>\n                                <div repeat.for=\"facet of facets.abv\" class=\"form-check\">\n                                    <label class=\"form-check-label\">\n                                <input class=\"form-check-input\" type=\"checkbox\" model.bind=\"facet\" checked.bind=\"selectedAbv\" matcher.bind=\"abvFacetMatcher\">\n                                    <span if.bind=\"facet.from\">${facet.from}%</span>\n                                     - <span if.bind=\"facet.to\">${facet.to}%</span> (${facet.count})\n                                </label>\n                                </div>\n\n                                <div if.bind=\"facets.created\" class=\"facet-group-title\"><strong>Created</strong></div>\n                                <div repeat.for=\"facet of facets.created\" class=\"form-check\">\n                                    <label class=\"form-check-label\">\n                                <input class=\"form-check-input\" type=\"checkbox\" model.bind=\"facet.value\" checked.bind=\"selectedCreated\">\n                                    ${facet.value} (${facet.count})\n                                </label>\n                                </div>\n\n                            </div>\n\n                            <div class=\"search-reset-buttons row same-height-container float-xs-right\">\n                                <a href=\"#\" click.delegate=\"clear()\" class=\"search-reset-button\">Reset</a>\n                                <input type=\"submit\" value=\"Search\" class=\"btn facet-search-button search-reset-button float-xs-right\">\n                            </div>\n\n\n                        </form>\n                    </div>\n                </div>\n\n                <div class=\"main-pane col-sm-8 \">\n                    <div class=\"search-result card \">\n                        <div class=\"text-xs-right result-count\">Results: <strong>${count}</strong></div>\n                        <div class=\"list-group list-group-flush \">\n                            <div repeat.for=\"result of results \" class=\"list-group-item \">\n                                <div class=\"row\">\n                                    <div class=\"col-md-4\">\n                                        <img if.bind=\"result.label \" src=\"${result.label}\" alt=\"Beer label\">\n                                        <img if.bind=\"!result.label \" src=\"https://placehold.it/200x200\" alt=\"Placeholder image when label is missing\" />\n                                    </div>\n\n                                    <div class=\"col-md-8\">\n                                        <h4>${result.name}</h4>\n                                        <div if.bind=\"result.description \">${result.description}</div>\n                                        <div if.bind=\"!result.description \" class=\"text-muted font-italic small \">Missing description</div>\n                                        <div class=\"row \">\n                                            <div class=\"text-muted col-sm-6 brewery-name \">${result.brewery}</div>\n                                            <div if.bind=\"result.alcoholPercentage\" class=\"display-4 col-sm-6 \"><strong>${result.alcoholPercentage} %</strong></div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n\n</template>"; });
define('text!facets/facets.css', ['module'], function(module) { module.exports = ".main-container {\n    background-color: #F3FAFF;\n    font-family: Raleway;\n    min-height: 100vh;\n}\n\n.top-menu-bar {\n    background-color: #08C5FC;\n    line-height: 55px;\n    color: #FFF;\n}\n\n.top-menu-bar a {\n    color: #FFF;\n}\n\n.container {\n    max-width: 980px;\n}\n\n.right-menu {\n    background-color: #056EFC;\n    text-align: center;\n}\n\n.logo-text {\n    font-size: 14px;\n    font-family: Montserrat;\n    letter-spacing: 2px;\n    font-weight: bold;\n    border: 2px solid;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem;\n}\n\n.logo.logo-text {\n    background-color: #056EFC;\n    margin-right: -6px;\n}\n\n.slogan {\n    margin-left: 5px;\n    font-size: 0.8rem;\n}\n\n.card {\n    border-radius: 0;\n}\n\n.sub-container {\n    width: 90%;\n    margin: auto;\n}\n\n.search-area {\n    margin-top: 20px;\n}\n\n.search-input {\n    margin: 1rem auto;\n    font-size: 1em;\n}\n\n.facet-pane {\n    font-size: 0.8em;\n}\n\n.facet-group-title {\n    margin: 10px auto;\n}\n\n.brewery-name {\n    margin-top: 20px;\n}\n\n.facet-search-button{\n    background-color: transparent;\n    border: 1px solid #06BEFB;\n    color: #0063FB;\n    border-radius: 2px;\n    \n}\n\n.facet-search-button:hover {\n    background-color: #F1F9FF;\n}\n\n.search-reset-buttons {\n    margin: 20px 0;\n}\n\n.search-reset-button {\n    display: table-cell;\n    vertical-align: bottom;\n}\n\n.same-height-container {\n    display: table;\n    width: 100%;\n}\n\n.same-height-container::first-child{\n    margin-right: 20px;\n}\n\n.search-result img{\n    width: 100%;\n} \n\n.result-count {\n    font-family: Montserrat;\n    padding: 10px;\n    text-transform: uppercase;\n}"; });
define('text!home/home.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./home.css\"></require>\n\n    \n\n    <h1>At Home</h1>\n</template>"; });
define('text!home/home.css', ['module'], function(module) { module.exports = ""; });
define('text!location/location.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./location.css\"></require>\n\n    <div id=\"location\" class=\"container-fluid\">\n        <div class=\"menu-bar row\">\n            <div class=\"logo float-xs-left\">\n                <i class=\"fa fa-2x fa-heart-o fa-flip-vertical\" aria-hidden=\"true\"></i>\n            </div>\n            <div class=\"search-input col-xs-10\">\n                <form submit.delegate=\"search()\">\n                    <div class=\"col-xs-4\">\n                        <div class=\"input-group\">\n                            <span class=\"input-group-addon\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></span>\n                            <input type=\"text\" class=\"form-control\" value.bind=\"queryText\">\n                        </div>\n                    </div>\n                    <div class=\"col-xs-4\">\n                        <div class=\"input-group\">\n                            <span class=\"input-group-addon\"><i class=\"fa fa-map-o\" aria-hidden=\"true\"></i></span>\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Limit search within radius (km)\" value.bind=\"radiusLimit\">\n                        </div>\n                    </div>\n                    <div class=\"col-xs-4 search-map-input\">\n                        <input type=\"checkbox\" checked.bind=\"mapSearch\"> <span class=\"search-map-label text-muted\">Search as I move the map</span>\n                    </div>\n                    <input type=submit class=\"hidden-xl-down\">\n                </form>\n            </div>\n        </div>\n        <div class=\"main-area\">\n            <div if.bind=\"count\" class=\"count\">\n                <span>Found: ${count}, displaying: ${results.length}</span>\n            </div>\n            <div class=\"h-100 result-area row\">\n                <div class=\"col-sm-6 search-result h-100 row\">\n                    <div repeat.for=\"result of results\">\n                        <div class=\"col-xs-6 single-result\">\n                            <div if.bind=\"result.label\" class=\"label\" style=\"background-image: url(${result.label});\">\n                            </div>\n                            <div if.bind=\"!result.label\" class=\"label\">\n                            </div>\n                            <div class=\"float-xs-left\">\n                                <h5 class=\"display-5\">${result.name}</h5>\n                                <div class=\"text-muted\">${result.brewery}</div>\n                            </div>\n                            <div class=\"float-xs-right display-5\">${result.distance} km</div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-sm-6 map h-100\">\n                    <div id=\"map\"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!location/location.css', ['module'], function(module) { module.exports = "#location {\n    font-family: \"Raleway\";\n}\n\n.menu-bar{\n    border-bottom: 1px solid #dce0e0;\n}\n\n.logo {\n    color: #FF656A;\n    padding: 20px;\n    border-right: 1px solid #dce0e0;\n}\n\n.search-input {\n    margin-top: 20px;\n    font-size: 0.8em;\n}\n\n.search-input input[type=\"text\"]::-webkit-input-placeholder\n{\n    font-size:0.8em;\n}\n\n.search-input input[type=\"text\"]::-moz-placeholder{\n    font-size:0.8em;\n}\n.search-input input[type=\"text\"]:-moz-placeholder\n{\n    font-size:0.8em;\n}\n.search-input input[type=\"text\"]:-ms-input-placeholder{\n    font-size:0.8em;\n}\n\n.search-input .input-group-addon{\n    background-color: transparent;\n}\n\n.search-input .input-group-addon, .search-input .form-control{\n    border: none;\n}\n\n.search-input .form-control:focus{\n    border-bottom: 1px solid #dce0e0;\n}\n\n.search-input .input-group:hover{\n    background-color: #FF656A;\n    border: 1px solid #FF656A;\n}\n\n.search-map-input{\n    padding-top: 8px;\n    padding-bottom: 8px;\n}\n\n.search-map-label{\n    margin-left: 15px;\n}\n\n.nav-links {\n    font-size: 0.8em;\n}\n\n.main-area{\n    min-height: 80vh;\n    height: 1px;\n}\n\n#map{\n    width: 100%;\n    height: 100%;\n}\n\n\n.search-result{\n    overflow-y: scroll;\n    height: 100%;\n}\n\n.search-result .label {\n    width: 100%;\n    height: 150px;\n    margin: 0 auto 10px auto;\n    background-repeat: no-repeat;\n    background-size: cover;\n    background-color: #dce0e0;\n    background-position: center center;\n}\n\n.single-result{\n    padding-top: 20px;\n    padding-bottom: 20px;\n}\n\n.single-result:hover{\n    background-color: #f5f5f5;\n}\n\n.count{\n    font-family: montserrat;\n    padding: 10px;\n    border-bottom: 1px solid #dce0e0;\n    font-size: 0.8em;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n}"; });
define('text!simple/simple.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"./simple.css\"></require>\n\n\t<div class=\"container\">\n\t\t<div class=\"search-container ${results.length > 0 ? 'has-results' : ''}\">\n\t\t\t<div if.bind=\"!hasResults\" class=\"text-xs-center search-title-container\">\n\t\t\t\t<h1 class=\"search-title\">\n\t\t\t\t\t<span class=\"g-blue\">B</span>\n\t\t\t\t\t<span class=\"g-red\">e</span>\n\t\t\t\t\t<span class=\"g-yellow\">e</span>\n\t\t\t\t\t<span class=\"g-blue\">e</span>\n\t\t\t\t\t<span class=\"g-green\">e</span>\n\t\t\t\t\t<span class=\"g-red\">r</span>\n\t\t\t\t</h1>\n\t\t\t</div>\n\t\t\t<form submit.delegate=\"search()\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<input type=\"text\" value.bind=\"queryText\" class=\"search-input col-md-6 col-xs-8 offset-xs-2 offset-md-3\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"search-button-row\">\n\t\t\t\t\t<input type=\"submit\" value=\"Search Beer\" class=\"btn btn-primary search-button\">\n\t\t\t\t\t<input type=\"button\" click.delegate=\"tired()\" value=\"I'm Feeling Tired\" class=\"btn btn-primary search-button\">\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t</div>\n\n\t\t<div class=\"row\" if.bind=\"hasResults\">\n\t\t\t<p>\n\t\t\t\tFound <span class=\"tag tag-info\">${count}</span>, displaying <span class=\"tag tag-info\">${results.length}</span>.\n\t\t\t</p>\n\n\t\t\t<div class=\"card-columns\">\n\t\t\t\t<div repeat.for=\"result of results\" class=\"card\">\n\t\t\t\t\t<img if.bind=\"result.label\" class=\"card-img-top\" width=\"100%\" src=\"${result.label}\" alt=\"Card image cap\">\n\t\t\t\t\t<div class=\"card-block\">\n\t\t\t\t\t\t<h4 class=\"card-title\">${result.name}</h4>\n\t\t\t\t\t\t<p class=\"card-text\"><small class=\"text-muted\">${result.brewery}</small></p>\n\t\t\t\t\t\t<p class=\"card-text\"><small class=\"text-muted\">${result.style}</small></p>\n\t\t\t\t\t\t<p class=\"card-text\">${result.description}</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</template>"; });
define('text!simple/simple.css', ['module'], function(module) { module.exports = ".search-container {\n    margin-top: 20vh;\n}\n\n.has-results {\n    margin-top: 10px !important;\n}\n\n.search-title {\n    font-family: 'Montserrat';\n    font-size: 5.5em;\n    margin: 20px;\n}\n\n.search-title-container::after {\n    content: \"Norway\";\n    font-size: 16px;\n    font-family: \"Roboto\";\n    color: #4285f4;\n    position: relative;\n    top: -40px;\n    right: -110px;\n}\n\n.search-title span {\n    margin: -14px;\n}\n\n.search-input {\n    height: 2.5em;\n}\n\n.search-button-row {\n    margin-top: 20px;\n    width: 400px;\n    margin: 30px auto;\n    text-align: center;\n}\n\n.search-button {\n    font-size: 12px;\n    margin: 0 2px;\n}\n\n.g-blue {\n    color: #4C90F5;\n}\n\n.g-red {\n    color: #ED4D3C;\n}\n\n.g-yellow {\n    color: #FBC402;\n}\n\n.g-green {\n    color: #3BB15D;\n}\n\n.btn-primary {\n    background-color: #F5F5F5;\n    color: #808080;\n    border: none;\n    font-weight: bold;\n    border-radius: 2px;\n}\n\n.brand-img {\n    width: 100%;\n}\n\n.result.card {\n    border: none;\n    background-color: whitesmoke;\n}\n\n.result {\n    padding: 0.4rem;\n}\n\n.raw-result {\n    background-color: whitesmoke;\n    font-size: 0.8em;\n}\n\n.raw-result-trigger {\n    font-size: 0.8em;\n}\n\n.ui-menu .ui-menu-item-wrapper {\n    padding: 0;\n}\n\n.ui-menu .ui-menu-item-wrapper:hover {\n    color: #ED4D3C;\n}"; });
//# sourceMappingURL=app-bundle.js.map