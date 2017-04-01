import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class HeaderCustomElement {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.color = 'white';
        this.keepMoving = true;
        this.ea.subscribe('game', response => {
            switch (response.type) {
                case 'illegal':
                    this.setTitleText(this.getTitleData('no can do'));
                    break;
                case 'win':
                    this.keepMoving = false;
                    this.setTitleText(this.getTitleData(response.player + ' wins'));
                    break;
                case 'start':
                    this.reset();
                    break;
                default:

            }

        });
        this.ea.subscribe('player', response => {
            if (this.keepMoving) {
                this.setTitleText(this.getTitleData(response + ' plays'));
                this.color = response;
            }
        });
        this.text = 'gopix war';
        this.titleData = [];
        this.characters = [{
                'name': ' ',
                'data': [0]
            },
            {
                'name': 'a',
                'data': [31, 31, 20, 20, 15]
            },
            {
                'name': 'b',
                'data': [31, 31, 21, 21, 11]
            },
            {
                'name': 'c',
                'data': [14, 31, 17, 17, 10]
            },
            {
                'name': 'd',
                'data': [31, 31, 17, 17, 14]
            },
            {
                'name': 'e',
                'data': [31, 31, 21, 21, 1]
            },
            {
                'name': 'f',
                'data': [31, 31, 20, 20]
            },
            {
                'name': 'g',
                'data': [14, 31, 17, 21, 7]
            },
            {
                'name': 'h',
                'data': [31, 31, 4, 4, 15]
            },
            {
                'name': 'i',
                'data': [31, 15]
            },
            {
                'name': 'j',
                'data': [2, 1, 31, 30]
            },
            {
                'name': 'k',
                'data': [31, 31, 12, 6, 11, 17]
            },
            {
                'name': 'l',
                'data': [31, 31, 1, 1, 1]
            },
            {
                'name': 'm',
                'data': [7, 28, 8, 28, 7]
            },
            {
                'name': 'n',
                'data': [31, 31, 12, 6, 15]
            },
            {
                'name': 'o',
                'data': [14, 31, 17, 17, 14]
            },
            {
                'name': 'p',
                'data': [31, 31, 20, 20, 8]
            },
            {
                'name': 'q',
                'data': [14, 31, 17, 18, 13]
            },
            {
                'name': 'r',
                'data': [31, 31, 20, 22, 9]
            },
            {
                'name': 's',
                'data': [29, 29, 21, 23, 7]
            },
            {
                'name': 't',
                'data': [16, 16, 31, 31, 16]
            },
            {
                'name': 'u',
                'data': [30, 31, 1, 1, 30]
            },
            {
                'name': 'v',
                'data': [28, 6, 1, 6, 28]
            },
            {
                'name': 'w',
                'data': [16, 28, 7, 2, 7, 28]
            },
            {
                'name': 'x',
                'data': [17, 26, 12, 6, 11, 17]
            },
            {
                'name': 'y',
                'data': [16, 25, 14, 4, 8]
            },
            {
                'name': 'z',
                'data': [17, 19, 23, 29, 25, 17]
            }
        ]
        this.setTitleText(this.getTitleData(this.text));
    }

    reset(){
        this.color = 'white'; // zou niet de verantwoordelijkheid van header moeten zijn
        this.keepMoving = true;
        this.setTitleText(this.getTitleData(this.color + ' plays'));
    }

    // shift new title into header
    setTitleText(titleData) {
        this.titleData = titleData;
    }

    // convert string to colums of pixeldata
    getTitleData(titleString) {
        function dec2bin(dec) {
            return ('00000' + (dec >>> 0).toString(2)).substr(-5);
        }
        let titleData = [];
        let titleSplit = titleString.split('');
        // console.log(titleSplit);
        for (let character of titleSplit) {
            let charObject = this.characters.find(x => x.name === character);
            let charData = charObject.data;
            let charName = charObject.name;
            for (let col of charData) {
                let binaryCol = dec2bin(col);
                let pixels = [];
                for (let pix of binaryCol) {
                    pixels.push(pix);
                }
                titleData.push(pixels);
            }
            titleData.push([0,0,0,0,0]); // space
        }
        titleData.pop();
        return titleData;
    }

    attached() {
        this.titleData = this.getTitleData(this.text);
        // console.log(this.titleData);
    }

}
