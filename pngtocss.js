var fs = require('fs'),
    PNG = require('png-js'),
    sizeOf = require('image-size'),
    rgb2hex = require('rgb2hex'),
    argv = require('optimist').argv,
    imageSrc = argv._[0],
    imgArr = [],
    output = argv._[1],
    className = argv._[2] || 'pixel-img',
    cssStr,
    pixel,
    color,
    arr,
    i,
    c,
    h;

'use strict';

// Initialize the css string
cssStr = '.' + className +' {\n    font-size: 1px;\n    height: 1px;\n    width: 1px;\n\n    box-shadow:\n';

// Decode the image
PNG.decode(imageSrc, function(pixels) {
    'use strict';

    sizeOf(imageSrc, function (err, dimensions) {
        if (err) {
            throw err;
        }

        // Go through every value in pixels
        c = 0;
        for (i = 0; i < pixels.length; i += 1) {
            // Create a pixel
            if (c === 0) {
                arr = [];
            }

            arr.push(pixels[i]);

            c += 1;

            if (c === 4) {
                imgArr.push(arr);
                c = 0;
            }
        }

        // Create the rows
        c = 0;
        h = 0;
        for (i = 0; i < imgArr.length; i += 1) {
            pixel = imgArr[i];
            if (pixel[3] === 255) {
                color = rgb2hex('rgb(' + pixel[0] +',' + pixel[1] +',' + pixel[2] +')').hex;
                cssStr += '        ' + c + 'em ' + h + 'em 0 ' + color + ',\n';
            }

            c += 1;

            if (c === dimensions.width) {
                c = 0;
                h += 1;

                if (h < dimensions.height) {
                    cssStr += '\n        /* Line ' + h +' */\n';
                }
            }
        }

        // End the css file
        cssStr = cssStr.slice(0, cssStr.length - 2);
        cssStr += '\n}';

        // Save the css file
        fs.writeFile(output, cssStr, function(err) {
            if (err) {
                throw err;
            }

            console.log('Success!');
        });
    });
});
