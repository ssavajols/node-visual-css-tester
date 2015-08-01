var fs = require('fs');

module.exports = {
    /*
        libraryRoot is relative to this file and must point to your 
        phantomcss folder (not lib or node_modules). If you are using 
        NPM, this will be './node_modules/phantomcss'.
    */
    libraryRoot: './node_modules/phantomcss',

    screenshotRoot: '../../phantomcss/screenshots',

    /*
        By default, failure images are put in the './failures' folder. 
        If failedComparisonsRoot is set to false a separate folder will 
        not be created but failure images can still be found alongside 
        the original and new images.
    */
    failedComparisonsRoot: '../../phantomcss/failures',

    /*
        Remove results directory tree after run.  Use in conjunction 
        with failedComparisonsRoot to see failed comparisons.
    */
//    cleanupComparisonImages: true,

    /*
        You might want to keep master/baseline images in a completely 
        different folder to the diffs/failures.  Useful when working 
        with version control systems. By default this resolves to the 
        screenshotRoot folder.
    */
    comparisonResultRoot: '../../phantomcss/results',

    /*
        Don't add label to generated failure image
    */
    addLabelToFailedImage: false,

    /*
        Mismatch tolerance defaults to  0.05%. Increasing this value 
        will decrease test coverage
    */
    mismatchTolerance: 0.05,


    /*
        Prefix the screenshot number to the filename, instead of suffixing it
    */
    prefixCount: true,

    /*
        Output styles for image failure outputs genrated by 
        Resemble.js
    */
    outputSettings: {
        //errorColor: {
        //    red: 255,
        //    green: 0,
        //    blue: 0
        //},
        errorType: 'movement',
        transparency: 1
    }
};