var childProcess = require('child_process');

var parseArgs = function(args){

    var argsString = " "+Array.prototype.join.call(args, ' ') + " ";
    
    return argsString;
};

var service = function(argsString, callback){
    
    
    console.log('start casper service with args : ' + argsString.substring(0, 100)+'...');
    
    childProcess.exec('casperjs "'+__dirname+'/../../casperjs/casper-services.js" ' + argsString, function(err, stdout, stderr){
        if( err){
            console.log('casper error');
            callback && callback({message: err.message}, null);

        }

        callback && callback(null, stdout);

    });
    

};

exports.dot = function(captureSelector, templateId, templateFile, layoutPath, scriptName, accessibility, cookies, viewportWidth, viewportHeight, phantomcssconfig, callback){
    var args = [
        "--captureSelector="+encodeURIComponent(captureSelector),
        "--templateId="+encodeURIComponent(templateId),
        "--templateFile="+encodeURIComponent(templateFile),
        "--layoutPath="+encodeURIComponent(layoutPath),
        "--scriptName="+encodeURIComponent(scriptName),
        "--accessibility="+encodeURIComponent(accessibility),
        "--cookies="+encodeURIComponent(cookies),
        "--viewportWidth="+encodeURIComponent(viewportWidth),
        "--viewportHeight="+encodeURIComponent(viewportHeight),
        "--phantomcssconfig="+encodeURIComponent(JSON.stringify(phantomcssconfig))
    ];
    
    
    service(parseArgs(args), callback);
    

};

exports.page = function(url, captureSelector, id, scriptName, accessibility, cookies, viewportWidth, viewportHeight, phantomcssconfig, callback){
    var args = [
        "--captureSelector="+encodeURIComponent(captureSelector),
        "--templateId="+encodeURIComponent(id),
        "--templateFile="+encodeURIComponent("{}"),
        "--layoutPath="+encodeURIComponent(url),
        "--scriptName="+encodeURIComponent(scriptName),
        "--accessibility="+encodeURIComponent(accessibility),
        "--cookies="+encodeURIComponent(cookies),
        "--viewportWidth="+encodeURIComponent(viewportWidth),
        "--viewportHeight="+encodeURIComponent(viewportHeight),
        "--phantomcssconfig="+encodeURIComponent(JSON.stringify(phantomcssconfig))
    ];
    
    service(parseArgs(args), callback);
    
};

