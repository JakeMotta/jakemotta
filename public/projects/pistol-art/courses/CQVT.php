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
	<div id="s-banner-content"><span class="banner-text">Close Quarter Vehicle Tactics</span></div>
</div>

<div id="container">

        <div id="leftcolumn">
        
            <div class="content">
                <span class="large-text bold-text">Close Quarter Vehicle Tactics (CQVT)</span><div class="line"></div>
                <span class="gen-text grey">You will always be the first responder at your critical life incident. You must be prepared.</span>
            </div>
            
            <img id="class_photo" src="../images/courses/ccw.jpg">
            
            <hr><br>
            
            <div class="content">
            	<span class="med-text bold-text">Course Overview</span><div class="line"></div>
                <span class="gen-text grey">
                    
                        Over half of all shootings happen in and around vehicles.  For law enforcement the percentage rises up to 80-85%. <br>
                        This is a physically and mentally exhausting course, yet fun and a must  for law enforcement and those who carry concealed. <br>
                        This course will cover:
                        <br><br>
                    <ul>
                        <li class="bullet">"Vehicle ballistics"</li>
                        <li class="bullet">Firing/fighting from inside, around, and through a vehicle.</li>
                        <li class="bullet">The reality of vehicle cover.</li>
                        <li class="bullet">Firing/fighting from various positions (prone, kneeling, squatting, standing) and so much more.</li>
                    </ul>

                        <br>
                        This course will be held on Saturday, August 24, from 0700-1500 at the Avenal Gun Club. 
                        <br>
                        If interested and for a list of required gear, contact Vince Lozano @ 559-799-3858
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
            	<a onClick="prevPage(8)"><img id="prev_class"></a>
                <a onClick="nextPage(8)"><img id="next_class"></a>
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