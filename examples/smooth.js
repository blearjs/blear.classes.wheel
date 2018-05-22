/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';


var Wheel = require('../src/index');

new Wheel({
    el: '#demo'
}).on('wheel', function (meta) {
    console.log(meta);
});