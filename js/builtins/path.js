module.exports = {
    dirname: function (path) {
        console.log('dirname', path);
        return 'dirname';
    },
    normalize: function (path) {
        console.log('normalize', path);
        return 'normalize';
    }
}