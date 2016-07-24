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
    this.x = x || canvasRect.width / 7;
    this.y = y || canvasRect.height / 8;
    this.alpha = alpha || 1.0;
    this.speed = speed || 5;

    this.namePlate = new createjs.Text(name, "12px consolas", "#40aaef");
    this.namePlate.x = this.x;
    this.namePlate.y = this.y;
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
    console.log('avatar:' + this.x + ', ' + this.y);
    switch(key) {
        case '37': // Left
            this.x -= this.speed;
            if (this.x < 35) this.x = 35;
            if(this.scaleX > 0) {
                this.turn();
            }
            // マイナスの時に軸が動く
            this.namePlate.x = this.x - this.image.width / 2;
            break;
        case '38': // Up
            this.y -= this.speed;
            if (this.y < this.regY) this.y = this.regY;
            break;
        case '39': // Right
            this.x += this.speed + window.pageXOffset;
            var borderRight = canvas.width - this.image.width * this.scaleX / 2;
            if (270 < this.x) this.x = 270;
            if(this.scaleX < 0) {
                this.turn();
            }
            break;
        case '40': // Down
            this.y += this.speed;
            if ( 95 < this.y ) this.y = 95;
            break;
        default:
            console.log('引数が不正です');
    }
    this.moveOption();
    this.setBallonPos();
};
User.prototype.moveOption =  function() {
    this.namePlate.x = this.x;
    this.namePlate.y = this.y - 20;
};

User.prototype.turn = function() {
    this.scaleX *= -1;
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
    this.balloon.x = 10 + this.x * 3;
    this.balloon.y = 200 + this.y * 2;

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
    var hideRate = 0.1;
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
    if (-0.7 <= this.scaleX && this.scaleX <= 0.7) {
        createjs.Tween.get(this, { loop: false, override:true })
            .to({ scaleX: 0.6, scaleY: 0.6 }, 250)
            .to({ scaleX: 0.5, scaleY: 0.5 }, 150)
            .to({ scaleX: 0.7, scaleY: 0.7 }, 250)
            .to({ scaleX: 0.6, scaleY: 0.6 }, 150)
            .to({ scaleX: 0.8, scaleY: 0.8 }, 250)
            .call(function() {this.isAction = false;});
        var borderBottom = canvas.height - this.image.height * this.scaleY / 2;
        if (borderBottom < this.y) this.y = borderBottom;
    } else {
        //this.scaleX = 2.0;
        //this.scaleY = 2.0;
        createjs.Tween.get(this, { loop: false, override:true })
            .to({ scaleX: 0.5, scaleY: 0.5 }, 250)
            .to({ scaleX: 0.6, scaleY: 0.6 }, 250)
            .to({ scaleX: 0.4, scaleY: 0.4 }, 150)
            .to({ scaleX: 0.5, scaleY: 0.5 }, 150)
            .to({ scaleX: 0.4, scaleY: 0.4 }, 250)
            .call(function() {this.isAction = false;});
    }
    this.moveOption();
    this.setBallonPos();
};