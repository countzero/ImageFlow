/*
Name:       ImageFlow
Version:    1.3.0 (Februar 21 2010)
Author:     Finn Rudolph
Support:    http://finnrudolph.de/ImageFlow

License:    ImageFlow is licensed under a Creative Commons 
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
		animationSpeed:     50,             /* Animation speed in ms */
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
	var my = this;

	
	/* Initiate ImageFlow */
	this.init = function (options)
	{
		/* Evaluate options */
		for(var name in my.defaults) 
		{
			this[name] = (options !== undefined && options[name] !== undefined) ? options[name] : my.defaults[name];
		}

		/* Try to get ImageFlow div element */
		var ImageFlowDiv = document.getElementById(my.ImageFlowID);
		if(ImageFlowDiv)
		{
			/* Set it global within the ImageFlow scope */
			ImageFlowDiv.style.visibility = 'visible';
			this.ImageFlowDiv = ImageFlowDiv;
			
			/* Try to create XHTML structure */
			if(this.createStructure())
			{
				this.imagesDiv = document.getElementById(my.ImageFlowID+'_images');
				this.captionDiv = document.getElementById(my.ImageFlowID+'_caption');
				this.navigationDiv = document.getElementById(my.ImageFlowID+'_navigation');
				this.scrollbarDiv = document.getElementById(my.ImageFlowID+'_scrollbar');
				this.sliderDiv = document.getElementById(my.ImageFlowID+'_slider');
				this.buttonNextDiv = document.getElementById(my.ImageFlowID+'_next');
				this.buttonPreviousDiv = document.getElementById(my.ImageFlowID+'_previous');

				this.indexArray = [];
				this.current = 0;
				this.imageID = 0;
				this.target = 0;
				this.memTarget = 0;
				this.firstRefresh = true;
				this.firstCheck = true;
				this.busy = false;

				/* Toggle slider */
				if(this.slider === false)
				{
					this.scrollbarDiv.style.display = 'none';
				}

				/* Set height of the ImageFlow container and center the loading bar */
				var width = this.ImageFlowDiv.offsetWidth;
				var height = Math.round(width / my.aspectRatio);
				document.getElementById(my.ImageFlowID+'_loading_txt').style.paddingTop = ((height * 0.5) -22) + 'px';
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
		var imagesDiv = my.Helper.createDocumentElement('div','images');

		/* Shift all images into the images div */
		var node = null;
		var max = this.ImageFlowDiv.childNodes.length;
		for(var index = 0; index < max; index++)
		{
			node = this.ImageFlowDiv.childNodes[index];
			if (node && node.nodeType == 1 && node.nodeName == 'IMG')
			{
				/* Add 'reflect.php?img=' */
				if(my.reflections === true)
				{
					var version = '2';
					if(my.reflectionPNG === true)
					{
						version = '3';
					}
					var src = node.getAttribute('src',2);
					src =  'reflect'+version+'.php?img='+src+my.reflectionGET;
					node.setAttribute('src',src);
				}

				var imageNode = node.cloneNode(true);
				imagesDiv.appendChild(imageNode);
			}
		}

		/* Create loading text container */
		var loadingP = my.Helper.createDocumentElement('p','loading_txt');
		var loadingText = document.createTextNode(' ');
		loadingP.appendChild(loadingText);

		/* Create loading div container */
		var loadingDiv = my.Helper.createDocumentElement('div','loading');

		/* Create loading bar div container inside the loading div */
		var loadingBarDiv = my.Helper.createDocumentElement('div','loading_bar');
		loadingDiv.appendChild(loadingBarDiv);

		/* Create captions div container */		
		var captionDiv = my.Helper.createDocumentElement('div','caption');
		
		/* Create slider and button div container inside the scrollbar div */
		var scrollbarDiv = my.Helper.createDocumentElement('div','scrollbar');
		var sliderDiv = my.Helper.createDocumentElement('div','slider');
		scrollbarDiv.appendChild(sliderDiv);		
		if(my.buttons)
		{
			var buttonPreviousDiv = my.Helper.createDocumentElement('div','previous', 'button');
			var buttonNextDiv = my.Helper.createDocumentElement('div','next', 'button');
			scrollbarDiv.appendChild(buttonPreviousDiv);
			scrollbarDiv.appendChild(buttonNextDiv);
		}
		
		/* Create navigation div container beneath images div */
		var navigationDiv = my.Helper.createDocumentElement('div','navigation');
		navigationDiv.appendChild(captionDiv);
		navigationDiv.appendChild(scrollbarDiv);
	
		/* Update document structure and return true on success */
		var success = false;
		if (my.ImageFlowDiv.appendChild(imagesDiv) &&
			my.ImageFlowDiv.appendChild(loadingP) &&
			my.ImageFlowDiv.appendChild(loadingDiv) &&
			my.ImageFlowDiv.appendChild(navigationDiv))
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
		var p = my.loadingStatus();
		if((p < 100 || my.firstCheck === true) && my.preloadImages === true)
		{
			/* Insert a short delay if the browser loads rapidly from its cache */
			if(my.firstCheck === true && p == 100)
			{
				my.firstCheck = false;
				window.setTimeout(my.loadingProgress, 100);
			}
			else
			{
				window.setTimeout(my.loadingProgress, 40);
			}
		}
		else
		{
			/* Hide loading elements */
			document.getElementById(my.ImageFlowID+'_loading_txt').style.display = 'none';
			document.getElementById(my.ImageFlowID+'_loading').style.display = 'none';

			/* Refresh ImageFlow on window resize - delay adding this event for the IE */
			window.setTimeout(my.Helper.addResizeEvent, 1000);

			/* Call refresh function */
			my.refresh();
			
			/* Only initialize navigation elements if there is more than one image */
			if(my.max > 1)
			{
				/* Initialize mouse, touch and key support */
				my.MouseWheel.init();
				my.MouseDrag.init();
				my.Touch.init();
				my.Key.init();

				/* Unhide scrollbar elements */
				document.getElementById(my.ImageFlowID+'_scrollbar').style.visibility = 'visible';

				/* Animate images moving in from the right */
				if(my.startAnimation === true)
				{
					my.moveTo(5000);
				}
			}
		}
	};


	/* Return loaded images in percent, set loading bar width and loading text */
	this.loadingStatus = function()
	{
		var max = my.imagesDiv.childNodes.length;
		var i = 0, completed = 0;
		var image = null;
		for(var index = 0; index < max; index++)
		{
			image = my.imagesDiv.childNodes[index];
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
		var loadingBar = document.getElementById(my.ImageFlowID+'_loading_bar');
		loadingBar.style.width = finished+'%';

		var loadingP = document.getElementById(my.ImageFlowID+'_loading_txt');
		var loadingTxt = document.createTextNode('loading images '+completed+'/'+i);
		loadingP.replaceChild(loadingTxt,loadingP.firstChild);
		return finished;
	};

	
	/* Cache EVERYTHING that only changes on refresh or resize of the window */
	this.refresh = function()
	{
		/* Cache global variables */
		this.imagesDivWidth = my.imagesDiv.offsetWidth+my.imagesDiv.offsetLeft;
		this.maxHeight = Math.round(my.imagesDivWidth / my.aspectRatio);
		this.maxFocus = my.imageFocusMax * my.xStep;
		this.size = my.imagesDivWidth * 0.5;
		this.sliderWidth = my.sliderWidth * 0.5;
		this.scrollbarWidth = (my.imagesDivWidth - ( Math.round(my.sliderWidth) * 2)) * my.scrollbarP;
		this.imagesDivHeight = Math.round(my.maxHeight * my.imagesHeight);
		
		/* Change imageflow div properties */
		my.ImageFlowDiv.style.height = my.maxHeight + 'px';

		/* Change images div properties */
		my.imagesDiv.style.height =  my.imagesDivHeight + 'px'; 
		
		/* Change images div properties */
		my.navigationDiv.style.height =  (my.maxHeight - my.imagesDivHeight) + 'px'; 

		/* Change captions div properties */
		my.captionDiv.style.width = my.imagesDivWidth + 'px';
		my.captionDiv.style.paddingTop = Math.round(my.imagesDivWidth * 0.02) + 'px';

		/* Change scrollbar div properties */
		my.scrollbarDiv.style.width = my.scrollbarWidth + 'px';
		my.scrollbarDiv.style.marginTop = Math.round(my.imagesDivWidth * 0.02) + 'px';
		my.scrollbarDiv.style.marginLeft = Math.round(my.sliderWidth + ((my.imagesDivWidth - my.scrollbarWidth)/2)) + 'px';

		/* Set slider attributes */
		my.sliderDiv.style.cursor = my.sliderCursor;
		my.sliderDiv.onmousedown = function () { my.MouseDrag.start(this); return false;};
		
		if(my.buttons)
		{
			my.buttonPreviousDiv.onclick = function () { my.MouseWheel.handle(1); };
			my.buttonNextDiv.onclick = function () { my.MouseWheel.handle(-1); };
		}

		/* Set the reflection multiplicator */
		var multi = (my.reflections === true) ? my.reflectionP + 1 : 1;

		/* Set image attributes */
		var max = my.imagesDiv.childNodes.length;
		var i = 0;
		var image = null;
		for (var index = 0; index < max; index++)
		{
			image = my.imagesDiv.childNodes[index];
			if(image !== null && image.nodeType == 1 && image.nodeName == 'IMG')
			{
				this.indexArray[i] = index;

				/* Set image attributes to store values */
				image.url = image.getAttribute('longdesc');
				image.xPosition = (-i * my.xStep);
				image.i = i;

				/* Add width and height as attributes only once */
				if(my.firstRefresh)
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
				if((image.w) > (image.h / (my.reflectionP + 1)))
				{
					/* Landscape format */
					image.pc = my.percentLandscape;
					image.pcMem = my.percentLandscape;
				}
				else
				{
					/* Portrait and square format */
					image.pc = my.percentOther;
					image.pcMem = my.percentOther;
				}
				
				/* Change image positioning */
				if(my.imageScaling === false)
				{		
					image.style.position = 'relative';
					image.style.display = 'inline';
				}

				/* Set image cursor type */
				image.style.cursor = my.imageCursor;
				i++;
			}
		}
		this.max = my.indexArray.length;
		
		/* Override dynamic sizes based on the first image */
		if(my.imageScaling === false)
		{
			image = my.imagesDiv.childNodes[my.indexArray[0]];
			
			/* Set left padding for the first image */
			this.totalImagesWidth = image.w * my.max;
			image.style.paddingLeft = (my.imagesDivWidth/2) + (image.w/2) + 'px';
			
			/* Override images and navigation div height */
			my.imagesDiv.style.height =  image.h + 'px';
			my.navigationDiv.style.height =  (my.maxHeight - image.h) + 'px'; 
		}

		/* Handle startID on the first refresh */
		if(my.firstRefresh)
		{
			/* Reset variable */
			my.firstRefresh = false;
		
			/* Set image id to start id */
			my.imageID = my.startID-1;
			if (my.imageID < 0 )
			{
				my.imageID = 0;
			}
			if (my.imageID > my.max)
			{
				my.imageID = my.max -1;
			}
		}

		/* Only animate if there is more than one image */
		if(my.max > 1)
		{
			my.glideTo(my.imageID);
		}
		
		/* Display images in current order */
		my.moveTo(my.current);
	};


	/* Main animation function */
	this.moveTo = function(x)
	{
		this.current = x;
		this.zIndex = my.max;

		/* Main loop */
		for (var index = 0; index < my.max; index++)
		{
			var image = my.imagesDiv.childNodes[my.indexArray[index]];
			var currentImage = index * -my.xStep;

			/* Enabled image scaling */
			if(my.imageScaling)
			{
				/* Don't display images that are not conf_focussed */
				if ((currentImage + my.maxFocus) < my.memTarget || (currentImage - my.maxFocus) > my.memTarget)
				{
					image.style.visibility = 'hidden';
					image.style.display = 'none';
				}
				else
				{
					var z = (Math.sqrt(10000 + x * x) + 100) * my.imagesM;
					var xs = x / z * my.size + my.size;

					/* Still hide images until they are processed, but set display style to block */
					image.style.display = 'block';

					/* Process new image height and width */
					var newImageH = (image.h / image.w * image.pc) / z * my.size;
					var newImageW = 0;
					switch (newImageH > my.maxHeight)
					{
						case false:
							newImageW = image.pc / z * my.size;
							break;

						default:
							newImageH = my.maxHeight;
							newImageW = image.w * newImageH / image.h;
							break;
					}

					var newImageTop = (my.imagesDivHeight - newImageH) + ((newImageH / (my.reflectionP + 1)) * my.reflectionP);

					/* Set new image properties */
					image.style.left = xs - (image.pc / 2) / z * my.size + 'px';
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
							this.zIndex = my.zIndex - 1;
							break;
					}

					/* Change zIndex and onclick function of the focussed image */
					switch ( image.i == my.imageID )
					{
						case false:
							image.onclick = function() { my.glideTo(this.i);};
							break;

						default:
							this.zIndex = my.zIndex + 1;
							if(image.url !== '')
							{
								image.onclick = my.onClick;
							}
							break;
					}
					image.style.zIndex = my.zIndex;
				}
			}

			/* Disabled image scaling */
			else
			{
				if ((currentImage + my.maxFocus) < my.memTarget || (currentImage - my.maxFocus) > my.memTarget)
				{
					image.style.visibility = 'hidden';
				}
				else
				{
					image.style.visibility = 'visible';

					/* Change onclick function of the focussed image */
					switch ( image.i == my.imageID )
					{
						case false:
							image.onclick = function() { my.glideTo(this.i);};
							break;

						default:
							if(image.url !== '')
							{
								image.onclick = my.onClick;
							}
							break;
					}
				}	
				my.imagesDiv.style.marginLeft = (x - my.totalImagesWidth) + 'px';
			}

			x += my.xStep;
		}
	};

	
	/* Initializes image gliding animation */
	this.glideTo = function(imageID)
	{
		/* Calculate new image position target */
		var x = -imageID * my.xStep;
		this.target = x;
		this.memTarget = x;
		this.imageID = imageID;

		/* Display new caption */
		var caption = my.imagesDiv.childNodes[imageID].getAttribute('alt');
		if (caption === '' || my.captions === false)
		{
			caption = '&nbsp;';
		}
		my.captionDiv.innerHTML = caption;

		/* Set scrollbar slider to new position */
		if (my.MouseDrag.busy === false)
		{
			this.newSliderX = (imageID * my.scrollbarWidth) / (my.max-1) - my.MouseDrag.newX;
			my.sliderDiv.style.marginLeft = (my.newSliderX - my.sliderWidth) + 'px';
		}

		/* Only process if opacity or a multiplicator for the focussed image has been set */
		if(my.opacity === true || my.imageFocusM !== my.defaults.imageFocusM)
		{
			/* Set opacity for centered image */
			my.Helper.setOpacity(my.imagesDiv.childNodes[imageID], my.opacityArray[0]);
			my.imagesDiv.childNodes[imageID].pc = my.imagesDiv.childNodes[imageID].pc * my.imageFocusM;

			/* Set opacity for the other images that are displayed */
			var opacityValue = 0;
			var rightID = 0;
			var leftID = 0;
			var last = my.opacityArray.length;

			for (var i = 1; i < (my.imageFocusMax+1); i++)
			{
				if((i+1) > last)
				{
					opacityValue = my.opacityArray[last-1];
				}
				else
				{
					opacityValue = my.opacityArray[i];
				}

				rightID = imageID + i;
				leftID = imageID - i;

				if (rightID < my.max)
				{
					my.Helper.setOpacity(my.imagesDiv.childNodes[rightID], opacityValue);
					my.imagesDiv.childNodes[rightID].pc = my.imagesDiv.childNodes[rightID].pcMem;
				}
				if (leftID >= 0)
				{
					my.Helper.setOpacity(my.imagesDiv.childNodes[leftID], opacityValue);
					my.imagesDiv.childNodes[leftID].pc = my.imagesDiv.childNodes[leftID].pcMem;
				}
			}
		}

		/* Animate gliding to new x position */
		if (my.busy === false)
		{
			my.busy = true;
			my.animate();			
		}
	};


	/* Animates image gliding */
	this.animate = function()
	{
		switch (my.target < my.current-1 || my.target > my.current+1)
		{
			case true:
				my.moveTo(my.current + (my.target-my.current)/3);
				window.setTimeout(my.animate, my.animationSpeed);
				my.busy = true;
				break;

			default:
				my.busy = false;
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
				my.ImageFlowDiv.addEventListener('DOMMouseScroll', my.MouseWheel.get, false);
			}
			my.Helper.addEvent(my.ImageFlowDiv,'mousewheel',my.MouseWheel.get);
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
				my.MouseWheel.handle(delta);
			}
			my.Helper.suppressBrowserDefault(event);
		},

		handle: function(delta)
		{
			var change = false;
			var newImageID = 0;
			if(delta > 0)
			{
				if(my.imageID >= 1)
				{
					newImageID = my.imageID -1;
					change = true;
				}
			}
			else
			{
				if(my.imageID < (my.max-1))
				{
					newImageID = my.imageID +1;
					change = true;
				}
			}

			/* Glide to next (mouse wheel down) / previous (mouse wheel up) image  */
			if (change === true)
			{
				my.glideTo(newImageID);
			}
		}
	};
	
	
	/* Mouse Dragging */
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
			my.Helper.addEvent(my.ImageFlowDiv,'mousemove',my.MouseDrag.drag);
			my.Helper.addEvent(my.ImageFlowDiv,'mouseup',my.MouseDrag.stop);
			my.Helper.addEvent(document,'mouseup',my.MouseDrag.stop);

			/* Avoid text and image selection while dragging  */
			my.ImageFlowDiv.onselectstart = function ()
			{
				var selection = true;
				if (my.MouseDrag.busy === true)
				{
					selection = false;
				}
				return selection;
			};
		},

		start: function(o)
		{
			my.MouseDrag.object = o;
			my.MouseDrag.objectX = my.MouseDrag.mouseX - o.offsetLeft + my.newSliderX;

		},

		stop: function()
		{
			my.MouseDrag.object = null;
			my.MouseDrag.busy = false;
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
			my.MouseDrag.mouseX = posx;

			if(my.MouseDrag.object !== null)
			{
				var newX = (my.MouseDrag.mouseX - my.MouseDrag.objectX) + my.sliderWidth;

				/* Make sure, that the slider is moved in proper relation to previous movements by the glideTo function */
				if(newX < ( - my.newSliderX))
				{
					newX = - my.newSliderX;
				}
				if(newX > (my.scrollbarWidth - my.newSliderX))
				{
					newX = my.scrollbarWidth - my.newSliderX;
				}

				/* Set new slider position */
				var step = (newX + my.newSliderX) / (my.scrollbarWidth / (my.max-1));
				var imageID = Math.round(step);
				my.MouseDrag.newX = newX;
				my.MouseDrag.object.style.left = newX + 'px';
				if(my.imageID !== imageID)
				{
					my.glideTo(imageID);
				}
				my.MouseDrag.busy = true;
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
			my.Helper.addEvent(my.navigationDiv,'touchstart',my.Touch.start);
			my.Helper.addEvent(document,'touchmove',my.Touch.handle);
			my.Helper.addEvent(document,'touchend',my.Touch.stop);	
		},
		
		isOnNavigationDiv: function(e)
		{	
			var state = false;
			if(e.touches)
			{
				var target = e.touches[0].target;
				if(target === my.navigationDiv || target === my.sliderDiv || target === my.scrollbarDiv)
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
			my.Touch.startX = my.Touch.getX(e);
			my.Touch.busy = true;
			my.Helper.suppressBrowserDefault(e);			
		},
		
		isBusy: function()
		{
			var busy = false;
			if(my.Touch.busy === true)
			{
				busy = true;
			}
			return busy;
		},

		/* Handle touch event position within the navigation div */
		handle: function(e)
		{
			if(my.Touch.isBusy && my.Touch.isOnNavigationDiv(e))
			{
				if(my.Touch.first)
				{
					my.Touch.stopX = ((my.max-1)-my.imageID) * (my.imagesDivWidth / (my.max-1));
					my.Touch.first = false;
				}
				var newX = -(my.Touch.getX(e) - my.Touch.startX - my.Touch.stopX);

				/* Map x-axis touch coordinates in range of the ImageFlow width */
				if(newX < 0)
				{
					newX = 0;
				}
				if(newX > my.imagesDivWidth)
				{
					newX = my.imagesDivWidth;
				}

				my.Touch.x = newX;
				
				var imageID = Math.round(newX / (my.imagesDivWidth / (my.max-1)));
				imageID = (my.max-1)-imageID;
				if(my.imageID !== imageID)
				{
					my.glideTo(imageID);
				}
				my.Helper.suppressBrowserDefault(e);
			}
		},

		stop: function()
		{
			my.Touch.stopX = my.Touch.x;
			//my.Touch.stopX = -(my.Touch.x - my.imagesDivWidth);
			
			my.Touch.busy = false;
		}
	};
	

	/* Key support */
	this.Key =
	{
		/* Init key event listener */
		init: function()
		{
			document.onkeydown = function(event){ my.Key.handle(event); };
		},

		/* Handle the arrow keys */
		handle: function(event)
		{
			var charCode  = my.Key.get(event);
			switch (charCode)
			{
				/* Right arrow key */
				case 39:
					my.MouseWheel.handle(-1);
					break;

				/* Left arrow key */
				case 37:
					my.MouseWheel.handle(1);
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
			if(my.opacity === true)
			{
				object.style.opacity = value/10;
				object.style.filter = 'alpha(opacity=' + value*10 + ')';
			}
		},
		
		/* Creates HTML elements */
		createDocumentElement: function(type, id, optionalClass)
		{
			var element = document.createElement(type);
			element.setAttribute('id',my.ImageFlowID+'_'+id);
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
					my.refresh();
				};
			}
			else
			{
				window.onresize = function(){
					if (otherFunctions)
					{
						otherFunctions();
					}
					my.refresh();
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