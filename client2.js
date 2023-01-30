var io = require('socket.io-client');
var prompt = require('prompt-sync')();
var socket = io.connect("http://localhost:3000");

let checkHash = ""
let str = ""
let checkHash_l = 0;
let found = -1;
socket.on("get checkHash", function(data){
    console.log("checkHash is: ",data);
    checkHash = data;
    checkHash_l = checkHash.length;
});

socket.on("get data", function(data){
    // console.log("str is : ", data);
    str = data;

    found = implementSearch(str, checkHash);
    if(found > -1){
        console.log("found");
        socket.emit("found", {found:found, id:4});
    }else{
        console.log("not found");
        socket.emit("found", {found:found, id:4});
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
