$(document).ready(function() {			
			$('#deco_nuages').pan({fps: 30, speed: 0.7, dir: 'left', depth: 10});               
            $('#deco_city').pan({fps: 30, speed: 1, dir: 'left', depth: 70});
			
			$('.hpdiapo').bind("click",function(){
				var elem = $(this);
				if(elem.data('flipped')) {
					elem.revertFlip();
					elem.data('flipped',false)
				} 
				else {
					elem.flip({
						direction:'lr',
						speed: 350,
						
						onBefore: function(){
							elem.html(elem.siblings('.hp_desc').html());
						}
					});
						elem.data('flipped',true);
				}
			});			
		});   
		
(function(a){function b(a){a.elem.style[a.prop]=parseInt(a.now,10)+a.unit}var c=function(a){throw{name:"jquery.flip.js plugin error",message:a}};var d=function(){return false&&typeof document.body.style.maxHeight==="undefined"};var e={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[0,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]};var f=function(a){if(a&&a.indexOf("#")==-1&&a.indexOf("(")==-1){return"rgb("+e[a].toString()+")"}else{return a}};a.extend(a.fx.step,{borderTopWidth:b,borderBottomWidth:b,borderLeftWidth:b,borderRightWidth:b});a.fn.revertFlip=function(){return this.each(function(){var b=a(this);b.flip(b.data("flipRevertedSettings"))})};a.fn.flip=function(b){return this.each(function(){var c=a(this),e,g,h,j,l,n=d();if(c.data("flipLock")){return false}var o={direction:function(a){switch(a){case"tb":return"bt";case"bt":return"tb";case"lr":return"rl";case"rl":return"lr";default:return"bt"}}(b.direction),bgColor:f(b.color)||"#000",color:f(b.bgColor)||c.css("background-color"),content:c.html(),speed:b.speed||500,onBefore:b.onBefore||function(){},onEnd:b.onEnd||function(){},onAnimation:b.onAnimation||function(){}};c.data("flipRevertedSettings",o).data("flipLock",1).data("flipSettings",o);e={width:c.width(),height:c.height(),bgColor:f(b.bgColor)||c.css("background-color"),fontSize:c.css("font-size")||"12px",direction:b.direction||"tb",toColor:f(b.color)||"#000",speed:b.speed||500,top:c.offset().top,left:c.offset().left,target:b.content||null,transparent:"transparent",dontChangeColor:b.dontChangeColor||false,onBefore:b.onBefore||function(){},onEnd:b.onEnd||function(){},onAnimation:b.onAnimation||function(){}};n&&(e.transparent="#123456");g=c.css("visibility","hidden").clone(true).data("flipLock",1).appendTo("body").html("").css({visibility:"visible",position:"absolute",left:e.left,top:e.top,margin:0,zIndex:9999});var p=function(){return{backgroundColor:e.transparent,fontSize:0,lineHeight:0,borderTopWidth:0,borderLeftWidth:0,borderRightWidth:0,borderBottomWidth:0,borderTopColor:e.transparent,borderBottomColor:e.transparent,borderLeftColor:e.transparent,borderRightColor:e.transparent,background:"none",borderStyle:"solid",height:0,width:0}};var q=function(){var a=e.height/100*25;var b=p();b.width=e.width;return{start:b,first:{borderTopWidth:0,borderLeftWidth:a,borderRightWidth:a,borderBottomWidth:0,borderTopColor:"#395663",borderBottomColor:"#395663",top:e.top+e.height/2,left:e.left-a},second:{borderBottomWidth:0,borderTopWidth:0,borderLeftWidth:0,borderRightWidth:0,borderTopColor:e.transparent,borderBottomColor:e.transparent,top:e.top,left:e.left}}};var r=function(){var a=e.height/100*25;var b=p();b.height=e.height;return{start:b,first:{borderTopWidth:a,borderLeftWidth:0,borderRightWidth:0,borderBottomWidth:a,borderLeftColor:"#395663",borderRightColor:"#395663",top:e.top-a,left:e.left+e.width/2},second:{borderTopWidth:0,borderLeftWidth:0,borderRightWidth:0,borderBottomWidth:0,borderLeftColor:e.transparent,borderRightColor:e.transparent,top:e.top,left:e.left}}};j={tb:function(){var a=q();a.start.borderTopWidth=e.height;a.start.borderTopColor=e.bgColor;a.second.borderBottomWidth=e.height;a.second.borderBottomColor=e.toColor;return a},bt:function(){var a=q();a.start.borderBottomWidth=e.height;a.start.borderBottomColor=e.bgColor;a.second.borderTopWidth=e.height;a.second.borderTopColor=e.toColor;return a},lr:function(){var a=r();a.start.borderLeftWidth=e.width;a.start.borderLeftColor=e.bgColor;a.second.borderRightWidth=e.width;a.second.borderRightColor=e.toColor;return a},rl:function(){var a=r();a.start.borderRightWidth=e.width;a.start.borderRightColor=e.bgColor;a.second.borderLeftWidth=e.width;a.second.borderLeftColor=e.toColor;return a}};h=j[e.direction]();n&&(h.start.filter="chroma(color="+e.transparent+")");l=function(){var a=e.target;return a&&a.jquery?a.html():a};g.queue(function(){e.onBefore(g,c);g.html("").css(h.start);g.dequeue()});g.animate(h.first,e.speed);g.queue(function(){e.onAnimation(g,c);g.dequeue()});g.animate(h.second,e.speed);g.queue(function(){if(!e.dontChangeColor){c.css({backgroundColor:e.toColor})}c.css({visibility:"visible"});var a=l();if(a){c.html(a)}g.remove();e.onEnd(g,c);c.removeData("flipLock");g.dequeue()})})}})(jQuery)