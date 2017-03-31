import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import $ from 'jquery';

@inject(EventAggregator)
export class GopixCustomElement {

    constructor(eventAggregator) {

        this.ea = eventAggregator;

        this.ea.subscribe('keyPressed', response => {
            this.move(response);
        });
        this.ea.subscribe('game', response => {
            switch (response.type) {
                case 'start':
                    // this.emptyBoard();
                    this.reset();
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
        }

        this.gopix = [];

        this.neighbours = [[0, -1],[1, 0],[0, 1],[-1, 0]];

    }

    pixStyle(pix) {
        let blackCompensation = (pix.name === 'black') ? 1 : 0;
        return {
            'borderWidth': (15 - pix.strength - blackCompensation) + 'px'
        };
    }

    move(direction) {
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
    }

    turn() {
        [this.oponent, this.toplay] = [this.toplay, this.oponent];
    }

    getNewPixes(dx, dy) {
        let newPixes = [];
        let abortMove = false;
        for (let y = 0; y < this.maxY; y++) {
            for (let x = 0; x < this.maxX; x++) {
                let thisPix = this.gopix[y][x];
                var newX = x + dx;
                var newY = y + dy;
                if (!(newX < 0 || newX >= this.maxX || newY < 0 || newY >= this.maxY)) {
                    let targetPix = this.gopix[newY][newX];
                    if (thisPix.name === this.toplay && targetPix.name !== this.toplay) {
                        if (thisPix.strength >= targetPix.strength) {
                            let newStrength = thisPix.strength + targetPix.strength + this.gainStrength;
                            newStrength = newStrength > this.maxStrength ? this.maxStrength : newStrength;
                            let newPix = [newX, newY, newStrength];
                            newPixes.push(newPix);
                        }
                    }
                }
            }
        }
        return newPixes;
    }

    copyPix(pix) {
        return {
            'name': pix.name,
            'strength': pix.strength
        }
    }

    weakenPixes() {
        // prevent copying by reference
        for (let y = 0; y < this.maxY; y++) {
            for (let x = 0; x < this.maxX; x++) {
                let thisPix = this.copyPix(this.gopix[y][x]);
                if (thisPix.name === this.toplay) {
                    let $row = $($('.row')[y]);
                    let $pix = $($row.children('.pix')[x]);
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
    }

    addNewPixes(newPixes) {
        for (var i = 0; i < newPixes.length; i++) {
            let newPix = {
                'name': this.toplay,
                'strength': newPixes[i][2]
            }
            this.gopix[newPixes[i][1]][newPixes[i][0]] = this.copyPix(newPix);
            let $row = $($('.row')[newPixes[i][1]]);
            let $pix = $($row.children('.pix')[newPixes[i][0]]);
            $pix.removeClass('empty white black').addClass(this.toplay);
            $pix.css(this.pixStyle(newPix));
        }
    }

    countPixes(player) {
        let self = this;
        let total = [];
        self.gopix.forEach(function(row) {
            row.forEach(function(pixel) {
                if (pixel.name === player) {
                    total.push([row.indexOf(pixel), self.gopix.indexOf(row)])
                }
            });
        });
        return total;
    }

    withinBounds(xy) {
        return xy[0]>=0 && xy[1]>=0 && xy[0]<this.maxX && xy[1]<this.maxY;
    }

    strength(area) {
        let self = this;
        let strength = 0;
        area.forEach(function(xy) {
            strength += self.gopix[xy[1]][xy[0]].strength;
        });
        return strength;
    }

    killIsolatedOponentPixes() {
        let self = this;

        function clearMarks() {
            self.gopix.forEach(function(row) {
                row.forEach(function(pixel) {
                    pixel.marked = false;
                })
            });
        }

        function markPixel(position) {
            self.gopix[position[1]][position[0]].marked = true;
            // let $row = $($('.row')[position[1]]);
            // let $pix = $($row.children('.pix')[position[0]]);
            // $pix.addClass('red');
        }

        function findFirstOponentPix() {
            function firstOponentPix(pix) {
                let result = (pix.name === self.oponent && !pix.marked);
                return result;
            }

            function firstOponentRow(row) {
                let result = row.find(firstOponentPix);
                return result;
            }
            let startRow = self.gopix.findIndex(firstOponentRow);
            let startPix = -1;
            if (startRow > -1) {
                startPix = self.gopix[startRow].findIndex(firstOponentPix);
            }

            return [startPix, startRow];
        }

        function getAdjacentArea(startPos) {
            let area = [startPos];
            $('.'+self.toplay).removeClass('red');
            $('.empty').removeClass('red');

            function countAdjacentPixes(startPos) {
                self.neighbours.forEach(function (neighbour) {
                    let xy = [startPos[0] + neighbour[0], startPos[1] + neighbour[1]];
                    if (self.withinBounds(xy)) {
                        let thisPix = self.gopix[xy[1]][xy[0]];
                        if (thisPix.name === self.oponent && !thisPix.marked) {
                            markPixel(xy)
                            area.push(xy);
                            countAdjacentPixes(xy);
                        }
                    }
                });
            }

            markPixel(startPos);
            countAdjacentPixes(startPos);
            // self.logArray('counts cleared', self.gopix);

            return area;
        }

        function getAreas() {
            let areas = [];
            let totalOponentPixes = self.countPixes(self.oponent);
            let firstOponentPix = findFirstOponentPix();
            if (firstOponentPix[0] > -1) {
                let area = getAdjacentArea(firstOponentPix);
                areas = [area];
                let areaCount = area.length;
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
            area.forEach(function(xy) {
                self.gopix[xy[1]][xy[0]].name = 'empty';
                self.gopix[xy[1]][xy[0]].strength = 0;
                let $row = $($('.row')[xy[1]]);
                let $pix = $($row.children('.pix')[xy[0]]);
                $pix.removeClass('black white').addClass('empty');
            });
        }

        function killSmallestAreas(areas) {
            let smallestArea = 0;
            let i = 1;
            while (areas.length > 1) {
                if (areas[i].length < areas[smallestArea].length) {
                    smallestArea = i;
                }
                else if (areas[i].length === areas[smallestArea].length) {
                    // You can't call the same function in the if comparison CHECK!!
                    let smallestAreaStrength = self.strength(areas[smallestArea]);
                    let thisAreaStrength = self.strength(areas[i]);
                    if (thisAreaStrength < smallestAreaStrength) {
                        smallestArea = i;
                    }
                }
                killArea(areas[smallestArea]);
                areas.splice(smallestArea, 1);
            }
        }

        clearMarks();
        let areas = getAreas()
        if (areas.length) {
            killSmallestAreas(areas);
        }

    }

    surrounded(pixel) {
        let self = this;
        let surrounders = 0;
        self.neighbours.forEach(function(neighbour){
            let xy = [pixel[0] + neighbour[0], pixel[1] + neighbour[1]];
            if (self.withinBounds(xy)) {
                let color = self.gopix[xy[1]][xy[0]].name;
                if (color === self.toplay) {
                    surrounders++;
                }
            } else {
                surrounders++;
            }
        });
        return surrounders;
    }

    killEnclosedSingleOponent() {
        let pixels = this.countPixes(this.oponent);
        if (pixels.length === 1) {
            if (this.surrounded(pixels[0]) > 3) {
                console.log('yo lost');
                return true;
            }
        }
        return false;
    }

    canMove() {
        // TODO implementeren
        return true;
    }

    step(dx, dy) {
        console.clear();
        if (this.canMove(this.toplay)) {
            let newPixes = this.getNewPixes(dx, dy);
            if (newPixes.length) {
                this.weakenPixes();
                this.addNewPixes(newPixes);
                this.killIsolatedOponentPixes();
                if (this.killEnclosedSingleOponent()) {
                    // console.log(this.oponent, 'no pieces');
                    this.game = 'off';
                    this.ea.publish('game', {'type' : 'win', 'player' : this.toplay});
                }
                let pixCount = this.countPixes(this.oponent);
                if (pixCount.length === 0) {
                    // console.log(this.oponent, 'no pieces');
                    this.game = 'off';
                    this.ea.publish('game', {'type' : 'win', 'player' : this.toplay});
                }
                this.turn();
                this.ea.publish('player', this.toplay);
            } else {
                this.ea.publish('game', {'type' : 'illegal'});
            }
        } else {
            // console.log(this.toplay, 'no more moves');
            this.ea.publish('game', {'type' : 'win', 'player' : this.oponent});
        }
    }

    logArray(str, arr) {
        let arrr = arr.slice();
        console.log(str);
        for (var i = 0; i < arrr.length; i++) {
            console.table(arrr[i]);
        }
    }

    emptyBoard() {
        $('.pix').removeClass('white black');
        this.gopix = [];
        let newPix = {
            "name": "empty",
            "strength": 0
        }
        for (let y = 0; y < this.maxX; y++) {
            this.gopix.push([]);
            for (let x = 0; x < this.maxY; x++) {
                this.gopix[y].push(newPix);
            }
        }
    }

    // setup the board
    reset() {
        this.emptyBoard();
        if (this.toplay === 'black') {
            this.turn();
        }
        this.gopix[3][3] = {
            "name": "white",
            "strength": this.playerStrength['white']
        };
        this.gopix[7][7] = {
            "name": "black",
            "strength": this.playerStrength['black']
        };
        this.setup();
    }

    setup() {
        this.game = 'on';
        let newPixes = [
            [3, 3, 5]
        ];
        this.addNewPixes(newPixes);
        this.turn();
        newPixes = [
            [7, 7, 5]
        ];
        this.addNewPixes(newPixes);
        this.turn();
    }

    attached() {
        this.reset();
        // this.setup();
    }

}
