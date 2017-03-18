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

        this.maxX = 22;
        this.maxY = 22;

        this.maxStrength = 11;

        this.playerStrength = {
            'white': 5,
            'black': 5
        }

        this.gopix = [];

    }

    pixStyle(pix) {
        return {
            'borderWidth' : pix.strength + 'px'
        };
    }

    turn() {
        if (this.playerStrength[this.toplay] < this.maxStrength) {
            this.playerStrength[this.toplay]++
        }
        // console.log(this.playerStrength);
        // switch color
        let temp = this.oponent;
        this.oponent = this.toplay;
        this.toplay = temp;
        this.ea.publish('player', this.toplay);
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

    getNewPixes(dx, dy) {
        let newPixes = [];
        let abortMove = false;
        for (let y = 0; y < this.maxY; y++) {
            for (let x = 0; x < this.maxX; x++) {
                let thisPix = this.gopix[y][x];
                if (thisPix.name === this.toplay) {
                    if (thisPix.strength > 0) {
                        let newX = x + dx;
                        let newY = y + dy;
                        if (!(newX < 0 || newX >= this.maxX || newY < 0 || newY >= this.maxY)) {
                            let newPix = [newX,newY];
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
    }

    weakenPixes() {
        for (let y = 0; y < this.maxY; y++) {
            for (let x = 0; x < this.maxX; x++) {
                let thisPix = this.gopix[y][x];
                if (thisPix.name === this.toplay) {
                    let $row = $($('.row')[y]);
                    let $pix = $($row.children('.pix')[x]);
                    if (thisPix.strength > 1) {
                        thisPix.strength--;
                        $pix.css(this.pixStyle(thisPix));
                    } else {
                        thisPix.name = 'empty';
                        $pix.removeClass(this.toplay).addClass('empty');
                    }
                }
            }
        }
    }

    drawNewPixes(newPixes){
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

    step(dx, dy) {
        let newPixes = this.getNewPixes(dx, dy);
        // console.log(newPixes);
        if (newPixes.length) {
            this.weakenPixes();
            this.drawNewPixes(newPixes);
            this.turn();
        } else {
            this.ea.publish('illegal');
            // console.log('illegal move');
        }
    }

    // setup the board
    reset() {
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
        this.gopix[7][7] = {
            "name": "white",
            "strength": this.playerStrength['white']
        };
        this.gopix[14][14] = {
            "name": "black",
            "strength": this.playerStrength['black']
        };
    }

    setup() {
        let newPixes = [[7,7]];
        console.log(newPixes);
        this.drawNewPixes(newPixes);
        this.turn();
        newPixes = [[14,14]];
        console.log(newPixes);
        this.drawNewPixes(newPixes);
        this.turn();
    }

    attached(){
        this.reset();
        this.setup();
    }

}
