function User(id, name, imageKey, actionName, x, y, scaleX, scaleY, alpha, speed) {
    this.id = id;
    this.name = name;
    this.imageKey = imageKey;
    this.image = images[this.imageKey];
    this.actionName = actionName;
    this.scaleX = scaleX || 0.8;
    this.scaleY = scaleY || 0.8;
    this.x = x || window.innerWidth / 2 - this.image.width / 2;
    this.y = y || canvas.height - this.image.height * this.scaleY - 700;
    this.regX = this.image.width * this.scaleX / 2;
    this.regY = this.image.height * this.scaleY / 2;
    this.alpha = alpha || 1.0;
    this.speed = speed || 5;

    this.namePlate = new createjs.Text(name, "24px serif", "DarkRed");
    this.namePlate.x = window.innerWidth / 2 - this.image.width / 2;
    this.namePlate.y = this.y - 30;
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
    this.actionSelector();
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
            this.changeScale();
            var borderTop = canvas.height - this.image.height * this.scaleY / 2 - 700;
            if (this.y < borderTop) this.y = borderTop;
            break;
        case '39': // Right
            this.x += this.speed;
            var borderRight = canvas.width - this.image.width * this.scaleX / 2;
            if (borderRight < this.x) this.x = borderRight;
            if(this.scaleX < 0) {
                this.turn();
            }
            break;
        case '40': // Down
            this.y += this.speed;
            this.changeScale();
            var borderBottom = canvas.height - this.image.height * this.scaleY / 2;
            if (borderBottom < this.y) this.y = borderBottom;
            break;
        default:
            console.log('引数が不正です');
    }
    this.moveOption();
    this.setBallonPos();
};
User.prototype.moveOption =  function() {
    this.namePlate.x = this.x + this.regX;
    this.namePlate.y = this.y - this.regY - 30;
    this.namePlate.regX = this.regX;
};
User.prototype.changeScale = function() {
    if (this.scaleX < -1.5 || 1.5 < this.scaleX) return null;
    var scale = (1 - (canvas.height - this.image.height * this.scaleY - this.y) / 700) / 4;
    if (this.scaleX < 0) {
        this.scaleX = -scale - 0.8;
        this.scaleY = scale + 0.8;
        this.regX = this.image.width * -this.scaleX / 2;
    } else {
        this.scaleX = this.scaleY = scale + 0.8;
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
    this.isAction = true;

    // アクションの実態　面白そうなものがあったら増やす（残像とか）
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


    // アニメーションが終わったら
    this.isAction = false;
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

// Todo input type=hidden にアクションのデータを設定するようにフロントでは頑張る。
// 固有のアクションの設定
User.prototype.actionSelector = function () {
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
            break;
    }
};

var dash = function () {
    console.log("Let's Dash");
    if (this.speed === 5) this.speed = 50;
    else this.speed = 5;
};
var hide = function () {
    console.log("I am Shinobi");
    if (this.alpha === 1.0) {
        this.alpha = 0.05;
        this.namePlate.alpha = 0.05;
    } else {
        this.alpha = 1.0;
        this.namePlate.alpha = 1.0;
    }
};
var titan = function() {
    console.log("Attack of Titan");
    if (-1.5 <= this.scaleX && this.scaleX <= 1.5) {
        this.scaleX = 2.0;
        this.scaleY = 2.0;
        var borderBottom = canvas.height - this.image.height * this.scaleY / 2;
        if (borderBottom < this.y) this.y = borderBottom;
    } else {
        this.scaleX = 0.8;
        this.changeScale();
    }
    this.moveOption();
    this.setBallonPos();
};