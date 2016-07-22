var fs = require("fs");
var qs = require('querystring');
require('date-utils');
var server = require("http").createServer(function(req, res) {
    console.log(req.url);
    switch(req.url) {
        case '/':
            if (req.method=='POST') {
                var POST = '';
                var body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function() {
                    POST = qs.parse(body);
                    res.writeHead(200, {"Content-Type":"text/html"});
                    var output = fs.readFileSync("./index.html", "utf-8");
                    console.log(POST);
                    var dt = new Date();
                    var formatted = dt.toFormat("YYYYMMDDHH24MISS");
                    //var date= new String("'" + formatted + "'");
                    output = output.replace("<<NAME>>", POST.name)
                                    .replace("<<DATE>>", formatted)
                                    .replace("<<IMAGE>>", POST.imageKey)
                                    .replace("<<ACTION>>", POST.actionName);
                    res.end(output);
                });
            }
            break;
        case '/avatownModel.js':
            var js = fs.readFileSync('./avatownModel.js', 'utf-8');
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(js);
            res.end();
            break;
        case '/user.js':
            var js = fs.readFileSync('./user.js', 'utf-8');
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(js);
            res.end();
            break;
        case '/assets/images/m-64x100.png':
            var png = fs.readFileSync('./assets/images/m-64x100.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/p-64x100.png':
            var png = fs.readFileSync('./assets/images/p-64x100.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/v-64x100.png':
            var png = fs.readFileSync('./assets/images/v-64x100.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/c-64x100.png':
            var png = fs.readFileSync('./assets/images/c-64x100.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/i-64x100.png':
            var png = fs.readFileSync('./assets/images/i-64x100.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/m-64x64.png':
            var png = fs.readFileSync('./assets/images/m-64x64.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/p-64x64.png':
            var png = fs.readFileSync('./assets/images/p-64x64.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/v-64x64.png':
            var png = fs.readFileSync('./assets/images/v-64x64.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/c-64x64.png':
            var png = fs.readFileSync('./assets/images/c-64x64.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/i-64x64.png':
            var png = fs.readFileSync('./assets/images/i-64x64.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/images/r-64x64.png':
            var png = fs.readFileSync('./assets/images/r-64x64.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/avatown.ico':
            var ico = fs.readFileSync('./assets/avatown.ico');
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.write(ico);
            res.end();
            break;
        case '/assets/css/nomalize.css':
            var css = fs.readFileSync('./assets/css/nomalize.css');
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(css);
            res.end();
            break;
        case '/assets/css/style.css':
            var css = fs.readFileSync('./assets/css/style.css');
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(css);
            res.end();
            break;
        case '/assets/css/lib/bulma.css':
            var css = fs.readFileSync('./assets/css/lib/bulma.css');
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(css);
            res.end();
            break;
    }
}).listen(8000);
var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};

// 2.イベントの定義
io.sockets.on("connection", function (socket) {

    // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
    socket.on("connected", function (id, name, img, act) {
        var msg = '{"keycode":"login","id":"' + id +'","name":"' + name +'","imageKey":"' + img +'","actionName":"' + act + '"}';
        console.log(msg);
        userHash[socket.id] = id;
        console.log("userHash:" + userHash);
        io.sockets.emit("publish", {value: msg});
    });

    // メッセージ送信カスタムイベント
    socket.on("publish", function (data) {
        //io.sockets.emit("publish", {value:data.value});
        socket.broadcast.emit("publish", {value: data.value});
    });

    // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
    socket.on("disconnect", function () {
        if (userHash[socket.id]) {
            console.log(userHash[socket.id] + 'is disconnect!');
            var msg = '{"keycode":"logout","id":"' + userHash[socket.id] + '"}';
            delete userHash[socket.id];
            io.sockets.emit("publish", {value: msg});
        }
    });
});


