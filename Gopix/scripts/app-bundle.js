define('app',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'jquery'], function (exports, _aureliaFramework, _aureliaEventAggregator, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function App(eventAggregator) {
            var _this = this;

            _classCallCheck(this, App);

            this.handleKeyInput = function (event) {
                var keycode = event.keyCode || event.which;
                switch (keycode) {
                    case _this.keys.LEFT:
                        _this.ea.publish('keyPressed', "LEFT");
                        break;
                    case _this.keys.UP:
                        _this.ea.publish('keyPressed', "UP");
                        break;
                    case _this.keys.RIGHT:
                        _this.ea.publish('keyPressed', "RIGHT");
                        break;
                    case _this.keys.DOWN:
                        _this.ea.publish('keyPressed', "DOWN");
                        break;
                    default:
                        _this.ea.publish('keyPressed', "SOMEKEY");
                }
            };

            this.ea = eventAggregator;
            this.message = 'Gopix Raiders';
            this.keys = {
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40
            };
        }

        App.prototype.activate = function activate() {
            document.addEventListener('keydown', this.handleKeyInput, true);
        };

        App.prototype.deactivate = function deactivate() {
            document.removeEventListener('keydown', this.handleKeyInput);
        };

        return App;
    }()) || _class);
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
define('components/board',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BoardCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var BoardCustomElement = exports.BoardCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function BoardCustomElement(eventAggregator) {
            var _this = this;

            _classCallCheck(this, BoardCustomElement);

            this.ea = eventAggregator;
            this.player = 'white';
            this.ea.subscribe('player', function (response) {
                _this.player = response;
            });
        }

        BoardCustomElement.prototype.logoClass = function logoClass() {
            return this.player;
        };

        return BoardCustomElement;
    }()) || _class);
});
define('components/gopix',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'jquery'], function (exports, _aureliaFramework, _aureliaEventAggregator, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GopixCustomElement = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var GopixCustomElement = exports.GopixCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function GopixCustomElement(eventAggregator) {
            var _this = this;

            _classCallCheck(this, GopixCustomElement);

            this.pixClass = function (pix) {
                var classes = pix.cycles > 0 ? pix.name + ' shade' + pix.cycles : pix.name;
                return classes;
            };

            this.ea = eventAggregator;
            this.ea.subscribe('keyPressed', function (response) {
                _this.move(response);
            });
            this.move = function (direction) {
                switch (direction) {
                    case 'LEFT':
                        this.duplicate(-1, 0);
                        break;
                    case 'RIGHT':
                        this.duplicate(1, 0);
                        break;
                    case 'UP':
                        this.duplicate(0, -1);
                        break;
                    case 'DOWN':
                        this.duplicate(0, 1);
                        break;
                    default:
                }
                this.turn();
            };
            this.duplicate = function (dx, dy) {
                var newPixes = [];
                var maxY = this.gopix.length;
                var maxX = this.gopix[0].length;

                for (var y = 0; y < maxY; y++) {
                    for (var x = 0; x < maxX; x++) {
                        var thisPix = this.gopix[y][x];
                        if (thisPix.name === this.toplay) {
                            var $row = (0, _jquery2.default)((0, _jquery2.default)('.row')[y]);
                            var $pix = (0, _jquery2.default)($row.children('.pix')[x]);

                            if (thisPix.cycles > 3) {
                                newPixes.push([[(x + dx + maxX) % maxX], [(y + dy + maxY) % maxY]]);
                            }
                            if (thisPix.cycles > 0) {
                                thisPix.cycles--;
                                $pix.addClass('shade' + thisPix.cycles);
                            }
                            if (thisPix.cycles === 0) {
                                thisPix.name === 'empty';
                                $pix.removeClass('white black shade0 shade1 shade2 shade3 shade4 shade5 shade6 shade7').addClass('empty');
                            }
                        }
                    }
                }
                var newPix = {
                    "name": this.toplay,
                    "cycles": 7
                };
                console.log(this.gopix);

                for (var i = 0; i < newPixes.length; i++) {
                    this.gopix[newPixes[i][1]][newPixes[i][0]] = newPix;
                    var _$row = (0, _jquery2.default)((0, _jquery2.default)('.row')[newPixes[i][1]]);
                    var _$pix = (0, _jquery2.default)(_$row.children('.pix')[newPixes[i][0]]);
                    _$pix.removeClass('empty white black').addClass(this.toplay);
                }
            };

            this.turn = function () {
                this.toplay = this.toplay === 'black' ? 'white' : 'black';
                this.ea.publish('player', this.toplay);
            };
            this.toplay = 'white';
            this.gopix = [];

            this.reset = function () {
                var newPix = {
                    "name": "empty",
                    "cycles": 0
                };
                for (var y = 0; y < 33; y++) {
                    this.gopix.push([]);
                    for (var x = 0; x < 33; x++) {
                        this.gopix[y].push(newPix);
                    }
                }
                this.gopix[11][11] = {
                    "name": "white",
                    "cycles": 7
                };
                this.gopix[21][21] = {
                    "name": "black",
                    "cycles": 7
                };
            };
            this.reset();
        }

        GopixCustomElement.prototype.clickPix = function clickPix(pix) {
            this.turn();
            if (pix === 'empty') {
                this.turn();
                pix = this.toplay;
            }
        };

        return GopixCustomElement;
    }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('resources/binding-behaviors/keystrokes',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Keystrokes = exports.Keystrokes = function () {
        function Keystrokes() {
            _classCallCheck(this, Keystrokes);

            this.myKeypressCallback = this.keypressInput.bind(this);
        }

        Keystrokes.prototype.activate = function activate() {
            window.addEventListener('keypress', this.myKeypressCallback, false);
        };

        Keystrokes.prototype.deactivate = function deactivate() {
            window.removeEventListener('keypress', this.myKeypressCallback);
        };

        Keystrokes.prototype.keypressInput = function keypressInput(e) {
            console.log(e);
        };

        return Keystrokes;
    }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"app.css\"></require>\n    <require from=\"components/board\"></require>\n    <board></board>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "*{\n\tmargin:0; border:0; padding:0;\n}\nbody, html{\n\theight:100%;\n\tmin-height:100%;\n}\na{outline:none;}\n#container{\n\tposition:relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n\tmargin:0 auto;\n\twidth:750px;\n\theight:100%;\n\tmin-height:100%;\n\tbackground-color:#E3B32D;\n\toverflow:hidden;\n}\n#logo{\n\twidth:544px;\n\theight:39px;\n    margin: 15px 0;\n\tbackground-image:url(/images/logo.gif);\n\tbackground-repeat:no-repeat;\n}\n#logo.white{\n\tbackground-position: 0 -40px;\n}\n#logo.black{\n\tbackground-position: 0 0;\n}\n#gopix{\n\twidth:544px;\n\theight:544px;\n}\n.row{\n    display: flex;\n    justify-content: space-between;\n}\na.pix{\n    display: inline-block;\n\toverflow:hidden;\n\twidth:16px;\n\theight:16px;\n\tbackground-image:url(/images/pix.gif);\n\tbackground-repeat:no-repeat;\n\tbackground-position:0 0;\n\t/*border:1px solid red;*/\n}\na.shade7{\n\topacity: 1;\n}\na.shade6{\n\topacity: .85;\n}\na.shade5{\n\topacity: .7;\n}\na.shade4{\n\topacity: .55;\n}\na.shade3{\n\topacity: .4;\n}\na.shade2{\n\topacity: .25;\n}\na.shade1{\n\topacity: .1;\n}\na.black{\n\tbackground-position:0 -32px;\n}\na.white{\n\tbackground-position:0 -16px;\n}\na.pix:hover{\n\tbackground-position:0 -16px;\n}\n"; });
define('text!components/board.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/gopix\"></require>\n\t<div id=\"container\">\n\t\t<div id=\"logo\" class.bind=\"player\"></div>\n\t\t<gopix id=\"gopix\"></gopix>\n\t</div>\n</template>\n"; });
define('text!components/board.css', ['module'], function(module) { module.exports = ""; });
define('text!components/gopix.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"row\" repeat.for = \"row of gopix\">\n        <a href=\"#\"\n            repeat.for=\"pix of row\"\n            class.bind=\"pixClass(pix)\"\n            class=\"pix\"\n            click.trigger=\"clickPix(pix)\"></a>\n    </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map