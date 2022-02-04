const fs = require('fs');
const util = require('util');
//
// SAVE data to file path
//
exports.saveFile = async (data, path) => {
    await fs.promises.writeFile(path, data, err => {
        if (err) {
            console.error(err);
            return {
                error: err
            };
        }
    });
    return {
        path: path,
        status: 200
    };
}
//
// SAVE text file
//
exports.saveTextFile = async (data, fileName) => {
    let status = 200;
    try {
        await fs.promises.writeFile(fileName, data, err => {
            if (err) {
                console.error(err);
            }
        });
    } catch (err) {
        console.log('write error', err);
        status = 404
    }

    return {
        fileName: fileName,
        status: status
    };
}
//
// WRITE image file
//
exports.writeImageFile = async (data, path) => {
    fs.writeFile(path, data, () => console.log(`finished downloading! ${path}`));
};
//
// DELETE a directory path and all it's sub directories
//
exports.deletePage = async (path) => {

    if (fs.existsSync(path)) {
        fs.rm(path, {
            recursive: true
        }, (err) => {
            if (err) {
                throw err;
            }
            console.log(`${path} is deleted!`);
        });
    } else {
        return {
            path: path,
            status: 404
        };
    }

    return {
        path: path,
        status: 200
    };
};
//
// CREATE a directory of path
//
exports.createDirectory = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: true
        });
    }
}
//
// DOES path exist
//
exports.directoryExists = (path) => {
    return fs.existsSync(path);
}
//
// TRIM the http(s)://www.x.xx and separate out the file name
//
exports.trimPath = (path) => {
    let fileName = path.substring(path.lastIndexOf("/") + 1);
    let tempPath = path.substring(path.indexOf("//") + 2, path.lastIndexOf("/"));
    tempPath = tempPath.substring(tempPath.indexOf("/") + 1);
    if (!fs.existsSync(`../maintain/${tempPath}`)) {
        fs.mkdirSync(`../maintain/${tempPath}`, {
            recursive: true
        });
    }
    return {
        path: tempPath,
        fileName: fileName
    };
}
//
// READ a text file at path
//
exports.readFile = (path) => {
    const data = fs.readFileSync(path, {
        encoding: 'utf8',
        flag: 'r'
    });
    return data;
}