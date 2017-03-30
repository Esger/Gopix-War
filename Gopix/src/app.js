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
            switch (response.type) {
                case 'start':
                    this.listen2keys = true;
                    break;
                case 'win':
                    this.listen2keys = false;
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
        this.scale = "";
        this.touchEvent = {
            'startX' : null,
            'startY' : null,
            'endX' : null,
            'endY' : null,
        };
    }

    handleSwipe() {
        let thresHold = 50;
        let startX = this.touchEvent.startX;
        let startY = this.touchEvent.startY;
        let dX = this.touchEvent.endX - this.touchEvent.startX;
        let dY = this.touchEvent.endY - this.touchEvent.startY;
        let vertical = (Math.abs(dX) < Math.abs(dY));
        let horizontal = (Math.abs(dX) > Math.abs(dY));
        let left = (dX < -thresHold && Math.abs(dY) < thresHold);
        let right = (dX > thresHold && Math.abs(dY) < thresHold);
        let up = (dY < -thresHold && Math.abs(dX) < thresHold);
        let down = (dY > thresHold && Math.abs(dX) < thresHold);
        if (vertical) {
            if (up) {
                this.ea.publish('keyPressed', "up");
            }
            if (down) {
                this.ea.publish('keyPressed', "down");
            }
        }
        if (horizontal) {
            if (left) {
                this.ea.publish('keyPressed', "left");
            }
            if (right) {
                this.ea.publish('keyPressed', "right");
            }
        }
    }

    activate() {
        let self = this;

        document.addEventListener('keydown', self.handleKeyInput, true);

        $('body').on('touchstart', function(event){
            if (self.listen2keys) {
                self.touchEvent.startX = event.originalEvent.touches[0].clientX;
                self.touchEvent.startY = event.originalEvent.touches[0].clientY;
            }
        });
        $('body').on('touchend', function(event){
            if (self.listen2keys) {
                self.touchEvent.endX = event.originalEvent.changedTouches[0].clientX;
                self.touchEvent.endY = event.originalEvent.changedTouches[0].clientY;
                self.handleSwipe();
            }
        });
    }

    deactivate() {
        document.removeEventListener('keydown', this.handleKeyInput);
        $('body').off('touchstart');
        $('body').off('touchend');
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

    getScale() {
        var screenWidth = $("html").width();
        var boardWidth = $("#gopix").width();
        var scale = Math.min(screenWidth / boardWidth, 1);

        scale = Math.floor(scale * 10) / 10;
        this.scale = scale;
        return {
            'transformOrigin': 'top',
            '-webkit-transform': 'scale(' + scale + ', ' + scale + ')',
            '-ms-transform': 'scale(' + scale + ', ' + scale + ')',
            'transform': 'scale(' + scale + ', ' + scale + ')'
        };
    }

    setSize() {
        this.scale = this.getScale();
        $('board').css(this.scale);
    }

    attached() {
        this.setSize();
        document.addEventListener('resize', this.setSize, true);
    }
}
