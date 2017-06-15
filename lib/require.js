"use strict";
/*global File */
var require;
(function () {
    'use strict';
    var Exports = {}, Dir = '';
    require = function (name) {
        var code, exports = {}, file = openFile(Dir, name), filename = file.fullName, dirname = Dir;
        if (Exports[filename])
            exports = Exports[filename];
        else
            code = readFile(file, function (error, data) {
                var fn;
                if (error) {
                    throwError(error, file.name);
                }
                else {
                    error = tryCatch(function () {
                        var args = [
                            'exports',
                            'require',
                            '__filename',
                            '__dirname'
                        ];
                        fn = Function(args, data);
                        fn(exports, require, filename, dirname);
                    });
                    if (error) {
                        if (/.js$/.test(error.message))
                            name = '';
                        else
                            name = file.name;
                        throwError(error.message, name);
                    }
                    Exports[filename] = exports;
                }
            });
        return exports;
    };
    require.dir = function (mainScriptRoot) {
        Dir = mainScriptRoot;
    };
    function parseName(rootDir, requiredName){
        var parsedName;
        var countParents;
        
        requiredName = requiredName.replace(new RegExp(/^(.*?)\//), "");

        if(requiredName.lastIndexOf("../") > -1){
            parsedName = requiredName.split("../");
            countParents = parsedName.length - 1;
            rootDir = rootDir.split("/").slice(0, -countParents).join("/");
            parsedName = rootDir + "/" + parsedName[countParents];
        } else {
            parsedName = rootDir + "/" + requiredName;
        }
        return parsedName;
    }
    function openFile(Dir, name) {
        name = parseName(Dir, name);
        var file = tryOpen(name, ['.js', '.jsx']);
        return file;
    }
    function readFile(file, callback) {
        var fileData = file.read();
        if (!file.error)
            file.close();
        callback(file.error, fileData);
    }
    function tryOpen(name, exts) {
        var file;
        some(exts, function (ext) {
            var is;
            file = new File(name + ext);
            file.encoding = 'UTF-8';
            is = file.open('r');
            return is;
        });
        if (file.error) {
            throwError(file.error, file.name);
        }
        return file;
    }
    function throwError(error, fileName) {
        if (fileName)
            fileName = ' in ' + fileName;
        throw Error(error + fileName);
    }
    function tryCatch(fn) {
        var error;
        try {
            fn();
        }
        catch (err) {
            error = err;
        }
        return error;
    }
    function some(array, fn) {
        var i, is, n = array.length;
        for (i = 0; i < n; i++) {
            is = fn(array[i], i, n);
            if (is)
                break;
        }
    }
})();
