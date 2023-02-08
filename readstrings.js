let fs = require('fs');

let listToPermute = [];
function readStrings() {
    let file = fs.readFileSync('list.txt', 'utf8');
    file = file.split(" ");
    file.forEach(str => {
        listToPermute.push(str);
    });
    console.log(listToPermute);
}

readStrings();