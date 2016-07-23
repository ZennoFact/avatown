preload();
var stage;
var images = {};
stage = new createjs.Stage("canvas");
var ground;
// 画面のリサイズに関してイベントの登録と，ロード後一発目に起動させておく
window.addEventListener("resize", handleResize);

// 自分の使用しているユーザー
var currentUser;
// 接続している他のユーザーの一覧
var users = {};

function init() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (h < 764) h = 764;
    // Canvas要素の大きさを画面幅・高さに合わせる
    stage.canvas.width = w;
    stage.canvas.height = h;

    document.getElementById('canvas').style.backgroundColor = '#a0d8ef';
    var shape = new createjs.Shape();
    shape.graphics.beginFill("#d0a36a").drawRect(0, window.innerHeight -700, window.innerWidth, 700);
    stage.addChild(shape);

    if (myName === 'zenno30') myActionName = 'all';

    var actionDict = {
        'dash': '加速装置(×10)',
        'hide': '熱光学迷彩',
        'titan': '怒りの巨人化',
        'all': '全行為許可'
    };
    var t = document.querySelector('#template');
    t.content.querySelector('strong').innerHTML = myName;
    t.content.querySelector('small').innerHTML = '#' + actionDict[myActionName];
    t.content.querySelector('img').src = images['s-' + myImageKey].src;
    var clone = document.importNode(t.content, true);
    document.body.appendChild(clone);
    document.getElementById('msg_input').addEventListener('keydown', publishMessage);
    var card = document.getElementById('card');
    var cardElement = new createjs.DOMElement(card);
    cardElement.x = 10;
    cardElement.y = 10;
    stage.addChild(cardElement);


    currentUser = new User(myId, myName, myImageKey, myActionName);
    stage.addChild(currentUser);
    currentUser.addMessage('Hello world!');
}


function preload() {
    console.log(myImageKey);
    var queue = new createjs.LoadQueue(false);
    queue.setMaxConnections(2);
	var key;
	if (10 < myImageKey.length) key = 'c';
	else key = myImageKey.charAt(0);
    var manifest = [{
        "id": "mushroom",
        "src": "./assets/images/m-64x100.png"
    }, {
        "id": "picker",
        "src": "./assets/images/p-64x100.png"
    }, {
        "id": "vacuum",
        "src": "./assets/images/v-64x100.png"
    }, {
        "id": "mr.cardboard",
        "src": "./assets/images/c-64x100.png"
    }, {
        "id": "iwao",
        "src": "./assets/images/i-64x100.png"
    }, {
        "id": "dragon",
        "src": "./assets/images/d-64x100.png"
    }, {
        "id": "s-" + myImageKey,
        "src": "./assets/images/" + key + "-64x64.png"
    }
    ];
    // 指定したリスト（マニフェスト）に従って画像を読み込むよー
    queue.loadManifest(manifest, false);
    queue.load();
    // 読み込みが完了したら「handleComplete」って命令を起動するよ
    queue.addEventListener("complete", handleComplete);
}
function handleComplete(event) {
    // 読み込み完了に伴い，その結果を保存します
    var result = event.target._loadedResults;
    //for (var key in result) {
    //    images[key] = result;
    //}
    images['mushroom'] = result["mushroom"];
    images['picker'] = result["picker"];
    images['vacuum'] = result["vacuum"];
    images['mr.cardboard'] = result["mr.cardboard"];
    images['iwao'] = result["iwao"];
    images['dragon'] = result["dragon"];
    images['s-mushroom'] = result["s-mushroom"];
    images['s-picker'] = result["s-picker"];
    images['s-vacuum'] = result["s-vacuum"];
    images['s-mr.cardboard'] = result["s-mr.cardboard"];
    images['s-iwao'] = result["s-iwao"];
    images['s-dragon'] = result["s-dragon"];

    init();
}

function handleResize(event) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (h < 764) h = 764;
    // Canvas要素の大きさを画面幅・高さに合わせる
    stage.canvas.width = w;
    stage.canvas.height = h;
}

// タイマーの設定。描画の変更は一括で
createjs.Ticker.setFPS(30);
createjs.Ticker.useRAF = true;
createjs.Ticker.addEventListener("tick", stage);

function welcomToNight() {
    console.log(users.length);
    if (3 < users.length ) {
        canvas.backgroundColor = '#27313D';

    } else if (2 < users.length) canvas.backgroundColor = '#F84F5F';
    else if (1 < users.length) canvas.backgroundColor = '#3E5A99';
    else canvas.backgroundColor = '#F5F7FA';
}