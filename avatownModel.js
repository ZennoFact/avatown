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
    var h = window.innerHeight - 50;
    if (h < 764) h = 764;
    // Canvas要素の大きさを画面幅・高さに合わせる
    stage.canvas.width = w;
    stage.canvas.height = h;

    //TODO なぜか出ない
    document.getElementById('canvas').style.backgroundColor = '#a0d8ef';
    var shape = new createjs.Shape();
    shape.graphics.beginFill("#000").drawRect(0,0,100,100);
    shape.x = 10;
    shape.y = 10;
    stage.addChild(shape);
    stage.update();
    //ground = new createjs.Shape();
    //ground.graphics.beginFill("DarkRed");
    //ground.graphics.drawRect(0, stage.height - 700, stage.width, 700);
    //stage.addChild(ground);
    console.log('mapset');

    //currentUser = new User(data.id, data.name, data.imageKey, data.actionName);
    currentUser = new User(myId, myName, myImageKey, myActionName);
    stage.addChild(currentUser);
    console.log('userset');
    currentUser.addMessage('Hello world!');
}


function preload() {
    var queue = new createjs.LoadQueue(false);
    queue.setMaxConnections(2);
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
        "src": "./assets/images/r-64x100.png"
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
    images['mushroom'] = result["mushroom"];
    images['picker'] = result["picker"];
    images['vacuum'] = result["vacuum"];
    images['mr.cardboard'] = result["mr.cardboard"];
    images['iwao'] = result["iwao"];
    images['dragon'] = result["dragon"];

    init();
}

function handleResize(event) {
    var w = window.innerWidth;
    var h = window.innerHeight - 50;
    if (h < 764) h = 764;
    // Canvas要素の大きさを画面幅・高さに合わせる
    stage.canvas.width = w;
    stage.canvas.height = h;

    ground.width = w;
    ground.y = h - 700;
}

// タイマーの設定。描画の変更は一括で
createjs.Ticker.setFPS(30);
createjs.Ticker.useRAF = true;
createjs.Ticker.addEventListener("tick", stage);