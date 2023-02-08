let strArr = []
function permute(str, l, r)
{
	if (l == r){
        strArr.push(str);
    }else{
			for (let i = l; i <= r; i++)
			{
				str = swap(str, l, i);
				permute(str, l + 1, r);
				str = swap(str, l, i);
			}
		}
}

function swap(a, i, j)
{
	let temp;
    let charArray = a.split("");
    temp = charArray[i] ;
    charArray[i] = charArray[j];
    charArray[j] = temp;
    return (charArray).join("");
}

let str = "abcdefghi"
let n = str.length;
console.log("string: ", str.length);
let start_time = new Date().getTime();
//find permutations
// str.forEach(str1 => permute(str1, 0, n-1));
permute(str, 0, n-1);
// permute(str, 0, n-1);
// permute(str, 0, n-1);
let end_time = new Date().getTime();
console.log("time taken: ", end_time - start_time);
console.log(strArr.length);