const azure = require('azure-storage');
const _ = require('lodash');
const configuration = require('../config/configuration.json');

var blobSvc = azure.createBlobService();

let getStatsFileName = function (callback) {

    blobSvc
        .listBlobsSegmentedWithPrefix(configuration.container, configuration.exportFolder, null, (error, result, response) => {
            if (!error) {

                let files = result.entries;

                files = _.orderBy(files, 'lastModified', 'desc')
                let latest = files[0]

                let fileArray = latest.name.split("/")
                let file = fileArray.slice(0, fileArray.length - 1).join('/') + '/part-00000'


                return callback(null, file)
            } else {
                return callback(error);
            }
        })
}

/*let uploadLog = function (file, name, callback) {

    return blobSvc.createAppendBlobFromLocalFile(CONTAINER, name, file, (error, result, response) => {
        if (!error) {
            console.log(file + ' uploaded');

            if (callback) {
                return callback();
            }
        }
    });

}

let appendLog = function (file, name, callback) {

    console.log(file)
    console.log(name)
    blobSvc.appendFromText(CONTAINER, name, "\nberna1", function (error, result, response) {
        if (!error) {
            console.log( file + ' updated');
        }
    });
}*/


let getStatistics = function (callback) {
    let container = configuration.container;

    return getStatsFileName((error, fileName) => {

        blobSvc.getBlobToText(container, fileName, (error, result, response) => {
            if (error) {
                return callback(error)
            }

            console.log(result)
            return callback(null, result)
        })
    })
}

let sendData = function (data, callback) {

    let container = configuration.container;
    let file = configuration.logName;
    blobSvc.appendFromText(container,file, data, function (error, result, response) {
        if (error) {
            return callback(error)
        }
        console.log('updated');
        return callback(null, response);
    });
}

module.exports = {
    getStatistics: getStatistics,
    sendData: sendData
}