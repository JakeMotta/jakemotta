$(document).ready(function(){
	var $topnav = $('#top-nav');
	var $ni = $('#ni');
	var $ich = $('#ich');
	var $cloud1 = $('#cloud1');
	var $cloud2 = $('#cloud2');
	var $balloon = $('#balloons');
	var $san = $('#san');
	var $yon = $('#yon');
	var $go = $('#go');
	var $roku = $('#roku');


		$ich.waypoint(function (direction) {

			if(direction === 'up') {
				$topnav.addClass('fadeInDown');
				$topnav.removeClass('fadeOutUp');
			} else {
				$topnav.removeClass('fadeInDown');
				$topnav.addClass('fadeOutUp');
			}

		}, {offset: '0%'});

		$ni.waypoint(function (direction) {
			if(direction == 'down') {
				$san.css("opacity:100;"); 
				$san.addClass('fadeInLeft');
				$san.removeClass('fadeOutLeft');
			} else {
				$san.removeClass('fadeInLeft');
				$san.addClass('fadeOutLeft');
			}
		}, {offset: '40%'});
	
		$ni.waypoint(function (direction) {
			if(direction == 'down') {
				$yon.css("opacity:100;"); 
				$yon.addClass('fadeInRight');
				$yon.removeClass('fadeOutRight');
			} else {
				$yon.removeClass('fadeInRight');
				$yon.addClass('fadeOutRight');
			}
		}, {offset: '35%'});

		$ni.waypoint(function (direction) {
			if(direction == 'down') {
				$go.css("opacity:100;"); 
				$go.addClass('fadeInLeft');
				$go.removeClass('fadeOutLeft');
			} else {
				$go.removeClass('fadeInLeft');
				$go.addClass('fadeOutLeft');
			}
		}, {offset: '30%'});
	
		$ni.waypoint(function (direction) {
			if(direction == 'down') {
				$roku.css("opacity:100;"); 
				$roku.addClass('fadeInRight');
				$roku.removeClass('fadeOutRight');
			} else {
				$roku.removeClass('fadeInRight');
				$roku.addClass('fadeOutRight');
			}
		}, {offset: '25%'});	
});