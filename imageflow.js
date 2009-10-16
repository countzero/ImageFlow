/**
 *	ImageFlow 0.4
 *
 *	This code is based on Michael L. Perrys Cover flow in Javascript.
 *	For he wrote that "You can take this code and use it as your own" [1]
 *	this is my attempt to improve some things. Feel free to use it! If
 *	you have any questions on it leave a message in my shoutbox [2].
 *
 *	The reflection is generated server-sided by a slightly hacked  
 *	version of Richard Daveys easyreflections [3] written in PHP.
 *	
 *	The mouse wheel support is an implementation of Adomas Paltanavicius
 *	JavaScript mouse wheel code [4].
 *
 *
 *	[1] http://www.adventuresinsoftware.com/blog/?p=104#comment-1981
 *	[2] http://shoutbox.finnrudolph.de/
 *	[3] http://reflection.corephp.co.uk/v2.php
 *	[4] http://adomas.org/javascript-mouse-wheel/
 */


/* Define global variables */
var caption_id = "i1";
var new_caption_id = "";
var current = 0;
var target = 0;
var timer = 0;
var array_images = new Array();

/* This variable must be changed to the used reflection image height in % of the source image */
var reflection_p = 0.5;

function step()
{
	switch (target < current-1 || target > current+1) 
	{
		case true:
			moveTo(current + (target-current)/3);
			window.setTimeout(step, 50);
			timer = 1;
			break;

		default:
			timer = 0;
			break;
	}
}

function glideTo(x, new_caption_id)
{	
	/* Animate gliding to new x position */
	target = x;
	if (timer == 0)
	{
		window.setTimeout(step, 50);
		timer = 1;
	}

	/* Display new caption */
	caption_id = new_caption_id;
	caption = document.getElementById(caption_id)
	if (caption) caption_div.innerHTML = caption.innerHTML;
}

function moveTo(x)
{
	current = x;
	var zIndex = max;
	
	/* Loop */
	for (var index = 0; index < max; index++)
	{ 
		var image = img_div.childNodes.item(array_images[index]);
		var z = Math.sqrt(10000 + x * x)+100;
		var xs = x / z * size + size;
		
		/* Get current image properties */
		var img_h = image.height;
		var img_w = image.width;
		
		/* Check source image format. Get image height minus reflection height! */
		switch ((img_w + 1) > (img_h / (reflection_p + 1))) 
		{
			/* Landscape format */
			case true:
				var img_percent = 118;
				break;

			/* Portrait and square format */
			default:
				var img_percent = 100;
				break;
		}
		
		/* Process new image height and top spacing */
		var new_img_h = (img_h / img_w * img_percent) / z * size;
		var new_img_top = (images_width * 0.33 - new_img_h) + images_top + ((new_img_h / (reflection_p + 1)) * reflection_p);

		/* Set new image properties */
		image.style.left = xs - (img_percent / 2) / z * size + imageflow_left + "px";
		image.style.height = new_img_h + "px";
		image.style.width= "";
		image.style.top = new_img_top + "px";

		/* Set image layer through zIndex */
		switch ( x < 0) 
		{
			case true:
				zIndex++;
				break;

			default:
				zIndex = zIndex -1;
				break;
		}
		image.style.zIndex = zIndex;

		x += 150;
	}
}

/* Main function */
function refresh()
{
	/* Cache document objects in global script variables */
	img_div = document.getElementById("images");
	caption_div = document.getElementById("captions");
	
	/* Change images div properties */
	images_width = img_div.offsetWidth;
	var images_height = images_width * 0.33;
	img_div.style.height = images_height + "px";

	/* Change captions div properties */
	caption_div.style.top = img_div.offsetTop + images_height + "px";
	caption_div.style.width = images_width + "px";
	caption_div.innerHTML = document.getElementById(caption_id).innerHTML;
	
	/* Cache global variables, that only change on refresh */
	imageflow_left = document.getElementById("imageflow").offsetLeft;
	images_top = img_div.offsetTop;
	size = images_width * 0.5;
	max = img_div.childNodes.length;
	
	/* Cache correct node type indices in an array */
	var count=0;
	for (var index = 0; index < max; index++)
	{ 
		var image = img_div.childNodes.item(index);
		if (image.nodeType == 1)
		{
			array_images[count] = index;
			count++;
		}
	}
	max = array_images.length;

	/* Display images in current order */
	moveTo(current);
}

/* Show/hide functions */
function show(id) {
	var element = document.getElementById(id);
	element.style.visibility = "visible";
}
function hide(id) {
	var element = document.getElementById(id);
	element.style.visibility = "hidden";
}

/* Hide loading div and show the images div */
window.onload = function() {
	hide('loading');
	show('images');
	refresh();
}

window.onresize = refresh;

/* JavaScript mouse wheel support */
function handle(delta) {

	var caption_id_int = caption_id.substr(1);
	caption_id_int = parseInt(caption_id_int);

	switch (delta > 0) 
	{
	case true:
		if(target != 0)
		{
			target = target + 150;
			new_caption_id = 'i' + (caption_id_int - 1);
		}
		break;

	default:
		if(caption_id_int < max)
		{
			target = target - 150;
			new_caption_id = 'i' + (caption_id_int + 1);
			break;
		}
	}
	glideTo(target, new_caption_id);
}

/* JavaScript mouse wheel support */
function wheel(event){
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta) {
		delta = event.wheelDelta/120; 
	} else if (event.detail) {
		delta = -event.detail/3;
	}
	if (delta)
		handle(delta);
        if (event.preventDefault)
                event.preventDefault();
        event.returnValue = false;
}

/* Initialization code */
if (window.addEventListener)
	window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;
