const azure = require('azure-storage');
const _ = require('lodash');

const CONTAINER = 'defaultpolimi'
const RTX_FILE = 'rtx.log'
const ACCESS_FILE = 'apache.log'

var blobSvc = azure.createBlobService();


blobSvc
    .listBlobsSegmented(CONTAINER, null, (error, result, response) => {
        if (!error) {

            let files = result.entries;

            let rtxBlob = _.find(files, {
                name: RTX_FILE
            });

            if (!rtxBlob) {
                uploadLog(RTX_FILE, RTX_FILE)
            } else {
                appendLog(RTX_FILE, rtxBlob.name)
            }

            let accessBlob = _.find(files, {
                name: ACCESS_FILE
            });

            if (!accessBlob) {
                uploadLog(ACCESS_FILE, ACCESS_FILE)
            } else {
                appendLog(ACCESS_FILE, accessBlob.name)
            }

        } else {
            console.log(error)
        }
    })


let uploadLog = function (file, name, callback) {

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
}