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

            this.ea = eventAggregator;

            this.ea.subscribe('keyPressed', function (response) {
                _this.move(response);
            });

            this.toplay = 'white';
            this.oponent = 'black';

            this.maxX = 11;
            this.maxY = 11;

            this.maxStrength = 20;

            this.playerStrength = {
                'white': 5,
                'black': 5
            };

            this.gopix = [];
        }

        GopixCustomElement.prototype.pixStyle = function pixStyle(pix) {
            return {
                'borderWidth': pix.strength + 'px'
            };
        };

        GopixCustomElement.prototype.turn = function turn() {
            if (this.playerStrength[this.toplay] < this.maxStrength) {
                this.playerStrength[this.toplay]++;
            }

            var temp = this.oponent;
            this.oponent = this.toplay;
            this.toplay = temp;
            this.ea.publish('player', this.toplay);
        };

        GopixCustomElement.prototype.move = function move(direction) {
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

        GopixCustomElement.prototype.getNewPixes = function getNewPixes(dx, dy) {
            var newPixes = [];
            var abortMove = false;
            for (var y = 0; y < this.maxY; y++) {
                for (var x = 0; x < this.maxX; x++) {
                    var thisPix = this.gopix[y][x];
                    if (thisPix.name === this.toplay) {
                        if (thisPix.strength > 0) {
                            var newX = x + dx;
                            var newY = y + dy;
                            if (!(newX < 0 || newX >= this.maxX || newY < 0 || newY >= this.maxY)) {
                                var newPix = [newX, newY];
                                if (this.gopix[newY][newX].strength === 0) {
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

        GopixCustomElement.prototype.copyPix = function copyPix(pix) {
            return {
                'name': pix.name,
                'strength': pix.strength
            };
        };

        GopixCustomElement.prototype.weakenPixes = function weakenPixes() {
            for (var y = 0; y < this.maxY; y++) {
                for (var x = 0; x < this.maxX; x++) {
                    var thisPix = this.copyPix(this.gopix[y][x]);
                    if (thisPix.name === this.toplay) {
                        var $row = (0, _jquery2.default)((0, _jquery2.default)('.row')[y]);
                        var $pix = (0, _jquery2.default)($row.children('.pix')[x]);
                        if (thisPix.strength > 0) {
                            thisPix.strength--;
                            $pix.css(this.pixStyle(thisPix));
                        } else {
                            thisPix.name = 'empty';

                            $pix.removeClass('black white').addClass('empty');
                        }
                    }
                    this.gopix[y][x] = this.copyPix(thisPix);
                }
            }
        };

        GopixCustomElement.prototype.addNewPixes = function addNewPixes(newPixes) {
            var newPix = {
                "name": this.toplay,
                "strength": this.playerStrength[this.toplay]
            };
            for (var i = 0; i < newPixes.length; i++) {
                this.gopix[newPixes[i][1]][newPixes[i][0]] = this.copyPix(newPix);
                var $row = (0, _jquery2.default)((0, _jquery2.default)('.row')[newPixes[i][1]]);
                var $pix = (0, _jquery2.default)($row.children('.pix')[newPixes[i][0]]);
                $pix.removeClass('empty white black').addClass(this.toplay);
                $pix.css(this.pixStyle(newPix));
            }
        };

        GopixCustomElement.prototype.step = function step(dx, dy) {
            console.clear();
            var newPixes = this.getNewPixes(dx, dy);

            if (newPixes.length) {
                this.weakenPixes();

                this.addNewPixes(newPixes);

                this.turn();
            } else {
                this.ea.publish('illegal');
            }
        };

        GopixCustomElement.prototype.logArray = function logArray(str, arr) {
            var arrr = arr.slice();
            console.log(str);
            for (var i = 0; i < arrr.length; i++) {
                console.table(arrr[i]);
            }
        };

        GopixCustomElement.prototype.reset = function reset() {
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
            this.gopix[3][3] = {
                "name": "white",
                "strength": this.playerStrength['white']
            };
            this.gopix[7][7] = {
                "name": "black",
                "strength": this.playerStrength['black']
            };
        };

        GopixCustomElement.prototype.setup = function setup() {
            var newPixes = [[3, 3]];
            this.addNewPixes(newPixes);
            this.turn();
            newPixes = [[7, 7]];
            this.addNewPixes(newPixes);
            this.turn();
        };

        GopixCustomElement.prototype.attached = function attached() {
            this.reset();
            this.setup();
        };

        return GopixCustomElement;
    }()) || _class);
});
define('components/header',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.HeaderCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var HeaderCustomElement = exports.HeaderCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function HeaderCustomElement(eventAggregator) {
            var _this = this;

            _classCallCheck(this, HeaderCustomElement);

            this.ea = eventAggregator;
            this.color = 'white';
            this.ea.subscribe('player', function (response) {
                _this.setTitleText(_this.getTitleData(response + ' plays'));
                _this.color = response;
            });
            this.ea.subscribe('illegal', function (response) {
                _this.setTitleText(_this.getTitleData('illegal move'));
            });
            this.text = 'gopix raider';
            this.titleData = [];
            this.characters = [{
                'name': ' ',
                'data': [0]
            }, {
                'name': 'a',
                'data': [31, 31, 20, 20, 15]
            }, {
                'name': 'b',
                'data': [31, 31, 21, 21, 11]
            }, {
                'name': 'c',
                'data': [31, 31, 17, 17, 10]
            }, {
                'name': 'd',
                'data': [31, 31, 17, 27, 14]
            }, {
                'name': 'e',
                'data': [31, 31, 21, 21, 1]
            }, {
                'name': 'g',
                'data': [31, 31, 17, 21, 7]
            }, {
                'name': 'h',
                'data': [31, 31, 4, 4, 15]
            }, {
                'name': 'i',
                'data': [31, 15]
            }, {
                'name': 'k',
                'data': [31, 31, 12, 6, 11, 17]
            }, {
                'name': 'l',
                'data': [31, 31, 1, 1, 1]
            }, {
                'name': 'm',
                'data': [7, 28, 8, 28, 7]
            }, {
                'name': 'o',
                'data': [31, 31, 17, 17, 15]
            }, {
                'name': 'p',
                'data': [31, 31, 20, 20, 8]
            }, {
                'name': 'r',
                'data': [31, 31, 20, 22, 9]
            }, {
                'name': 's',
                'data': [29, 29, 21, 23, 23]
            }, {
                'name': 't',
                'data': [16, 31, 31, 16, 16]
            }, {
                'name': 'v',
                'data': [28, 6, 1, 6, 28]
            }, {
                'name': 'w',
                'data': [28, 7, 2, 7, 28]
            }, {
                'name': 'x',
                'data': [17, 26, 12, 6, 11, 17]
            }, {
                'name': 'y',
                'data': [16, 25, 14, 4, 8, 16]
            }];
        }

        HeaderCustomElement.prototype.setTitleText = function setTitleText(titleData) {
            this.titleData = titleData;
        };

        HeaderCustomElement.prototype.getTitleData = function getTitleData(titleString) {
            var _this2 = this;

            function dec2bin(dec) {
                return ('00000' + (dec >>> 0).toString(2)).substr(-5);
            }
            var titleData = [];
            var titleSplit = titleString.split('');

            var _loop = function _loop() {
                if (_isArray) {
                    if (_i >= _iterator.length) return 'break';
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) return 'break';
                    _ref = _i.value;
                }

                var character = _ref;

                var charObject = _this2.characters.find(function (x) {
                    return x.name === character;
                });
                var charData = charObject.data;
                var charName = charObject.name;
                for (var _iterator2 = charData, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                    var _ref2;

                    if (_isArray2) {
                        if (_i2 >= _iterator2.length) break;
                        _ref2 = _iterator2[_i2++];
                    } else {
                        _i2 = _iterator2.next();
                        if (_i2.done) break;
                        _ref2 = _i2.value;
                    }

                    var col = _ref2;

                    var binaryCol = dec2bin(col);
                    var pixels = [];
                    for (var _iterator3 = binaryCol, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                        var _ref3;

                        if (_isArray3) {
                            if (_i3 >= _iterator3.length) break;
                            _ref3 = _iterator3[_i3++];
                        } else {
                            _i3 = _iterator3.next();
                            if (_i3.done) break;
                            _ref3 = _i3.value;
                        }

                        var pix = _ref3;

                        pixels.push(pix);
                    }
                    titleData.push(pixels);
                }
                titleData.push([0, 0, 0, 0, 0]);
            };

            for (var _iterator = titleSplit, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                var _ret = _loop();

                if (_ret === 'break') break;
            }
            titleData.pop();
            return titleData;
        };

        HeaderCustomElement.prototype.attached = function attached() {
            this.titleData = this.getTitleData(this.text);
        };

        return HeaderCustomElement;
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
define('text!app.css', ['module'], function(module) { module.exports = "*{\n\tmargin:0; border:0; padding:0;\n}\nbody, html{\n\theight:100%;\n\tmin-height:100%;\n}\na{outline:none;}\n#container{\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n\tposition:relative;\n\tmargin:0 auto;\n\twidth:750px;\n\theight:100%;\n\tmin-height:100%;\n\tbackground-color:#E3B32D;\n\toverflow:hidden;\n}\nheader{\n\tdisplay: block;\n}\n#logo{\n\twidth:527px;\n\theight:39px;\n    margin: 15px 0;\n\tbackground-image:url(/images/logo.gif);\n\tbackground-repeat:no-repeat;\n\tbackground-size: cover;\n}\n#logo.white{\n\tbackground-position: 0 -40px;\n}\n#logo.black{\n\tbackground-position: 0 0;\n}\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"app.css\"></require>\n    <require from=\"components/board\"></require>\n    <board></board>\n</template>\n"; });
define('text!components/board.css', ['module'], function(module) { module.exports = ""; });
define('text!components/board.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/gopix\"></require>\n    <require from=\"components/header\"></require>\n\t<div id=\"container\">\n\t\t<!-- <div id=\"logo\" class.bind=\"player\"></div> -->\n        <header></header>\n\t\t<gopix id=\"gopix\"></gopix>\n\t</div>\n</template>\n"; });
define('text!components/gopix.css', ['module'], function(module) { module.exports = "#gopix {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    width: 527px;\n    height: 527px;\n}\n\n.row {\n    flex: 0 0 47px;\n    display: flex;\n    justify-content: space-between;\n}\n\n.pix {\n    width: 47px;\n    height: 47px;\n    border-radius: 25px;\n    border: 0px solid transparent;\n    box-sizing: border-box;\n    background-color: #3d89d9;\n    background-position: center center;\n    transition: all .5s;\n}\n\n.pix.empty {\n    border-radius: 3px;\n}\n\n.pix.black {\n    border-color: rgba(0, 0, 0, 0.7);\n    -webkit-box-shadow: inset 0 0 20px 0 rgba(0, 0, 0, 0.7);\n    box-shadow: inset 0 0 20px 0px rgba(0, 0, 0, 0.7);\n}\n\n.pix.white {\n    border-color: rgba(255, 255, 255, 0.7);\n    -webkit-box-shadow: inset 0 0 20px 0 rgba(255, 255, 255, 0.7);\n    box-shadow: inset 0 0 20px 0px rgba(255, 255, 255, 0.7);\n}\n"; });
define('text!components/gopix.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/gopix.css\"></require>\n    <div class=\"row\" repeat.for = \"row of gopix\">\n        <span\n            repeat.for=\"pix of row\"\n            class.one-time=\"pix.name\"\n            style.one-time=\"pixStyle(pix)\"\n            class=\"pix\"></span>\n    </div>\n</template>\n"; });
define('text!components/header.css', ['module'], function(module) { module.exports = ".titleBar{\n    width: 527px;\n    height: 39px;\n    margin: 30px 0;\n    display: flex;\n}\n.pixelCol{\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n}\n.pixelCol + .pixelCol{\n    margin-left: 1px;\n}\n.pixel{\n    width: 7px;\n    height: 7px;\n    border-radius: 4px;\n    transition: all 1s;\n}\n.white .pixel.on{\n    background-color: #fff;\n}\n.black .pixel.on{\n    background-color: #000;\n}\n.pixel.off{\n    background-color: transparent;\n}\n"; });
define('text!components/header.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/header.css\"></require>\n    <div class=\"titleBar\" class.bind=\"color\">\n        <div class=\"pixelCol\" repeat.for=\"col of titleData\">\n            <div class=\"pixel\" repeat.for=\"pixel of col\" class.bind=\"pixel == 1 ? 'on' : 'off'\">\n\n            </div>\n        </div>\n    </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map