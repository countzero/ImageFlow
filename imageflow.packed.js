/*
Name:       ImageFlow
Version:    1.2.1 (August 10 2009)
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

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('u 3t(){9.2M={2n:1.4l,2b:B,2s:y,2N:\'1A\',K:\'3E\',1K:1.0,2k:4,1O:y,2q:0.3u,2p:1.0,1R:u(){A.4q=9.25},1r:B,1x:[10,8,6,4,2],1U:3O,1Z:1e,2L:y,1X:y,2z:\'\',1z:0.5,2C:B,2G:0.6,2l:y,2y:\'e-45\',1d:14,2B:1,2F:B,1m:4p};t s=9;9.X=u(a){t b=[\'2n\',\'2b\',\'2s\',\'2N\',\'2p\',\'K\',\'1K\',\'2k\',\'2q\',\'1R\',\'1r\',\'1x\',\'1U\',\'1Z\',\'2L\',\'1X\',\'2z\',\'1z\',\'2C\',\'1O\',\'2G\',\'2l\',\'2y\',\'1d\',\'2B\',\'2F\',\'1m\'];t c=b.1u;1c(t i=0;i<c;i++){t d=b[i];9[d]=(a!==1C&&a[d]!==1C)?a[d]:s.2M[d]}t e=A.L(s.K);7(e){e.v.1t=\'2h\';9.M=e;7(9.3a()){9.D=A.L(s.K+\'43\');9.2f=A.L(s.K+\'3C\');9.1I=A.L(s.K+\'3H\');9.1B=A.L(s.K+\'38\');9.1F=A.L(s.K+\'4e\');9.2T=A.L(s.K+\'4E\');9.30=A.L(s.K+\'4r\');9.1D=[];9.1h=0;9.T=0;9.1p=0;9.1q=0;9.21=y;9.1S=y;9.N=B;7(9.2l===B){9.1B.v.1s=\'29\'}t f=9.M.2S;t g=Y.11(f/s.2n);A.L(s.K+\'2D\').v.3o=((g*0.5)-22)+\'G\';e.v.Z=g+\'G\';9.23()}}};9.3a=u(){t a=s.C.W(\'16\',\'32\');t b=U;t c=9.M.J.1u;1c(t d=0;d<c;d++){b=9.M.J[d];7(b&&b.1W==1&&b.24==\'28\'){7(s.1X===y){t e=\'2\';7(s.2C===y){e=\'3\'}t f=b.1i(\'2r\',2);f=\'3X\'+e+\'.42?48=\'+f+s.2z;b.1P(\'2r\',f)}t g=b.4k(y);a.R(g)}}t h=s.C.W(\'p\',\'3z\');t i=A.2X(\' \');h.R(i);t j=s.C.W(\'16\',\'3g\');t k=s.C.W(\'16\',\'4D\');j.R(k);t l=s.C.W(\'16\',\'3v\');t m=s.C.W(\'16\',\'3I\');t n=s.C.W(\'16\',\'2l\');m.R(n);7(s.2b){t o=s.C.W(\'16\',\'3Z\',\'36\');t p=s.C.W(\'16\',\'46\',\'36\');m.R(o);m.R(p)}t q=s.C.W(\'16\',\'4a\');q.R(l);q.R(m);t r=B;7(s.M.R(a)&&s.M.R(h)&&s.M.R(j)&&s.M.R(q)){1c(d=0;d<c;d++){b=9.M.J[d];7(b&&b.1W==1&&b.24==\'28\'){9.M.4i(b)}}r=y}O r};9.23=u(){t p=s.2Z();7(p<1e||s.1S===y&&s.2L===y){7(s.1S===y&&p==1e){s.1S=B;I.1g(s.23,1e)}H{I.1g(s.23,40)}}H{A.L(s.K+\'2D\').v.1s=\'29\';A.L(s.K+\'4d\').v.1s=\'29\';I.1g(s.C.3m,3V);s.15.X();s.E.X();s.F.X();s.2e.X();s.2j(y);A.L(s.K+\'38\').v.1t=\'2h\';t a=s.2B-1;7(a<0){a=0}7(a>s.P){a=s.P-1}s.1a(a);7(s.2F===y){s.2o(3A)}}};9.2Z=u(){t a=s.D.J.1u;t i=0,1Q=0;t b=U;1c(t c=0;c<a;c++){b=s.D.J[c];7(b&&b.1W==1&&b.24==\'28\'){7(b.2O===y){1Q++}i++}}t d=Y.11((1Q/i)*1e);t e=A.L(s.K+\'3K\');e.v.1j=d+\'%\';t f=A.L(s.K+\'2D\');t g=A.2X(\'3g 32 \'+1Q+\'/\'+i);f.3Q(g,f.3U);O d};9.2j=u(){9.Q=s.D.2S+s.D.34;9.1k=Y.11(s.Q/s.2n);9.1N=s.2k*s.1m;9.1w=s.Q*0.5;9.1d=s.1d*0.5;9.1n=(s.Q-(Y.11(s.1d)*2))*s.2G;9.2i=Y.11(s.1k*s.2q);s.M.v.Z=s.1k+\'G\';s.D.v.Z=s.2i+\'G\';s.1I.v.Z=(s.1k-s.2i)+\'G\';s.2f.v.1j=s.Q+\'G\';s.2f.v.3o=Y.11(s.Q*0.3h)+\'G\';s.1B.v.1j=s.1n+\'G\';s.1B.v.4g=Y.11(s.Q*0.3h)+\'G\';s.1B.v.2w=Y.11(s.1d+((s.Q-s.1n)/2))+\'G\';s.1F.v.3r=s.2y;s.1F.4o=u(){s.E.27(9);O B};7(s.2b){s.30.1y=u(){s.15.13(1)};s.2T.1y=u(){s.15.13(-1)}}t a=(s.1X===y)?s.1z+1:1;t b=s.D.J.1u;t i=0;t c=U;1c(t d=0;d<b;d++){c=s.D.J[d];7(c!==U&&c.1W==1&&c.24==\'28\'){9.1D[i]=d;c.25=c.1i(\'4B\');c.4C=(-i*s.1m);c.i=i;7(s.21){7(c.1i(\'1j\')!==U&&c.1i(\'Z\')!==U){c.w=c.1i(\'1j\');c.h=c.1i(\'Z\')*a}H{c.w=c.1j;c.h=c.Z}}7((c.w)>(c.h/(s.1z+1))){c.18=s.1U;c.2d=s.1U}H{c.18=s.1Z;c.2d=s.1Z}7(s.1O===B){c.v.4h=\'4j\';c.v.1s=\'3T\'}c.v.3r=s.2N;i++}}9.P=s.1D.1u;7(s.1O===B){c=s.D.J[s.1D[0]];9.35=c.w*s.P;c.v.4n=(s.Q/2)+(c.w/2)+\'G\';s.D.v.Z=c.h+\'G\';s.1I.v.Z=(s.1k-c.h)+\'G\'}7(s.21){s.21=B}s.1a(s.T);s.2o(s.1h)};9.2o=u(x){9.1h=x;9.19=s.P;1c(t a=0;a<s.P;a++){t b=s.D.J[s.1D[a]];t c=a*-s.1m;7(s.1O){7((c+s.1N)<s.1q||(c-s.1N)>s.1q){b.v.1t=\'3d\';b.v.1s=\'29\'}H{t z=(Y.3x(3Y+x*x)+1e)*s.2p;t d=x/z*s.1w+s.1w;b.v.1s=\'4y\';t e=(b.h/b.w*b.18)/z*s.1w;t f=0;1v(e>s.1k){1l B:f=b.18/z*s.1w;S;1A:e=s.1k;f=b.w*e/b.h;S}t g=(s.2i-e)+((e/(s.1z+1))*s.1z);b.v.3e=d-(b.18/2)/z*s.1w+\'G\';7(f&&e){b.v.Z=e+\'G\';b.v.1j=f+\'G\';b.v.4H=g+\'G\'}b.v.1t=\'2h\';1v(x<0){1l y:9.19++;S;1A:9.19=s.19-1;S}1v(b.i==s.T){1l B:b.1y=u(){s.1a(9.i)};S;1A:9.19=s.19+1;7(b.25!==\'\'){b.1y=s.1R}S}b.v.19=s.19}}H{7((c+s.1N)<s.1q||(c-s.1N)>s.1q){b.v.1t=\'3d\'}H{b.v.1t=\'2h\';1v(b.i==s.T){1l B:b.1y=u(){s.1a(9.i)};S;1A:7(b.25!==\'\'){b.1y=s.1R}S}}s.D.v.2w=(x-s.35)+\'G\'}x+=s.1m}};9.1a=u(a){t x=-a*s.1m;9.1p=x;9.1q=x;9.T=a;t b=s.D.J[a].1i(\'3N\');7(b===\'\'||s.2s===B){b=\'&3D;\'}s.2f.3s=b;7(s.E.N===B){9.1b=(a*s.1n)/(s.P-1)-s.E.2I;s.1F.v.2w=(s.1b-s.1d)+\'G\'}7(s.1r===y||s.1K!==s.2M.1K){s.C.26(s.D.J[a],s.1x[0]);s.D.J[a].18=s.D.J[a].18*s.1K;t c=0;t d=0;t e=0;t f=s.1x.1u;1c(t i=1;i<(s.2k+1);i++){7((i+1)>f){c=s.1x[f-1]}H{c=s.1x[i]}d=a+i;e=a-i;7(d<s.P){s.C.26(s.D.J[d],c);s.D.J[d].18=s.D.J[d].2d}7(e>=0){s.C.26(s.D.J[e],c);s.D.J[e].18=s.D.J[e].2d}}}7(s.N===B){I.1g(s.2K,2W);s.N=y}};9.2K=u(){1v(s.1p<s.1h-1||s.1p>s.1h+1){1l y:s.2o(s.1h+(s.1p-s.1h)/3);I.1g(s.2K,2W);s.N=y;S;1A:s.N=B;S}};9.15={X:u(){7(I.1f){s.M.1f(\'3G\',s.15.1G,B)}s.C.12(s.M,\'3M\',s.15.1G)},1G:u(a){t b=0;7(!a){a=I.1V}7(a.2Q){b=a.2Q/3S}H 7(a.2R){b=-a.2R/3}7(b){s.15.13(b)}s.C.2a(a)},13:u(a){t b=B;t c=0;7(a>0){7(s.T>=1){c=s.T-1;b=y}}H{7(s.T<(s.P-1)){c=s.T+1;b=y}}7(b===y){s.1a(c)}}};9.E={1E:U,2P:0,2c:0,2I:0,N:B,X:u(){s.C.12(s.M,\'44\',s.E.31);s.C.12(s.M,\'33\',s.E.1M);s.C.12(A,\'33\',s.E.1M);s.M.4c=u(){t a=y;7(s.E.N===y){a=B}O a}},27:u(o){s.E.1E=o;s.E.2P=s.E.2c-o.34+s.1b},1M:u(){s.E.1E=U;s.E.N=B},31:u(e){t a=0;7(!e){e=I.1V}7(e.2t){a=e.2t}H 7(e.3b){a=e.3b+A.2E.3f+A.4m.3f}s.E.2c=a;7(s.E.1E!==U){t b=(s.E.2c-s.E.2P)+s.1d;7(b<(-s.1b)){b=-s.1b}7(b>(s.1n-s.1b)){b=s.1n-s.1b}t c=(b+s.1b)/(s.1n/(s.P-1));t d=Y.11(c);s.E.2I=b;s.E.1E.v.3e=b+\'G\';7(s.T!==d){s.1a(d)}s.E.N=y}}};9.F={x:0,2x:0,1Y:0,N:B,2u:y,X:u(){s.C.12(s.1I,\'4t\',s.F.27);s.C.12(A,\'4v\',s.F.13);s.C.12(A,\'4x\',s.F.1M)},3k:u(e){t a=B;7(e.20){t b=e.20[0].1p;7(b===s.1I||b===s.1F||b===s.1B){a=y}}O a},2H:u(e){t x=0;7(e.20){x=e.20[0].2t}O x},27:u(e){s.F.2x=s.F.2H(e);s.F.N=y;s.C.2a(e)},3p:u(){t a=B;7(s.F.N===y){a=y}O a},13:u(e){7(s.F.3p&&s.F.3k(e)){7(s.F.2u){s.F.1Y=((s.P-1)-s.T)*(s.Q/(s.P-1));s.F.2u=B}t a=-(s.F.2H(e)-s.F.2x-s.F.1Y);7(a<0){a=0}7(a>s.Q){a=s.Q}s.F.x=a;t b=Y.11(a/(s.Q/(s.P-1)));b=(s.P-1)-b;7(s.T!==b){s.1a(b)}s.C.2a(e)}},1M:u(){s.F.1Y=s.F.x;s.F.N=B}};9.2e={X:u(){A.4G=u(a){s.2e.13(a)}},13:u(a){t b=s.2e.1G(a);1v(b){1l 39:s.15.13(-1);S;1l 37:s.15.13(1);S}},1G:u(a){a=a||I.1V;O a.4K}};9.C={12:u(a,b,c){7(a.1f){a.1f(b,c,B)}H 7(a.3q){a["e"+b+c]=c;a[b+c]=u(){a["e"+b+c](I.1V)};a.3q("4N"+b,a[b+c])}},26:u(a,b){7(s.1r===y){a.v.1r=b/10;a.v.4O=\'4b(1r=\'+b*10+\')\'}},W:u(a,b,c){t d=A.3P(a);d.1P(\'2V\',s.K+\'3w\'+b);7(c!==1C){b+=\' \'+c}d.1P(\'4f\',b);d.1P(\'3R\',b);O d},2a:u(e){7(e.3c){e.3c()}H{e.3F=B}O B},3m:u(){t a=I.2g;7(1L I.2g!=\'u\'){I.2g=u(){s.2j()}}H{I.2g=u(){7(a){a()}s.2j()}}}}}t 17={2J:"17",1H:{},1o:1,1J:B,2A:U,3i:u(a){7(!a.$$1o){a.$$1o=9.1o++;7(9.1J){a()}9.1H[a.$$1o]=a}},3W:u(a){7(a.$$1o){4s 9.1H[a.$$1o]}},V:u(){7(9.1J){O}9.1J=y;1c(t i 4u 9.1H){9.1H[i]()}},1T:u(){7(9.1J){O}7(/4w|3J/i.2U(41.4A)){7(/3B|2O/.2U(A.3l)){9.V()}H{1g(9.2J+".1T()",1e)}}H 7(A.L("2v")){O y}7(1L 9.2A==="u"){7(1L A.3n!==\'1C\'&&(A.3n(\'2E\')[0]!==U||A.2E!==U)){7(9.2A()){9.V()}H{1g(9.2J+".1T()",3L)}}}O y},X:u(){7(A.1f){A.1f("4F",u(){17.V()},B)}1g("17.1T()",1e);u V(){17.V()}7(1L 12!=="1C"){12(I,"2Y",V)}H 7(A.1f){A.1f("2Y",V,B)}H 7(1L I.2m==="u"){t a=I.2m;I.2m=u(){17.V();a()}}H{I.2m=V}/*@3y@7(@4I||@47)A.4J("<3j 2V=2v 4L 2r=\\"//:\\"><\\/3j>");t b=A.L("2v");b.49=u(){7(9.3l=="2O"){17.V()}};@4M@*/}};t 4z=u(a){17.3i(a)};17.X();',62,299,'|||||||if||this||||||||||||||||||||var|function|style|||true||document|false|Helper|imagesDiv|MouseDrag|Touch|px|else|window|childNodes|ImageFlowID|getElementById|ImageFlowDiv|busy|return|max|imagesDivWidth|appendChild|break|imageID|null|run|createDocumentElement|init|Math|height||round|addEvent|handle||MouseWheel|div|domReadyEvent|pc|zIndex|glideTo|newSliderX|for|sliderWidth|100|addEventListener|setTimeout|current|getAttribute|width|maxHeight|case|xStep|scrollbarWidth|domReadyID|target|memTarget|opacity|display|visibility|length|switch|size|opacityArray|onclick|reflectionP|default|scrollbarDiv|undefined|indexArray|object|sliderDiv|get|events|navigationDiv|bDone|imageFocusM|typeof|stop|maxFocus|imageScaling|setAttribute|completed|onClick|firstCheck|schedule|percentLandscape|event|nodeType|reflections|stopX|percentOther|touches|firstRefresh||loadingProgress|nodeName|url|setOpacity|start|IMG|none|suppressBrowserDefault|buttons|mouseX|pcMem|Key|captionDiv|onresize|visible|imagesDivHeight|refresh|imageFocusMax|slider|onload|aspectRatio|moveTo|imagesM|imagesHeight|src|captions|pageX|first|__ie_onload|marginLeft|startX|sliderCursor|reflectionGET|DOMContentLoadedCustom|startID|reflectionPNG|_loading_txt|body|startAnimation|scrollbarP|getX|newX|name|animate|preloadImages|defaults|imageCursor|complete|objectX|wheelDelta|detail|offsetWidth|buttonNextDiv|test|id|50|createTextNode|load|loadingStatus|buttonPreviousDiv|drag|images|mouseup|offsetLeft|totalImagesWidth|button||_scrollbar||createStructure|clientX|preventDefault|hidden|left|scrollLeft|loading|02|add|script|isOnNavigationDiv|readyState|addResizeEvent|getElementsByTagName|paddingTop|isBusy|attachEvent|cursor|innerHTML|ImageFlow|67|caption|_|sqrt|cc_on|loading_txt|5000|loaded|_caption|nbsp|imageflow|returnValue|DOMMouseScroll|_navigation|scrollbar|WebKit|_loading_bar|250|mousewheel|alt|118|createElement|replaceChild|className|120|inline|firstChild|1000|remove|reflect|10000|previous||navigator|php|_images|mousemove|resize|next|_win64|img|onreadystatechange|navigation|alpha|onselectstart|_loading|_slider|class|marginTop|position|removeChild|relative|cloneNode|964|documentElement|paddingLeft|onmousedown|150|location|_previous|delete|touchstart|in|touchmove|KHTML|touchend|block|domReady|userAgent|longdesc|xPosition|loading_bar|_next|DOMContentLoaded|onkeydown|top|_win32|write|keyCode|defer|end|on|filter'.split('|'),0,{}));

/* Create ImageFlow instances when the DOM structure has been loaded */
domReady(function()
{
	var instanceOne = new ImageFlow();
	instanceOne.init({ ImageFlowID:'myImageFlow' });
});