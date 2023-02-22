const args = process.argv.slice();
const fs = require('fs');

if(typeof args[2] != "string" && !Number.isInteger(Number(args[2]))){
	throw new Error(`First argument must be a number!`)
}
const count = Number(args[2]);

if(typeof args[3] != "string" && (args[3] != "windows" || args[3] != "linux")){
	throw new Error(`Second argument must be 'windows' or 'linux'!`)
}

if(typeof args[4] != "string"){
	throw new Error(`Third argument must be a string!`)
}

if(typeof args[5] != "string"){
	throw new Error(`Forth argument must be a string!`)
}

let regexString = "";
let pipeString = "";
args[5].split(",").forEach((item) => {
	regexString += `^[ *]*${item.trim()}$|`;
	pipeString += `${item.trim()},`;
});
regexString = regexString.slice(0, regexString.length - 1);
pipeString = pipeString.slice(0, pipeString.length - 1);

let command = "";
if(args[3] == "windows"){
	for(let i = 0 ; i < count; i++){
		command += `cd "${ args[6 + i] }"; git remote update origin --prune; git checkout ${args[4]}; git branch --merged ${args[4]} | ForEach-Object {echo $_; if($_ | Select-String -Pattern "${regexString}"){echo nope} else {git branch $_.Trim() -d}};`
	}
	fs.writeFileSync('./script.ps1', command);
}
else if(args[3] == "linux"){
	for(let i = 0 ; i < count; i++){
		command += `cd "${ args[6 + i] }"; git remote update origin --prune; git checkout ${args[4]}; git branch --merged ${args[4]} | grep -v -E "(${pipeString})" | xargs git branch -d;`
	}
	fs.writeFileSync('./script.sh', command);
}

