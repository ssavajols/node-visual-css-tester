var casperService = require('./modules/casper-service');
var dotJSTester = require('./modules/dotJSTester');
var dotPath = './public/templates/some.dot';

/**
 *
 * @type {null|array}
 */
exports.pages = null;

/**
 *
 * @type {null|array}
 */
exports.dots = null;

/**
 *
 * @type {*|exports|module.exports}
 */
exports.phantomcssconfig = require('./conf/config-phantomcss.js');

/**
 * run tester
 * @param ipages
 * @param idots
 */
exports.run = function(ipages, idots, iphantomcssconfig){

    var pages = ipages || exports.pages;
    var dots = idots || exports.dots;
    var phantomcssconfig = iphantomcssconfig || exports.phantomcssconfig;

    /**
    * Page mode
    */
    (function iterate(i){

        if( pages === null || pages.length === 0 ){
            console.log('No pages to test.', '\n');
            return;
        }


        if( i >= pages.length ){
            return;
        }

        setImmediate((function(page){

            return function(){

                var url = page.url,
                    captureSelector = page.captureSelector,
                    id = page.id,
                    script = page.script,
                    accessibility = page.accessibility,
                    cookies = JSON.stringify(page.cookies),
                    viewportWidth  = page.viewport ? page.viewport.width : 1024,
                    viewportHeight = page.viewport ? page.viewport.height : 768;

                casperService.page(url, captureSelector, id, script, accessibility, cookies, viewportWidth, viewportHeight, phantomcssconfig, function(err, stdout){
                    if( err ){
                        console.log(err.message);
                        return;
                    }

                    console.log(stdout);

                });
            }
        })(pages[i]));

    })(0);

    /**
    * Template mode
    */
    (function iterate(i){

        if( dots === null || dots.length === 0 ){
            console.log('No dots to test.', '\n');
            return;
        }

        if( i >= dots.length ){
            return;
        }

        // @TODO: remplacer par setImmediate (meilleur gestion des resouces)
        setImmediate((function(dot){

            return function(){

                var captureSelector = dot.captureSelector,
                    id = dot.id,
                    path = dot.path,
                    model = dot.model,
                    script = dot.script,
                    layout = dot.layout,
                    accessibility = dot.accessibility,
                    cookies = dot.cookies,
                    viewportWidth  = dot.viewport ? dot.viewport.width : 1024,
                    viewportHeight = dot.viewport ? dot.viewport.height : 768;

                dotJSTester.dot.load(path, model,
                                 function(err, content){
                                    if( err ){
                                        console.log('error: ' + err.message);
                                        return;
                                    }

                                    casperService.dot(captureSelector, id, content, layout, script, accessibility, cookies, viewportWidth, viewportHeight, phantomcssconfig, function(err, stdout){
                                        if( err ){
                                            console.log(err.message);
                                            return;
                                        }

                                        console.log(stdout);
                                    });
                                });

            }

        })(dots[i]));

        iterate(i+1);

    })(0);

};
