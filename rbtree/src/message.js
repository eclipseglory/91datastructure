export default class Message {

    static $t;

    static _getOpMsg(key, id, num) {
        return this.$t(`default.message.${key}`, { id: id, num: num });
    }

    static generateOperationOverMsg(op, id, num, type) {
        if (this.$t == null) return '';
        let key = `default.message.${op}${type}`;
        return this.$t(key, { id: id, num: num });
    }

    static generateDeleteBalanceMsgSimple(caseKey, type, args) {
        if (this.$t == null) return '';
        let key = `default.message.deleteBlance.simple.case${caseKey}.${type}`;
        return this.$t(key, args);
    }

    static generateDeleteBalanceMsgComplex(caseKey, type, args) {
        if (this.$t == null) return '';
        let key = `default.message.deleteBlance.complex.case${caseKey}.${type}`;
        return this.$t(key, args);
    }

    static generateDeleteBalanceAdditionalMsg(key1, args) {
        if (this.$t == null) return '';
        let key = `default.message.deleteBlance.additional${key1}`;
        return this.$t(key, args);
    }

    static generateInsertBalanceMsg(caseKey, type, args) {
        if (this.$t == null) return '';
        let key = `default.message.insertBlance.case${caseKey}.${type}`;
        return this.$t(key, args);
    }

    static generateRotateForward(isleft) {
        if (this.$t == null) return '';
        let key;
        if (isleft) key = `default.rotate.left`;
        else key = `default.rotate.right`
        return this.$t(key);
    }
}
