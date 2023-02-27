$(document).ready(function(){
	
	var $topnav = $('#top-nav');
	var $midnav = $('#mid-nav');
	var $marker = $('#marker');
	
	var $left_column = $('#left-column');
	var $center_column = $('#center-column');
	var $right_column = $('#right-column');
	var $marker_2 = $('#marker-2');
	
	$midnav.remove();
	
	$marker.waypoint(function (direction) {

		if(direction == 'up')
		{
			console.log('up');
			
			$midnav.removeClass('slideInDown');
			$midnav.addClass('slideOutUp');
		
			setTimeout(function() {
				$topnav.removeClass('slideOutUp');
				$topnav.addClass('slideInDown');
			}, 600);
		}
		else
		{
			console.log('down');
			
			$marker.append($midnav);
			document.getElementById("mid-nav").style.opacity = '1';
			
			$midnav.addClass('slideInDown');
			$midnav.removeClass('slideOutUp');
			
			$topnav.addClass('slideOutUp');
			$topnav.removeClass('slideInDown');
		}
		
	}, {offset: '0%'});	
	
	$marker_2.waypoint(function (direction) {

		if(direction == 'up')
		{
			console.log('up');
			$left_column.removeClass('fadeIn');
			document.getElementById("left-column").style.opacity = '0';
			
			$center_column.removeClass('fadeIn');
			document.getElementById("center-column").style.opacity = '0';
			
			$right_column.removeClass('fadeIn');
			document.getElementById("right-column").style.opacity = '0';
		}
		else
		{
			console.log('down');
			$left_column.addClass('fadeIn');
			
			$center_column.addClass('fadeIn');
			
			$right_column.addClass('fadeIn');
		}
		
	}, {offset: '100%'});	
});