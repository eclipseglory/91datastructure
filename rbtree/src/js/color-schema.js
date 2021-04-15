export default class ColorSchema {
    static SCHEMAS = {
        'default': {
            'red': '#DC3545',
            'black': '#212529',
            'line': '#576088',
            'bg': '#F8F9FA',
            'focus': '#ffcef3',
            'light': '#fdfdfd',
            'lightsecond': '#a1eafb',
            'second': '#cabbe9',
            'frontline': '#8559a5'
        }
    }

    static currentSchema = 'default';

    static getFrontLineColor() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.frontline;
        }
        return '#000000'
    }

    static getFocusColor() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.focus;
        }
        return '#000000'
    }

    static getLightColor() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.light;
        }
        return '#000000'
    }

    static getLightSecondColor() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.lightsecond;
        }
        return '#000000'
    }


    static getSecondColor() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.second;
        }
        return '#000000'
    }



    static getLineColor() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.line;
        }
        return '#000000'
    }

    static getRedColor() {
        let r = this.getRedColorString()
        return this.hexToRgb(r);
    }

    static getRedColorString() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.red;
        }
        return '#ffffff';
    }

    static getBlackColor() {
        let str = this.getBlackColorString();
        return this.hexToRgb(str);
    }

    static getBlackColorString() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.black;
        }
        return '#000000';
    }

    static getBackGroundColor() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.bg;
        }
        return '#ffffff';
    }

    static cache = {};

    static hexToRgb(hex) {
        let color = this.cache[hex];
        if (color == null) {
            let s = hex.substring(1, 3);
            let r = Number.parseInt(s, 16);
            s = hex.substring(3, 5);
            let g = Number.parseInt(s, 16);
            s = hex.substring(5, 7);
            let b = Number.parseInt(s, 16);
            color = { 'red': r, 'green': g, 'blue': b };
            this.cache[hex] = color;
        }
        return color;
    }
}