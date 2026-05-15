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

<!-- PAGE BANNER -->
<div id="s-banner" style="background-image:url(../images/banners/courses.jpg)">
	<div id="s-banner-content"><span class="banner-text">Force-on-Force</span></div>
</div>

<div id="container">

        <div id="leftcolumn">
        
            <div class="content">
                <span class="large-text bold-text">Force-on-Force</span><div class="line"></div>
                <span class="gen-text grey">You will always be the first responder at your critical life incident. You must be prepared.</span>
            </div>
            
            <img id="class_photo" src="../images/courses/Force_on_Force.jpg" />
            
            <hr><br>
            
            <div class="content">
            	<span class="med-text bold-text">Course Overview</span><div class="line"></div>
                <span class="gen-text grey">
                    This course is a MUST if you carry or intend to carry.   This course features a 2 hour power point presentation titled “Tactical Mind” which covers Threat Assessment, Intent, Violence, and the Mental Preparation one must have to succeed in a truly violent confrontation.  After the presentation students will use AirSoft weapons and proper safety equipment (provided by ART) to be put through various ‘real life’ scenarios.  If you have never participated in Force-on-Force training you are not truly prepared.  Force-on-Force is not target shooting…..targets don’t shoot back!  People respond different when rounds are going in both directions.  Participants are encouraged to bring a video recording device for the scenarios, as this will allow you to review your training anytime after.
                </span>
            </div> 
            
            <div class="content">
            	<span class="med-text bold-text">Course Requirements</span><div class="line"></div>
                <span class="gen-text grey">
                    
      				<ul> 
                    	<li class="bullet">Cost:  $120</li>
                        <li class="bullet">Time: By Appointment</li>
                        <li class="bullet">Length: 4 hours</li>
                    </ul>
                    
                    <br>
                    
                    * If you do not own a handgun, or wish to rent one, please see our <a class="red-link" href="../equipment-rentals.php">equipment rentals</a>
                    
                    <br><br>

 					Additional Range Fees may apply determined by course location.
                    
                    <br><br>

					All courses will cover intent, mindset, threat assessment, avoidance, firearm safety rules, and your responsibility as a gun owner/operator.
                    
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
            	<a onClick="prevPage(5)"><img id="prev_class"></a>
                <a onClick="nextPage(5)"><img id="next_class"></a>
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
