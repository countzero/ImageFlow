/*
Name:       ImageFlow - (Marriot International)
Version:    1.2.2 (Oktober 17 2009)
Author:     Finn Rudolph
Support:    http://finnrudolph.de/ImageFlow

Licence:    ImageFlow is licensed under a Creative Commons 
            Attribution-Noncommercial 3.0 Unported License 
            (http://creativecommons.org/licenses/by-nc/3.0/).

            You are free:
                + to Share - to copy, distribute and transmit the work
                + to Remix - to adapt the work

            Under the following conditions:
                + Attribution. You must attribute the work in the manner specified by the author or licensor 
                  (but not in any way that suggests that they endorse you or your use of the work). 
                + Noncommercial. You may not use this work for commercial purposes. 

            + For any reuse or distribution, you must make clear to others the license terms of this work.
            + Any of the above conditions can be waived if you get permission from the copyright holder.
            + Nothing in this license impairs or restricts the author's moral rights.

Credits:    This script is based on Michael L. Perrys Cover flow in Javascript [1].
            The reflections are generated server-sided by a slightly hacked version 
            of Richard Daveys easyreflections [2] written in PHP. The mouse wheel 
            support is an implementation of Adomas Paltanavicius JavaScript mouse 
            wheel code [3]. It also uses the domReadyEvent from Tanny O'Haley [4].

            [1] http://www.adventuresinsoftware.com/blog/?p=104#comment-1981
            [2] http://reflection.corephp.co.uk/v2.php
            [3] http://adomas.org/javascript-mouse-wheel/
            [4] http://tanny.ica.com/ICA/TKO/tkoblog.nsf/dx/domcontentloaded-for-browsers-part-v
*/

/* ImageFlow constructor */
function ImageFlow ()
{
	/* Setting option defaults */
	this.defaults =
	{
		aspectRatio:        1.964,          /* Aspect ratio of the ImageFlow container (width divided by height) */
		buttons:            false,          /* Toggle navigation buttons */
		captions:           true,           /* Toggle captions */
		imageCursor:        'default',      /* Cursor type for all images - default is 'default' */
		ImageFlowID:        'imageflow',    /* Default id of the ImageFlow container */
		imageFocusM:        1.0,            /* Multiplicator for the focussed image size in percent */
		imageFocusMax:      4,              /* Max number of images on each side of the focussed one */
		imageScaling:       true,           /* Toggle image scaling */ 
		imagesHeight:       0.67,           /* Height of the images div container in percent */
		imagesM:            1.0,            /* Multiplicator for all images in percent */
		onClick:            function() { document.location = this.url; },   /* Onclick behaviour */
		opacity:            false,          /* Toggle image opacity */
		opacityArray:       [10,8,6,4,2],   /* Image opacity (range: 0 to 10) first value is for the focussed image */
		percentLandscape:   118,            /* Scale landscape format */
		percentOther:       100,            /* Scale portrait and square format */
		preloadImages:      true,           /* Toggles loading bar (false: requires img attributes height and width) */
		reflections:        true,           /* Toggle reflections */
		reflectionGET:      '',             /* Pass variables via the GET method to the reflect_.php script */
		reflectionP:        0.5,            /* Height of the reflection in percent of the source image */
		reflectionPNG:      false,          /* Toggle reflect2.php or reflect3.php */
		scrollbarP:         0.6,            /* Width of the scrollbar in percent */
		slider:             true,           /* Toggle slider */
		sliderCursor:       'e-resize',     /* Slider cursor type - default is 'default' */
		sliderWidth:        14,             /* Width of the slider in px */
		startID:            1,              /* Glide to this image ID on startup */
		startAnimation:     false,          /* Animate images moving in from the right on startup */
		xStep:              150             /* Step width on the x-axis in px */
	};

	
	/* Closure for this */
	var thisObject = this;

	
	/* Initiate ImageFlow */
	this.init = function (options)
	{
		/* Evaluate options */
		var optionsArray = ['aspectRatio', 'buttons', 'captions', 'imageCursor', 'imagesM', 'ImageFlowID', 'imageFocusM', 'imageFocusMax', 'imagesHeight', 'onClick', 'opacity', 'opacityArray', 'percentLandscape', 'percentOther', 'preloadImages', 'reflections', 'reflectionGET', 'reflectionP', 'reflectionPNG','imageScaling', 'scrollbarP', 'slider', 'sliderCursor', 'sliderWidth', 'startID', 'startAnimation', 'xStep'];
		var max = optionsArray.length;
		for (var i = 0; i < max; i++)
		{
			var name = optionsArray[i];
			this[name] = (options !== undefined && options[name] !== undefined) ? options[name] : thisObject.defaults[name];
		}

		/* Try to get ImageFlow div element */
		var ImageFlowDiv = document.getElementById(thisObject.ImageFlowID);
		if(ImageFlowDiv)
		{
			/* Set it global within the ImageFlow scope */
			ImageFlowDiv.style.visibility = 'visible';
			this.ImageFlowDiv = ImageFlowDiv;

			/* Try to create XHTML structure */
			if(this.createStructure())
			{
				this.imagesDiv = document.getElementById(thisObject.ImageFlowID+'_images');
				this.captionDiv = document.getElementById(thisObject.ImageFlowID+'_caption');
				this.navigationDiv = document.getElementById(thisObject.ImageFlowID+'_navigation');
				this.scrollbarDiv = document.getElementById(thisObject.ImageFlowID+'_scrollbar');
				this.sliderDiv = document.getElementById(thisObject.ImageFlowID+'_slider');
				this.buttonNextDiv = document.getElementById(thisObject.ImageFlowID+'_next');
				this.buttonPreviousDiv = document.getElementById(thisObject.ImageFlowID+'_previous');

				this.indexArray = [];
				this.current = 0;
				this.imageID = 0;
				this.target = 0;
				this.memTarget = 0;
				this.firstRefresh = true;
				this.firstCheck = true;
				this.busy = false;

				/* Toggle Slider */
				if(this.slider === false)
				{
					this.scrollbarDiv.style.display = 'none';
				}

				/* Set height of the ImageFlow container and center the loading bar */
				var width = this.ImageFlowDiv.offsetWidth;
				var height = Math.round(width / thisObject.aspectRatio);
				document.getElementById(thisObject.ImageFlowID+'_loading_txt').style.paddingTop = ((height * 0.5) -22) + 'px';
				ImageFlowDiv.style.height = height + 'px';

				/* Init loading progress */
				this.loadingProgress();
			}
		}
	};
	
	/* Create HTML Structure */
	this.createStructure = function()
	{
		/* Create images div container */
		var imagesDiv = thisObject.Helper.createDocumentElement('div','images');

		/* Shift all images into the images div */
		var node = null;
		var max = this.ImageFlowDiv.childNodes.length;
		for(var index = 0; index < max; index++)
		{
			node = this.ImageFlowDiv.childNodes[index];
			if (node && node.nodeType == 1 && node.nodeName == 'IMG')
			{
				/* Add 'reflect.php?img=' */
				if(thisObject.reflections === true)
				{
					var version = '2';
					if(thisObject.reflectionPNG === true)
					{
						version = '3';
					}
					var src = node.getAttribute('src',2);
					src =  'reflect'+version+'.php?img='+src+thisObject.reflectionGET;
					node.setAttribute('src',src);
				}

				var imageNode = node.cloneNode(true);
				imagesDiv.appendChild(imageNode);
			}
		}

		/* Create loading text container */
		var loadingP = thisObject.Helper.createDocumentElement('p','loading_txt');
		var loadingText = document.createTextNode(' ');
		loadingP.appendChild(loadingText);

		/* Create loading div container */
		var loadingDiv = thisObject.Helper.createDocumentElement('div','loading');

		/* Create loading bar div container inside the loading div */
		var loadingBarDiv = thisObject.Helper.createDocumentElement('div','loading_bar');
		loadingDiv.appendChild(loadingBarDiv);

		/* Create captions div container */		
		var captionDiv = thisObject.Helper.createDocumentElement('div','caption');
		
		/* Create slider and button div container inside the scrollbar div */
		var scrollbarDiv = thisObject.Helper.createDocumentElement('div','scrollbar');
		var sliderDiv = thisObject.Helper.createDocumentElement('div','slider');
		scrollbarDiv.appendChild(sliderDiv);		
		if(thisObject.buttons)
		{
			var buttonPreviousDiv = thisObject.Helper.createDocumentElement('div','previous', 'button');
			var buttonNextDiv = thisObject.Helper.createDocumentElement('div','next', 'button');
			scrollbarDiv.appendChild(buttonPreviousDiv);
			scrollbarDiv.appendChild(buttonNextDiv);
		}
		
		/* Create navigation div container beneath images div */
		var navigationDiv = thisObject.Helper.createDocumentElement('div','navigation');
		navigationDiv.appendChild(captionDiv);
		navigationDiv.appendChild(scrollbarDiv);
	
		/* Update document structure and return true on success */
		var success = false;
		if (thisObject.ImageFlowDiv.appendChild(imagesDiv) &&
			thisObject.ImageFlowDiv.appendChild(loadingP) &&
			thisObject.ImageFlowDiv.appendChild(loadingDiv) &&
			thisObject.ImageFlowDiv.appendChild(navigationDiv))
		{
			/* Remove image nodes outside the images div */
			for(index = 0; index < max; index++)
			{
				node = this.ImageFlowDiv.childNodes[index];
				if (node && node.nodeType == 1 && node.nodeName == 'IMG')
				{
					this.ImageFlowDiv.removeChild(node);
				}
			}
			success = true;
		}
		return success;
	};

	
	/* Manage loading progress and call the refresh function */
	this.loadingProgress = function()
	{
		var p = thisObject.loadingStatus();
		if(p < 100 || thisObject.firstCheck === true && thisObject.preloadImages === true)
		{
			/* Insert a short delay if the browser loads rapidly from its cache */
			if(thisObject.firstCheck === true && p == 100)
			{
				thisObject.firstCheck = false;
				window.setTimeout(thisObject.loadingProgress, 100);
			}
			else
			{
				window.setTimeout(thisObject.loadingProgress, 40);
			}
		}
		else
		{
			/* Hide loading elements */
			document.getElementById(thisObject.ImageFlowID+'_loading_txt').style.display = 'none';
			document.getElementById(thisObject.ImageFlowID+'_loading').style.display = 'none';

			/* Refresh ImageFlow on window resize - delay adding this event for the IE */
			window.setTimeout(thisObject.Helper.addResizeEvent, 1000);

			/* Initialize mouse, touch and key support */
			thisObject.MouseWheel.init();
			thisObject.MouseDrag.init();
			thisObject.Touch.init();
			thisObject.Key.init();

			/* Call refresh function */
			thisObject.refresh(true);

			/* Unhide scrollbar elements */
			document.getElementById(thisObject.ImageFlowID+'_scrollbar').style.visibility = 'visible';

			/* Glide to start image */
			var startID = thisObject.startID-1;
			if (startID < 0 )
			{
				startID = 0;
			}
			if (startID > thisObject.max)
			{
				startID = thisObject.max -1;
			}
			thisObject.glideTo(startID);

			/* Animate images moving in from the right */
			if(thisObject.startAnimation === true)
			{
				thisObject.moveTo(5000);
			}
		}
	};


	/* Return loaded images in percent, set loading bar width and loading text */
	this.loadingStatus = function()
	{
		var max = thisObject.imagesDiv.childNodes.length;
		var i = 0, completed = 0;
		var image = null;
		for(var index = 0; index < max; index++)
		{
			image = thisObject.imagesDiv.childNodes[index];
			if (image && image.nodeType == 1 && image.nodeName == 'IMG')
			{
				if (image.complete === true)
				{
					completed++;
				}
				i++;
			}
		}
		var finished = Math.round((completed/i)*100);
		var loadingBar = document.getElementById(thisObject.ImageFlowID+'_loading_bar');
		loadingBar.style.width = finished+'%';

		var loadingP = document.getElementById(thisObject.ImageFlowID+'_loading_txt');
		var loadingTxt = document.createTextNode('loading images '+completed+'/'+i);
		loadingP.replaceChild(loadingTxt,loadingP.firstChild);
		return finished;
	};

	
	/* Cache EVERYTHING that only changes on refresh or resize of the window */
	this.refresh = function()
	{
		/* Cache global variables */
		this.imagesDivWidth = thisObject.imagesDiv.offsetWidth+thisObject.imagesDiv.offsetLeft;
		this.maxHeight = Math.round(thisObject.imagesDivWidth / thisObject.aspectRatio);
		this.maxFocus = thisObject.imageFocusMax * thisObject.xStep;
		this.size = thisObject.imagesDivWidth * 0.5;
		this.sliderWidth = thisObject.sliderWidth * 0.5;
		this.scrollbarWidth = (thisObject.imagesDivWidth - ( Math.round(thisObject.sliderWidth) * 2)) * thisObject.scrollbarP;
		this.imagesDivHeight = Math.round(thisObject.maxHeight * thisObject.imagesHeight);
		
		/* Change imageflow div properties */
		thisObject.ImageFlowDiv.style.height = thisObject.maxHeight + 'px';

		/* Change images div properties */
		thisObject.imagesDiv.style.height =  thisObject.imagesDivHeight + 'px'; 
		
		/* Change images div properties */
		thisObject.navigationDiv.style.height =  (thisObject.maxHeight - thisObject.imagesDivHeight) + 'px'; 

		/* Change captions div properties */
		thisObject.captionDiv.style.width = thisObject.imagesDivWidth + 'px';
		thisObject.captionDiv.style.paddingTop = Math.round(thisObject.imagesDivWidth * 0.02) + 'px';

		/* Change scrollbar div properties */
		thisObject.scrollbarDiv.style.width = thisObject.scrollbarWidth + 'px';
		thisObject.scrollbarDiv.style.marginTop = Math.round(thisObject.imagesDivWidth * 0.02) + 'px';
		thisObject.scrollbarDiv.style.marginLeft = Math.round(thisObject.sliderWidth + ((thisObject.imagesDivWidth - thisObject.scrollbarWidth)/2)) + 'px';

		/* Set slider attributes */
		thisObject.sliderDiv.style.cursor = thisObject.sliderCursor;
		thisObject.sliderDiv.onmousedown = function () { thisObject.MouseDrag.start(this); return false;};
		
		if(thisObject.buttons)
		{
			thisObject.buttonPreviousDiv.onclick = function () { thisObject.MouseWheel.handle(1); };
			thisObject.buttonNextDiv.onclick = function () { thisObject.MouseWheel.handle(-1); };
		}

		/* Set the reflection multiplicator */
		var multi = (thisObject.reflections === true) ? thisObject.reflectionP + 1 : 1;

		/* Set image attributes */
		var max = thisObject.imagesDiv.childNodes.length;
		var i = 0;
		var image = null;
		for (var index = 0; index < max; index++)
		{
			image = thisObject.imagesDiv.childNodes[index];
			if(image !== null && image.nodeType == 1 && image.nodeName == 'IMG')
			{
				this.indexArray[i] = index;

				/* Get iframe name via the image class */
				image.iframeId = image.className;
				
				/* Set image attributes to store values */
				image.url = image.getAttribute('longdesc');
				image.xPosition = (-i * thisObject.xStep);
				image.i = i;

				/* Add width and height as attributes only once */
				if(thisObject.firstRefresh)
				{
					if(image.getAttribute('width') !== null && image.getAttribute('height') !== null)
					{
						image.w = image.getAttribute('width');
						image.h = image.getAttribute('height') * multi;
					}
					else{
						image.w = image.width;
						image.h = image.height;
					}
				}

				/* Check source image format. Get image height minus reflection height! */
				if((image.w) > (image.h / (thisObject.reflectionP + 1)))
				{
					/* Landscape format */
					image.pc = thisObject.percentLandscape;
					image.pcMem = thisObject.percentLandscape;
				}
				else
				{
					/* Portrait and square format */
					image.pc = thisObject.percentOther;
					image.pcMem = thisObject.percentOther;
				}
				
				/* Change image positioning */
				if(thisObject.imageScaling === false)
				{		
					image.style.position = 'relative';
					image.style.display = 'inline';
				}

				/* Set image cursor type */
				image.style.cursor = thisObject.imageCursor;
				i++;
			}
		}
		this.max = thisObject.indexArray.length;
		
		/* Override dynamic sizes based on the first image */
		if(thisObject.imageScaling === false)
		{
			image = thisObject.imagesDiv.childNodes[thisObject.indexArray[0]];
			
			/* Set left padding for the first image */
			this.totalImagesWidth = image.w * thisObject.max;
			image.style.paddingLeft = (thisObject.imagesDivWidth/2) + (image.w/2) + 'px';
			
			/* Override images and navigation div height */
			thisObject.imagesDiv.style.height =  image.h + 'px';
			thisObject.navigationDiv.style.height =  (thisObject.maxHeight - image.h) + 'px'; 
		}

		/* Reset variable */
		if(thisObject.firstRefresh)
		{
			thisObject.firstRefresh = false;
		}

		/* Display images in current order */
		thisObject.glideTo(thisObject.imageID);
		thisObject.moveTo(thisObject.current);
	};


	/* Main animation function */
	this.moveTo = function(x)
	{
		this.current = x;
		this.zIndex = thisObject.max;

		/* Main loop */
		for (var index = 0; index < thisObject.max; index++)
		{
			var image = thisObject.imagesDiv.childNodes[thisObject.indexArray[index]];
			var currentImage = index * -thisObject.xStep;

			/* Enabled image scaling */
			if(thisObject.imageScaling)
			{
				/* Don't display images that are not conf_focussed */
				if ((currentImage + thisObject.maxFocus) < thisObject.memTarget || (currentImage - thisObject.maxFocus) > thisObject.memTarget)
				{
					image.style.visibility = 'hidden';
					image.style.display = 'none';
				}
				else
				{
					var z = (Math.sqrt(10000 + x * x) + 100) * thisObject.imagesM;
					var xs = x / z * thisObject.size + thisObject.size;

					/* Still hide images until they are processed, but set display style to block */
					image.style.display = 'block';

					/* Process new image height and image width */
					var newImageH = (image.h / image.w * image.pc) / z * thisObject.size;
					var newImageW = 0;
					switch (newImageH > thisObject.maxHeight)
					{
						case false:
							newImageW = image.pc / z * thisObject.size;
							break;

						default:
							newImageH = thisObject.maxHeight;
							newImageW = image.w * newImageH / image.h;
							break;
					}

					var newImageTop = (thisObject.imagesDivHeight - newImageH) + ((newImageH / (thisObject.reflectionP + 1)) * thisObject.reflectionP);

					/* Set new image properties */
					image.style.left = xs - (image.pc / 2) / z * thisObject.size + 'px';
					if(newImageW && newImageH)
					{
						image.style.height = newImageH + 'px';
						image.style.width = newImageW + 'px';
						image.style.top = newImageTop + 'px';
					}
					image.style.visibility = 'visible';

					/* Set image layer through zIndex */
					switch ( x < 0 )
					{
						case true:
							this.zIndex++;
							break;

						default:
							this.zIndex = thisObject.zIndex - 1;
							break;
					}

					/* Change zIndex and onclick function of the focussed image */
					switch ( image.i == thisObject.imageID )
					{
						case false:
							image.onclick = function() { thisObject.glideTo(this.i);};
							if(image.iframeId)
							{
								var iframe = document.getElementById(image.iframeId);
								iframe.style.visibility = 'hidden';
							}
							break;

						default:
							this.zIndex = thisObject.zIndex + 1;
							if(image.url !== '')
							{
								image.onclick = thisObject.onClick;
							}
							
							/* Display iFrame and scale it like the image */
							if(image.iframeId)
							{
								var iframe = document.getElementById(image.iframeId);
								iframe.style.visibility = 'visible';
								iframe.style.left = image.offsetLeft + 'px';
								if(newImageW && newImageH)
								{
									iframe.style.height = (image.getAttribute('height') / image.w * image.pc) / z * thisObject.size + 'px';
									iframe.style.width = image.width + 'px';
									iframe.style.top = image.offsetTop + thisObject.ImageFlowDiv.offsetTop + 'px';
								}
								
					
							}
							break;
					}
					image.style.zIndex = thisObject.zIndex;
				}
			}

			/* Disabled image scaling */
			else
			{
				if ((currentImage + thisObject.maxFocus) < thisObject.memTarget || (currentImage - thisObject.maxFocus) > thisObject.memTarget)
				{
					image.style.visibility = 'hidden';
				}
				else
				{
					image.style.visibility = 'visible';

					/* Change onclick function of the focussed image */
					switch ( image.i == thisObject.imageID )
					{
						case false:
							image.onclick = function() { thisObject.glideTo(this.i);};
							break;

						default:
							if(image.url !== '')
							{
								image.onclick = thisObject.onClick;
							}
							break;
					}
				}	
				thisObject.imagesDiv.style.marginLeft = (x - thisObject.totalImagesWidth) + 'px';
			}

			x += thisObject.xStep;
		}
	};

	
	/* Initializes image gliding animation */
	this.glideTo = function(imageID)
	{
		/* Calculate new image position target */
		var x = -imageID * thisObject.xStep;
		this.target = x;
		this.memTarget = x;
		this.imageID = imageID;

		/* Display new caption */
		var caption = thisObject.imagesDiv.childNodes[imageID].getAttribute('alt');
		if (caption === '' || thisObject.captions === false)
		{
			caption = '&nbsp;';
		}
		thisObject.captionDiv.innerHTML = caption;

		/* Set scrollbar slider to new position */
		if (thisObject.MouseDrag.busy === false)
		{
			this.newSliderX = (imageID * thisObject.scrollbarWidth) / (thisObject.max-1) - thisObject.MouseDrag.newX;
			thisObject.sliderDiv.style.marginLeft = (thisObject.newSliderX - thisObject.sliderWidth) + 'px';
		}

		/* Only process if opacity or a multiplicator for the focussed image has been set */
		if(thisObject.opacity === true || thisObject.imageFocusM !== thisObject.defaults.imageFocusM)
		{
			/* Set opacity for centered image */
			thisObject.Helper.setOpacity(thisObject.imagesDiv.childNodes[imageID], thisObject.opacityArray[0]);
			thisObject.imagesDiv.childNodes[imageID].pc = thisObject.imagesDiv.childNodes[imageID].pc * thisObject.imageFocusM;

			/* Set opacity for the other images that are displayed */
			var opacityValue = 0;
			var rightID = 0;
			var leftID = 0;
			var last = thisObject.opacityArray.length;

			for (var i = 1; i < (thisObject.imageFocusMax+1); i++)
			{
				if((i+1) > last)
				{
					opacityValue = thisObject.opacityArray[last-1];
				}
				else
				{
					opacityValue = thisObject.opacityArray[i];
				}

				rightID = imageID + i;
				leftID = imageID - i;

				if (rightID < thisObject.max)
				{
					thisObject.Helper.setOpacity(thisObject.imagesDiv.childNodes[rightID], opacityValue);
					thisObject.imagesDiv.childNodes[rightID].pc = thisObject.imagesDiv.childNodes[rightID].pcMem;
				}
				if (leftID >= 0)
				{
					thisObject.Helper.setOpacity(thisObject.imagesDiv.childNodes[leftID], opacityValue);
					thisObject.imagesDiv.childNodes[leftID].pc = thisObject.imagesDiv.childNodes[leftID].pcMem;
				}
			}
		}

		/* Animate gliding to new x position */
		if (thisObject.busy === false)
		{
			window.setTimeout(thisObject.animate, 50);
			thisObject.busy = true;
		}
	};


	/* Animates image gliding */
	this.animate = function()
	{
		switch (thisObject.target < thisObject.current-1 || thisObject.target > thisObject.current+1)
		{
			case true:
				thisObject.moveTo(thisObject.current + (thisObject.target-thisObject.current)/3);
				window.setTimeout(thisObject.animate, 50);
				thisObject.busy = true;
				break;

			default:
				thisObject.busy = false;
				break;
		}
	};
	
	
	/* Mouse Wheel support */
	this.MouseWheel =
	{
		init: function()
		{
			/* Init mouse wheel listener */
			if(window.addEventListener)
			{
				thisObject.ImageFlowDiv.addEventListener('DOMMouseScroll', thisObject.MouseWheel.get, false);
			}
			thisObject.Helper.addEvent(thisObject.ImageFlowDiv,'mousewheel',thisObject.MouseWheel.get);
		},

		get: function(event)
		{
			var delta = 0;
			if (!event)
			{
				event = window.event;
			}
			if (event.wheelDelta)
			{
				delta = event.wheelDelta / 120;
			}
			else if (event.detail)
			{
				delta = -event.detail / 3;
			}
			if (delta)
			{
				thisObject.MouseWheel.handle(delta);
			}
			thisObject.Helper.suppressBrowserDefault(event);
		},

		handle: function(delta)
		{
			var change = false;
			var newImageID = 0;
			if(delta > 0)
			{
				if(thisObject.imageID >= 1)
				{
					newImageID = thisObject.imageID -1;
					change = true;
				}
			}
			else
			{
				if(thisObject.imageID < (thisObject.max-1))
				{
					newImageID = thisObject.imageID +1;
					change = true;
				}
			}

			/* Glide to next (mouse wheel down) / previous (mouse wheel up) image  */
			if (change === true)
			{
				thisObject.glideTo(newImageID);
			}
		}
	};
	
	
	/* Mouse Dragging*/
	this.MouseDrag =
	{
		object: null,
		objectX: 0,
		mouseX: 0,
		newX: 0,
		busy: false,

		/* Init mouse event listener */
		init: function()
		{
			thisObject.Helper.addEvent(thisObject.ImageFlowDiv,'mousemove',thisObject.MouseDrag.drag);
			thisObject.Helper.addEvent(thisObject.ImageFlowDiv,'mouseup',thisObject.MouseDrag.stop);
			thisObject.Helper.addEvent(document,'mouseup',thisObject.MouseDrag.stop);

			/* Avoid text and image selection while dragging  */
			thisObject.ImageFlowDiv.onselectstart = function ()
			{
				var selection = true;
				if (thisObject.MouseDrag.busy === true)
				{
					selection = false;
				}
				return selection;
			};
		},

		start: function(o)
		{
			thisObject.MouseDrag.object = o;
			thisObject.MouseDrag.objectX = thisObject.MouseDrag.mouseX - o.offsetLeft + thisObject.newSliderX;

		},

		stop: function()
		{
			thisObject.MouseDrag.object = null;
			thisObject.MouseDrag.busy = false;
		},

		drag: function(e)
		{
			var posx = 0;
			if (!e)
			{
				e = window.event;
			}
			if (e.pageX)
			{
				posx = e.pageX;
			}
			else if (e.clientX)
			{
				posx = e.clientX + document.body.scrollLeft	+ document.documentElement.scrollLeft;
			}
			thisObject.MouseDrag.mouseX = posx;

			if(thisObject.MouseDrag.object !== null)
			{
				var newX = (thisObject.MouseDrag.mouseX - thisObject.MouseDrag.objectX) + thisObject.sliderWidth;

				/* Make sure, that the slider is moved in proper relation to previous movements by the glideTo function */
				if(newX < ( - thisObject.newSliderX))
				{
					newX = - thisObject.newSliderX;
				}
				if(newX > (thisObject.scrollbarWidth - thisObject.newSliderX))
				{
					newX = thisObject.scrollbarWidth - thisObject.newSliderX;
				}

				/* Set new slider position */
				var step = (newX + thisObject.newSliderX) / (thisObject.scrollbarWidth / (thisObject.max-1));
				var imageID = Math.round(step);
				thisObject.MouseDrag.newX = newX;
				thisObject.MouseDrag.object.style.left = newX + 'px';
				if(thisObject.imageID !== imageID)
				{
					thisObject.glideTo(imageID);
				}
				thisObject.MouseDrag.busy = true;
			}
		}
	};
	
	
	/* Safari touch events on the iPhone and iPod Touch */
	this.Touch =
	{
		x: 0,		
		startX: 0,
		stopX: 0,
		busy: false,
		first: true,

		/* Init touch event listener */
		init: function()
		{
			thisObject.Helper.addEvent(thisObject.navigationDiv,'touchstart',thisObject.Touch.start);
			thisObject.Helper.addEvent(document,'touchmove',thisObject.Touch.handle);
			thisObject.Helper.addEvent(document,'touchend',thisObject.Touch.stop);	
		},
		
		isOnNavigationDiv: function(e)
		{	
			var state = false;
			if(e.touches)
			{
				var target = e.touches[0].target;
				if(target === thisObject.navigationDiv || target === thisObject.sliderDiv || target === thisObject.scrollbarDiv)
				{
					state = true;
				}
			}
			return state;
		},
		
		getX: function(e)
		{
			var x = 0;
			if(e.touches)
			{
				x = e.touches[0].pageX;
			}
			return x;		
		},
	
		start: function(e)
		{
			thisObject.Touch.startX = thisObject.Touch.getX(e);
			thisObject.Touch.busy = true;
			thisObject.Helper.suppressBrowserDefault(e);			
		},
		
		isBusy: function()
		{
			var busy = false;
			if(thisObject.Touch.busy === true)
			{
				busy = true;
			}
			return busy;
		},

		/* Handle touch event position within the navigation div */
		handle: function(e)
		{
			if(thisObject.Touch.isBusy && thisObject.Touch.isOnNavigationDiv(e))
			{
				if(thisObject.Touch.first)
				{
					thisObject.Touch.stopX = ((thisObject.max-1)-thisObject.imageID) * (thisObject.imagesDivWidth / (thisObject.max-1));
					thisObject.Touch.first = false;
				}
				var newX = -(thisObject.Touch.getX(e) - thisObject.Touch.startX - thisObject.Touch.stopX);

				/* Map x-axis touch coordinates in range of the ImageFlow width */
				if(newX < 0)
				{
					newX = 0;
				}
				if(newX > thisObject.imagesDivWidth)
				{
					newX = thisObject.imagesDivWidth;
				}

				thisObject.Touch.x = newX;
				
				var imageID = Math.round(newX / (thisObject.imagesDivWidth / (thisObject.max-1)));
				imageID = (thisObject.max-1)-imageID;
				if(thisObject.imageID !== imageID)
				{
					thisObject.glideTo(imageID);
				}
				thisObject.Helper.suppressBrowserDefault(e);
			}
		},

		stop: function()
		{
			thisObject.Touch.stopX = thisObject.Touch.x;
			//thisObject.Touch.stopX = -(thisObject.Touch.x - thisObject.imagesDivWidth);
			
			thisObject.Touch.busy = false;
		}
	};
	

	/* Key support */
	this.Key =
	{
		/* Init key event listener */
		init: function()
		{
			document.onkeydown = function(event){ thisObject.Key.handle(event); };
		},

		/* Handle the arrow keys */
		handle: function(event)
		{
			var charCode  = thisObject.Key.get(event);
			switch (charCode)
			{
				/* Right arrow key */
				case 39:
					thisObject.MouseWheel.handle(-1);
					break;

				/* Left arrow key */
				case 37:
					thisObject.MouseWheel.handle(1);
					break;
			}
		},

		/* Get the current keycode */
		get: function(event)
		{
			event = event || window.event;
			return event.keyCode;
		}
	};
	
	
	/* Helper functions */
	this.Helper =
	{
		/* Add events */
		addEvent: function(obj, type, fn)
		{
			if(obj.addEventListener)
			{
				obj.addEventListener(type, fn, false);
			}
			else if(obj.attachEvent)
			{
				obj["e"+type+fn] = fn;
				obj[type+fn] = function() { obj["e"+type+fn]( window.event ); };
				obj.attachEvent( "on"+type, obj[type+fn] );
			}
		},
		
		/* Set image opacity */
		setOpacity: function(object, value)
		{
			if(thisObject.opacity === true)
			{
				object.style.opacity = value/10;
				object.style.filter = 'alpha(opacity=' + value*10 + ')';
			}
		},
		
		/* Creates HTML elements */
		createDocumentElement: function(type, id, optionalClass)
		{
			var element = document.createElement(type);
			element.setAttribute('id',thisObject.ImageFlowID+'_'+id);
			if(optionalClass !== undefined)
			{
				id += ' '+optionalClass;
			}
			element.setAttribute('class',id);
			element.setAttribute('className',id);
			return element;
		},
		
		/* Suppress default browser behaviour to avoid image/text selection while dragging */
		suppressBrowserDefault: function(e)
		{
			if(e.preventDefault)
			{
				e.preventDefault();
			}
			else
			{
				e.returnValue = false;
			}
			return false;
		},
		
		/* Adds functions to the window.onresize event - can not be done by addEvent */
		addResizeEvent: function()
		{
			var otherFunctions = window.onresize;
			if(typeof window.onresize != 'function')
			{
				window.onresize = function()
				{
					thisObject.refresh();
				};
			}
			else
			{
				window.onresize = function(){
					if (otherFunctions)
					{
						otherFunctions();
					}
					thisObject.refresh();
				};
			}
		}
	};
}

/* DOMContentLoaded event handler - by Tanny O'Haley [4] */
var domReadyEvent =
{
	name: "domReadyEvent",
	/* Array of DOMContentLoaded event handlers.*/
	events: {},
	domReadyID: 1,
	bDone: false,
	DOMContentLoadedCustom: null,

	/* Function that adds DOMContentLoaded listeners to the array.*/
	add: function(handler)
	{
		/* Assign each event handler a unique ID. If the handler has an ID, it has already been added to the events object or been run.*/
		if (!handler.$$domReadyID)
		{
			handler.$$domReadyID = this.domReadyID++;

			/* If the DOMContentLoaded event has happened, run the function. */
			if(this.bDone)
			{
				handler();
			}

			/* store the event handler in the hash table */
			this.events[handler.$$domReadyID] = handler;
		}
	},

	remove: function(handler)
	{
		/* Delete the event handler from the hash table */
		if (handler.$$domReadyID)
		{
			delete this.events[handler.$$domReadyID];
		}
	},

	/* Function to process the DOMContentLoaded events array. */
	run: function()
	{
		/* quit if this function has already been called */
		if (this.bDone)
		{
			return;
		}

		/* Flag this function so we don't do the same thing twice */
		this.bDone = true;

		/* iterates through array of registered functions */
		for (var i in this.events)
		{
			this.events[i]();
		}
	},

	schedule: function()
	{
		/* Quit if the init function has already been called*/
		if (this.bDone)
		{
			return;
		}

		/* First, check for Safari or KHTML.*/
		if(/KHTML|WebKit/i.test(navigator.userAgent))
		{
			if(/loaded|complete/.test(document.readyState))
			{
				this.run();
			}
			else
			{
				/* Not ready yet, wait a little more.*/
				setTimeout(this.name + ".schedule()", 100);
			}
		}
		else if(document.getElementById("__ie_onload"))
		{
			/* Second, check for IE.*/
			return true;
		}

		/* Check for custom developer provided function.*/
		if(typeof this.DOMContentLoadedCustom === "function")
		{
			/* if DOM methods are supported, and the body element exists (using a double-check
			including document.body, for the benefit of older moz builds [eg ns7.1] in which
			getElementsByTagName('body')[0] is undefined, unless this script is in the body section) */
			if(typeof document.getElementsByTagName !== 'undefined' && (document.getElementsByTagName('body')[0] !== null || document.body !== null))
			{
				/* Call custom function. */
				if(this.DOMContentLoadedCustom())
				{
					this.run();
				}
				else
				{
					/* Not ready yet, wait a little more. */
					setTimeout(this.name + ".schedule()", 250);
				}
			}
		}
		return true;
	},

	init: function()
	{
		/* If addEventListener supports the DOMContentLoaded event.*/
		if(document.addEventListener)
		{
			document.addEventListener("DOMContentLoaded", function() { domReadyEvent.run(); }, false);
		}

		/* Schedule to run the init function.*/
		setTimeout("domReadyEvent.schedule()", 100);

		function run()
		{
			domReadyEvent.run();
		}

		/* Just in case window.onload happens first, add it to onload using an available method.*/
		if(typeof addEvent !== "undefined")
		{
			addEvent(window, "load", run);
		}
		else if(document.addEventListener)
		{
			document.addEventListener("load", run, false);
		}
		else if(typeof window.onload === "function")
		{
			var oldonload = window.onload;
			window.onload = function()
			{
				domReadyEvent.run();
				oldonload();
			};
		}
		else
		{
			window.onload = run;
		}

		/* for Internet Explorer */
		/*@cc_on
			@if (@_win32 || @_win64)
			document.write("<script id=__ie_onload defer src=\"//:\"><\/script>");
			var script = document.getElementById("__ie_onload");
			script.onreadystatechange = function()
			{
				if (this.readyState == "complete")
				{
					domReadyEvent.run(); // call the onload handler
				}
			};
			@end
		@*/
	}
};

var domReady = function(handler) { domReadyEvent.add(handler); };
domReadyEvent.init();


/* Create ImageFlow instances when the DOM structure has been loaded */
domReady(function()
{
	var instanceOne = new ImageFlow();
	instanceOne.init({ ImageFlowID:'myImageFlow' });
});