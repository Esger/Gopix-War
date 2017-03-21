import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import $ from 'jquery';

@inject(EventAggregator)
export class App {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.listen2keys = false;
        this.ea.subscribe('game', response => {
            switch (response) {
                case 'start':
                    this.listen2keys = true
                    break;
                default:

            }
        });
        this.message = 'Gopix Raiders';
        this.keys = {
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40
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
        if (this.listen2keys) {
            switch (keycode) {
                case this.keys.left:
                    this.ea.publish('keyPressed', "left");
                    break;
                case this.keys.up:
                    this.ea.publish('keyPressed', "up");
                    break;
                case this.keys.right:
                    this.ea.publish('keyPressed', "right");
                    break;
                case this.keys.down:
                    this.ea.publish('keyPressed', "down");
                    break;
                default:
                    this.ea.publish('keyPressed', "somekey");
            }
        }
    }
}
