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
                    case _this.keys.left:
                        _this.ea.publish('keyPressed', "left");
                        break;
                    case _this.keys.up:
                        _this.ea.publish('keyPressed', "up");
                        break;
                    case _this.keys.right:
                        _this.ea.publish('keyPressed', "right");
                        break;
                    case _this.keys.down:
                        _this.ea.publish('keyPressed', "down");
                        break;
                    default:
                        _this.ea.publish('keyPressed', "somekey");
                }
            };

            this.ea = eventAggregator;
            this.message = 'Gopix Raiders';
            this.keys = {
                'left': 37,
                'up': 38,
                'right': 39,
                'down': 40
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

    var GopixCustomElement = exports.GopixCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function GopixCustomElement(eventAggregator) {
        var _this = this;

        _classCallCheck(this, GopixCustomElement);

        this.ea = eventAggregator;

        this.ea.subscribe('keyPressed', function (response) {
            _this.move(response);
        });

        this.toplay = 'white';
        this.oponent = 'black';

        this.maxX = 22;
        this.maxY = 22;

        this.maxStrength = 25;

        this.playerStrength = {
            'white': 8,
            'black': 8
        };

        this.gopix = [];

        this.pixStyle = function (pix) {
            var style = "";
            var borderWidth = Math.floor(pix.strength / 8);
            var opacity = pix.strength / this.maxStrength;
            var bgR, bgG, bgB;
            switch (pix.name) {
                case 'white':
                    bgR = 255;
                    bgG = 255;
                    bgB = 255;
                    break;
                case 'black':
                    bgR = 0;
                    bgG = 0;
                    bgB = 0;
                    break;
                default:
                    bgR = 61;
                    bgG = 137;
                    bgB = 217;
                    opacity = 1;
            }
            style = {
                'background': 'linear-gradient(' + 'rgba(' + bgR + ', ' + bgG + ', ' + bgB + ', ' + opacity + '),' + 'rgba(' + bgR + ', ' + bgG + ', ' + bgB + ', ' + opacity + ')' + '),' + 'url(/images/bgBlauw.gif)',
                'borderWidth': borderWidth + 'px'
            };

            return style;
        };

        this.turn = function () {
            if (this.playerStrength[this.toplay] < this.maxStrength) {
                this.playerStrength[this.toplay]++;
            }
            console.log(this.playerStrength);

            var temp = this.oponent;
            this.oponent = this.toplay;
            this.toplay = temp;
            this.ea.publish('player', this.toplay);
        };

        this.move = function (direction) {
            switch (direction) {
                case 'left':
                    this.step(-1, 0);
                    break;
                case 'right':
                    this.step(1, 0);
                    break;
                case 'up':
                    this.step(0, -1);
                    break;
                case 'down':
                    this.step(0, 1);
                    break;
                default:
            }
        };

        this.getNewPixes = function (dx, dy) {
            var newPixes = [];
            var abortMove = false;
            for (var y = 0; y < this.maxY; y++) {
                for (var x = 0; x < this.maxX; x++) {
                    var thisPix = this.gopix[y][x];
                    if (thisPix.name === this.toplay) {
                        if (thisPix.strength > this.playerStrength[this.toplay] / 4) {
                            var newX = x + dx;
                            var newY = y + dy;
                            if (!(newX < 0 || newX >= this.maxX || newY < 0 || newY >= this.maxY)) {
                                var newPix = [newX, newY];
                                if (this.gopix[newY][newX].name == 'empty') {
                                    newPixes.push(newPix);
                                } else {
                                    if (this.gopix[newY][newX].name == this.oponent) {
                                        if (this.gopix[newY][newX].strength < thisPix.strength) {
                                            newPixes.push(newPix);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return newPixes;
        };

        this.weakenPixes = function () {
            for (var y = 0; y < this.maxY; y++) {
                for (var x = 0; x < this.maxX; x++) {
                    var thisPix = this.gopix[y][x];
                    if (thisPix.name !== this.oponent) {
                        var $row = (0, _jquery2.default)((0, _jquery2.default)('.row')[y]);
                        var $pix = (0, _jquery2.default)($row.children('.pix')[x]);
                        if (thisPix.strength > 0) {
                            thisPix.strength--;
                            $pix.removeClass('empty white black').addClass(this.toplay);
                            $pix.css(this.pixStyle(thisPix));
                        } else {
                            thisPix.name = 'empty';
                            $pix.removeClass('white black').addClass('empty');
                            $pix.css(this.pixStyle(thisPix));
                        }
                    }
                }
            }
        };

        this.drawNewPixes = function (newPixes) {
            var newPix = {
                "name": this.toplay,
                "strength": this.playerStrength[this.toplay]
            };
            for (var i = 0; i < newPixes.length; i++) {
                this.gopix[newPixes[i][1]][newPixes[i][0]] = newPix;
                var $row = (0, _jquery2.default)((0, _jquery2.default)('.row')[newPixes[i][1]]);
                var $pix = (0, _jquery2.default)($row.children('.pix')[newPixes[i][0]]);
                $pix.removeClass('empty white black').addClass(this.toplay);
                $pix.css(this.pixStyle(newPix));
            }
        };

        this.step = function (dx, dy) {
            var newPixes = this.getNewPixes(dx, dy);
            console.log(newPixes);
            if (newPixes.length) {
                this.weakenPixes();
                this.drawNewPixes(newPixes);
                this.turn();
            } else {
                console.log('illegal move');
            }
        };

        this.reset = function () {
            var newPix = {
                "name": "empty",
                "strength": 0
            };
            for (var y = 0; y < this.maxX; y++) {
                this.gopix.push([]);
                for (var x = 0; x < this.maxY; x++) {
                    this.gopix[y].push(newPix);
                }
            }
            this.gopix[7][7] = {
                "name": "white",
                "strength": this.playerStrength['white']
            };
            this.gopix[14][14] = {
                "name": "black",
                "strength": this.playerStrength['black']
            };
        };

        this.reset();
    }) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"app.css\"></require>\n    <require from=\"components/board\"></require>\n    <board></board>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "*{\n\tmargin:0; border:0; padding:0;\n}\nbody, html{\n\theight:100%;\n\tmin-height:100%;\n}\na{outline:none;}\n#container{\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n\tposition:relative;\n\tmargin:0 auto;\n\twidth:750px;\n\theight:100%;\n\tmin-height:100%;\n\tbackground-color:#E3B32D;\n\toverflow:hidden;\n}\n#logo{\n\twidth:527px;\n\theight:39px;\n    margin: 15px 0;\n\tbackground-image:url(/images/logo.gif);\n\tbackground-repeat:no-repeat;\n\tbackground-size: cover;\n}\n#logo.white{\n\tbackground-position: 0 -40px;\n}\n#logo.black{\n\tbackground-position: 0 0;\n}\n"; });
define('text!components/board.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/gopix\"></require>\n\t<div id=\"container\">\n\t\t<div id=\"logo\" class.bind=\"player\"></div>\n\t\t<gopix id=\"gopix\"></gopix>\n\t</div>\n</template>\n"; });
define('text!components/board.css', ['module'], function(module) { module.exports = ""; });
define('text!components/gopix.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/gopix.css\"></require>\n    <div class=\"row\" repeat.for = \"row of gopix\">\n        <a href=\"#\"\n            repeat.for=\"pix of row\"\n            class.bind=\"pix.name\"\n            class=\"pix\"\n            data-strength.bind=\"pix.strength\"></a>\n    </div>\n</template>\n"; });
define('text!components/gopix.css', ['module'], function(module) { module.exports = "#gopix{\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\twidth:527px;\n\theight:527px;\n}\n.row{\n    display: flex;\n    justify-content: space-between;\n}\na.pix{\n\twidth:23px;\n\theight:23px;\n\tborder-radius: 3px;\n    border: 0px solid transparent;\n    box-sizing: border-box;\n    background-position: center center;\n}\na.pix.empty{\n\tbackground-color: #3d89d9;\n}\na.black{\n\tbackground-color: #000;\n    border-color: #888;\n}\na.white{\n\tbackground-color: #fff;\n    border-color: #888;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map