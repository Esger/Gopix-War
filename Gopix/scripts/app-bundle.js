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

  var App = exports.App = function App() {
    _classCallCheck(this, App);

    this.message = 'Hello World!';
  };
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
    longStackTraces: _environment2.default.debug,
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
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('components/gopix',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GopixCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var GopixCustomElement = exports.GopixCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function GopixCustomElement(eventAggregator) {
            _classCallCheck(this, GopixCustomElement);

            this.ea = eventAggregator;
            this.toplay = 'black';
            this.gopix = [];

            this.reset = function () {
                for (var count = 1; count < 1089; count++) {
                    this.gopix.push('empty');
                }
            };
            this.reset();
        }

        GopixCustomElement.prototype.turn = function turn() {
            if (toplay == 'black') {
                toplay = 'white';
            } else {
                toplay = 'black';
            }
        };

        GopixCustomElement.prototype.clickPix = function clickPix(pix) {};

        return GopixCustomElement;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/board.css\"></require>\n    <require from=\"components/board.html\"></require>\n    <board></board>\n</template>\n"; });
define('text!components/board.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/gopix\"></require>\n\t<div id=\"container\">\n\t\t<div id=\"logo\"></div>\n\t\t<gopix id=\"gopix\"></gopix>\n\t</div>\n</template>\n"; });
define('text!components/board.css', ['module'], function(module) { module.exports = "*{\n\tmargin:0; border:0; padding:0;\n}\nbody, html{\n\theight:100%;\n\tmin-height:100%;\n}\na{outline:none;}\n#container{\n\tposition:relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n\tmargin:0 auto;\n\twidth:750px;\n\theight:100%;\n\tmin-height:100%;\n\tbackground-color:#E3B32D;\n\toverflow:hidden;\n}\n#logo{\n\twidth:544px;\n\theight:39px;\n    margin: 15px 0;\n\tbackground-image:url(/images/logo.gif);\n\tbackground-repeat:no-repeat;\n}\n#gopix{\n\twidth:544px;\n\theight:544px;\n}\na.pix{\n\tdisplay:block;\n\toverflow:hidden;\n\tfloat:left;\n\twidth:16px;\n\theight:16px;\n\tbackground-image:url(/images/pix.gif);\n\tbackground-repeat:no-repeat;\n\tbackground-position:0 0;\n\t/*border:1px solid red;*/\n}\na.black{\n\tbackground-position:0 -32px;\n}\na.white{\n\tbackground-position:0 -16px;\n}\na.pix:hover{\n\tbackground-position:0 -16px;\n}\n"; });
define('text!components/gopix.html', ['module'], function(module) { module.exports = "<template>\n    <a repeat.for=\"pix of gopix\" href='#' class='pix' id=\"+count+\"></a>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map