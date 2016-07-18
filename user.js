function User(name, imageKey, head, hair, body, x, y, scaleX, scaleY) {
    this.name = name;
    this.imageKey = imageKey;
    this.image = images[this.imageKey];
    this.head = head;
    this.hair = hair;
    this.body = body;
    this.scaleX = scaleX || 0.8;
    this.scaleY = scaleY || 0.8;
    this.x = x || window.innerWidth / 2 - this.image.width / 2;
    this.y = y || canvas.height - this.image.height * this.scaleY - 700;
    this.regX = this.image.width * this.scaleX / 2;
    this.regY = this.image.height * this.scaleY / 2;


    this.namePlate = new createjs.Text(name, "24px serif", "DarkRed");
    this.namePlate.x = window.innerWidth / 2 - this.image.width / 2;
    this.namePlate.y = this.y - 30;
    this.namePlate.textAlign = 'center';
    stage.addChild(this.namePlate);
    this.moveOption();
    // TODO メッセージを表示する引き出しを持たせておいたらいいんじゃないの？
    this.balloon = this.createBalloon();
    //最後の子要素として追加
    console.log(this.balloon);
    stage.addChild(this.balloon);
    this.addMessage('Hello world!');
    this.setBallonPos();
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
            this.x -= 5;
            var borderLeft = this.image.width * -this.scaleX - this.regX; // 右向きの時はscaleXは必ずマイナスなので調整
            if (this.x < borderLeft) this.x = borderLeft;
            if(this.scaleX > 0) {
                this.turn();
            }
            // マイナスの時に軸が動く
            this.namePlate.x = this.x - this.image.width / 2;
            break;
        case '38': // Up
            this.y -= 5;
            this.changeScale();
            var borderTop = canvas.height - this.image.height * this.scaleY / 2 - 700;
            if (this.y < borderTop) this.y = borderTop;
            break;
        case '39': // Right
            this.x += 5;
            var borderRight = canvas.width - this.image.width * this.scaleX / 2;
            if (borderRight < this.x) this.x = borderRight;
            if(this.scaleX < 0) {
                this.turn();
            }
            break;
        case '40': // Down
            this.y += 5;
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
User.prototype.action1 = function() {
    this.isAction = true;

    // アニメーション


    // アニメーションが終わったら
    this.isAction = false;
};

// name, image, head, hair, body, scale, x, y, scaleX
User.prototype.toJsonString = function () {
  return '{"name":"' + this.name + '",' +
          '"imageKey":"' + this.imageKey + '",' +
           '"head":' + this.head + ',' +
           '"hair":' + this.hair + ',' +
           '"body":' + this.body + ',' +
              '"x":' + this.x + ',' +
              '"y":' + this.y + ',' +
         '"scaleX":' + this.scaleX + ',' +
         '"scaleY":' + this.scaleY + '}';
};

// IMに関する設定
User.prototype.createBalloon = function() {
    var div = document.createElement('div');
    div.innerHTML = 'test';
    div.setAttribute('id', this.name);
    div.classList.add('balloon');
    document.body.appendChild(div);
    return new createjs.DOMElement(this.name);
};
User.prototype.addMessage = function(message) {
    document.getElementById(this.name).innerHTML = message;
};
User.prototype.setBallonPos = function() {
    var balloon = document.getElementById(this.name);
    this.balloon.x = this.x - balloon.clientWidth / 2;
    if (this.balloon.x < 0) this.balloon.x = 0;
    else if (window.innerWidth - balloon.clientWidth < this.balloon.x) this.balloon.x = window.innerWidth - balloon.clientWidth;
    this.balloon.y = this.y - this.regY - 34 - balloon.clientHeight;

};