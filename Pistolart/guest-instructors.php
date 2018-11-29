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

<div id="s-banner" style="background-image:url(images/banners/guest-instructors.jpg)">
	<div id="s-banner-content"><span class="banner-text">GUEST INSTRUCTORS</span></div>
</div>

<div id="container">

	<div id="leftcolumn">
    	
        <!-- BEGIN ROB MOTTA -->
        <div class="anchor" id="robmotta"></div>
        <div class="content">
            	<span class="med-text bold-text">Rob Motta</span><div class="line"></div>
                <span class="gen-text grey">
                
                <img class="profile_img_guest" style="background-image:url(images/courses/rob_motta.jpg)">
                
                	Rob Motta has been a peace officer since 1992 and became a range-master in 2008.  He also instructs concealed carry techniques and scenarios for both peace officers and civilians.  <br><br> Working with his departments In-Service Training, he assists in the training of hundreds of peace officers each year.  Motta has attended multiple outside agency and private instructional courses for weapons, emergency response and active shooters.
                </span>
        </div> 
        
        <div class="content">
            	<span class="small-text bold-text">Certifications:</span><div class="line"></div>
                <span class="gen-text grey">
					<ul> 
                    	<li class="bullet">Classroom Master Instructor</li>
                        <li class="bullet">Range Master</li>
                        <li class="bullet">Glock instructor</li>
                        <li class="bullet">Winning Edge mental preparation for violent encounters</li>
                        <li class="bullet">Law enforcement active shooter emergency response trainer (through Department of Homeland Security, NCBRT, LSU)</li>
                        <li class="bullet">Tactical response to school and community violence</li>
                        <li class="bullet">Tactical Handgun I / II / III / IV</li>
                        <li class="bullet">Tactical Medical for First Responders (Through Department of Homeland Security)</li>
                    </ul>
                </span>
        </div> 
        <!-- END ROB MOTTA -->
        
        <hr><br>
        
        <!-- BEGIN TIM SMITH -->
        <div class="anchor" id="timsmith"></div>
        <div class="content">
        		<span class="med-text bold-text">Tim Smith</span><div class="line"></div>
                <span class="gen-text grey">
                
                <img class="profile_img_guest" style="background-image:url(images/courses/tim_smith.jpg)">
                
                	Tim Smith is a retired peace officer with 27 years of service.  For over 15 years of his career he was an integral part of his departments In-Service Training department where he instructed courses on Use of Force, alarm response, chemical agents, firearms instruction, reality based training, emergency response and much more.  Smith attended multiple outside agency and private instructional courses for weapons, emergency response and active shooters.  
                </span>
        </div> 
        
        <div class="content">
            	<span class="small-text bold-text">Certifications:</span><div class="line"></div>
                <span class="gen-text grey">
					<ul> 
                    	<li class="bullet">Classroom Master Instructor</li>
                        <li class="bullet">Range Master</li>
                        <li class="bullet">Firearms proctor</li>
                        <li class="bullet">Winning Edge mental preparation for violent encounters</li>
                        <li class="bullet">Law enforcement active shooter emergency response trainer (through Department of Homeland Security, NCBRT, LSU)</li>
                        <li class="bullet">Tactical response to school and community violence</li>
                        <li class="bullet">Tactical Handgun I / II / III / IV</li>
                        <li class="bullet">Tactical Rifle</li>
                        <li class="bullet">Tactical Shotgun</li>
                    </ul>
                </span>
        </div> 
        
        <!-- END TIM SMITH -->
            
            
        
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
