var fs = require("fs");
var qs = require('querystring');
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
                    var name = new String("'" + POST.name + "'");
                    output = output.replace("<<NAME>>", name);
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
        case '/assets/images/m-256x400.png':
            var png = fs.readFileSync('./assets/images/m-64x100.png');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(png);
            res.end();
            break;
        case '/assets/avatown.ico':
            var png = fs.readFileSync('./assets/avatown.ico');
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.write(png);
            res.end();
            break;
        case '/assets/nomalize.css':
            var png = fs.readFileSync('./assets/nomalize.css');
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(png);
            res.end();
            break;
        case '/assets/style.css':
            var png = fs.readFileSync('./assets/style.css');
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(png);
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
    socket.on("connected", function (name) {
        var msg = '{"keycode":"login","name":"' + name + '"}';
        userHash[socket.id] = name;
        console.log("userHash:" + userHash);
        io.sockets.emit("publish", {value: msg});
    });

    // メッセージ送信カスタムイベント
    socket.on("publish", function (data) {
        io.sockets.emit("publish", {value:data.value});
    });

    // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
    socket.on("disconnect", function () {
        if (userHash[socket.id]) {
            //var msg = userHash[socket.id] + "が退出しました";
            var msg = '{"keycode":"logout","name":"' + userHash[socket.id] + '"}'
            delete userHash[socket.id];
            io.sockets.emit("publish", {value: msg});
        }
    });
});


