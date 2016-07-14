/**
 * Created by K_Maeno on 2016/07/06.
 */

var User = function (name, head, hair, body, scale) {
    this.name = name;
    this.head = head;
    this.hair = hair;
    this.body = body;
    // TODO 世界の真ん中とかゲートのある位置に
    this.cx = 100;
    this.cy = 100;
    this.scale = scale;
    this.isAction = false;
};

User.prototype.talk = function(key) {

};
User.prototype.move = function() {

};
User.prototype.action1 = function() {
    this.isAction = true;

    // アニメーション


    // アニメーションが終わったら
    this.isAction = false;
};
