
/* Create ImageFlow instances when the DOM structure has been loaded */
domReady(function()
{
	var test = new ImageFlow();
	test.init({ ImageFlowID: 'test', 
				imagePath: 'test/',
				reflectPath: '../'  
				});
});