var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
let connections = [];
let file = ""
let arr = [];
let count = 0;
let start_time = 0;
let end_time = 0;
let checkHash = "ccggatttgacgaagtttttcgggggtaaagctacggatgctat";
function readFile() {
    file = fs.readFileSync('inputHash.txt', 'utf8');
    //divide into 4
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
readFile();
io.on('connection', function(socket) {
    connections.push(socket);
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
        count++;
        if(count===4){
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
});


server.listen(3000, function() {
    console.log('Server listening at port %d', 3000);
});