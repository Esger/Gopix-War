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
        	for (let count=1; count<1089; count++){
                this.gopix.push('empty');
        	}
        };
        this.reset();
    }

    // switch color
    turn(){
        if (toplay == 'black') {
            toplay = 'white';
        } else {
            toplay = 'black';
        }
    }

    clickPix(pix){
		// if (($(this).hasClass('white')===false) && ($(this).hasClass('black')===false)) {
		// 	$(this).addClass(toplay);
		// 	board[count]=toplay;
		// 	turn();
		// }
	};
    // dislikeIngredient(ingredient, i) {
    //     ingredient.pref = (ingredient.pref === 1)? 0 : -1;
    //     this.ea.publish('downPreference', ingredient);
    // }
}
