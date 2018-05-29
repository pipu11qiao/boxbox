;(function () {
  var setPrototype = function (child, parent) {
    var Super = function () {
    };
    Super.prototype = parent.prototype;
    child.prototype = new Super();
    child.prototype.constructor = child;
  };
  // 基础类cell
  var Cell = function (r, c,viewObj) {
    this.name = 'cell';
    r = -(-r);
    c = -(-c);
    this.r = r;
    this.c = c;
    this.paintR = r;
    this.paintC = c;
    this.viewObj = viewObj; // 显示对象 图片或者canvas渲染
    this.pass = 0;
    this.coverPriority = ''; // 覆盖类型(决定该cell是否会被展示，在一个点上存在多个cell的时候)  '' 0- 如果是空表明不会被覆盖,如果是数字进行比较较大的才会去展示
    this.index = 0; // 如果一个点上存在多个cell 按照index的书序进行渲染
    this.curStep = 0; // 当前移动步数
    this.move = false; // 是否在移动
    this.animateTime = 300; // 单位ms
    this.animateSteps = parseInt(this.animateTime / 16); // 16是动效间隔时间
  };
  Cell.prototype = {
    constructor: Cell,
    getName: function () {
      return this.getName();
    },
    setPos: function (r, c) {
      r = -(-r);
      c = -(-c);
      // 0.3s = 300ms 18 步完成位置的变换
      // 计算paint 的坐标和现在的坐标的差值

      if(this.r !== r || this.c !== c){
        this.r = -(-r);
        this.c = -(-c);
        if(this.paintR !== r || this.paintC !== c){
          // 开始动效 计算移动的数值
          this.stepR = (r - this.paintR) / this.animateSteps;
          this.stepC = (c - this.paintC) / this.animateSteps;
          this.move = true;
          this.curStep = 0;
        }
      }
    },
    getPos: function () {
      return {
        r: this.r,
        c: this.c
      };
    },
    getPaintPos: function () {
      var paintR,paintC;
      if (this.move) {
        paintR = this.paintR = this.paintR + this.stepR;
        paintC = this.paintC = this.paintC + this.stepC;
        this.curStep++;
        if (this.curStep >= this.animateSteps) {
          this.move = false;
        }
      }else{
        paintR = this.r;
        paintC = this.c;
      }
      return {
        r: paintR,
        c: paintC
      };
    },
    getPass: function () {
      return this.pass;
    },
    getCover: function () {
      return this.coverPriority;
    },
    getViewObj: function () {
      return this.viewObj;
    },
    getIndex: function () {
      return this.index;
    }
  };


  /*************************  具体的类  ************************************/
  // 背景
  var BG = function (options) {
    Cell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = '';
    this.index = 0;
    this.viewObj = options.viewObj;
    this.name = 'bg';
    } ;
  setPrototype(BG,Cell);

  // ball
  var Ball = function (options) {
    Cell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = 0; // 会被覆盖
    this.index = 1;
    this.name = 'ball';
  };
  setPrototype(Ball,Cell);

  // wall
  var Wall = function (options) {
    Cell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = 1; // 会被覆盖
    this.index = 2;
    this.name = 'wall';
  };
  setPrototype(Wall,Cell);

  // Box
  var Box = function (options) {
    Cell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = 1; // 会被覆盖
    this.index = 2;
    this.name = 'box';
  };
  setPrototype(Box,Cell);

  // soldier 可以移动的部分
  var Soldier = function (options) {
    Cell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = 1; // 会被覆盖
    this.index = 2;
    this.name = 'soldier';
    this.direction = options.direction;
  };
  setPrototype(Soldier,Cell);
  Soldier.prototype.getDirection = function () {
    return this.direction;
  };
  Soldier.prototype.setDirection = function (direction) {
    this.direction = direction || 'right';
  };
  Soldier.prototype.getViewObj = function () {
    return this.viewObj[this.direction];
  };
  var CellModal = {
    BG: BG,
    BALL: Ball,
    WALL: Wall,
    BOX: Box,
    SOLDIER: Soldier
  };
  window.createModal = function (type,options) {
    return new CellModal[type](options);
  };
})();