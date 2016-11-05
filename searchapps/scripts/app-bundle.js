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
define('services/search-api',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var searchResults = [{
        name: 'Nissefar',
        brewery: 'Nøgne Ø',
        type: 'Porter'
    }, {
        name: 'Bestefar',
        brewery: 'Nøgne Ø',
        type: 'Porter'
    }, {
        name: 'Tiger Trippel',
        brewery: 'Nøgne Ø',
        type: 'Tripel Ale'
    }];

    var suggestions = ['Nissefar', 'Bestefar', 'Oldefar'];

    var SearchApi = exports.SearchApi = function () {
        function SearchApi() {
            _classCallCheck(this, SearchApi);
        }

        SearchApi.prototype.search = function search(query) {
            return new Promise(function (resolve) {
                resolve(searchResults);
            });
        };

        SearchApi.prototype.suggest = function suggest(query) {
            return new Promise(function (resolve) {
                resolve(suggestions);
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

    var _class, _temp;

    var Simple = exports.Simple = (_temp = _class = function () {
        function Simple(api) {
            _classCallCheck(this, Simple);

            this.api = api;
            this.results = [];
            this.queryText = '';
        }

        Simple.prototype.search = function search() {
            var _this = this;

            this.api.search(this.queryText).then(function (results) {
                return _this.results = results;
            });
        };

        Simple.prototype.clear = function clear() {
            this.results = [];
        };

        Simple.prototype.attached = function attached() {
            var _api = this.api;
            $(".search-input").autocomplete({
                source: function source(request, response) {
                    debugger;
                    _api.suggest(request.term).then(function (results) {
                        return response(results);
                    });
                },
                minLength: 2,
                select: function select(event, ui) {
                    console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
                }
            });
        };

        return Simple;
    }(), _class.inject = [_searchApi.SearchApi], _temp);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>"; });
define('text!simple/simple.css', ['module'], function(module) { module.exports = ".search-container {\n    margin-top: 20vh;\n}\n\n.has-results {\n    margin-top: 10px !important;\n}\n\n.search-title {\n    font-family: 'Montserrat';\n    font-size: 5.5em;\n    margin: 20px;\n}\n\n.search-title-container::after {\n    content: \"Norway\";\n    font-size: 16px;\n    font-family: \"Roboto\";\n    color: #4285f4;\n    position: relative;\n    top: -40px;\n    right: -110px;\n}\n\n.search-title span {\n    margin: -14px;\n}\n\n.search-input {\n    height: 2.5em;\n}\n\n.search-button-row {\n    margin-top: 20px;\n    width: 400px;\n    margin: 30px auto;\n    text-align: center;\n}\n\n.search-button {\n    font-size: 12px;\n    margin: 0 2px;\n}\n\n.g-blue {\n    color: #4C90F5;\n}\n\n.g-red {\n    color: #ED4D3C;\n}\n\n.g-yellow {\n    color: #FBC402;\n}\n\n.g-green {\n    color: #3BB15D;\n}\n\n.btn-primary {\n    background-color: #F5F5F5;\n    color: #808080;\n    border: none;\n    font-weight: bold;\n    border-radius: 2px;\n}\n\n.brand-img {\n    width: 100%;\n}\n\n.result {\n    padding: 0;\n}"; });
define('text!home/home.html', ['module'], function(module) { module.exports = "<template>\n    <h1>At Home</h1>\n</template>"; });
define('text!simple/simple.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"./simple.css\"></require>\n\n\t<div class=\"container\">\n\t\t<div class=\"search-container ${results.length > 0 ? 'has-results' : ''}\">\n\t\t\t<div class=\"text-xs-center search-title-container\">\n\t\t\t\t<h1 class=\"search-title\">\n\t\t\t\t\t<span class=\"g-blue\">S</span>\n\t\t\t\t\t<span class=\"g-red\">e</span>\n\t\t\t\t\t<span class=\"g-yellow\">a</span>\n\t\t\t\t\t<span class=\"g-blue\">r</span>\n\t\t\t\t\t<span class=\"g-green\">c</span>\n\t\t\t\t\t<span class=\"g-red\">h</span>\n\t\t\t\t</h1>\n\t\t\t</div>\n\t\t\t<form submit.delegate=\"search()\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<input type=\"text\" value.bind=\"queryText\" class=\"search-input col-md-6 col-xs-8 offset-xs-2 offset-md-3\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"search-button-row\">\n\t\t\t\t\t<input type=\"submit\" value=\"Search Search\" class=\"btn btn-primary search-button\">\n\t\t\t\t\t<input type=\"button\" click.delegate=\"clear()\" value=\"I'm Feeling Tired\" class=\"btn btn-primary search-button\">\n\t\t\t\t</div>\n\n\t\t\t</form>\n\t\t</div>\n\t\t<div class=\"row\">\n\t\t\t<div repeat.for=\"result of results\" class=\"card col-md-4 result\">\n\t\t\t\t<img class=\"card-img-top brand-img\" src=\"https://unsplash.it/300/200?image=876\" alt=\"Card image cap\">\n\t\t\t\t<div class=\"card-block\">\n\t\t\t\t\t<h4 class=\"card-title\">${result.name}</h4>\n\t\t\t\t\t<p class=\"card-text\">${result.brewery}</p>\n\t\t\t\t\t<p class=\"card-text\">${result.type}</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</template>"; });
//# sourceMappingURL=app-bundle.js.map