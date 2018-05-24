;(function (window, document, $, undefine) {
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
  var imgSrc = 'images/';
  var imgArr = ['ball.png', 'block.gif', 'box.png', 'down.png', 'left.png', 'right.png', 'up.png', 'wall.png'];
  var imgLoad = function (src, cb) {
    var img = new Image();
    img.onload = cb;
    img.src = src;
  };
  var loadedNum = 0;
  var mission = [
    {
      wall: [
        {r: 5, c: 7},
        {r: 5, c: 8},
        {r: 5, c: 9},
        {r: 6, c: 7},
        {r: 6, c: 9},
        {r: 7, c: 7},
        {r: 7, c: 9},
        {r: 7, c: 10},
        {r: 7, c: 11},
        {r: 7, c: 12},
        {r: 8, c: 5},
        {r: 8, c: 6},
        {r: 8, c: 7},
        {r: 8, c: 12},
        {r: 9, c: 5},
        {r: 9, c: 10},
        {r: 9, c: 11},
        {r: 9, c: 12},
        {r: 10, c: 5},
        {r: 10, c: 6},
        {r: 10, c: 7},
        {r: 10, c: 8},
        {r: 10, c: 10},
        {r: 11, c: 8},
        {r: 11, c: 10},
        {r: 12, c: 8},
        {r: 12, c: 9},
        {r: 12, c: 10}

      ],
      ball: [
        {r: 6, c: 8},
        {r: 8, c: 11},
        {r: 9, c: 6}
      ],
      box: [
        {r: 8, c: 8},
        {r: 8, c: 10},
        {r: 9, c: 8},
        {r: 10, c: 9}
      ],
      person: [
        {r:8,c:9}
      ]
    }
  ];
  var offset = {
    block: [0, 0],
    ball: [-2.5, -2.5],
    box: [0, 10],
    wall: [0, 11],
    right: [0,10],
  };
  var Game = function (options) {
    this._el = $('#box').get(0);
    this._ctx = this._el.getContext('2d');
    this.options = $.extend({}, defaultOption, options);
    this.bg = [];
    this.init();

  };
  Game.prototype = {
    constructor: Game,
    init: function () {
      this._el.width = this.options.width;
      this._el.height = this.options.height;
      this.width = this.options.width;
      this.height = this.options.height;
      this.numH = this.options.numH;
      this.numV = this.options.numV;
      this.cellWidth = parseInt(this.width / this.numH);
      this.cellHeight = parseInt(this.height / this.numV);

      this.imgs = {};
      this.missionNum = 0;
      this.getBg();
      this.imgLoad();
    },
    getBg: function () {
      for (var r = 0; r < this.numV; r++) {
        for (var c = 0; c < this.numH; c++) {
          this.bg.push({
            r: r + 1,
            c: c + 1
          });
        }
      }
    },
    imgLoad: function () {
      var me = this;
      for (var i = 0; i < imgArr.length; i++) {
        imgLoad(imgSrc + imgArr[i], function () {
          // 获取图片相应的名字 从后第一个 / 到 从后第一个点
          var o = /\/([^/.]+)\.[^./]+$/g.exec(this.src)[1];
          me.imgs[o] = this;
          this.onload = null;
          loadedNum++;
          me.isFinishLoad();
        });
      }
    },
    isFinishLoad: function () {
      if (loadedNum >= imgArr.length) {
        this.gameStart();
      }
    },
    gameStart: function () {
      // 游戏开始 绘制
      this.paint();
      console.log('gogogo');
    },
    // paint: function () {
    //     this.paintStatic();
    //     this.paintWall();
    // },
    draw: function (arr, imgName, r, c) {
      for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        if (item.r === r + 1 && item.c === c + 1) {
          var offsetX = offset[imgName][0];
          var offsetY = offset[imgName][1];
          var x = (item.c - 1) * this.cellWidth - offsetX;
          var y = (item.r - 1) * this.cellHeight - offsetY;
          var width = this.cellWidth + offsetX;
          var height = this.cellHeight + offsetY;
          this._ctx.drawImage(this.imgs[imgName], x, y, width, height);
        }
      }
    },

    paint: function () {
      var curMision = mission[this.missionNum];

      for (var r = 0; r < this.numV; r++) {
        for (var c = 0; c < this.numH; c++) {
          // 绘制背景
          this.draw(this.bg, 'block', r, c);
          // 绘制球球
          this.draw(curMision.ball, 'ball', r, c);
          // 绘制箱子
          this.draw(curMision.box, 'box', r, c);
          // 绘制小人
          this.draw(curMision.person,'right',r,c);
          // 绘制墙
          this.draw(curMision.wall, 'wall', r, c);
        }
      }


    },
    paintWall: function () {

    }
  };
  window.Game = Game;
  var game = new Game();
})(window, document, jQuery);
