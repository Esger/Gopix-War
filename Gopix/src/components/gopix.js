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
        this.move = function(direction) {
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
        }
        this.duplicate = function(dx, dy) {
            let newPixes = [];
            let maxY = this.gopix.length;
            let maxX = this.gopix[0].length;
            // let currentColorPixes = [];
            // Gather pixes of current color with cycles = 3
            for (let y = 0; y < maxY; y++) {
                for (let x = 0; x < maxX; x++) {
                    let thisPix = this.gopix[y][x];
                    if (thisPix.name === this.toplay) {
                        // currentColorPixes.push(thisPix);
                        let $row = $($('.row')[y]);
                        let $pix = $($row.children('.pix')[x]);

                        if (thisPix.cycles > 3) {
                            newPixes.push([
                                [(x + dx + maxX) % maxX],
                                [(y + dy + maxY) % maxY]
                            ]);
                        }
                        if (thisPix.cycles > 0) {
                            thisPix.cycles--;
                            $pix.addClass('shade'+thisPix.cycles);
                        }
                        if (thisPix.cycles === 0) {
                            thisPix.name === 'empty';
                            $pix.removeClass('white black shade0 shade1 shade2 shade3 shade4 shade5 shade6 shade7').addClass('empty');
                        }
                    }
                }
            }
            let newPix = {
                "name": this.toplay,
                "cycles": 7
            }
            console.log(this.gopix);
            // Fade existing pixes
            // for (var i = 0; i < currentColorPixes.length; i++) {
            //     currentColorPixes[i]
            // }
            // Apply new pixes
            for (var i = 0; i < newPixes.length; i++) {
                this.gopix[newPixes[i][1]][newPixes[i][0]] = newPix;
                let $row = $($('.row')[newPixes[i][1]]);
                let $pix = $($row.children('.pix')[newPixes[i][0]]);
                $pix.removeClass('empty white black').addClass(this.toplay);
            }
        }
        // switch color
        this.turn = function() {
            this.toplay = (this.toplay === 'black') ? 'white' : 'black';
            this.ea.publish('player', this.toplay);
        }
        this.toplay = 'white';
        this.gopix = [];
        // setup the board
        this.reset = function() {
            let newPix = {
                "name": "empty",
                "cycles": 0
            }
            for (let y = 0; y < 33; y++) {
                this.gopix.push([]);
                for (let x = 0; x < 33; x++) {
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

    pixClass = function(pix) {
        let classes = (pix.cycles > 0) ? pix.name + ' shade' + pix.cycles : pix.name;
        return classes;
    }

    clickPix(pix) {
        this.turn();
        if (pix === 'empty') {
            this.turn();
            pix = this.toplay;
        }
        // console.log(pix);
    };
}
