preload();
var stage;
var avatar;
var images = {};
var canvas = document.getElementById('canvas');

var actionDict = {
    'dash': '加速装置(×10)',
    'hide': '熱光学迷彩',
    'titan': '怒りの巨人化'
};

stage = new createjs.Stage('canvas');

function init() {
    document.getElementById('btn-warning-ok').addEventListener('click', function() { document.getElementById('factory-warning').style.display = 'none'; });
    document.getElementById('avatar-name').addEventListener('blur', function() {
        var name = document.getElementById('avatar-name').value;
        localStorage.setItem('name', name);
        document.getElementById('name').value = name;
    });
    loadHandleName();

    // Step.1 アバター一覧の読み込もう
    loadAvatarList();
}

function createAvatar() {
    tickerStart();

    var date = Date.now();
    var name = document.getElementById('name').value;
    var id = name + date;
    var imageKey = document.getElementById('image-key').value;
    var action = document.getElementById('action-name').value;

    if (avatar === undefined) {

        // Step.2 アバターの生成を画面内に生成しよう
        avatar = new User(id, name, imageKey, action);

        stage.addChild(avatar);
    } else {
        avatar.image = images[imageKey];
    }

    // Step.3 'dash'[走る]，'hide'[隠れる]，'titan'[巨大化]のいずれかをアクションとして設定しよう
    avatar.actionSelector('hide');

    actionToUI(avatar);

    // Step.4 キーボード入力を読み取れるようにしよう
    document.addEventListener('keydown', avatarControl);

    var btn = document.getElementById('button-login');
    // Step.6 さあ，世界へ飛び出そう！
    btn.addEventListener('click', helloWorld);
}

function sendMessage(e) {
    if(e.keyCode === 13) {
        var message = this.value;
        this.value = '';
        // Step.5 メッセージの吹き出しを表示しましょう
        avatar.talk(message);

        this.blur();
        this.removeEventListener('keydown', sendMessage);
        document.addEventListener('keydown', avatarControl);
    }
}

function avatarControl(e) {
    var key = e.keyCode;
    switch (key) {
        case 16: // Shift goto message
            document.removeEventListener('keydown', avatarControl);
            document.getElementById('msg_input').addEventListener('keydown', sendMessage);
            var textInput = document.getElementById('msg_input');
            textInput.focus();
            return null;
        case 17: // Ctrl action 起動
            avatar.action();
            break;
        case 37: // Left
        case 38: // Up
        case 39: // Right
        case 40: // Down
            avatar.walk(key.toString());
            break;
        default:
                console.log(key);
            break;
    }
}

function loadAvatarList() {
    var dataMap = {
        'char1': {
            img: './assets/images/m-64x64.png',
            name: 'ひげの人',
            at: '@mushroom',
            description: '配管工のアルバイトをしているという噂の25歳。恋人が誘拐されがちなのが悩み。'
        },
        'char2': {
            img: './assets/images/p-64x64.png',
            name: 'ぴか獣',
            at: '@picker',
            description: '世界の節電のために爆誕したげっ歯類代表。わりと漏電しているので水場では注意だ。'
        },
        'char3': {
            img: './assets/images/c-64x64.png',
            name: '固体の蛇',
            at: '@mr.cardboard',
            description: '段ボール大好きおじさん。常に段ボールをかぶっているので，素顔を知る人は少ない。'
        },
        'char4': {
            img: './assets/images/v-64x64.png',
            name: 'ピンク玉',
            at: '@vacuum',
            description: '吸引力の落ちない掃除機に内蔵されている生物を模した着ぐるみ。ただの着ぐるみ。'
        },
        'char5': {
            img: './assets/images/i-64x64.png',
            name: '岩男',
            at: '@iwao',
            description: '家庭用お手伝いロボット。動力源はまさかの光合成。いつも青白いので体調が心配。'
        },
        'char6': {
            img: './assets/images/d-64x64.png',
            name: 'たかし',
            at: '@dragon',
            description: '漢字では隆。拳がすべての世界で生きる日本人。赤い鉢巻きがラッキーアイテム。'
        }
    }

    for (var key in dataMap) {
        var t = document.querySelector('#template');
        t.content.querySelector('strong').innerHTML = dataMap[key].name;
        t.content.querySelector('small').innerHTML = dataMap[key].at;
        t.content.querySelector('span').innerHTML = dataMap[key].description;
        t.content.querySelector('img').src = dataMap[key].img;

        var clone = document.importNode(t.content, true);
        var div = document.getElementById('character-list');
        div.appendChild(clone);
    }

    [].forEach.call(document.getElementsByClassName('card'),function(card){
        card.addEventListener('click', function(e) {
            var name = document.getElementById('avatar-name').value;
            if (name !== '') {
                [].forEach.call(document.getElementsByClassName('card'), function (card) {
                    if (card.classList.contains("notification")) {
                        card.classList.remove('notification');
                        card.classList.remove('is-success');
                    }
                });
                var name = this.querySelector('small').innerHTML.substr(1);
                var nameDom = document.getElementById('image-key');
                nameDom.value = name;
                this.classList.add('notification');
                this.classList.add('is-success');
                createAvatar();
            } else {
                document.getElementById('factory-warning').style.display = 'block';
            }
        });
    });
}


function actionToUI(avatar) {
    document.getElementById('action-name').value = avatar.actionName;
    document.getElementById('action').innerHTML = actionDict[avatar.actionName];
}

function  getAbsolutePos(element) {
    var x1 = element.getBoundingClientRect().left + window.pageXOffset;
    var y1 = canvas.getBoundingClientRect().top + window.pageYOffset;
    var x2 = element.getBoundingClientRect().right + window.pageXOffset;
    var y2 = canvas.getBoundingClientRect().bottom + window.pageYOffset;
    return {
        left: x1,
        top: y1,
        right: x2,
        bottom: y2,
        width: x2 - x1,
        height: y2 - y1
    };
}


// Create.js 関連
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
        "src": "./assets/images/d-64x100.png"
    }
    ];
    // 指定したリスト（マニフェスト）に従って画像を読み込む
    queue.loadManifest(manifest, false);
    queue.load();
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

function tickerStart() {
    // タイマーの設定。描画の変更は一括で
    createjs.Ticker.setFPS(30);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener("tick", stage);
}

function loadHandleName() {
    if (!window.localStorage) {
        console.log('This browser do not use Local Storage');
        return null;
    }
    var name = localStorage.getItem('name');
    if (name !== '') {
        document.getElementById('avatar-name').value = name;
        document.getElementById('name').value = name;
        document.getElementById('factory-warning').style.display = 'none';
    }
}

function helloWorld() {
    console.log('wait');
    var form = document.login;
    var name = form.name.value;
    var key = form.imageKey.value;
    var act = form.actionName.value;
    if (name !== '' && key !== '' && act !== '') {
        console.log('send');
        form.submit();
    }
}