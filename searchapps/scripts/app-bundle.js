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
            config.map([{ route: ['', 'home'], name: 'home', moduleId: 'home/home', title: 'Home' }, { route: 'simple', name: 'simple', moduleId: 'simple/simple', title: 'Simple', nav: true }, { route: 'facets', name: 'facets', moduleId: 'facets/facets', title: 'Faceted Search', nav: true }]);
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
define('facets/facets',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Facets = exports.Facets = function Facets() {
        _classCallCheck(this, Facets);
    };
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

        SearchApi.prototype.search = function search(query) {
            var _this = this;

            return new Promise(function (resolve) {
                _this.httpClient.post("/search", {
                    count: true,
                    search: query
                }).then(function (result) {
                    var jsonResult = JSON.parse(result.response);
                    resolve({
                        count: jsonResult["@odata.count"],
                        results: jsonResult["value"].map(function (x) {
                            return {
                                name: x.name,
                                description: x.description,
                                label: x.labelmediumimage,
                                style: x.stylename,
                                brewery: x.breweries[0]
                            };
                        }),
                        raw: jsonResult
                    });
                });
            });
        };

        SearchApi.prototype.suggest = function suggest(query) {
            var _this2 = this;

            return new Promise(function (resolve) {
                _this2.httpClient.post("/suggest", {
                    search: query,
                    suggesterName: "suggestBeerName",
                    highlightPreTag: "<b>",
                    highlightPostTag: "</b>"
                }).then(function (result) {
                    var results = JSON.parse(result.response).value;
                    console.log(results);
                    resolve(results.map(function (x) {
                        return x["@search.text"];
                    }));
                });
            });
        };

        return SearchApi;
    }(), _class.inject = [_requestInterceptor.RequestInterceptor], _temp);
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
            this.rawResult = '';
            this.count = null;
            this.rawJson = '';
        }

        Simple.prototype.search = function search() {
            var _this = this;

            this.api.search(this.queryText).then(function (x) {
                _this.count = x.count;
                _this.results = x.results;
                _this.rawResult = JSON.stringify(x.raw, null, 4);
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
            }).data('ui-autocomplete')._renderItem = function (ul, item) {
                item.value = item.value.replace(/<\/?\w*>/g, "");

                return $("<li>").attr("data-value", item.value).append(item.label).appendTo(ul);
            };
        };

        _createClass(Simple, [{
            key: 'hasResults',
            get: function get() {
                return this.rawResult;
            }
        }]);

        return Simple;
    }(), _class.inject = [_searchApi.SearchApi], _temp);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"common/request-log\"></require>\n  <require from=\"site.css\"></require>\n\n  <request-log></request-log>\n  <router-view></router-view>\n</template>"; });
define('text!site.css', ['module'], function(module) { module.exports = ""; });
define('text!common/request-log.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./request-log.css\"></require>\n\n    <div if.bind=\"hasValues\" class=\"container-fluid json-output-area\">\n        <div class=\"container text-xs-center json-output-trigger\">\n                <a if.bind=\"request\" class=\"btn\" data-toggle=\"collapse\" href=\"#request\" aria-expanded=\"false\" aria-controls=\"collapseExample\">\n                    Request\t\t\t\n                </a>\n                <a if.bind=\"response\" class=\"btn\" data-toggle=\"collapse\" href=\"#response\" aria-expanded=\"false\" aria-controls=\"collapseExample\">\n                    Response\n                </a>\n        </div>\n        \n        <div class=\"container\">\n            <div class=\"collapse\" id=\"request\">\n                <div class=\"request json-output card\">\n                    <pre>${request}</pre>\n                </div>\n            </div>\n        </div>\n        <div class=\"container\">\n            <div class=\"collapse\" id=\"response\">\n                <div class=\"response json-output card\">\n                    <pre>${response}</pre>\n                </div>\t\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!common/request-log.css', ['module'], function(module) { module.exports = ".json-output-area {\n    background-color: #0B2841;\n}\n\n.json-output-trigger {\n    padding: 10px;\n}\n\n.json-output-trigger a {\n    background-color: #E93F65;\n    padding: 5px;\n    color: #FFF;\n    font-size: 0.8em;\n    font-family: Montserrat;\n}\n\n.json-output {\n    padding: 10px;\n    background-color: #f5f5f5;\n    font-size: 0.8em;\n}"; });
define('text!home/home.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./home.css\"></require>\n\n    \n\n    <h1>At Home</h1>\n</template>"; });
define('text!home/home.css', ['module'], function(module) { module.exports = ""; });
define('text!facets/facets.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./facets.css\"></require>\n\n    <div class=\"main-container\">\n        <div class=\"container-fluid top-menu-bar\">\n            <div class=\"container\">\n                <div class=\"left-menu float-xs-left\">\n                    <span>\n                        <span class=\"btn logo-text logo\">&nbsp</span>\n                        <span class=\"btn logo-text\">BEER</span>\n                    </span>\n                    <span class=\"slogan\">The market of Beer</span>\n                </div>\n                <nav class=\"right-menu nav nav-inline float-xs-right\">\n                    <a class=\"nav-link active\" href=\"#\"><i class=\"fa fa-lg fa-dot-circle-o\" aria-hidden=\"true\"></i> Me</a>\n                    <a class=\"nav-link\" href=\"#\"><i class=\"fa fa-lg fa-plus\" aria-hidden=\"true\"></i> Can</a>\n                    <a class=\"nav-link\" href=\"#\"><i class=\"fa fa-lg fa-bell\" aria-hidden=\"true\"></i> Haz</a>\n                    <a class=\"nav-link\" href=\"#\"><i class=\"fa fa-lg fa-user-circle\" aria-hidden=\"true\"></i> Beer</a>\n                </nav>   \n            </div>\n        </div>\n        <div class=\"container search-area\">\n            <div class=\"row\">\n                <div class=\"facet-pane col-sm-4 card\">\n                    <div class=\"sub-container\">\n                        <input class=\"form-control search-input\" type=\"text\" value=\"\" placeholder=\"Search\" id=\"example-text-input\">\n                        <div>\n                            <div class=\"facet-group-title\"><strong>Style</strong></div>\n                            <div class=\"form-check\">\n                                <label class=\"form-check-label\">\n                                <input class=\"form-check-input\" type=\"checkbox\" value=\"\">\n                                    Indian Pale Ale\n                                </label>\n                                </div>\n                            <div class=\"form-check\">\n                                    <label class=\"form-check-label\">\n                                    <input class=\"form-check-input\" type=\"checkbox\" value=\"\">\n                                    Oatmeal Porter\n                                    </label>\n                            </div>\n                        </div>\n                        <div>\n                            <div class=\"facet-group-title\"><strong>Style</strong></div>\n                            <div class=\"form-check\">\n                                <label class=\"form-check-label\">\n                                <input class=\"form-check-input\" type=\"checkbox\" value=\"\">\n                                    Indian Pale Ale\n                                </label>\n                                </div>\n                            <div class=\"form-check\">\n                                    <label class=\"form-check-label\">\n                                    <input class=\"form-check-input\" type=\"checkbox\" value=\"\">\n                                    Oatmeal Porter\n                                    </label>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"main-pane col-sm-8\">\n                    <div class=\"search-result card\">\n                        <ul class=\"list-group list-group-flush\">\n                            <li class=\"list-group-item\">Cras justo odio</li>\n                            <li class=\"list-group-item\">Dapibus ac facilisis in</li>\n                            <li class=\"list-group-item\">Vestibulum at eros</li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n    </div>\n    \n</template>"; });
define('text!facets/facets.css', ['module'], function(module) { module.exports = ".main-container {\n    background-color: #F3FAFF;\n    font-family: Raleway;\n    min-height: 100vh;\n}\n\n.top-menu-bar {\n    background-color: #08C5FC;\n    line-height: 55px;\n    color: #FFF;\n}\n\n.top-menu-bar a {\n    color: #FFF;\n}\n\n.container {\n    max-width: 980px;\n}\n\n.right-menu {\n    background-color: #056EFC;\n    width: 500px;\n    text-align: center;\n}\n\n.right-menu a {\n    padding: 0 20px;\n}\n\n.logo-text {\n    font-size: 14px;\n    font-family: Montserrat;\n    letter-spacing: 2px;\n    font-weight: bold;\n    border: 2px solid;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem;\n}\n\n.logo.logo-text {\n    background-color: #056EFC;\n    margin-right: -6px;\n}\n\n.slogan {\n    margin-left: 5px;\n    font-size: 0.8rem;\n}\n\n.card {\n    border-radius: 0;\n}\n\n.sub-container {\n    width: 90%;\n    margin: auto;\n}\n\n.search-area {\n    margin-top: 20px;\n}\n\n.search-input {\n    margin: 1rem auto;\n    font-size: 1em;\n}\n\n.facet-pane {\n    font-size: 0.8em;\n}\n\n.facet-group-title {\n    margin: 10px auto;\n}"; });
define('text!simple/simple.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"./simple.css\"></require>\n\n\t<div class=\"container\">\n\t\t<div class=\"search-container ${results.length > 0 ? 'has-results' : ''}\">\n\t\t\t<div if.bind=\"!hasResults\" class=\"text-xs-center search-title-container\">\n\t\t\t\t<h1 class=\"search-title\">\n\t\t\t\t\t<span class=\"g-blue\">S</span>\n\t\t\t\t\t<span class=\"g-red\">e</span>\n\t\t\t\t\t<span class=\"g-yellow\">a</span>\n\t\t\t\t\t<span class=\"g-blue\">r</span>\n\t\t\t\t\t<span class=\"g-green\">c</span>\n\t\t\t\t\t<span class=\"g-red\">h</span>\n\t\t\t\t</h1>\n\t\t\t</div>\n\t\t\t<form submit.delegate=\"search()\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<input type=\"text\" value.bind=\"queryText\" class=\"search-input col-md-6 col-xs-8 offset-xs-2 offset-md-3\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"search-button-row\">\n\t\t\t\t\t<input type=\"submit\" value=\"Search Search\" class=\"btn btn-primary search-button\">\n\t\t\t\t\t<input type=\"button\" click.delegate=\"tired()\" value=\"I'm Feeling Tired\" class=\"btn btn-primary search-button\">\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t</div>\n\t\t\t\n\t\t<div class=\"row\" if.bind=\"hasResults\">\n\t\t\t<p>\n\t\t\t\tFound <span class=\"tag tag-info\">${count}</span>, displaying <span class=\"tag tag-info\">${results.length}</span>. \n\t\t\t</p>\n\t\t\t\n\t\t\t<div class=\"card-columns\">\n\t\t\t\t<div repeat.for=\"result of results\" class=\"card\">\n\t\t\t\t\t<img if.bind=\"result.label\" class=\"card-img-top\" width=\"100%\" src=\"${result.label}\" alt=\"Card image cap\">\n\t\t\t\t\t<div class=\"card-block\">\n\t\t\t\t\t\t<h4 class=\"card-title\">${result.name}</h4>\n\t\t\t\t\t\t<p class=\"card-text\"><small class=\"text-muted\">${result.brewery}</small></p>\n\t\t\t\t\t\t<p class=\"card-text\"><small class=\"text-muted\">${result.style}</small></p>\n\t\t\t\t\t\t<p class=\"card-text\">${result.description}</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</template>"; });
define('text!simple/simple.css', ['module'], function(module) { module.exports = ".search-container {\n    margin-top: 20vh;\n}\n\n.has-results {\n    margin-top: 10px !important;\n}\n\n.search-title {\n    font-family: 'Montserrat';\n    font-size: 5.5em;\n    margin: 20px;\n}\n\n.search-title-container::after {\n    content: \"Norway\";\n    font-size: 16px;\n    font-family: \"Roboto\";\n    color: #4285f4;\n    position: relative;\n    top: -40px;\n    right: -110px;\n}\n\n.search-title span {\n    margin: -14px;\n}\n\n.search-input {\n    height: 2.5em;\n}\n\n.search-button-row {\n    margin-top: 20px;\n    width: 400px;\n    margin: 30px auto;\n    text-align: center;\n}\n\n.search-button {\n    font-size: 12px;\n    margin: 0 2px;\n}\n\n.g-blue {\n    color: #4C90F5;\n}\n\n.g-red {\n    color: #ED4D3C;\n}\n\n.g-yellow {\n    color: #FBC402;\n}\n\n.g-green {\n    color: #3BB15D;\n}\n\n.btn-primary {\n    background-color: #F5F5F5;\n    color: #808080;\n    border: none;\n    font-weight: bold;\n    border-radius: 2px;\n}\n\n.brand-img {\n    width: 100%;\n}\n\n.result.card {\n    border: none;\n    background-color: whitesmoke;\n}\n\n.result {\n    padding: 0.4rem;\n}\n\n.raw-result {\n    background-color: whitesmoke;\n    font-size: 0.8em;\n}\n\n.raw-result-trigger {\n    font-size: 0.8em;\n}\n\n.ui-menu .ui-menu-item-wrapper {\n    padding: 0;\n}\n\n.ui-menu .ui-menu-item-wrapper:hover {\n    color: #ED4D3C;\n}"; });
//# sourceMappingURL=app-bundle.js.map