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

    static getFrontLineColorHex() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.frontline;
        }
        return '#000000'
    }

    static getFocusColorHex() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.focus;
        }
        return '#000000'
    }

    static getLightColorHex() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.light;
        }
        return '#000000'
    }

    static getLightSecondColorHex() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.lightsecond;
        }
        return '#000000'
    }


    static getSecondColorHex() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.second;
        }
        return '#000000'
    }

    static getLineColorHex() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.line;
        }
        return '#000000'
    }

    static getRedColorHex() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.red;
        }
        return '#ffffff';
    }

    static getBlackColorHex() {
        let colors = this.SCHEMAS[this.currentSchema];
        if (colors != null) {
            return colors.black;
        }
        return '#000000';
    }

    static getBackGroundColorHex() {
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

    static getRGBString(rgb, a) {
        if (a != null) {
            return `rgba(${rgb.red},${rgb.green},${rgb.blue},${a})`;
        }
        return `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
    }

}