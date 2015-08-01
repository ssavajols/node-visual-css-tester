var fs = require('fs');
var modelHelper = require('./modelLoader');
var dot = require('dot');

/**
 * [[Description]]
 * @param   {String}   file     [[Description]]
 * @param   {String}   model    [[Description]]
 * @param   {Function} callback [[Description]]
 * @returns {Boolean}  [[Description]]
 */
exports.load = function(file, model, callback){
    
    if( !typeof file === "string" ){
        callback({message: 'no file founded'});
        return false;
    }
    
    if( !model ){
        callback({message: 'no model founded'});
        return false;
    }
    
    if( typeof model === 'string'){
        model = modelHelper.load(model);
    }
    
    fs.readFile(file, 'utf8', function(err, content){

        if( err ){
            callback(err, null);
            return;
        }
        
        var template = dot.template(content);

        try {
            var templateCompiled = template(model);
            callback(null, templateCompiled);
        }catch(e){
            callback({message:e.message}, null);
        }
        
    });

};