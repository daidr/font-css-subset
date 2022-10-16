module.exports = {
    readFile: function (file, options, callback) {
        console.log('readFile', file, options, callback);
    },
    readFileSync: function (file, options) {
        console.log('readFileSync', file, options);
    },
    promises: {
        readFile: function (file, options) {
            console.log('readFile', file, options);
            return new Promise(function (resolve, reject) {
                resolve('readFile');
            });
        }
    }
}