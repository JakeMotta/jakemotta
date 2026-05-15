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

<div id="s-banner" style="background-image:url(images/banners/schedule.jpg)">
	<div id="s-banner-content"><span class="banner-text">SCHEDULE</span></div>
</div>

<div id="container">

	<div id="leftcolumn">
    	
        <div class="content scheduleTable">
            <span class="med-text bold-text">Schedule</span><div class="line"></div>
            <table id='schedule-table'>
                <tbody id='schedule-table-body'>
                    <tr class="schedule-table-row">
                        <td class='schedule-table-data schedule-table-left'><a href="http://pistolart.net/files/pdfs/cqb-2-15-20.pdf" target=”_blank”>Saturday, February 15</a></td>
                        <td class='schedule-table-data schedule-table-right end-row'><a href="http://pistolart.net/files/pdfs/cqb-2-15-20.pdf" target=”_blank”>CQB</a></td>
                    </tr>
                    <tr class="schedule-table-row">
                        <td class='schedule-table-data schedule-table-left'><a href="http://pistolart.net/files/pdfs/low-light-2-22-20.pdf" target=”_blank”>Saturday, February 22</a></td>
                        <td class='schedule-table-data schedule-table-right end-row'><a href="http://pistolart.net/files/pdfs/low-light-2-22-20.pdf" target=”_blank”>Low-Light Pistols</a></td>
                    </tr>
                    <tr class="schedule-table-row">
                        <td class='schedule-table-data schedule-table-left'><a href="http://pistolart.net/files/pdfs/stop-the-bleed-3-7-20.pdf" target=”_blank”>Saturday, March 07</a></td>
                        <td class='schedule-table-data schedule-table-right end-row'><a href="http://pistolart.net/files/pdfs/stop-the-bleed-3-7-20.pdf" target=”_blank”>Stop The Bleed</a></td>
                    </tr>
                    <tr class="schedule-table-row">
                        <td class='schedule-table-data schedule-table-left'><a href="http://pistolart.net/files/pdfs/artI-3-15-20.pdf" target=”_blank”>Sunday, March 15</a></td>
                        <td class='schedule-table-data schedule-table-right end-row'><a href="http://pistolart.net/files/pdfs/artI-3-15-20.pdf" target=”_blank”>Pistol ART 1</a></td>
                    </tr>
                </tbody>
            </table>
        </div> 
            
        <hr><br>

        <div class="content">
            <span class="med-text bold-text">Pistol ART I</span><div class="line"></div>
            <span class="gen-text grey">
            Beginners shooting course.  This course will cover all the essentials of gun handling, proper sight alignment/sight picture, grip, stance, accuracy.
            </span>
        </div> 

        <div class="content">
            <span class="med-text bold-text">Pistol ART II</span><div class="line"></div>
            <span class="gen-text grey">
                The ART of shooting. Shooting from various positions, some movement, multiple target engagements, and proper assess and scan.
            </span>
        </div> 

        <div class="content">
            <span class="med-text bold-text">Pistol ART III - FIGHT!</span><div class="line"></div>
            <span class="gen-text grey">
                This is an aggressive course. Shooters will engage multiple targets while moving and fixing malfunctions, learn proper use of barricades, and shoot with a partner.
            </span>
        </div> 

        <div class="content">
            <span class="med-text bold-text">Pistol ART IV - MOVE!</span><div class="line"></div>
            <span class="gen-text grey">
                Constant movement while performing at an advanced level with a handgun, shooting from  various  positions, multiple target engagements.
            </span>
        </div> 

        <div class="content">
            <span class="med-text bold-text">Tac-Med</span><div class="line"></div>
            <span class="gen-text grey">
                "You got shot!” - If you carry a gun as part of your profession or as a CCW, this course is a must.  The skills learned in this course are just as important  as  having an  emergency life -saving device (gun) itself.
            </span>
        </div> 

        <div class="content">
            <span class="med-text bold-text">Low-Light</span><div class="line"></div>
            <span class="gen-text grey">
                "I can't see!" - More than half of violent encounters occur in low-light environment.  This course will cover the proper use of  illumination tools  while using a handgun.  The shooter will learn to use  and manipulate  both hand-held and weapons mounted lights properly.
            </span>
        </div> 

        <div class="content">
            <span class="med-text bold-text">Concealed Carry Warrior</span><div class="line"></div>
            <span class="gen-text grey">
                You are qualified to carry, now get trained to carry. This course will cover proper deployment of your weapon from concealment and from multiple positions, standing, seated, kneeling, lying, and with various obstructions (human & non-human) added to the chaos.
            </span>
        </div> 

        <div class="content">
            <span class="med-text bold-text">Close Quarter Vehicle Tactics (CQVT)</span><div class="line"></div>
            <span class="gen-text grey">
                Shooting from, through, around and under vehicles.  You will learn techniques and considerations when having to engage with your weapon from inside and outside of a vehicle.  You will learn which parts of a vehicle offer limited cover and proper weapons orientation while moving from and around vehicles with a partner.
            </span>
        </div> 

        <div class="content">
            <span class="med-text bold-text">Handgun Close Quarter Battle (Handgun CQB)</span><div class="line"></div>
            <span class="gen-text grey">
                Handgun CQB is a pistol course at contact distance. The course will cover: precision vs stress sight shooting, contact distance shooting, ground CQB shooting from various positions, standing, kneeling, urban prone, and supine.
            </span>
        </div> 
        
        <hr><br>

        <div class="content">
            <span class="med-text bold-text">Registration</span><div class="line"></div>
            <span class="gen-text grey">
                To register for a course, scheduled times, and additional information contact Vince Lozano @ 559-799-3858 or register below.
            </span>
        </div> 
        
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
