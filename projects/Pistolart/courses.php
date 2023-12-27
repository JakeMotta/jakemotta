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
	<div id="s-banner-content"><span class="banner-text">COURSES</span></div>
</div>

<div id="container">

	<div id="leftcolumn">
    	
          <div class="content">
            <span class="med-text bold-text">Courses</span><div class="line"></div>
              <span class="gen-text grey">
                  
            <ul> 
              <li class="bullet"><a class="grey-link" href="courses/Pistol_ART_I.php">Pistol Art I</a></li>
                <li class="bullet"><a class="grey-link" href="courses/Pistol_ART_II.php">Pistol Art II</a></li>
                <li class="bullet"><a class="grey-link" href="courses/Pistol_ART_III.php">Pistol Art III</a></li>
                <li class="bullet"><a class="grey-link" href="courses/Pistol_ART_IV.php">Pistol Art IV</a></li>
                <li class="bullet"><a class="grey-link" href="courses/Force-on-Force.php">Force-on-Force</a></li>
                <li class="bullet"><a class="grey-link" href="courses/CCW.php">Concealed Carry Weapons (CCW)</a></li>
                <li class="bullet"><a class="grey-link" href="courses/Low_Light.php">Low-Light Pistol</a></li>
                <li class="bullet"><a class="grey-link" href="courses/CQVT.php">Close Quarter Vehicle Tactics (CQVT)</a></li>
            </ul>
                    
            <br>

					  All courses will cover intent, mindset, threat assessment, avoidance, firearm safety rules, and your responsibility as a gun owner/operator.
                    
            </span>
          </div> 
            
         <div class="content-dark">
            <span class="med-text bold-text white">Testimonial</span><div class="line"></div>
            <span class="gen-text white">
            	“Class is very educational, hands-on and makes you think about real life scenarios. Taught me things  that I had not heard of before and Im a combat veteran.  Lozano easily adapts his teaching ability to your level/knowledge of the firearm."
                    <br><br>
                <div align="right">-Brandon H.</div>
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
