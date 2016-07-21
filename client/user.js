function User(id, name, imageKey, actionName, x, y, scaleX, scaleY, alpha, speed) {
    this.id = id;
    this.name = name;
    this.imageKey = imageKey;
    this.image = images[this.imageKey];
    this.actionName = actionName || 'No Action';
    this.scaleX = scaleX || 0.4;
    this.scaleY = scaleY || 0.4;
    this.regX = this.image.width * this.scaleX / 2;
    this.regY = this.image.height * this.scaleY / 2;
    var canvasRect = getAbsolutePos(canvas);
    this.x = x || 0;
    this.y = y || 0;
    this.alpha = alpha || 1.0;
    this.speed = speed || 5;

    this.namePlate = new createjs.Text(name, "24px serif", "DarkRed");
    this.namePlate.x = 0;
    this.namePlate.y = 0;
    this.namePlate.textAlign = 'center';
    this.namePlate.alpha = this.alpha || 1.0;
    stage.addChild(this.namePlate);
    this.moveOption();

    this.balloon = this.createBalloon();
    //最後の子要素として追加
    stage.addChild(this.balloon);
    this.balloon.alpha = 0;
    this.setBallonPos();

    // actionSelectorの発動
    this.isAction = false;
}

// 継承の仕方。まず，宣言してあるメソッドのプロトタイプを指定
// そのままではコンストラクタが継承元のものとなってしまうので，それを変更
User.prototype = new createjs.Bitmap();
User.prototype.constructor = User;


User.prototype.talk = function(message) {
    console.log(this.name + ' is talk ->' + message );
    this.addMessage(message);
    this.setBallonPos();
};
User.prototype.walk = function(key) {
    console.log('avatar:' + this.y + ', canvas:' + getAbsolutePos(canvas).top);
    var limmit = getAbsolutePos(canvas);
    switch(key) {
        case '37': // Left
            this.x -= this.speed;
            var borderLeft = this.image.width * -this.scaleX - this.regX; // 右向きの時はscaleXは必ずマイナスなので調整
            if (this.x < borderLeft) this.x = borderLeft;
            if(this.scaleX > 0) {
                this.turn();
            }
            // マイナスの時に軸が動く
            this.namePlate.x = this.x - this.image.width / 2;
            break;
        case '38': // Up
            this.y -= this.speed;
            if (this.y < 0) this.y = 0;
            //if (this.y < limmit.top) this.y = limmit.top;
            //else this.changeScale();
            break;
        case '39': // Right
            this.x += this.speed + window.pageXOffset;
            var borderRight = canvas.width - this.image.width * this.scaleX / 2;
            if (borderRight < this.x) this.x = borderRight;
            if(this.scaleX < 0) {
                this.turn();
            }
            break;
        case '40': // Down
            this.y += this.speed;
            console.log(limmit.height);
            var y = limmit.height - this.image.width * this.scaleY - window.pageYOffset - 50;
            if ( y < this.y ) this.y = y;
            //this.changeScale();
            //var borderBottom = canvas.height - this.image.height * this.scaleY / 2;
            //if (borderBottom < this.y) this.y = borderBottom;
            break;
        default:
            console.log('引数が不正です');
    }
    this.moveOption();
    this.setBallonPos();
};
User.prototype.moveOption =  function() {
    this.namePlate.x = this.x + this.regX - this.namePlate.getMeasuredWidth();
    this.namePlate.y = this.y - this.namePlate.getMeasuredHeight() - 5;
    this.namePlate.regX = this.regX;
};
User.prototype.changeScale = function() {
    if (this.scaleX < -0.8 || 0.8 < this.scaleX) return null;

    var unit = canvas.height / 4;
    if (unit * 3 < this.y) this.scaleX = this.scaleY = 0.6;
    else if (unit * 2 < this.y)  this.scaleX = this.scaleY = 0.5;
    else if (unit < this.y)  this.scaleX = this.scaleY = 0.4;
    else if (unit < this.y)  this.scaleX = this.scaleY = 0.3;
    if (this.scaleX < 0) {
        this.regX = this.image.width * -this.scaleX / 2;
    } else {
        this.regX = this.image.width * this.scaleX / 2;
    }
    this.regY = this.image.height * this.scaleY / 2;
};
User.prototype.turn = function() {
    this.scaleX *= -1;
    //this.x -= this.image.width * this.scaleX / 2;
    //this.regX = this.image.width * this.scaleX / 2;
};
User.prototype.action = function() {
    if (!this.isAction) {
        this.isAction = true;

        // アクションの実体　面白そうなものがあったら増やす（残像とか）
        switch (this.actionName) {
            case 'dash':
                this.dash();
                break;
            case 'hide':
                this.hide();
                break;
            case 'titan':
                this.titan();
                break;
            default:
                console.log('No Action');
                break;
        }
        // アニメーションが終わったら各メソッド内で以下を実行
        //this.isAction = false;
    }
};

// id, name, imageKey, actionName, x, y, scaleX, scaleY
User.prototype.toJsonString = function () {
  return '{"id":"' + this.id + '",' +
          '"name":"' + this.name + '",' +
      '"imageKey":"' + this.imageKey + '",' +
     '"actionName":"' + this.actionName + '",' +
              '"x":' + this.x + ',' +
              '"y":' + this.y + ',' +
         '"scaleX":' + this.scaleX + ',' +
         '"scaleY":' + this.scaleY + ',' +
          '"alpha":' + this.alpha + ',' +
          '"speed":' + this.speed + '}';
};

// IMに関する設定
User.prototype.createBalloon = function() {
    var div = document.createElement('div');
    div.setAttribute('id', this.id);
    div.classList.add('balloon');
    document.body.appendChild(div);
    return new createjs.DOMElement(div);
};
User.prototype.addMessage = function(message) {
    document.getElementById(this.id).innerHTML = message;
    createjs.Tween.get(this.balloon, { loop: false, override:true })
        .to({ alpha: 1 }, 500, createjs.Ease.getPowInOut(2))
        .wait(5000)
        .to({ alpha: 0 }, 500, createjs.Ease.getPowInOut(2));
};
User.prototype.setBallonPos = function() {
    var balloon = document.getElementById(this.id);
    this.balloon.x = this.x - balloon.clientWidth / 2;
    if (this.balloon.x < 0) this.balloon.x = 0;
    else if (window.innerWidth - balloon.clientWidth < this.balloon.x) this.balloon.x = window.innerWidth - balloon.clientWidth;
    this.balloon.y = this.y - this.regY - 34 - balloon.clientHeight;

};

// 固有のアクションの設定
User.prototype.actionSelector = function (actionName) {
    this.actionName = actionName;
    this.dash = null;
    this.hide = null;
    this.titan = null;
    switch (this.actionName) {
        case 'dash': // 高速移動
            this.dash = dash;
            break;
        case 'hide': // 透明化
            this.hide = hide;
            break;
        case 'titan': // 巨大化
            this.titan = titan;
            break;
        default:
            actionName = 'No Action';
            break;
    }
};

var dash = function () {
    console.log("Let's Dash");
    if (this.speed === 5) this.speed = 50;
    else this.speed = 5;
    this.isAction = false;
};
var hide = function () {
    console.log("I am Shinobi");
    var hideRate = 0.2; // Todo いい感じの透明度に変更
    if (this.alpha === 1.0) {
        createjs.Tween.get(this, { loop: false, override:true })
            .to({ alpha: hideRate }, 500)
            .call(function() {this.isAction = false;});
        createjs.Tween.get(this.namePlate, { loop: false, override:true })
            .to({ alpha: hideRate }, 400);
    } else {
        createjs.Tween.get(this, { loop: false, override:true })
            .to({ alpha: 1.0 }, 500)
            .call(function() {this.isAction = false;});
        createjs.Tween.get(this.namePlate, { loop: false, override:true })
            .to({ alpha: 1.0 }, 400);
    }
};
var titan = function() {
    console.log("Attack of Titan");
    if (-1.0 <= this.scaleX && this.scaleX <= 1.0) {
        createjs.Tween.get(this, { loop: false, override:true })
            .to({ scaleX: 1.1, scaleY: 1.1 }, 250)
            .to({ scaleX: 0.8, scaleY: 0.8 }, 150)
            .to({ scaleX: 1.3, scaleY: 1.3 }, 250)
            .to({ scaleX: 1.1, scaleY: 1.1 }, 150)
            .to({ scaleX: 1.6, scaleY: 1.6 }, 250)
            .call(function() {this.isAction = false;});
        var borderBottom = canvas.height - this.image.height * this.scaleY / 2;
        if (borderBottom < this.y) this.y = borderBottom;
    } else {
        //this.scaleX = 2.0;
        //this.scaleY = 2.0;
        createjs.Tween.get(this, { loop: false, override:true })
            .to({ scaleX: 1.1, scaleY: 1.1 }, 250)
            .to({ scaleX: 1.3, scaleY: 1.3 }, 250)
            .to({ scaleX: 0.8, scaleY: 0.8 }, 150)
            .to({ scaleX: 1.1, scaleY: 1.1 }, 150)
            .to({ scaleX: 0.8, scaleY: 0.8 }, 250)
            .call(function() {this.isAction = false;});
        this.changeScale();
    }
    this.moveOption();
    this.setBallonPos();
};