var fs = require('fs');

var file = fs.readFileSync('inputHash.txt', 'utf8');
var checkHash = "ccggatttgacgaagtttttcgggggtaaagctacggatgctat";
var checkHash_l = checkHash.length;

let start_time = 0
let end_time = 0
let found = -1;

start_time = new Date().getTime();
found = implementSearch(file, checkHash);
end_time = new Date().getTime();
console.log("time taken: ", end_time - start_time);

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