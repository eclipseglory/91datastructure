process.env.VUE_APP_VERSION = require('./package.json').version;
var author = require('./package.json').author;
process.env.VUE_APP_AUTHOR_MANE = author.name == null ?  "老脸"  : author.name;
process.env.VUE_APP_AUTHOR_URL = author.url == null ?  "#"  : author.url;
module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/'
};