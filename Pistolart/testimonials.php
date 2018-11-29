<!doctype html> 
<html>
<head>
<meta charset="utf-8">
<title>ART</title>

<link rel="stylesheet" type="text/css" href="files/maincss.css">
<link rel="stylesheet" type="text/css" href="files/reset.css">
<link rel="stylesheet" type="text/css" media="all" href="menu/css/styles.css">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:700|Marck+Script" rel="stylesheet">

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

<div id="s-banner" style="background-image:url(images/banners/testimonies.jpg)">
	<div id="s-banner-content"><span class="banner-text">Testimonials</span></div>
</div>

<div id="container">

	<div id="leftcolumn">
    	
        <div class="content">
            	<span class="med-text bold-text">Customer Testimonials</span><div class="line"></div>
                <br>
                <span class="gen-text grey">
                	“I have been an avid shooter since I was very young. My Dad got me into shooting shotguns early on, and then into silhouette competitions. I have always felt very comfortable and somewhat accomplished at shooting. Several years ago I decided to get a CCW and go through courses, some book work, shoot at the range, easy stuff. A couple of years after that, a friend and I took a 2 day course at a training institute in Pahrump. This type of training certainly opened my eyes to just how untrained I was to the real world challenge of concealed carry. The two day course was well done, and we learned a great deal on how to handle our weapon.  A few years later, I learned that Vince was a CCW instructor. I have known Vince for a very long time, and needing to get my course completed soon so my license would not lapse, I gave him a call. He was able to put on the class rather quickly. I that we would just go through “the motions", I would get my certificate, and we’d be done. Once I stepped on to the range and received the safety instructions, I knew it would be unlike any other course I have attended. Honestly, Brand X paled in comparison to Vince's hands on combat training.  He had our group shoot in every possible scenario from standing up to lying down or in tandem working with a partner shooting at different targets. This amount of work and attention to detail was not what I was expecting at all, he truly loves doing it and it clearly shows. Our group worked harder and shot more in the 3-4 hours` with Vince than my friend and I did in 2 days at the other training institute. I took 300 rounds thinking that would be more than enough… not by a long shot. By then end of the course, the whole group was out of ammo and tired; our instructor wanted to continue. Try and get that type of training anywhere else; you won't find it.  I plan on attending his classes several times this year; hope to see you there."
                    <br><br>
                <div align="right">-Rick C.</div>
                </span>
        </div> 
        
        <hr><br>
        
        <div class="content-dark">
            <span class="med-text bold-text white">Mission Statement</span><div class="line"></div>
            <span class="gen-text white">
            	“Class is very educational, hands-on and makes you think about real life scenarios. Taught me things  that I had not heard of before and Im a combat veteran.  Lozano easily adapts his teaching ability to your level/knowledge of the firearm."
                    <br><br>
                <div align="right">-Brandon H.</div>
            </span>
        </div>
        
        <hr><br>
        
        <div class="content">
                <span class="gen-text grey">
                	“One of the best Firearm Experiences I have ever had. As a shooter with no previous formal instruction, I had reservations about taking a firearms course.  Any apprehension soon dispersed as I was presented with a safe, encouraging, and fun atmosphere.  Vince understands the dynamic of real world scenarios versus traditional static shooting.  He updates his own education with the latest developments in firearm defense and brings a practical strategy to the session, giving the student the mental and physical tools necessary to carry in safety and confidence.  Looking forward to the next course."
                    <br><br>
                <div align="right">-Chris M.</div>
                </span>
        </div> 
        
        <hr><br>
        
        <div class="content">
                <span class="gen-text grey">
                	“ART 1 & 2 exceeded my expectations.  Even having prior shooting knowledge I walked away truly confident in handling a firearm.  The instructor, Vince Lozano, makes the class fun, while teaching you everything you need to know, down to recognizing and clearing different malfunctions to the point it becomes second nature to you.  I would recommend these classes for anyone, even those with gun handling experience."
                    <br><br>
                <div align="right">-Jennifer W.</div>
                </span>
        </div> 
        
        <hr><br>
        
        <div class="content">
                <span class="gen-text grey">
                	“As a woman that is not in law enforcement, it is daunting to attend a training where other attendees are active law enforcement personnel.  However, Vince at Armed Response Training saw to it that I was in a comfortable and safe training environment and provided me valuable learning experiences that I will continue to build on.
                    <br><br>
I will continue to use the professional and beneficial services provided by Armed Response Training and I highly recommend them to anyone wanting to learn and improve their skills."
                    <br><br>
                <div align="right">-Uriel H.</div>
                </span>
        </div> 
        
        <hr><br>
        
        <div class="content">
                <span class="gen-text grey">
                	“Prior to finding Armed Response Training, I spent a week with various Range Masters with the agency for which I was hired. During that week they kept informing me on everything I was doing wrong.  During weapons qualifications with that same agency I failed to qualify, even worse I was warned that if I couldn’t get my rounds on target I would be terminated.  It made sense at the time.  I wanted to hand over my weapon right then and give up on shooting altogether.  Then I was introduced to ART.  Again I was told that I was shooting wrong and I thought to myself “Oh no, I’m not going to get it AGAIN! It’s exactly the same and I’m wasting this guys time!” But it was different.  ART addressed my issues by SHOWING me how to correct every area that I had been performing incorrectly with SPECIFIC teaching techniques.  In just a couple of hours, my abilities, even more so, my confidence skyrocketed!  I was able to not only meet, but exceed my goal.  I can shoot because of ART. I can’t wait for more training to become even more AWESOME!"
                    <br><br>
                <div align="right">-Mary-Rose E.</div>
                </span>
        </div> 
        
        <hr><br>
        
         <div class="content">
                <span class="gen-text grey">
                	“My experience at Armed Response Training was awesome!  The instructor put us through reality based scenarios and let us run through each scenario until we got it down.  He also let us run through team shooting drills, moving drills, one handed shooting/reloading drills and we drew from the holster which not a lot of ranges around here let you do that.
                    <br><br>
Overall I enjoyed myself and learned a lot from this course, well worth the time and money spent.”
                    <br><br>
                <div align="right">-Joshua M.</div>
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
