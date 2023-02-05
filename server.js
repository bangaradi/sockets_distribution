var app = require('express')();
// var io = require('socket.io')(server);
const { Server } = require('socket.io');
var fs = require('fs');
var cors = require('cors');
const http = require('http');
const server = http.createServer(app);
let connections = [];
let node_connections = [];
let provider_connections = [];
let file = ""
let arr = [];
let count = 0;
let start_time = 0;
let end_time = 0;
let checkHash = "";
function readFile() {
    file = fs.readFileSync('hash.txt', 'utf8');
    // divide into 4
    console.log(file.length);
    let len = file.length;
    let chunk = len / 4;
    let start = 0;
    let end = chunk;
    for (let i = 0; i < 4; i++) {
        arr.push(file.substring(start, end));
        start = end;
        end += chunk;
    }
}

// app.use(cors())

// const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: ['*'],
//         allowedHeaders: ['*'],
//     },
// });

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Access-Control-Allow-Origin"],
    }
  });

readFile();
checkHash = file.substring(39560300, 39560350);
console.log("checkHash: ", checkHash);
io.on('connection', function(socket) {
    connections.push(socket);
    console.log("connection: ", socket.id)
    console.log('Connected: %s sockets connected', connections.length);
    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
    socket.on('get data', function(data) {
        console.log("inside get data",data);
        socket.emit('get data', arr[parseInt(data)]);
    });
    socket.on('get checkHash', function(data) {
        console.log("inside get checkHas: ",data);
        socket.emit('get checkHash', checkHash);
    });
    socket.on('found', function(...args) {
        console.log("inside found :",args);
        console.log("client: ", args[0].id, "status: ", args[0].found);
        let id = "";
        let found = false;
        if(args[0].found !== -1){
            id = args[0].id;
            found = true;
        }
        count++;
        if(count===node_connections.length){
            provider_connections[0].emit("found", {found:found, id:id})
            end_time = new Date().getTime();
            console.log("time taken: ", end_time - start_time);
        }
    });
    socket.on("connected", function(){
        if(connections.length === 4){
            console.log("all connected");
            start_time = new Date().getTime();
            for(let i = 0; i < 4; i++){
                connections[i].emit("get checkHash", checkHash);
                connections[i].emit("get data", arr[i]);
            }
        }
    });

    socket.on("join node", function(){
        node_connections.push(socket);
        console.log("node connected: ", socket.id);
        console.log("node connected: ", node_connections.length);
    });

    socket.on("join provider", function(){
        provider_connections.push(socket);
        console.log("provider connected: ", socket.id);
        console.log("provider connected: ", provider_connections.length);
    });

    // split data into number of nodes and send to each node
    socket.on("split data", function(data){
        console.log("inside split data");
        start_time = new Date().getTime();
        let len = file.length;
        let chunk = len / node_connections.length;
        let start = 0;
        let end = chunk;
        for (let i = 0; i < node_connections.length; i++) {
            node_connections[i].emit("get data", data.substring(start, end));
            start = end;
            end += chunk;
        }
    });

});

// add cors option on get request
// app.get('/', cors(), function(req, res) {
//     res.send("hello");
// });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
    });

server.listen(3001, function() {
    console.log('Server listening at port %d', 3001);
});