import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class StartCustomElement {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.showStartButton = true;
        this.ea.subscribe('game', response => {
            switch (response.type) {
                case 'win':
                    this.showStartButton = true;
                    break;
                default:

            }
        });
    }

    startGame(){
        this.ea.publish('game', {'type' : 'start'});
        this.showStartButton = false;
    }
}
