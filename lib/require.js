
/*global File */
var require;

(function() {
    'use strict';
    
    var Exports = {},
        Dir     = '';
        
    require = function(name) {
        // $.writeln("requireBefore: " + name) // for debugging
        // removes any parent references "../" and resolves the path name to the filename only 
        name = name.lastIndexOf("../") > -1 ? name.substr(name.lastIndexOf("/"), name.length) : name;
        // removes "./" prefix to avoid ~/Desktop/build/lib/./lib.main.js issues
        name = name.lastIndexOf("./") > -1 ? name.replace(new RegExp(/\.\//m), "") : name;
        // $.writeln("requireAfter: " + name) // for debugging
        var code,
            exports     = {},
            file        = openFile(Dir + name),
            filename    = file.fullName,
            dirname     = getDir(filename);
            
        if (Exports[filename])
            exports = Exports[filename];
        else
            code = readFile(file, function(error, code) {
                var fn;
                
                if (error) {
                    throwError(error, file.name);
                } else {
                    error = tryCatch(function() {
                        var args = [
                            'exports',
                            'require',
                            '__filename',
                            '__dirname'];
                        
                        fn = Function(args, code);
                        
                        fn(exports, require, filename, dirname);
                    });
                    
                    if (error) {
                        if (/.js$/.test(error.message))
                            name = '';
                        else
                            name = file.name;
                        
                        throwError(error.message, name);
                    }
                    
                    Exports[filename]   = exports;
                }
            });

        return exports;
    };
    
    require.dir = function(dir) {
        // $.writeln("require.dir: " + dir) // for debugging
        Dir = dir;
    };
    
    function getDir(path) {
        // $.writeln("getDir: " + path); // for debugging
        var index   = path.lastIndexOf('/'),
            dir     = path.slice(0, index) || '/';
        
        return dir;
    }
    
    function openFile(name) {
        // $.writeln("openFile " + name) // for debugging
        var file = tryOpen(name, ['.js', '.jsx']);
        return file;
    }
    
    function readFile(file, callback) {
        var data = file.read(data);
        
        if (!file.error)
            file.close();
        
        callback(file.error, data, file);
    }
    
    function tryOpen(name, exts) {
        var file;
        
        some(exts, function(ext) {
            var is;
            
            file = new File(name + ext);
            // $.writeln("tryOpen: " + file); // for debugging
            file.encoding = 'UTF-8';
            
            is = file.open('r:');
            
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
        } catch(err) {
            error = err;
        }
        
        return error;
    }
    
    function some(array, fn) {
        var i, is,
            n = array.length;
        
        for (i = 0; i < n; i++) {
            is = fn(array[i], i, n);
            
            if (is)
                break;
        }
    }
    
})();
