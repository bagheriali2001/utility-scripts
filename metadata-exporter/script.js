const arg_reader = incoming_args => {
    const arg = {};
    for (let i = 2; i < incoming_args.length; i++) {
        if (incoming_args[i].startsWith("--")) {
            const longArg = incoming_args[i].split("=");
            const longArgFlag = longArg[0].slice(2).replace(/-/g, "_");
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            arg[longArgFlag] = longArgValue;
        } else if (incoming_args[i].startsWith("-")) {
            const flags = incoming_args[i].slice(1).split("");
            for (const flag of flags) {
                arg[flag] = true;
            }
        }
    }
    return arg;
};

const args = arg_reader(process.argv.slice());

const fs = require("fs");
const path = require("path");

let file_check = 0;
let no_files = false;

const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

const log = (text) => {
    if (args["no_log"]) return;
    console.log(text);
};

const getMetadata = async (file_path) => {
    const file = {};
    file.file_name = path.basename(file_path);
    file.file_extension = path.extname(file_path);
    try{
        file.file_id_dir = (fs.lstatSync(file_path).isDirectory() && file.file_extension != ".DIR") ? true : false;
        file.file_size = fs.statSync(file_path).size;
        file.file_created_at = fs.statSync(file_path).birthtime;
        file.file_modified_at = fs.statSync(file_path).mtime;
    } catch (err) {
        log(err);
    }
    file_check++;
    if(file_check % 1000 == 0) log(`${file_check} files checked! last file path is ${file_path}`);
    return file;
};

const getMetadataForAllFiles = async (folder_path) => {
    const files = fs.readdirSync(folder_path);
    let metadata = [];
    for (let file of files) {
        
        const md = await getMetadata(path.join(folder_path, file));
        if (md.file_id_dir) {
            md.childData = await getMetadataForAllFiles(path.join(folder_path, file));
        }
        metadata.push(md);
    }
    return metadata;
}

const saveMetadata = async (folder_path, data) => {
    fs.writeFileSync(
        `${getFileName(folder_path)}.json`, 
        JSON.stringify(
            data, null, 2
        )
    );
}

const calculateSizePrint = (size) => {
    if (size == 0) return "0 Byte";
    let i = 0;
    while (size > 1024) {
        size = size / 1024;
        i++;
    }
    return Math.round(size, 3) + " " + sizes[i];
}

const visualizeMetadata = async (metadata, level = 0) => {
    let text = "";
    let total_size = 0;

    await metadata.sort( (a, b) => {
        if (a.file_id_dir && !b.file_id_dir) return -1;
        else if (!a.file_id_dir && b.file_id_dir) return 1;
        else if (a.file_name < b.file_name) return -1;
        else if (a.file_name > b.file_name) return 1;
        return 0;
    });


    for (let item of metadata) {
        if (item.file_id_dir) {
            const folderData = await visualizeMetadata(item.childData, level+1);
            item.file_size = folderData.total_size;
            if(item.file_size){
                total_size += +item.file_size;
            }
            text += `${" ".repeat(level*4)}- ${item.file_name}, ${calculateSizePrint(+item.file_size)} \n`;
            if (folderData.text) text += `${folderData.text}${ (folderData.text[folderData.text.length-1] != "\n" || folderData.text[folderData.text.length-2] != "\n") ? "\n" : ""}`;
        } else {
            if (!no_files) text += `${" ".repeat(level*4)}- ${item.file_name}, ${calculateSizePrint(+item.file_size)} \n`;
            if(item.file_size){
                total_size += +item.file_size;
            }
        }
    }
    return {
        text: (!args["depth"] || level < args["depth"]) ? text : "",
        total_size: total_size,
        json: metadata,
    };
}

const getFileName = (file_path) => {
    if(args["output_file"])
        return args["output_file"];
    else if(path.basename(file_path))
        return path.basename(file_path);
    else if (path.dirname(file_path) === file_path)
        return file_path.split(":")[0] || "result";
    else
        return "result";
}

const printMetadata = async (folder_path, text, total_size) => {
    fs.writeFileSync(
        `${getFileName(folder_path)}.txt`, 
        `${folder_path}, ${calculateSizePrint(total_size)} \n${text}`
    );
}

const main = async () => {
    const folder_path = args["folder_path"];
    if (args["no_files"]) no_files = true;
    if (folder_path) {
        const data = await getMetadataForAllFiles(folder_path)
        let beatifiedData = await visualizeMetadata(data);
        if (args["json"] || args["j"]) saveMetadata(folder_path, beatifiedData.json);
        if (args["txt"] || args["t"]) printMetadata(folder_path, beatifiedData.text, beatifiedData.total_size);
        console.log("Done!");
    } else {
        console.log("Please provide folder path as argument!");
    }
}

main();