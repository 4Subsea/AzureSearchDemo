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
            config.map([{ route: ['', 'home'], name: 'home', moduleId: 'home/home', title: 'Home' }, { route: 'simple', name: 'simple', moduleId: 'simple/simple', title: 'Simple', nav: true }]);
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
define('services/search-api',['exports', 'aurelia-http-client'], function (exports, _aureliaHttpClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SearchApi = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var SearchApi = exports.SearchApi = function () {
        function SearchApi() {
            _classCallCheck(this, SearchApi);

            this.httpClient = new _aureliaHttpClient.HttpClient().configure(function (x) {
                x.withBaseUrl('https://azuresearchfree.search.windows.net/indexes/beersv1/docs/search?api-version=2015-02-28');
                x.withHeader('api-key', '5655AB55C4E55DBE67C691F376482D8C');
            });
        }

        SearchApi.prototype.search = function search(query) {
            var _this = this;

            return new Promise(function (resolve) {
                _this.httpClient.post("", {
                    "count": true,
                    "search": query
                }).then(function (result) {
                    var jsonResult = JSON.parse(result.response);
                    resolve({
                        count: jsonResult["@odata.count"],
                        results: jsonResult["value"].map(function (x) {
                            return {
                                name: x.name,
                                style: x.style,
                                brewery: x.breweries[0]
                            };
                        }),
                        raw: jsonResult
                    });
                });
            });
        };

        SearchApi.prototype.suggest = function suggest(query) {
            return new Promise(function (resolve) {
                resolve(['nissefar', 'bestefar', 'oldefar']);
            });
        };

        return SearchApi;
    }();
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

    var _class2, _temp;

    var Simple = exports.Simple = (_temp = _class2 = function () {
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

        Simple.prototype.clear = function clear() {
            this.results = [];
            this.queryText = '';
            this.rawResult = '';
            this.count = null;
        };

        Simple.prototype.attached = function attached() {
            var _class = this;
            $(".search-input").autocomplete({
                source: function source(request, response) {
                    _class.api.suggest(request.term).then(function (results) {
                        return response(results);
                    });
                },
                minLength: 2,
                select: function select(event, ui) {
                    _class.queryText = ui.item.value;
                }
            });
        };

        return Simple;
    }(), _class2.inject = [_searchApi.SearchApi], _temp);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>"; });
define('text!simple/simple.css', ['module'], function(module) { module.exports = ".search-container {\n    margin-top: 20vh;\n}\n\n.has-results {\n    margin-top: 10px !important;\n}\n\n.search-title {\n    font-family: 'Montserrat';\n    font-size: 5.5em;\n    margin: 20px;\n}\n\n.search-title-container::after {\n    content: \"Norway\";\n    font-size: 16px;\n    font-family: \"Roboto\";\n    color: #4285f4;\n    position: relative;\n    top: -40px;\n    right: -110px;\n}\n\n.search-title span {\n    margin: -14px;\n}\n\n.search-input {\n    height: 2.5em;\n}\n\n.search-button-row {\n    margin-top: 20px;\n    width: 400px;\n    margin: 30px auto;\n    text-align: center;\n}\n\n.search-button {\n    font-size: 12px;\n    margin: 0 2px;\n}\n\n.g-blue {\n    color: #4C90F5;\n}\n\n.g-red {\n    color: #ED4D3C;\n}\n\n.g-yellow {\n    color: #FBC402;\n}\n\n.g-green {\n    color: #3BB15D;\n}\n\n.btn-primary {\n    background-color: #F5F5F5;\n    color: #808080;\n    border: none;\n    font-weight: bold;\n    border-radius: 2px;\n}\n\n.brand-img {\n    width: 100%;\n}\n\n.result {\n    padding: 0;\n}\n\n.raw-result {\n    background-color: whitesmoke;\n    font-size: 0.8em;\n}\n\n.raw-result-trigger {\n    font-size: 0.8em;\n}"; });
define('text!home/home.html', ['module'], function(module) { module.exports = "<template>\n    <h1>At Home</h1>\n</template>"; });
define('text!simple/simple.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"./simple.css\"></require>\n\n\t<div class=\"container\">\n\t\t<div class=\"search-container ${results.length > 0 ? 'has-results' : ''}\">\n\t\t\t<div class=\"text-xs-center search-title-container\">\n\t\t\t\t<h1 class=\"search-title\">\n\t\t\t\t\t<span class=\"g-blue\">S</span>\n\t\t\t\t\t<span class=\"g-red\">e</span>\n\t\t\t\t\t<span class=\"g-yellow\">a</span>\n\t\t\t\t\t<span class=\"g-blue\">r</span>\n\t\t\t\t\t<span class=\"g-green\">c</span>\n\t\t\t\t\t<span class=\"g-red\">h</span>\n\t\t\t\t</h1>\n\t\t\t</div>\n\t\t\t<form submit.delegate=\"search()\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<input type=\"text\" value.bind=\"queryText\" class=\"search-input col-md-6 col-xs-8 offset-xs-2 offset-md-3\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"search-button-row\">\n\t\t\t\t\t<input type=\"submit\" value=\"Search Search\" class=\"btn btn-primary search-button\">\n\t\t\t\t\t<input type=\"button\" click.delegate=\"clear()\" value=\"I'm Feeling Tired\" class=\"btn btn-primary search-button\">\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t</div>\n\t\t\t\n\t\t<div class=\"row\" if.bind=\"rawResult\">\n\t\t\t<p>\n\t\t\t\tFound <span class=\"tag tag-info\">${count}</span>, displaying <span class=\"tag tag-info\">${results.length}</span>. \n\t\t\t\t<a class=\"text-muted raw-result-trigger\" data-toggle=\"collapse\" href=\"#rawResult\" aria-expanded=\"false\" aria-controls=\"collapseExample\">\n\t\t\t\t\tRaw result\t\t\t\n\t\t\t\t</a>\n\n\t\t\t</p>\n\t\t\t<div class=\"collapse\" id=\"rawResult\">\n\t\t\t\t<div class=\"card card-block raw-result\">\n\t\t\t\t\t<pre>${rawResult}</pre>\t\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div repeat.for=\"result of results\" class=\"card col-md-12 result\">\n\t\t\t\t<div class=\"card-block\">\n\t\t\t\t\t<h4 class=\"card-title\">${result.name}</h4>\n\t\t\t\t\t<p class=\"card-text\">${result.style}</p>\n\t\t\t\t\t<p class=\"card-text\">${result.brewery}</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</template>"; });
//# sourceMappingURL=app-bundle.js.map