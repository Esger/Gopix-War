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
    }

    startGame(){
        this.ea.publish('game', 'start');
        this.showStartButton = false;
    }
}
