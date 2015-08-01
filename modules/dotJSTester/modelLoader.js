var fs = require('fs');

/**
 * [[Description]]
 * @param   {[[Type]]} file [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
exports.load = function(file){
    var json;
    
    try {
        json = require(file);
    }catch(e){
        console.log(e);
        json = {};
    }
    
    return json;
    
};