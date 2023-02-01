const fs = require('fs');
dictionary = ["a", "g", "c", "t"]
//write hash into file
function randomHashWriter() {
    let hash = "";
    for (let i = 0; i < 40000000; i++) {
        hash += dictionary[Math.floor(Math.random() * 4)];
    }
    fs.writeFileSync("hash.txt", hash);
}

randomHashWriter();

//read hash from file
function randomHashReader() {
    let hash = fs.readFileSync("hash.txt", "utf8");
    console.log(hash.length);
}

randomHashReader();
    