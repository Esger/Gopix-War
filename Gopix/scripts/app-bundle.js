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
            this.message = 'Gopix War';
            this.keys = {
                'left': 37,
                'up': 38,
                'right': 39,
                'down': 40
            };
            this.scale = "";
            this.touchEvent = {
                'startX': null,
                'startY': null,
                'endX': null,
                'endY': null
            };
        }

        App.prototype.handleSwipe = function handleSwipe() {
            var thresHold = 50;
            var startX = this.touchEvent.startX;
            var startY = this.touchEvent.startY;
            var dX = this.touchEvent.endX - this.touchEvent.startX;
            var dY = this.touchEvent.endY - this.touchEvent.startY;
            var vertical = Math.abs(dX) < Math.abs(dY);
            var horizontal = Math.abs(dX) > Math.abs(dY);
            var left = dX < -thresHold && Math.abs(dY) < thresHold;
            var right = dX > thresHold && Math.abs(dY) < thresHold;
            var up = dY < -thresHold && Math.abs(dX) < thresHold;
            var down = dY > thresHold && Math.abs(dX) < thresHold;
            if (vertical) {
                if (up) {
                    this.ea.publish('keyPressed', "up");
                }
                if (down) {
                    this.ea.publish('keyPressed', "down");
                }
            }
            if (horizontal) {
                if (left) {
                    this.ea.publish('keyPressed', "left");
                }
                if (right) {
                    this.ea.publish('keyPressed', "right");
                }
            }
        };

        App.prototype.activate = function activate() {
            var self = this;

            document.addEventListener('keydown', self.handleKeyInput, true);

            (0, _jquery2.default)('body').on('touchstart', function (event) {
                if (self.listen2keys) {
                    self.touchEvent.startX = event.originalEvent.touches[0].clientX;
                    self.touchEvent.startY = event.originalEvent.touches[0].clientY;
                }
            });
            (0, _jquery2.default)('body').on('touchend', function (event) {
                if (self.listen2keys) {
                    self.touchEvent.endX = event.originalEvent.changedTouches[0].clientX;
                    self.touchEvent.endY = event.originalEvent.changedTouches[0].clientY;
                    self.handleSwipe();
                }
            });
        };

        App.prototype.deactivate = function deactivate() {
            document.removeEventListener('keydown', this.handleKeyInput);
            (0, _jquery2.default)('body').off('touchstart');
            (0, _jquery2.default)('body').off('touchend');
        };

        App.prototype.getScale = function getScale() {
            var screenWidth = (0, _jquery2.default)("html").width();
            var boardWidth = (0, _jquery2.default)("#gopix").width();
            var scale = Math.min(screenWidth / boardWidth, 1);

            scale = Math.floor(scale * 10) / 10;
            this.scale = scale;
            return {
                'transformOrigin': 'top',
                '-webkit-transform': 'scale(' + scale + ', ' + scale + ')',
                '-ms-transform': 'scale(' + scale + ', ' + scale + ')',
                'transform': 'scale(' + scale + ', ' + scale + ')'
            };
        };

        App.prototype.setSize = function setSize() {
            this.scale = this.getScale();
            (0, _jquery2.default)('board').css(this.scale);
        };

        App.prototype.attached = function attached() {
            this.setSize();
            document.addEventListener('resize', this.setSize, true);
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
define('components/footer',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FooterCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var FooterCustomElement = exports.FooterCustomElement = function () {
        function FooterCustomElement(eventAggregator) {
            _classCallCheck(this, FooterCustomElement);

            this.showHelpButton = true;
            this.showHideButton = false;
            this.showHelpText = false;
        }

        FooterCustomElement.prototype.toggleHelp = function toggleHelp() {
            this.showHelpButton = !this.showHelpButton;
            this.showHideButton = !this.showHideButton;
            this.showHelpText = !this.showHelpText;
        };

        return FooterCustomElement;
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
                        _this.reset();
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
            this.gainStrength = 0;

            this.playerStrength = {
                'white': 5,
                'black': 5
            };

            this.gopix = [];

            this.neighbours = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        }

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

        GopixCustomElement.prototype.switchSides = function switchSides() {
            var _ref = [this.toplay, this.oponent];
            this.oponent = _ref[0];
            this.toplay = _ref[1];
        };

        GopixCustomElement.prototype.onBoard = function onBoard(xy) {
            return xy[0] >= 0 && xy[1] >= 0 && xy[0] < this.maxX && xy[1] < this.maxY;
        };

        GopixCustomElement.prototype.getNewPixes = function getNewPixes(dx, dy) {
            var newPixes = [];
            var abortMove = false;
            for (var y = 0; y < this.maxY; y++) {
                for (var x = 0; x < this.maxX; x++) {
                    var thisPix = this.gopix[y][x];
                    var newX = x + dx;
                    var newY = y + dy;
                    if (this.onBoard([newX, newY])) {
                        var targetPix = this.gopix[newY][newX];
                        if (thisPix.name === this.toplay) {
                            if (targetPix.name !== this.toplay) {
                                if (targetPix.name == 'lemon') {
                                    var newStrength = thisPix.strength + targetPix.energy + this.gainStrength;
                                    newStrength = newStrength > this.maxStrength ? this.maxStrength : newStrength;
                                    var newPix = [newX, newY, newStrength];
                                    newPixes.push(newPix);
                                } else {
                                    if (thisPix.strength > targetPix.strength) {
                                        var _newStrength = thisPix.strength + targetPix.strength + this.gainStrength;
                                        _newStrength = _newStrength > this.maxStrength ? this.maxStrength : _newStrength;
                                        var _newPix = [newX, newY, _newStrength];
                                        newPixes.push(_newPix);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return newPixes;
        };

        GopixCustomElement.prototype.pixStyle = function pixStyle(pix) {
            var blackCompensation = pix.name === 'black' ? 1 : 0;
            return {
                'borderWidth': 15 - pix.strength - blackCompensation + 'px'
            };
        };

        GopixCustomElement.prototype.copyPix = function copyPix(pix) {
            return JSON.parse(JSON.stringify(pix));
        };

        GopixCustomElement.prototype.updatePix = function updatePix($pix, pix) {
            $pix.css(this.pixStyle(pix));
            $pix.attr('data-strength', pix.strength || 0);
            $pix.removeClass().addClass(pix.name + ' pix');
        };

        GopixCustomElement.prototype.updateScreen = function updateScreen() {
            for (var y = 0; y < this.gopix.length; y++) {
                for (var x = 0; x < this.gopix.length; x++) {
                    var thisPix = this.gopix[y][x];
                    var $row = (0, _jquery2.default)((0, _jquery2.default)('.row')[y]);
                    var $pix = (0, _jquery2.default)($row.children('.pix')[x]);
                    this.updatePix($pix, thisPix);
                }
            }
        };

        GopixCustomElement.prototype.getPixes = function getPixes(type) {
            var self = this;
            var total = [];
            self.gopix.forEach(function (row) {
                row.forEach(function (pixel) {
                    if (pixel.name === type) {
                        total.push([row.indexOf(pixel), self.gopix.indexOf(row)]);
                    }
                });
            });
            return total;
        };

        GopixCustomElement.prototype.weakenPixes = function weakenPixes() {
            for (var y = 0; y < this.maxY; y++) {
                for (var x = 0; x < this.maxX; x++) {
                    var thisPix = this.copyPix(this.gopix[y][x]);
                    if (thisPix.name === this.toplay) {
                        if (thisPix.strength) {
                            thisPix.strength--;
                        }
                        if (thisPix.strength === 0) {
                            thisPix.name = 'empty';
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
            }
        };

        GopixCustomElement.prototype.addFruit = function addFruit() {
            var maxEnergy = 5;
            var maxFruit = 90;
            var fruit = {
                'name': 'lemon',
                'strength': 0,
                'energy': Math.ceil(5 * Math.random())
            };
            var fruitCount = this.getPixes(fruit.name).length;
            if (fruitCount < maxFruit) {
                var y = Math.floor(this.gopix.length * Math.random());
                var x = Math.floor(this.gopix[0].length * Math.random());
                if (this.gopix[y][x].name == 'empty') {
                    this.gopix[y][x] = this.copyPix(fruit);
                }
            }
        };

        GopixCustomElement.prototype.strength = function strength(area) {
            var self = this;
            var strength = 0;
            area.forEach(function (xy) {
                strength += self.gopix[xy[1]][xy[0]].strength;
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

                function countAdjacentPixes(startPos) {
                    self.neighbours.forEach(function (neighbour) {
                        var xy = [startPos[0] + neighbour[0], startPos[1] + neighbour[1]];
                        if (self.onBoard(xy)) {
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
                var totalOponentPixes = self.getPixes(self.oponent);
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

        GopixCustomElement.prototype.surrounders = function surrounders(pixel) {
            var self = this;
            var surrounders = 0;
            self.neighbours.forEach(function (neighbour) {
                var xy = [pixel[0] + neighbour[0], pixel[1] + neighbour[1]];
                if (self.onBoard(xy)) {
                    var color = self.gopix[xy[1]][xy[0]].name;
                    if (color === self.toplay) {
                        surrounders++;
                    }
                } else {
                    surrounders++;
                }
            });
            return surrounders;
        };

        GopixCustomElement.prototype.killEnclosedSingleOponent = function killEnclosedSingleOponent() {
            var pixels = this.getPixes(this.oponent);
            if (pixels.length === 1) {
                if (this.surrounders(pixels[0]) > 3) {
                    console.log('yo lost');
                    return true;
                }
            }
            return false;
        };

        GopixCustomElement.prototype.canMove = function canMove() {
            var self = this;
            var openAdjacentSpaces = 0;
            self.neighbours.forEach(function (direction) {
                openAdjacentSpaces += self.getNewPixes(direction[0], direction[1]).length;
            });
            return openAdjacentSpaces > 0;
        };

        GopixCustomElement.prototype.step = function step(dx, dy) {
            console.clear();
            if (this.canMove()) {
                var newPixes = this.getNewPixes(dx, dy);
                if (newPixes.length) {
                    this.weakenPixes();
                    this.addNewPixes(newPixes);
                    this.killIsolatedOponentPixes();
                    if (this.killEnclosedSingleOponent()) {
                        this.game = 'off';
                        this.ea.publish('game', {
                            'type': 'win',
                            'player': this.toplay
                        });
                    }
                    var pixCount = this.getPixes(this.oponent);
                    if (pixCount.length === 0) {
                        this.game = 'off';
                        this.ea.publish('game', {
                            'type': 'win',
                            'player': this.toplay
                        });
                    }
                    this.switchSides();
                    this.ea.publish('player', this.toplay);
                } else {
                    this.ea.publish('game', {
                        'type': 'illegal'
                    });
                }
            } else {
                this.ea.publish('game', {
                    'type': 'win',
                    'player': this.oponent
                });
            }
            this.addFruit();
            this.updateScreen();
        };

        GopixCustomElement.prototype.logArray = function logArray(str, arr) {
            var arrr = arr.slice();
            console.log(str);
            for (var i = 0; i < arrr.length; i++) {
                console.table(arrr[i]);
            }
        };

        GopixCustomElement.prototype.emptyBoard = function emptyBoard() {
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
            var newPixes = [[3, 3, this.playerStrength['white']]];
            this.emptyBoard();
            this.game = 'on';
            if (this.toplay === 'black') {
                this.switchSides();
            }
            this.addNewPixes(newPixes);
            this.switchSides();
            newPixes = [[7, 7, this.playerStrength['black']]];
            this.addNewPixes(newPixes);
            this.switchSides();
            this.updateScreen();
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
            this.keepMoving = true;
            this.ea.subscribe('game', function (response) {
                switch (response.type) {
                    case 'illegal':
                        _this.setTitleText(_this.getTitleData('no can do'));
                        break;
                    case 'win':
                        _this.keepMoving = false;
                        _this.setTitleText(_this.getTitleData(response.player + ' wins'));
                        break;
                    case 'start':
                        _this.reset();
                        break;
                    default:

                }
            });
            this.ea.subscribe('player', function (response) {
                if (_this.keepMoving) {
                    _this.setTitleText(_this.getTitleData(response + ' plays'));
                    _this.color = response;
                }
            });
            this.text = 'gopix war';
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
                'data': [29, 29, 21, 23, 7]
            }, {
                'name': 't',
                'data': [16, 16, 31, 31, 16]
            }, {
                'name': 'u',
                'data': [30, 31, 1, 1, 30]
            }, {
                'name': 'v',
                'data': [28, 6, 1, 6, 28]
            }, {
                'name': 'w',
                'data': [16, 28, 7, 2, 7, 28]
            }, {
                'name': 'x',
                'data': [17, 26, 12, 6, 11, 17]
            }, {
                'name': 'y',
                'data': [16, 25, 14, 4, 8]
            }, {
                'name': 'z',
                'data': [17, 19, 23, 29, 25, 17]
            }];
            this.setTitleText(this.getTitleData(this.text));
        }

        HeaderCustomElement.prototype.reset = function reset() {
            this.color = 'white';
            this.keepMoving = true;
            this.setTitleText(this.getTitleData(this.color + ' plays'));
        };

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
            this.ea.publish('game', { 'type': 'start', 'player': 'white' });
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"reset.css\"></require>\n    <require from=\"app.css\"></require>\n    <require from=\"components/board\"></require>\n    <board></board>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "* {\n    margin: 0;\n    border: 0;\n    padding: 0;\n}\n\nhtml,\nbody {\n\tposition: fixed;\n    height: 100vh;\n    width: 100vw;\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: flex-start;\n    background-color: #E3B32D;\n}\n\nbody {\n    -webkit-overflow-scrolling: touch;\n}\n\na {\n    outline: none;\n}\n\n#container {\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n    position: relative;\n    margin: 0 auto;\n    width: 527px;\n    min-height: 100vh;\n    overflow: hidden;\n}\n\nheader {\n    display: block;\n}\n\n#logo {\n    width: 527px;\n    height: 39px;\n    margin: 15px 0;\n    background-image: url(../images/logo.gif);\n    background-repeat: no-repeat;\n    background-size: cover;\n}\n\n#logo.white {\n    background-position: 0 -40px;\n}\n\n#logo.black {\n    background-position: 0 0;\n}\n"; });
define('text!components/board.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/header\"></require>\n    <require from=\"components/gopix\"></require>\n    <require from=\"components/footer\"></require>\n\t<div id=\"container\">\n        <header></header>\n\t\t<gopix id=\"gopix\"></gopix>\n        <footer></footer>\n\t</div>\n</template>\n"; });
define('text!reset.css', ['module'], function(module) { module.exports = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nol, ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}"; });
define('text!components/footer.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/footer.css\"></require>\n    <button if.bind=\"showHelpButton\" click.delegate=\"toggleHelp()\">?</button>\n    <button if.bind=\"showHideButton\" click.delegate=\"toggleHelp()\">&times;</button>\n    <div if.bind=\"showHelpText\" class=\"helpTekst\">\n        <ul>\n            <li>Click or tap the board to start game</li>\n            <li>Move by using the arrow keys or by swiping</li>\n            <li>Catch oponent or lemons to gain strength</li>\n            <li>Larger attacker wins from defender</li>\n            <li>Separated groups of pieces are lost</li>\n            <li>Last single enclosed piece is lost</li>\n        </ul>\n    </div>\n    <h2 class=\"ashWareLink\"><a href=\"http://www.ashware.nl\" target=\"_blank\">&copy;&nbsp;ashWare</a></h2>\n</template>\n"; });
define('text!components/board.css', ['module'], function(module) { module.exports = ""; });
define('text!components/footer.css', ['module'], function(module) { module.exports = ":focus {\n    outline: 0;\n}\n\nfooter {\n    font-family: 'Trebuchet MS', Roboto, sans-serif;\n    flex: 1 1 50vh;\n    align-self: stretch;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    text-shadow: 0 0 1px #000;\n}\n\nbutton {\n    align-self: flex-end;\n    width: 46px;\n    height: 46px;\n    background-color: transparent;\n    font-size: 30px;\n    line-height: 46px;\n    color: #fff;\n    cursor: pointer;\n}\n\n.helpTekst {\n    font-weight: bold;\n    font-size: 21px;\n    line-height: 27px;\n    color: #fff;\n    text-shadow: 0 0 1px #000;\n    margin-top: 30px;\n}\n\n.helpTekst ul {\n    list-style-type: disc;\n    margin-left: 30px;\n}\n\n.ashWareLink {\n    height: 46px;\n    line-height: 46px;\n}\n\n.ashWareLink a {\n    color: #fff;\n}\n"; });
define('text!components/gopix.css', ['module'], function(module) { module.exports = "#gopix {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    width: 526px;\n    height: 526px;\n}\n\n.row {\n    flex: 0 0 46px;\n    display: flex;\n    justify-content: space-between;\n}\n\n.pix {\n    font-size: 8px;\n\tcolor: #fff;\n    width: 46px;\n    height: 46px;\n    max-width: 46px;\n    max-height: 46px;\n    box-sizing: border-box;\n    border-radius: 3px;\n    border: 13px solid #3d89d9;\n    background-color: #3d89d9;\n    transition: all .2s;\n}\n\n.pix.red {\n    border: 1px solid red;\n}\n\n.pix::before {\n    content: '';\n    display: block;\n    box-sizing: border-box;\n    border-radius: 25px;\n    border: 2px solid transparent;\n    transition: all .2s;\n    position: relative;\n}\n\n.pix:not(.empty)::before {\n    width: 100%;\n    height: 100%;\n}\n\n.pix.black:before {\n    border-color: rgba(0, 0, 0, 0.6);\n    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 1), inset 0 0 20px 0px rgba(0, 0, 0, 0.7);\n}\n\n.pix.white:before {\n    border-width: 3px;\n    border-color: rgba(255, 255, 255, 0.5);\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 1), inset 0 0 20px 0px rgba(255, 255, 255, 0.7);\n}\n\n.pix.lemon {\n    border-width: 14px;\n}\n\n.pix.lemon::before {\n    -webkit-transform: rotate(55deg);\n    -ms-transform: rotate(55deg);\n    transform: rotate(55deg);\n    border-width: 0;\n    border-color: yellow;\n    border-radius: 15px 6px 15px 3px;\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 1), inset -6px -4px 15px #E3B32D;\n    background-color: lightgoldenrodyellow;\n}\n"; });
define('text!components/gopix.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/start\"></require>\n    <require from=\"components/gopix.css\"></require>\n    <div class=\"row\" repeat.for = \"row of gopix\">\n        <span\n            repeat.for=\"pix of row\"\n            class.one-time=\"pix.name\"\n            style.one-time=\"pixStyle(pix)\"\n            class=\"pix\"></span>\n    </div>\n    <start class=\"startButton\"></start>\n</template>\n"; });
define('text!components/header.css', ['module'], function(module) { module.exports = ".titleBar {\n    width: 527px;\n    height: 39px;\n    margin: 30px 0;\n    display: flex;\n}\n\n.pixelCol {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n}\n\n.pixelCol+.pixelCol {\n    margin-left: 1px;\n}\n\n.pixel {\n    width: 7px;\n    height: 7px;\n    border-radius: 4px;\n    transition: all 1s;\n}\n\n.pixel:not(.off) {\n    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .5);\n}\n\n.white .pixel.on {\n    background-color: #fff;\n}\n\n.black .pixel.on {\n    background-color: #000;\n}\n\n.pixel.off {\n    background-color: transparent;\n}\n"; });
define('text!components/header.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/header.css\"></require>\n    <div class=\"titleBar\" class.bind=\"color\">\n        <div class=\"pixelCol\" repeat.for=\"col of titleData\">\n            <div class=\"pixel\" repeat.for=\"pixel of col\" class.bind=\"pixel == 1 ? 'on' : 'off'\"></div>\n        </div>\n    </div>\n</template>\n"; });
define('text!components/start.html', ['module'], function(module) { module.exports = "<template class.bind=\"showStartButton ? '' : 'hide'\">\n    <require from=\"components/start.css\"></require>\n    <button click.trigger=\"startGame()\" aria-hidden=\"true\"></button>\n</template>\n"; });
define('text!components/start.css', ['module'], function(module) { module.exports = ".startButton{\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, .6);\n    border-radius: 3px;\n    transition: all .3s ease;\n}\n.startButton.hide{\n    opacity: 0;\n    pointer-events: none;\n}\n.startButton button{\n    width: 100%;\n    height: 100%;\n    background-color: transparent;\n    background-image: url(./../images/pijltjes.png);\n    background-position: center center;\n    background-repeat: no-repeat;\n    cursor: pointer;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map