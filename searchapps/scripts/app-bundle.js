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
            config.map([{ route: ['', 'home'], name: 'home', moduleId: 'home/home' }, { route: 'simple', name: 'simple', moduleId: 'simple/simple', nav: true }]);
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
define('home/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Index = exports.Index = function Index() {
    _classCallCheck(this, Index);
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
define('simple/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Index = exports.Index = function Index() {
    _classCallCheck(this, Index);
  };
});
define('simple/simple',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Simple = exports.Simple = function Simple() {
    _classCallCheck(this, Simple);
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>"; });
define('text!home/index.html', ['module'], function(module) { module.exports = "<template>\n    <h1>At Home</h1>\n</template>"; });
define('text!simple/index.html', ['module'], function(module) { module.exports = "<template>\n    <h1>In simple search</h1>\n</template>"; });
define('text!simple/simple.html', ['module'], function(module) { module.exports = "<template>\n\t<require from=\"./simple.css\"></require>\n\n\t<div class=\"container\">\n\t\t<div class=\"search-container\">\n\t\t\t<h1 class=\"text-xs-center search-title\">\n\t\t\t\t<span class=\"g-blue\">S</span>\n\t\t\t\t<span class=\"g-red\">e</span>\n\t\t\t\t<span class=\"g-yellow\">a</span>\n\t\t\t\t<span class=\"g-blue\">r</span>\n\t\t\t\t<span class=\"g-green\">c</span>\n\t\t\t\t<span class=\"g-red\">h</span>\n\t\t\t\t<small class=\"search-title-country\">Norway</small>\n\t\t\t</h1>\n\t\t\t<form>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<input type=\"text\" class=\"search-input col-md-6 col-xs-8 offset-xs-2 offset-md-3\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<input type=\"submit\" value=\"Search Search\" class=\"btn btn-primary search-button\">\n\t\t\t\t</div>\n\n\t\t\t</form>\n\t\t</div>\n\n\t</div>\n\n</template>"; });
define('text!home/home.html', ['module'], function(module) { module.exports = "<template>\n    <h1>At Home</h1>\n</template>"; });
define('text!simple/simple.css', ['module'], function(module) { module.exports = ".search-container {\n    margin-top: 20vh;\n}\n\n.search-title {\n    font-family: 'Montserrat';\n    font-size: 5em;\n    margin: 20px;\n}\n\n.search-title span {\n    margin: -12px;\n}\n\n.search-title-country {\n    font-size: 16px;\n    font-family: \"Roboto\";\n    color: #4285f4;\n    position: relative;\n    top: 17px;\n    right: 70px;\n}\n\n.search-input {\n    height: 2.5em;\n}\n\n.search-button {\n    margin: 20px auto;\n    display: block;\n    border-radius: 2px;\n    font-size: 0.8em;\n}\n\n.g-blue {\n    color: #4C90F5;\n}\n\n.g-red {\n    color: #ED4D3C;\n}\n\n.g-yellow {\n    color: #FBC402;\n}\n\n.g-green {\n    color: #3BB15D;\n}\n\n.btn-primary {\n    background-color: #F5F5F5;\n    color: #808080;\n    border: none;\n    font-weight: bold;\n}"; });
//# sourceMappingURL=app-bundle.js.map