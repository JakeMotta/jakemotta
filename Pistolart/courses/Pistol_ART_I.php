<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>ART</title>

<link rel="stylesheet" type="text/css" href="../files/maincss.css">
<link rel="stylesheet" type="text/css" href="../files/reset.css">
<link rel="stylesheet" type="text/css" media="all" href="../menu/css/styles.css">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:700" rel="stylesheet">

<!--Nav Scripts-->
<script type="text/javascript" src="../menu/js/jquery-1.11.1.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.4.min.js"></script>

<!--Course Selector-->
<script type="text/javascript" src="../files/course_selection.js"></script>

</head>

<body>

<div id="top-nav"></div>

<?php
					include("../files/lead-nav.php");
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

<div id="s-banner" style="background-image:url(../images/banners/courses.jpg)">
	<div id="s-banner-content"><span class="banner-text">Pistol ART I</span></div>
</div>

<div id="container">

        <div id="leftcolumn">
        
            <div class="content">
                <span class="large-text bold-text">Pistol ART I</span><div class="line"></div>
                <span class="gen-text grey">You will always be the first responder at your critical life incident. You must be prepared.</span>
            </div>
            
            <img id="class_photo" src="../images/courses/pistol_art_I.jpg">
            
            <hr><br>
            
            <div class="content">
            	<span class="med-text bold-text">Course Overview</span><div class="line"></div>
                <span class="gen-text grey">
                    Great for someone who has little or no training with a pistol.  Students will learn safe gun handling, basic fundamentals of marksmanship, proper stance, grip, and their responsibilities as a gun owner. This course covers proper weapons presentation, draw from holster, weapons malfunctions, marksmanship (we train to hit not just shoot).  Lots of fun and a definite must for the pistol owner.
                </span>
            </div> 
            
            <div class="content">
            	<span class="med-text bold-text">Course Requirements</span><div class="line"></div>
                <span class="gen-text grey">
                    
      				<ul> 
                    	<li class="bullet">Cost:  $100</li>
                        <li class="bullet">Time: By Appointment</li>
                        <li class="bullet">Length: 4.5-6 hours</li>
                        <li class="bullet">* Good, working pistol</li>
                        <li class="bullet">* Strong side holster</li>
                        <li class="bullet">* x3 magazines</li>
                        <li class="bullet">* Magazine pouch</li>
                        <li class="bullet">* 350-400 rounds of ammunition (minimum)</li>
                    </ul>
                    
                    <br>
                    
                    * If you do not own a handgun, or wish to rent one, please see our <a class="red-link" href="../equipment-rentals.php">equipment rentals</a>
                    
                    <br><br>

 					Additional Range Fees may apply determined by course location.
                    
                    <br><br>

					All courses will cover intent, mindset, threat assessment, avoidance, firearm safety rules, and your responsibility as a gun owner/operator.
                    
                </span>
            </div> 
            
            <div class="content">
            	<span class="med-text bold-text">Benifits</span><div class="line"></div>  
                <span class="gen-text grey">
      				<ul> 
                    	<li class="bullet">Firearms and accessory selection for range and concealed carry</li>
                        <li class="bullet">Home safety</li>
                        <li class="bullet">Range operations and safety</li>
                        <li class="bullet">Marksmanship training drills to develop the fundamentals of shooting</li>
                        <li class="bullet">Safe gun handling drills</li>
                        <li class="bullet">Training for self defense and concealed carry</li>
                    </ul>
                </span>
            </div> 
            
            <!-- REGISTER BUTTON -->
            <div class="content">
                <div id="class_register_button" onclick="register()">
                    <span class="med-text white class_register_text">Register</span>
                </div>
            </div>
            
            <hr><br>
			
            <!-- NEXT/PREV BUTTONS -- update page number below -->
            <div class="content">
            	<a onClick="prevPage(1)"><img id="prev_class"></a>
                <a onClick="nextPage(1)"><img id="next_class"></a>
            </div>
                        
        </div>	<!--END LEFTCOLUMN-->
          
    <?php
					include("../files/rightcolumn.php");
	?>
    
    <!--Fixes auto-height for container-->
    <div id="container-footer"></div>

</div>

	<?php
					include("../files/footer.php");
	?>

</body>
</html>
