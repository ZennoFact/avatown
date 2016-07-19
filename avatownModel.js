preload();
var stage;
var mario;
var images = {};
var userName;
//var user;
stage = new createjs.Stage("canvas");
// 画面のリサイズに関してイベントの登録と，ロード後一発目に起動させておく
window.addEventListener("resize", handleResize);
handleResize();

// 接続しているユーザーの一覧
var users = {};

function init() {
//        user = new User(mario).create(myName, 0, 1, 2, 0.5);
}


function preload() {
    var queue = new createjs.LoadQueue(false);
    queue.setMaxConnections(2);
    var manifest = [{
        "id": "mario",
        "src": "./assets/images/m-64x100.png"
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
    // 決めてあった箱に画像データを入れていくよ。
    // プログラムで「=」は，左辺のものに右辺のものを入れます意味です。イコールじゃないから要注意
    images['mario'] = result["mario"];

    init();
}

function handleResize(event) {
    var w = window.innerWidth;
    var h = window.innerHeight - 50;
    if (h < 764) h = 764;
    // Canvas要素の大きさを画面幅・高さに合わせる
    stage.canvas.width = w;
    stage.canvas.height = h;
    // 画面更新する
    //stage.update();
}

// タイマーの設定。描画の変更は一括で
createjs.Ticker.setFPS(30);
createjs.Ticker.useRAF = true;
createjs.Ticker.addEventListener("tick", stage);