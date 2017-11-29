;(function (window,document,$,undefine) {
    // 可以设置的部分
    // 1.画布的长宽和在长宽方向每个格子的数量     // 视图设置
    // 2.墙的位置 wall 球的位置 ball 人的位置   // 游戏设置
    // 3.是否开启动效
    // 4.是否可以后退，最大后退步数

    var defaultOption = {
        width: 560,
        height: 560,
        numH: 16,
        numV: 16
    };

    var Game = function () {
       this._el = $('#box');
       this._ctx = this._el.getContext('2d');

    };
    Game.prototype = {
        constructor: Game,
        init: function () {

        }
    };
})(window,document,jQuery);