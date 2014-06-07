(function($){
    
	JsBarcode = function(image, content, options) {
        
        var merge = function(m1, m2) {
            for (var k in m2) {
                m1[k] = m2[k];
            }
            return m1;
        };
	
		//Merge the user options with the default
        options = merge(JsBarcode.defaults, options);

		//Create the canvas where the barcode will be drawn on
		var canvas = document.createElement('canvas');
		
		//Abort if the browser does not support HTML5canvas
		if (!canvas.getContext) {
			return image;
		}
        
		var encoder = new window[options.format](content);
		
		//Abort if the barcode format does not support the content
		if(!encoder.valid()){
			return this;
		}
		
		//Encode the content
		var binary = encoder.encoded();
		
		//Get the canvas context
		var ctx    = canvas.getContext("2d");
		
		//Set the width and height of the barcode
		canvas.width = binary.length*options.width+2*options.quite;
		canvas.height = options.height;
		
		//Paint the canvas
		ctx.clearRect(0,0,canvas.width,canvas.height);
		if(options.backgroundColor){
			ctx.fillStyle = options.backgroundColor;
			ctx.fillRect(0,0,canvas.width,canvas.height);
		}
		
		//Creates the barcode out of the encoded binary
		ctx.fillStyle = options.lineColor;
		for(var i=0;i<binary.length;i++){
			var x = i*options.width+options.quite;
			if(binary[i] == "1"){
				ctx.fillRect(x,0,options.width,options.height);
			}			
		}
		
		//Grab the dataUri from the canvas
		uri = canvas.toDataURL('image/png');
		
		//Put the data uri into the image
        if (image.attr) { //If element has attr function (jQuery element)
            return image.attr("src", uri);
        }
		else { //DOM element
            image.setAttribute("src", uri);
        }

	};
	
	JsBarcode.defaults = {
		width:	2,
		height:	100,
		quite: 10,
		format:	"CODE128",
		backgroundColor:"#fff",
		lineColor:"#000"
	};
    
    //Extend jQuery
    if ($) {
        $.fn.JsBarcode = function(content, options) {
            JsBarcode(this, content, options);
        };
    }
    
    //Add as global object
    window["JsBarcode"] = JsBarcode;

})(jQuery);