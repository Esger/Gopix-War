import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class GopixCustomElement {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.toplay = 'black';
        this.gopix = [];
    	// setup the board
        this.reset = function() {
            for (let y = 0; y < 33; y++) {
                this.gopix.push([]);
                for (let x = 0; x < 33; x++) {
                    this.gopix[y].push('empty');
                }
            }
            this.gopix[11][11] = 'white';
            this.gopix[21][21] = 'black';
        };
        this.reset();
    }

    // switch color
    turn(){
        this.toplay = (this.toplay === 'black') ? 'white' : 'black';
    }

    clickPix(pix){
        this.turn();
		if (pix === 'empty') {
			pix = this.toplay;
			this.turn();
		}
        console.log(pix);
	};
}
