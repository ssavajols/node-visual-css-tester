var fs = require('fs');
var casper = require('casper');
var args = require('casper').create();
var sys = require('system');

fs.changeWorkingDirectory(__dirname('../'));

var phantomcss = require('./node_modules/phantomcss/phantomcss.js');
var domain;
var viewportWidth, viewportHeight;
var url, capture, template, templateId, layout, scriptName, accessibility, cookies, phantomcssconfig;


capture          = decodeURIComponent(args.cli.get("captureSelector"));  // selector to use for capture
templateId       = decodeURIComponent(args.cli.get("templateId"));  // template id
template         = decodeURIComponent(args.cli.get("templateFile"));  // template to use (.dot)
layoutPath       = decodeURIComponent(args.cli.get("layoutPath"));  // layoutPath or url to test
scriptName       = decodeURIComponent(args.cli.get("scriptName"));  // script to use
accessibility    = decodeURIComponent(args.cli.get("accessibility"));  // test accessibility and export report
cookies          = decodeURIComponent(args.cli.get("cookies"));  // cookies
viewportWidth    = decodeURIComponent(args.cli.get("viewportWidth"));  // ViewportWidth
viewportHeight   = decodeURIComponent(args.cli.get("viewportHeight"));  // ViewportHeight
phantomcssconfig = decodeURIComponent(args.cli.get("phantomcssconfig"));  // phantomcss confifugation


// Default viewport sizes
viewportWidth  = viewportWidth  ? viewportWidth  : 1024;
viewportHeight = viewportHeight ? viewportHeight : 768;

// Apply phantom config
phantomcss.init(JSON.parse(phantomcssconfig));

/**
* Load casperjs custom script test
*/
scriptTest = (function(name){
    var script;
    
    try {
        script = require('./scripts/casperjs/'+name);
    }catch(e){}

    if( typeof script !== "function"){
        return function(){};
    }
    
    return script;

})(scriptName);

// Set layout or page to test
if( layoutPath.indexOf('http') === -1 ){

    layoutPath = "file://"+layoutPath;

}else{

    try {
        cookies = JSON.parse(cookies);
    }catch(e){
        cookies = null;
    }

    domain = layoutPath.replace(/http(s?):\/\/([a-zA-Z0-9]+\.)/, "").split('/')[0];

    // set cookies
    if( cookies && domain ){
        for(var attr in cookies){
            phantom.addCookie({
                'name': attr,
                'value': cookies[attr],
                'domain': domain
            });
        }
    }

}

/**
*   ========
*   CasperJS 
*   ========
*/

// load layout or page
casper = casper.create({
    clientScripts:[
        './conf/axs_testing.js'
    ],
    viewportSize:{
        width: viewportWidth,
        height: viewportHeight
    }
})

.start(layoutPath)

.then(function(){
    this.echo("Currently testing : " + layoutPath + "\n");  
    this.echo(Array(30).join('-') + "\n");  
    this.echo("template id : " + layoutPath + "\n");  
    this.echo("script name : " + scriptName + "\n");  
    this.echo("capture selector : " + capture + "\n");  
    this.echo("Accessibility enabled : " + accessibility + "\n");  
    this.echo(Array(30).join('-') + "\n");
})

// Inject template to page
.thenEvaluate(function(templateId, template){
        //__utils__.echo("=====================\nStarting test\n==================");

        var node = document.createElement('div');
        node.id = templateId;
        node.innerHTML = template;

        __utils__.findOne('.DOMInjection').appendChild(node);

        //__utils__.echo("COOKIES INSIDE PAGE :::: \n" + document.cookie);
        //__utils__.echo("FROM DOM : ");

        //__utils__.echo(__utils__.findOne('html').innerHTML);
        //__utils__.echo("=====================\nEnding test\n==================");


}, templateId, template);

// Test accessibility
if( accessibility === "true" ){

    casper.thenEvaluate(function(){
        var results = axs.Audit.run();
        window.axsReport = axs.Audit.createReport(results);
    })

    .then(function(){
        this.echo(this.getGlobal("axsReport"));
    });

}

// execute test
casper.then(function(){   
    scriptTest(
        casper,
        phantomcss, {
            scriptName: scriptName,
            capture: capture,
            template: template,
            templateId: templateId,
            layoutPath: layoutPath
            });
})

// Capture page render
.then(function(){
    phantomcss.screenshot(capture, templateId);
})

// Compare screenshots 
.then(function(){
    phantomcss.compareAll();
})

// End of test
.run(function(){

    casper.echo(Array(30).join('='));
    casper.echo("test ended : " + templateId);
    casper.echo(Array(30).join('='));
    
    casper.exit();
});


function __dirname(string){
    var fullPath = sys.args[3].split("/");
    fullPath.pop();
    if( string ){
        fullPath.push(string);
    }
    return fullPath.join("/");
}
