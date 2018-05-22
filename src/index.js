/**
 * blear.classes.wheel
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var event = require('blear.core.event');
var selector = require('blear.core.selector');
var Events = require('blear.classes.events');
var object = require('blear.utils.object');

var abs = Math.abs;
var EVENT_TYPES = 'mousewheel wheel MozMousePixelScroll';
var defaults = {
    el: '',

    /**
     * 是否平滑模式
     * true: 平滑模式，滚动时时会连续触发
     * false: 段时间内只会触发一次
     * @type Boolean
     */
    smooth: true,

    /**
     * 是否阻止默认
     */
    preventDefault: true,

    /**
     * 间隔时间
     */
    deltaTime: 150
};
var Wheel = Events.extend({
    className: 'Wheel',
    constructor: function (options) {
        var the = this;

        Wheel.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_el] = selector.query(the[_options].el)[0];
        the[_initEvent]();
    },

    destroy: function () {
        var the = this;

        event.un(the[_el], EVENT_TYPES, the[_onWheel]);
        Wheel.invoke('destroy', the);
    }
});
var proto = Wheel.prototype;
var sole = Wheel.sole;
var _options = sole();
var _el = sole();
var _initEvent = sole();
var _onWheel = sole();

proto[_initEvent] = function () {
    var the = this;
    var options = the[_options];
    var timer = 0;
    var isStopped = true;
    var lastDirection = null;

    /**
     * wheel 兼容
     * @link http://www.sitepoint.com/html5-javascript-mouse-wheel/
     */
    event.on(the[_el], EVENT_TYPES, the[_onWheel] = function (ev) {
        var value = ev.wheelDelta || -ev.deltaY || -ev.detail;
        var delta = Math.max(-1, Math.min(1, value));
        var direction = delta > 0 ? 'down' : 'up';

        if (delta === 0) {
            return;
        }

        var emit = function () {
            the.emit('wheel', {
                event: ev,
                value: value,
                delta: delta,
                direction: direction
            });
        };

        if (options.smooth) {
            emit();
            return;
        }

        clearTimeout(timer);
        timer = setTimeout(function () {
            isStopped = true;
            lastDirection = null;
        }, options.deltaTime);

        // 方向变化了
        if (lastDirection !== direction) {
            isStopped = true;
            emit();
        }

        lastDirection = direction;
    });
};


module.exports = Wheel;

