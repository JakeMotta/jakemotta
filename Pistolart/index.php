<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>ART</title>

<link rel="stylesheet" type="text/css" href="files/maincss.css">
<link rel="stylesheet" type="text/css" href="files/reset.css">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:700" rel="stylesheet">
<link rel="stylesheet" type="text/css" media="all" href="menu/css/styles.css">

<!--Nav Scripts-->
<script type="text/javascript" src="menu/js/jquery-1.11.1.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.4.min.js"></script>


</head>

<body>

<div id="top-nav"></div>

<?php
					include("files/lead-nav.php");
?>

<script type="text/javascript"> <!--Used for lead-nav functionallity. Do not remove-->
    $(function(){
      $('a[href="#"]').on('click', function(e){
        e.preventDefault();
      });
      
      $('#menu > li').on('mouseover', function(e){
        $(this).find("ul:first").show();
        $(this).find('> a').addClass('active');
      }).on('mouseout', function(e){
        $(this).find("ul:first").hide();
        $(this).find('> a').removeClass('active');
      });
      
      $('#menu li li').on('mouseover',function(e){
        if($(this).has('ul').length) {
          $(this).parent().addClass('expanded');
        }
        $('ul:first',this).parent().find('> a').addClass('active');
        $('ul:first',this).show();
      }).on('mouseout',function(e){
        $(this).parent().removeClass('expanded');
        $('ul:first',this).parent().find('> a').removeClass('active');
        $('ul:first', this).hide();
      });
    });
</script>

<div id="banner" style="background-image:url(images/banners/home.jpg)">
	<div id="banner-content"><span class="banner-text">Armed Response Training</span></div>
</div>

<div id="container" style="background-color:transparent;">
	
    <div class="i-row">
    	<div class="top-bun">
            <span class="bold-text med-text white">COURSES</span><div class="line"></div>
            <span class="gen-text grey">Our training is designed to produce confident, competent, and capable shooters in order to , not just survive, but prevail</span>
        </div>    
    
    <div id="slideshow">
       <div id="one">
         <img src="images/slider/one.jpg">
       </div>
       <div id="two">
         <img src="images/slider/two.jpg">
       </div>
       <div id="three">
         <img src="images/slider/three.jpg">
       </div>
       <div id="three">
         <img src="images/slider/four.jpg">
       </div>
    </div>
    
    </div> <!--END I-ROW-->
    
    <br><hr><br>
    
   <div class="i-row" style="padding-bottom:30px; padding-top:30px;">
    	<div align="center"><span class="bold-text banner-text grey">OUR BELIEFS</span><div class="line"></div></div> <br>      
        <div align="center">
            <span class="bold-text large-text red">- STAY READY SO YOU DON'T HAVE TO GET READY -</span><br>
            <span class="bold-text med-text grey">- REALITY TRAINING FOR THE REALITY OF LIFE -</span>
        </div>  
   </div>
   
   <br><hr><br><br>
   
   <div class="i-row" style="padding-bottom:30px;">
    	<div class="top-bun">
            <span class="bold-text med-text white">TRAINERS</span><div class="line"></div>
            <span class="gen-text grey">Vince Lozano (Lead Instructor)  —  I have been trained by some of the premier firearms instructors.  A blend of the most practical tactics are incorporated into each training session</span>
        </div>    
        
        <a href="about.php"><div class="profile_preview fade" style="background-image:url(images/courses/vince_2.jpg)">
        	<span style="position:relative; top:255px; left:0px;" class="bold-text med-text grey">Vince Lozano</span> <br>
            <span style="position:relative; top:255px; left:0px;" class="bold-text small-text grey">Lead Instructor</span>
        </div></a>
        
        <a href="guest-instructors.php#robmotta"><div class="profile_preview fade" style="background-image:url(images/courses/rob_motta.jpg)">
        	<span style="position:relative; top:255px; left:0px;" class="bold-text med-text grey">Rob Motta</span> <br>
            <span style="position:relative; top:255px; left:0px;" class="bold-text small-text grey">Guest Instructor</span>
        </div></a>
        
        <a href="guest-instructors.php#timsmith"><div class="profile_preview fade" style="background-image:url(images/courses/tim_smith.jpg)">
        	<span style="position:relative; top:255px; left:0px;" class="bold-text med-text grey">Tim Smith</span> <br>
            <span style="position:relative; top:255px; left:0px;" class="bold-text small-text grey">Guest Instructor</span>
        </div></a>
        
   </div> <!--END I-ROW-->
</div>

<?php
					include("files/footer.php");
?>

<script src="files/slideshow.js"></script>

</body>
</html>
