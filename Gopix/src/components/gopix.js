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

        this.toplay = 'white';
        this.oponent = 'black';

        this.maxX = 33;
        this.maxY = 33;

        this.maxStrength = 33;

        this.playerStrength = {
            'white': 3,
            'black': 3
        }

        this.gopix = [];

        this.pixStyle = function(pix) {
            let style = "";
            let borderWidth = Math.floor(pix.strength / 8);
            let opacity = pix.strength / this.maxStrength;
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
                'background' : 'linear-gradient(' +
                    'rgba(' + bgR + ', ' + bgG + ', ' + bgB + ', ' + opacity + '),' +
                    'rgba(' + bgR + ', ' + bgG + ', ' + bgB + ', ' + opacity + ')' +
                '),' +
                'url(/images/pix.gif)',
                'borderWidth': borderWidth + 'px'
            }
            // console.log(style);
            return style;
        }

        this.turn = function() {
            if (this.playerStrength[this.toplay] < this.maxStrength) {
                this.playerStrength[this.toplay]++
            }
            console.log(this.playerStrength);
            // switch color
            let temp = this.oponent;
            this.oponent = this.toplay;
            this.toplay = temp;
            this.ea.publish('player', this.toplay);
        }

        this.move = function(direction) {
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
            this.turn();
        }

        this.getNewPixes = function(dx, dy) {
            let newPixes = [];
            for (let y = 0; y < this.maxY; y++) {
                for (let x = 0; x < this.maxX; x++) {
                    let thisPix = this.gopix[y][x];
                    if (thisPix.name === this.toplay) {
                        if (thisPix.strength > this.playerStrength[this.toplay] / 4) {
                            let newX = (x + dx + this.maxX) % this.maxX;
                            let newY = (y + dy + this.maxY) % this.maxY;
                            let newPix = [newX,newY];
                            if (this.gopix[newY][newX].name == 'empty') {
                                newPixes.push(newPix);
                            }
                            if ((this.gopix[newY][newX].name == this.oponent) &&
                                (this.gopix[newY][newX].strength < thisPix.strength)) {
                                newPixes.push(newPix);
                            }
                        }
                    }
                }
            }
            return newPixes;
        }

        this.weakenPixes = function() {
            for (let y = 0; y < this.maxY; y++) {
                for (let x = 0; x < this.maxX; x++) {
                    let thisPix = this.gopix[y][x];
                    if (thisPix.name !== this.oponent) {
                        let $row = $($('.row')[y]);
                        let $pix = $($row.children('.pix')[x]);
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
        }

        this.drawNewPixes = function(newPixes){
            let newPix = {
                "name": this.toplay,
                "strength": this.playerStrength[this.toplay]
            }
            for (var i = 0; i < newPixes.length; i++) {
                this.gopix[newPixes[i][1]][newPixes[i][0]] = newPix;
                let $row = $($('.row')[newPixes[i][1]]);
                let $pix = $($row.children('.pix')[newPixes[i][0]]);
                $pix.removeClass('empty white black').addClass(this.toplay);
                $pix.css(this.pixStyle(newPix));
            }
        }

        this.step = function(dx, dy) {
            let newPixes = this.getNewPixes(dx, dy);
            console.log(newPixes);
            this.weakenPixes();
            this.drawNewPixes(newPixes);
        }

        // setup the board
        this.reset = function() {
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
            this.gopix[11][11] = {
                "name": "white",
                "strength": this.playerStrength['white']
            };
            this.gopix[21][21] = {
                "name": "black",
                "strength": this.playerStrength['black']
            };
        };

        this.reset();
    }

    // pixClass = function(pix) {
    //     return pix.name;
    // }
    //
    // pixStyle = function(pix) {
    //     this.pixStyle(pix);
    // }
}
