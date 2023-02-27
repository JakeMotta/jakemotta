<!doctype html> 
<html>
<head>
<meta charset="utf-8">
<title>ART</title>

<link rel="stylesheet" type="text/css" href="files/maincss.css">
<link rel="stylesheet" type="text/css" href="files/reset.css">
<link rel="stylesheet" type="text/css" media="all" href="menu/css/styles.css">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:700" rel="stylesheet">

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

<div id="s-banner" style="background-image:url(images/banners/courses.jpg)">
	<div id="s-banner-content"><span class="banner-text">Frequently Asked</span></div>
</div>

<div id="container">

	<div id="leftcolumn">
    	
        <div class="content">
            	<span class="med-text bold-text">Q. Am I good/competent enough to be taking this course? I don’t want to look silly.</span><div class="line"></div>
                <span class="gen-text grey">
                    A. Every student has the very same thought going through their mind.  Of course you are good enough.  However, you should select a course within your skill set at first and then challenge yourself with a more advanced course.
                </span>
        </div> 
        
        <div class="content">
            	<span class="med-text bold-text">Q. How long is the course?</span><div class="line"></div>
                <span class="gen-text grey">
                    A. Courses are usually 4-5 hours in length.  However, if you still have ammo and want to shoot we will press on.  It’s your course.
                </span>
        </div> 
        
        <div class="content-dark">
            <span class="med-text bold-text white">Q. What if I don’t own a gun, or any of the equipment I need for the course?</span><div class="line"></div>
            <span class="gen-text white">
            	A. If you do not own a handgun, or wish to rent one, we have everything you'll need for any of our courses. Equipment rentals include: handguns, ammunition, magazines, magazine carriers, holsters, eye-protection, and ear-protection. <br> <a class="red-link" href="equipment-rentals.php">CLICK HERE for our equipment rental pricing</a>
            </span>
        </div>
                
        <div class="content">
            	<span class="med-text bold-text">Q. Besides the equipment listed in the course overview, what other things should I bring?</span><div class="line"></div>
                <span class="gen-text grey">
                    A. You should bring weather appropriate clothing.  Eye protection/ear protection, ball cap and a chair for lecture portion of class and any snacks or drinks you may want.
                </span>
        </div> 
        
        <div class="content">
            	<span class="med-text bold-text">Q. Will the training be conducted indoors or outdoors?</span><div class="line"></div>
                <span class="gen-text grey">
                    A. All training will be conducted outdoors.  Although indoor training is good for marksmanship, it does not allow the shooter to practice realistic training such as drawing from the holster and movement.
                </span>
        </div> 
            
        <div class="content">
            	<span class="med-text bold-text">Q. Are the courses physically demanding?</span><div class="line"></div>
                <span class="gen-text grey">
                    A. We move during all courses and are rarely static.  Some of the more advanced courses involve shooting from various positions other than standing.  Modifications of the course and or drill can be made for shooters while still achieving good tactics and solid hits on targets. 
                </span>
        </div> 
         
        <hr><br>
        
         <!-- REGISTER BUTTON -->
         <div class="content">
             <div id="class_register_button" onclick="register()">
                 <a class="register_button_link" href="register.php"><span class="med-text white class_register_text">Register</span></a>
             </div>
         </div>
            
    </div>	
    
    <?php
					include("files/rightcolumn.php");
	?>
    
    <!--Fixes auto-height for container-->
    <div id="container-footer"></div>

</div>

<?php
					include("files/footer.php");
?>

</body>
</html>
