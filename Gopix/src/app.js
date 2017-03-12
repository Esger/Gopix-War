import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import $ from 'jquery';

@inject(EventAggregator)
export class App {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.message = 'Gopix Raiders';
        this.keys = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };
    }

    activate() {
        document.addEventListener('keydown', this.handleKeyInput, true);
    }

    deactivate() {
        document.removeEventListener('keydown', this.handleKeyInput);
    }

    handleKeyInput = (event) => {
        var keycode = event.keyCode || event.which; // also for cross-browser compatible
        switch (keycode) {
            case this.keys.LEFT:
                this.ea.publish('keyPressed', "LEFT");
                break;
            case this.keys.UP:
                this.ea.publish('keyPressed', "UP");
                break;
            case this.keys.RIGHT:
                this.ea.publish('keyPressed', "RIGHT");
                break;
            case this.keys.DOWN:
                this.ea.publish('keyPressed', "DOWN");
                break;
            default:
                this.ea.publish('keyPressed', "SOMEKEY");
        }
    }
}
