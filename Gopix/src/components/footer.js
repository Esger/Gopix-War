import {
    inject,
    bindable
} from 'aurelia-framework';

export class FooterCustomElement {

    constructor(eventAggregator) {
        this.showHelpButton = true;
        this.showHideButton = false;
        this.showHelpText = false;
    }

    toggleHelp() {
        this.showHelpButton = !this.showHelpButton;
        this.showHideButton = !this.showHideButton;
        this.showHelpText = !this.showHelpText;
    }

}
