import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class BoardCustomElement {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.player = 'white';
        this.ea.subscribe('player', response => {
            this.player = response;
        });
    }

    logoClass() {
        return this.player;
    }

}
