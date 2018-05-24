;(function () {
  var setPrototype = function (child, parent) {
    var Super = function () {
    };
    Super.prototype = parent.prototype;
    child.prototype = new Fun();
    child.prototype.constructor = child;
  };
  // 基础类cell
  var Cell = function (r, c,viewObj) {
    this.name = 'cell';
    this.r = r;
    this.c = c;
    this.viewObj = viewObj; // 显示对象 图片或者canvas渲染
    this.pass = 0;
    this.coverPriority = ''; // 覆盖类型(决定该cell是否会被展示，在一个点上存在多个cell的时候)  '' 0- 如果是空表明不会被覆盖,如果是数字进行比较较大的才会去展示
    this.index = 0; // 如果一个点上存在多个cell 按照index的书序进行渲染
  };
  Cell.prototype = {
    constructor: Cell,
    getName: function () {
      return this.getName();
    },
    setPos: function (r, c) {
      this.r = r;
      this.c = c;
    },
    getPos: function () {
      return {
        r: this.r,
        c: this.c
      }
    },
    getPass: function () {
      return this.pass;
    },
    getCover: function () {
      return this.coverPriority;
    },
    getViewObj: function () {
      return this.viewObj;
    }
  };

  /***************      虚拟的类 ball bg          ************/
  /***************      实体的类 wall soldier box  ************/

  var VirtualCell = function (r, c,viewObj) {
    Cell.call(this, r, c,viewObj);
    this.pass = 1;
  };
  setPrototype(VirtualCell, Cell);
  var EntityCell = function () {
    Cell.call(this, r, c,viewObj);
    this.pass = 0;
  };
  setPrototype(EntityCell, Cell);

  /*************************  具体的类  ************************************/
  // 背景
  var BG = function (options) {
    VirtualCell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = '';
    this.index = 0;
    this.viewObj = options.viewObj;
    this.name = 'bg';
    } ;
  setPrototype(BG,VirtualCell);

  // ball
  var Ball = function (options) {
    VirtualCell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = 0; // 会被覆盖
    this.index = 1;
    this.name = 'ball';
  };
  setPrototype(Ball,VirtualCell);

  // wall
  var Wall = function (options) {
    EntityCell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = 1; // 会被覆盖
    this.index = 2;
    this.name = 'wall';
  };
  setPrototype(Wall,EntityCell);

  // Box
  var Box = function (options) {
    EntityCell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = 1; // 会被覆盖
    this.index = 2;
    this.name = 'box';
  };
  setPrototype(Box,EntityCell);
  // ren
  var Soldier = function (options) {
    EntityCell.call(this,options.r,options.c,options.viewObj);
    this.coverPriority = 1; // 会被覆盖
    this.index = 2;
    this.name = 'soldier';
    this.direction = options.direction;
  };
  setPrototype(Soldier,EntityCell);
  Soldier.getDirection = function () {
    return this.direction;
  };
  Soldier.setDirection = function (direction) {
    this.direction = direction || 'right';
  };
  Soldier.getViewObj = function () {
    return this.viewObj[this.direction];
  };
  var CellModal = {
    BG: BG,
    Ball: Ball,
    Wall: Wall,
    Box: Box,
    Soldier: Soldier
  };
  window.createModal = function (type,options) {
    return new CellModal[type](options);
  };
})();