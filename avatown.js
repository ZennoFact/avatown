var fs = require("fs");
var qs = require('querystring');
var server = require("http").createServer(function(req, res) {
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
        })

    } else {

    }
}).listen(8000);
var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};

// 2.イベントの定義
io.sockets.on("connection", function (socket) {

    // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
    socket.on("connected", function (name) {
        var msg = name + "が入室しました";
        userHash[socket.id] = name;
        io.sockets.emit("publish", {value: msg});

    });

    // メッセージ送信カスタムイベント
    socket.on("publish", function (data) {
        io.sockets.emit("publish", {value:data.value});
    });

    // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
    socket.on("disconnect", function () {
        if (userHash[socket.id]) {
            var msg = userHash[socket.id] + "が退出しました";
            delete userHash[socket.id];
            io.sockets.emit("publish", {value: msg});
        }
    });
});