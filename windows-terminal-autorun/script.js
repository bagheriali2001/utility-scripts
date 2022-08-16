const args = process.argv.slice();
const fs = require('fs');

if(typeof args[2] != "string" && !Number.isInteger(Number(args[2]))){
	throw new Error(`First argument must be a number!`)
}
if(typeof args[3] != "string" && !Number.isInteger(Number(args[2]))){
	throw new Error(`Second argument must be a number!`)
}
if(typeof args[4] != "string"){
	throw new Error(`Third argument must be a string!`)
}

const tabsCount = Number(args[2]);
const panesCount = Number(args[3]);
let terminal = Number(args[4]);

if (terminal === "d" || terminal === "D" || terminal === "default" || terminal === "Default") {
	terminal = "PowerShell";
}

let command = "";

for(let i = 0 ; i < tabsCount; i++){
	if(i === 0)
		command += `wt -d "${ args[4 + i*2 + 1] }" ${terminal} -NoExit -Command "${ args[4 + i*2 + 2] }"; `
	else 
		command += `new-tab -d "${ args[4 + i*2 + 1] }" ${terminal} -NoExit -Command "${ args[4 + i*2 + 2] }"; `
}

for(let i = 0 ; i < panesCount; i++){
	if(i === 0)
		command += `new-tab -d "${ args[4 + tabsCount*2 + i*2 + 1] }" ${terminal} -NoExit -Command "${ args[4 + tabsCount*2 + i*2 + 2] }"; `
	else 
		command += `split-pane -d "${ args[4 + tabsCount*2 + i*2 + 1] }" ${terminal} -NoExit -Command "${ args[4 + tabsCount*2 + i*2 + 2] }"; `
}

fs.writeFileSync('./script.cmd', command);