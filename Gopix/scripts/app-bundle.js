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
                for (var y = 0; y < 33; y++) {
                    this.gopix.push([]);
                    for (var x = 0; x < 33; x++) {
                        this.gopix[y].push('empty');
                    }
                }
                this.gopix[11][11] = 'white';
                this.gopix[21][21] = 'black';
            };
            this.reset();
        }

        GopixCustomElement.prototype.turn = function turn() {
            this.toplay = this.toplay === 'black' ? 'white' : 'black';
        };

        GopixCustomElement.prototype.clickPix = function clickPix(pix) {
            this.turn();
            if (pix === 'empty') {
                pix = this.toplay;
                this.turn();
            }
            console.log(pix);
        };

        return GopixCustomElement;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/board.css\"></require>\n    <require from=\"components/board.html\"></require>\n    <board></board>\n</template>\n"; });
define('text!components/board.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/gopix\"></require>\n\t<div id=\"container\">\n\t\t<div id=\"logo\"></div>\n\t\t<gopix id=\"gopix\"></gopix>\n\t</div>\n</template>\n"; });
define('text!components/board.css', ['module'], function(module) { module.exports = "*{\n\tmargin:0; border:0; padding:0;\n}\nbody, html{\n\theight:100%;\n\tmin-height:100%;\n}\na{outline:none;}\n#container{\n\tposition:relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n\tmargin:0 auto;\n\twidth:750px;\n\theight:100%;\n\tmin-height:100%;\n\tbackground-color:#E3B32D;\n\toverflow:hidden;\n}\n#logo{\n\twidth:544px;\n\theight:39px;\n    margin: 15px 0;\n\tbackground-image:url(/images/logo.gif);\n\tbackground-repeat:no-repeat;\n}\n#gopix{\n\twidth:544px;\n\theight:544px;\n}\n.row{\n    display: flex;\n    justify-content: space-between;\n}\na.pix{\n    display: inline-block;\n\toverflow:hidden;\n\twidth:16px;\n\theight:16px;\n\tbackground-image:url(/images/pix.gif);\n\tbackground-repeat:no-repeat;\n\tbackground-position:0 0;\n\t/*border:1px solid red;*/\n}\na.black{\n\tbackground-position:0 -32px;\n}\na.white{\n\tbackground-position:0 -16px;\n}\na.pix:hover{\n\tbackground-position:0 -16px;\n}\n"; });
define('text!components/gopix.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"row\" repeat.for = \"row of gopix\">\n        <a href=\"#\"\n            repeat.for=\"pix of row\"\n            class.bind=\"pix\" class=\"pix\"\n            click.trigger=\"clickPix(pix)\"></a>\n    </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map