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
                if (_this.listen2keys) {
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
                }
            };

            this.ea = eventAggregator;
            this.listen2keys = false;
            this.ea.subscribe('game', function (response) {
                switch (response.type) {
                    case 'start':
                        _this.listen2keys = true;
                        break;
                    case 'win':
                        _this.listen2keys = false;
                        break;
                    default:

                }
            });
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
            this.ea.subscribe('game', function (response) {
                switch (response.type) {
                    case 'start':
                        _this.emptyBoard();
                        _this.setup();
                        break;
                    default:

                }
            });

            this.toplay = 'white';
            this.oponent = 'black';
            this.game = 'off';

            this.maxX = 11;
            this.maxY = 11;

            this.maxStrength = 11;

            this.playerStrength = {
                'white': 5,
                'black': 5
            };

            this.gopix = [];

            this.neighbours = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        }

        GopixCustomElement.prototype.pixStyle = function pixStyle(pix) {
            var blackCompensation = pix.name === 'black' ? 1 : 0;
            return {
                'borderWidth': 15 - pix.strength - blackCompensation + 'px'
            };
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

        GopixCustomElement.prototype.turn = function turn() {
            var _ref = [this.toplay, this.oponent];
            this.oponent = _ref[0];
            this.toplay = _ref[1];

            this.ea.publish('player', this.toplay);
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
                                var newStrength = thisPix.strength < this.maxStrength ? thisPix.strength + 1 : thisPix.strength;
                                var newPix = [newX, newY, newStrength];
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
            for (var i = 0; i < newPixes.length; i++) {
                var newPix = {
                    'name': this.toplay,
                    'strength': newPixes[i][2]
                };
                this.gopix[newPixes[i][1]][newPixes[i][0]] = this.copyPix(newPix);
                var $row = (0, _jquery2.default)((0, _jquery2.default)('.row')[newPixes[i][1]]);
                var $pix = (0, _jquery2.default)($row.children('.pix')[newPixes[i][0]]);
                $pix.removeClass('empty white black').addClass(this.toplay);
                $pix.css(this.pixStyle(newPix));
            }
        };

        GopixCustomElement.prototype.countPixes = function countPixes(player) {
            var self = this;
            var total = [];
            self.gopix.forEach(function (row) {
                row.forEach(function (pixel) {
                    if (pixel.name === player) {
                        total.push([row.indexOf(pixel), self.gopix.indexOf(row)]);
                    }
                });
            });
            return total;
        };

        GopixCustomElement.prototype.withinBounds = function withinBounds(xy) {
            return xy[0] >= 0 && xy[1] >= 0 && xy[0] < this.maxX && xy[1] < this.maxY;
        };

        GopixCustomElement.prototype.strength = function strength(area) {
            var strength = 0;
            area.forEach(function (xy) {
                strength += this.gopix[xy[1]][xy[0]].strength;
            });
            return strength;
        };

        GopixCustomElement.prototype.killIsolatedOponentPixes = function killIsolatedOponentPixes() {
            var self = this;

            function clearMarks() {
                self.gopix.forEach(function (row) {
                    row.forEach(function (pixel) {
                        pixel.marked = false;
                    });
                });
            }

            function markPixel(position) {
                self.gopix[position[1]][position[0]].marked = true;
            }

            function findFirstOponentPix() {
                function firstOponentPix(pix) {
                    var result = pix.name === self.oponent && !pix.marked;
                    return result;
                }

                function firstOponentRow(row) {
                    var result = row.find(firstOponentPix);
                    return result;
                }
                var startRow = self.gopix.findIndex(firstOponentRow);
                var startPix = -1;
                if (startRow > -1) {
                    startPix = self.gopix[startRow].findIndex(firstOponentPix);
                }

                return [startPix, startRow];
            }

            function getAdjacentArea(startPos) {
                var area = [startPos];
                (0, _jquery2.default)('.' + self.toplay).removeClass('red');
                (0, _jquery2.default)('.empty').removeClass('red');

                function countAdjacentPixes(startPos) {
                    self.neighbours.forEach(function (neighbour) {
                        var xy = [startPos[0] + neighbour[0], startPos[1] + neighbour[1]];
                        if (self.withinBounds(xy)) {
                            var thisPix = self.gopix[xy[1]][xy[0]];
                            if (thisPix.name === self.oponent && !thisPix.marked) {
                                markPixel(xy);
                                area.push(xy);
                                countAdjacentPixes(xy);
                            }
                        }
                    });
                }

                markPixel(startPos);
                countAdjacentPixes(startPos);


                return area;
            }

            function getAreas() {
                var areas = [];
                var totalOponentPixes = self.countPixes(self.oponent);
                var firstOponentPix = findFirstOponentPix();
                if (firstOponentPix[0] > -1) {
                    var area = getAdjacentArea(firstOponentPix);
                    areas = [area];
                    var areaCount = area.length;
                    while (areaCount < totalOponentPixes.length) {
                        firstOponentPix = findFirstOponentPix();
                        area = getAdjacentArea(firstOponentPix);
                        areas.push(area);
                        areaCount += area.length;
                    }
                }
                return areas;
            }

            function killArea(area) {
                area.forEach(function (xy) {
                    self.gopix[xy[1]][xy[0]].name = 'empty';
                    self.gopix[xy[1]][xy[0]].strength = 0;
                    var $row = (0, _jquery2.default)((0, _jquery2.default)('.row')[xy[1]]);
                    var $pix = (0, _jquery2.default)($row.children('.pix')[xy[0]]);
                    $pix.removeClass('black white').addClass('empty');
                });
            }

            function killSmallestAreas(areas) {
                var smallestArea = 0;
                var i = 1;
                while (areas.length > 1) {
                    if (areas[i].length < areas[smallestArea].length) {
                        smallestArea = i;
                    } else if (areas[i].length === areas[smallestArea].length) {
                        var smallestAreaStrength = self.strength(areas[smallestArea]);
                        var thisAreaStrength = self.strength(areas[i]);
                        if (thisAreaStrength < smallestAreaStrength) {
                            smallestArea = i;
                        }
                    }
                    killArea(areas[smallestArea]);
                    areas.splice(smallestArea, 1);
                }
            }

            clearMarks();
            var areas = getAreas();
            if (areas.length) {
                killSmallestAreas(areas);
            }
        };

        GopixCustomElement.prototype.surrounded = function surrounded(pixel) {
            var self = this;
            var surrounders = 0;
            self.neighbours.forEach(function (neighbour) {
                var xy = [pixel[0] + neighbour[0], pixel[1] + neighbour[1]];
                if (self.withinBounds(xy)) {
                    var color = self.gopix[xy[1]][xy[0]].name;
                    if (color === self.toplay) {
                        surrounders++;
                    }
                }
            });
            return surrounders;
        };

        GopixCustomElement.prototype.killEnclosedSingleOponent = function killEnclosedSingleOponent() {
            var pixels = this.countPixes(this.oponent);
            if (pixels.length === 1) {
                if (this.surrounded(pixels[0]) > 2) {
                    console.log('yo lost');
                    return true;
                }
            }
            return false;
        };

        GopixCustomElement.prototype.canMove = function canMove() {
            return true;
        };

        GopixCustomElement.prototype.step = function step(dx, dy) {
            console.clear();
            if (this.canMove(this.toplay)) {
                var newPixes = this.getNewPixes(dx, dy);
                if (newPixes.length) {
                    this.weakenPixes();
                    this.addNewPixes(newPixes);
                    this.killIsolatedOponentPixes();
                    if (this.killEnclosedSingleOponent()) {
                        console.log(this.oponent, 'no pieces');
                        this.game = 'off';
                        this.ea.publish('game', { 'type': 'win', 'player': this.toplay });
                    }
                    var pixCount = this.countPixes(this.oponent);
                    if (pixCount.length === 0) {
                        console.log(this.oponent, 'no pieces');
                        this.game = 'off';
                        this.ea.publish('game', { 'type': 'win', 'player': this.toplay });
                    }
                    this.turn();
                } else {
                    this.ea.publish('game', { 'type': 'illegal' });
                }
            } else {
                console.log(this.toplay, 'no more moves');
                this.ea.publish('game', { 'type': 'win', 'player': this.oponent });
            }
        };

        GopixCustomElement.prototype.logArray = function logArray(str, arr) {
            var arrr = arr.slice();
            console.log(str);
            for (var i = 0; i < arrr.length; i++) {
                console.table(arrr[i]);
            }
        };

        GopixCustomElement.prototype.emptyBoard = function emptyBoard() {
            (0, _jquery2.default)('.pix').removeClass('white black');
            this.gopix = [];
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
        };

        GopixCustomElement.prototype.reset = function reset() {
            this.emptyBoard();
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
            this.game = 'on';
            var newPixes = [[3, 3, 5]];
            this.addNewPixes(newPixes);
            this.turn();
            newPixes = [[7, 7, 5]];
            this.addNewPixes(newPixes);
            this.turn();
        };

        GopixCustomElement.prototype.attached = function attached() {
            this.reset();
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
            this.ea.subscribe('game', function (response) {
                switch (response.type) {
                    case 'illegal':
                        _this.setTitleText(_this.getTitleData('illegal move'));
                        break;
                    case 'win':
                        _this.setTitleText(_this.getTitleData(response.player + ' wins'));
                        break;
                    default:

                }
            });
            this.ea.subscribe('player', function (response) {
                _this.setTitleText(_this.getTitleData(response + ' plays'));
                _this.color = response;
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
                'data': [14, 31, 17, 17, 10]
            }, {
                'name': 'd',
                'data': [31, 31, 17, 17, 14]
            }, {
                'name': 'e',
                'data': [31, 31, 21, 21, 1]
            }, {
                'name': 'f',
                'data': [31, 31, 20, 20]
            }, {
                'name': 'g',
                'data': [14, 31, 17, 21, 7]
            }, {
                'name': 'h',
                'data': [31, 31, 4, 4, 15]
            }, {
                'name': 'i',
                'data': [31, 15]
            }, {
                'name': 'j',
                'data': [2, 1, 31, 30]
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
                'name': 'n',
                'data': [31, 31, 12, 6, 15]
            }, {
                'name': 'o',
                'data': [14, 31, 17, 17, 14]
            }, {
                'name': 'p',
                'data': [31, 31, 20, 20, 8]
            }, {
                'name': 'q',
                'data': [14, 31, 17, 18, 13]
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
                'name': 'u',
                'data': [30, 31, 1, 1, 30]
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
            }, {
                'name': 'z',
                'data': [17, 19, 23, 29, 25, 17]
            }];
            this.setTitleText(this.getTitleData(this.text));
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
define('components/start',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StartCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var StartCustomElement = exports.StartCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function StartCustomElement(eventAggregator) {
            var _this = this;

            _classCallCheck(this, StartCustomElement);

            this.ea = eventAggregator;
            this.showStartButton = true;
            this.ea.subscribe('game', function (response) {
                switch (response.type) {
                    case 'win':
                        _this.showStartButton = true;
                        break;
                    default:

                }
            });
        }

        StartCustomElement.prototype.startGame = function startGame() {
            this.ea.publish('game', { 'type': 'start' });
            this.showStartButton = false;
        };

        return StartCustomElement;
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
define('text!app.css', ['module'], function(module) { module.exports = "*{\n\tmargin:0; border:0; padding:0;\n}\nbody, html{\n\theight:100%;\n\tmin-height:100%;\n}\na{outline:none;}\n#container{\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n\tposition:relative;\n\tmargin:0 auto;\n\twidth:750px;\n\theight:100%;\n\tmin-height:100%;\n\tbackground-color:#E3B32D;\n\toverflow:hidden;\n}\nheader{\n\tdisplay: block;\n}\n#logo{\n\twidth:527px;\n\theight:39px;\n    margin: 15px 0;\n\tbackground-image:url(/images/logo.gif);\n\tbackground-repeat:no-repeat;\n\tbackground-size: cover;\n}\n#logo.white{\n\tbackground-position: 0 -40px;\n}\n#logo.black{\n\tbackground-position: 0 0;\n}\n"; });
define('text!components/board.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/gopix\"></require>\n    <require from=\"components/header\"></require>\n\t<div id=\"container\">\n\t\t<!-- <div id=\"logo\" class.bind=\"player\"></div> -->\n        <header></header>\n\t\t<gopix id=\"gopix\"></gopix>\n\t</div>\n</template>\n"; });
define('text!components/board.css', ['module'], function(module) { module.exports = ""; });
define('text!components/gopix.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/start\"></require>\n    <require from=\"components/gopix.css\"></require>\n    <div class=\"row\" repeat.for = \"row of gopix\">\n        <span\n            repeat.for=\"pix of row\"\n            class.one-time=\"pix.name\"\n            style.one-time=\"pixStyle(pix)\"\n            class=\"pix\"></span>\n    </div>\n    <start class=\"startButton\"></start>\n</template>\n"; });
define('text!components/gopix.css', ['module'], function(module) { module.exports = "#gopix {\n\tposition: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    width: 527px;\n    height: 527px;\n}\n\n.row {\n    flex: 0 0 47px;\n    display: flex;\n    justify-content: space-between;\n}\n\n.pix {\n    width: 47px;\n    height: 47px;\n    max-width: 47px;\n    max-height: 47px;\n    box-sizing: border-box;\n    border-radius: 3px;\n    border: 13px solid #3d89d9;\n    background-color: #3d89d9;\n    transition: all .2s;\n}\n.pix.red{\n    border: 1px solid red;\n}\n\n.pix:before {\n    content: '';\n    display: block;\n    box-sizing: border-box;\n    border-radius: 25px;\n    border: 2px solid transparent;\n    transition: all .2s;\n    position: relative;\n}\n\n.pix:not(.empty):before {\n    width: 100%;\n    height: 100%;\n}\n\n.pix.black:before {\n    border-color: rgba(0, 0, 0, 0.6);\n    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 1), inset 0 0 20px 0px rgba(0, 0, 0, 0.7);\n}\n\n.pix.white:before {\n    border-width: 3px;\n    border-color: rgba(255, 255, 255, 0.5);\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 1), inset 0 0 20px 0px rgba(255, 255, 255, 0.7);\n}\n"; });
define('text!components/header.css', ['module'], function(module) { module.exports = ".titleBar {\n    width: 527px;\n    height: 39px;\n    margin: 30px 0;\n    display: flex;\n}\n\n.pixelCol {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n}\n\n.pixelCol+.pixelCol {\n    margin-left: 1px;\n}\n\n.pixel {\n    width: 7px;\n    height: 7px;\n    border-radius: 4px;\n    transition: all 1s;\n}\n\n.pixel:not(.off) {\n    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .5);\n}\n\n.white .pixel.on {\n    background-color: #fff;\n}\n\n.black .pixel.on {\n    background-color: #000;\n}\n\n.pixel.off {\n    background-color: transparent;\n}\n"; });
define('text!components/header.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/header.css\"></require>\n    <div class=\"titleBar\" class.bind=\"color\">\n        <div class=\"pixelCol\" repeat.for=\"col of titleData\">\n            <div class=\"pixel\" repeat.for=\"pixel of col\" class.bind=\"pixel == 1 ? 'on' : 'off'\">\n\n            </div>\n        </div>\n    </div>\n</template>\n"; });
define('text!components/start.css', ['module'], function(module) { module.exports = ".startButton{\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, .6);\n    border-radius: 3px;\n    transition: all .3s ease;\n}\n.startButton.hide{\n    opacity: 0;\n    pointer-events: none;\n}\n.startButton button{\n    width: 100%;\n    height: 100%;\n    background-color: transparent;\n    background-image: url(/images/pijltjes.png);\n    background-position: center center;\n    background-repeat: no-repeat;\n    cursor: pointer;\n}\n"; });
define('text!components/start.html', ['module'], function(module) { module.exports = "<template class.bind=\"showStartButton ? '' : 'hide'\">\n    <require from=\"components/start.css\"></require>\n    <button click.trigger=\"startGame()\" aria-hidden=\"true\"></button>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map