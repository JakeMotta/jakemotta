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

<div id="s-banner" style="background-image:url(images/banners/about.jpg)">
	<div id="s-banner-content"><span class="banner-text">ABOUT</span></div>
</div>

<div id="container">

	<div id="leftcolumn">
    
        <div class="content">
                <span class="large-text bold-text">About Vince</span><div class="line"></div>
                <span class="gen-text grey">
                    <img class="profile_img" style="background-image:url(images/courses/vince.jpg)">
                    Vince has been Firearms instructor for over 20 years.  He is a certified Homeland Security Active Shooter Instructor, State Range master, Glock Semi-Automatic Handgun Instructor, NRA certified Basic Pistol Instructor, NRA Personal Protection Inside the Home and Outside the Home Instructor, Ca. Hunter Education Instructor and he is DOJ certified.  He has certifications in Tactical Handgun I-V, and Tactical Medical for First Responders (Through Department of Homeland Security).  <br><br> He has been trained by and with many of the Nation's top instructors including Delta Force team members, Navy SEALs, SWAT Team members from various police agencies, US Marshal Service Officers, and many other well trained professional personnel.  
                </span>
            </div>
        
        <hr><br>
		
        <div class="anchor" id="our-mission"></div>
    	<div class="content">
            <span class="med-text bold-text">Philosophy</span><div class="line"></div>
            <span class="gen-text grey">
            	I believe that it is the individuals’ responsibility to protect themselves and their loved ones.  It is not the responsibility of their neighbor, the police, nor their elected officials.  You and you alone have been blessed with the burden and responsibility to protect yourself and your family.  Self-preservation is the most critical, yet basic, instinct for life.<br><br>
You are the only person who will be at 100% of your critical life incidents, therefore that makes you the most capable person at that time to do something about it.<br><br>
You will always be the first responder at your critical life incident.  You must be prepared.  You must have the Training, Intent, Tactics, and Skill to prevail at the time of your critical life incident.
            </span>
        </div>
        
        <div class="content-dark">
            <span class="med-text bold-text white">Mission Statement</span><div class="line"></div>
            <span class="gen-text white">
            	I will train, rather than just instruct, students to understand the gun, how it works, how to read the gun, so they can give the gun what it needs to operate, whether it be additional ammo, clear a malfunction, or press the trigger more smoothly.  Like any craftsman, the operator needs to have an intimate knowledge of his tool, its functions, and its’ potential.
            </span>
        </div>
                
        <div class="content">
            <span class="med-text bold-text">What to Expect</span><div class="line"></div>
            <span class="gen-text grey">
            	You will learn, train, and practice in a relaxed and fun atmosphere.  Although weapons training is inherently dangerous, respect of the firearm and consistently following the firearm safety rules will diminish any apprehension to train.  Tactics will be demonstrated and explained.  <br><br>
I believe that people understand and learn faster when the answer to “Why?” is added into the equation.  Students will be asked to challenge themselves and to put themselves in various scenarios through visualization.  Prior to each course I will give you my expectations and goals and ask for your goals from the course. What do you want from the course you are attending?    I will strive to improve your <span class="bold-text">confidence</span>, <span class="bold-text">competence</span>, and <span class="bold-text">capabilities</span>.
            </span>
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
