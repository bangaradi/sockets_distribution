var io = require('socket.io-client');
var prompt = require('prompt-sync')();
var socket = io.connect("http://localhost:3000");

let checkHash = ""
let str = ""
let checkHash_l = 0;
let found = -1;

let start_time = 0
let end_time = 0

socket.on("get checkHash", function(data){
    console.log("checkHash is: ",data);
    checkHash = data;
    checkHash_l = checkHash.length;
});

socket.on("disconnect it", function(){
    socket.disconnect();
});

socket.on("get data", function(data){
    // console.log("str is : ", data);
    str = data;

    start_time = new Date().getTime();
    found = implementSearch(str, checkHash);
    end_time = new Date().getTime();
    console.log("time taken: ", end_time - start_time);
    if(found > -1){
        console.log("found");
        socket.emit("found", {found:found, id:0});
    }else{
        console.log("not found");
        socket.emit("found", {found:found, id:0});
    }

});

function implementSearch(str, checkHash){
    let str_l = str.length;
    let checkHash_l = checkHash.length;
    let count = 0;
    for(let i = 0; i < str_l; i++){
        let temp = str.substring(i, i+checkHash_l);
        if(temp == checkHash){
            console.log("found at: ", i);
            return i;
        }
    }
    console.log("not found");
    return -1;
}

socket.emit("connected");
