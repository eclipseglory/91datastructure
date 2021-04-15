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

    static generateDeleteBlanceMsgSimple(caseKey, type, args) {
        if (this.$t == null) return '';
        let key = `default.message.deleteBlance.simple.case${caseKey}.${type}`;
        return this.$t(key, args);
    }

    static generateDeleteBlanceMsgComplex(caseKey, type, args) {
        if (this.$t == null) return '';
        let key = `default.message.deleteBlance.complex.case${caseKey}.${type}`;
        return this.$t(key, args);
    }

    static generateDeleteBlanceAdditionalMsg(key1, args) {
        if (this.$t == null) return '';
        let key = `default.message.deleteBlance.additional${key1}`;
        return this.$t(key, args);
    }

    static generateInsertBlanceMsg(caseKey, type, args) {
        if (this.$t == null) return '';
        let key = `default.message.insertBlance.case${caseKey}.${type}`;
        return this.$t(key, args);
    }
}
