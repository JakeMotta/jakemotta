<!DOCTYPE HTML>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Team SAFE Racing</title>

<!--Style Sheet-->
<link rel="stylesheet" href="../files/cssReset.css" type="text/css" />
<link rel="stylesheet" type="text/css" href="../files/mainCss.css">

<!--Font and JQuery-->
<script src="../files/jquery-3.4.1.min.js"></script>
<link href='http://fonts.googleapis.com/css?family=Roboto+Slab|Marmelad|Domine' rel='stylesheet' type='text/css'>

<!--NavBar-->
<link rel="stylesheet" href="../lavalamp/lavalamp_test.css" type="text/css" media="screen">
<script type="text/javascript" src="../lavalamp/jquery.lavalamp.js"></script>
<script type="text/javascript" src="../lavalamp/jquery.lavalamp.min.js"></script>
<script type="text/javascript" src="../lavalamp/jquery.easing.min.js"></script>
<script type="text/javascript">
        $(function() {
            $("#1").lavaLamp({
                fx: "backout", 
                speed: 700,
                click: function(event, menuItem) {
                }
            });
        });
    </script>
        

<!--SlideShow-->
<link rel="stylesheet" href="../files/responsiveslides.css">
<link rel="stylesheet" href="../files/slideCss.css">
  <script src="../files/responsiveslides.min.js"></script>
  <script>
    // You can also use "$(window).load(function() {"
    $(function () {

      // Slideshow 4
      $("#slider4").responsiveSlides({
        auto: true,
        pager: false,
        nav: false,
        speed: 500,
        namespace: "callbacks",
        before: function () {
          $('.events').append("<li>before event fired.</li>");
        },
        after: function () {
          $('.events').append("<li>after event fired.</li>");
        }
      });
    });
  </script>


<!--[if lt IE 9]>
<script src="files/html5shiv.js"></script>
<![endif]-->

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

</head>

<body>



<div id="container">
   <section id="topNav">
        <span id="largeTextShadow">
      	    Team SAFE Racing
        </span>
        <section id="contact">
            <span id="smallText"><span id="whiteText">
                    Email: teamsaferacing@yahoo.com
            </span></span>
        </section> <!--End Contact-->
   </section> <!--End topNav-->
   
<header id="head">
<section id="slideDiv">

<!-- Slideshow 4 -->
   <div class="callbacks_container">
      <ul class="rslides" id="slider4">
        <li>
          <img src="../images/slide/1.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
        <li>
          <img src="../images/slide/2.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
        <li>
          <img src="../images/slide/3.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
        <li>
          <img src="../images/slide/4.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
        <li>
          <img src="../images/slide/5.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
      </ul>
    </div>

</section> <!--End slideDiv-->

<nav id="headNav">
    <span id="navLinkText">
    	<ul class="lavaLampWithImage" id="1">
                <?php
						include("../files/sec_topNav.php");
				?>
       	</ul>     
	</span>
</nav> <!--End headNav-->
</header> <!--End Head-->


<section id="content">
<br>

<aside id="leftColumn">

<div align="center"><span id="medText" >Welcome Ryan McGee!</span><span id="smallText" ></span></div>
<hr />

<section id="mainContent">
<span id="pText">

<img id="bioPic" src="../images/bioPics/RyanMcGee.jpg"  />

&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <span id="redText">Team SAFE Racing</span> would like to welcome our <span id="redText">newest skater</span> to the team <span id="redText">Ryan McGee</span>.  Ryan, will be a <span id="redText">great addition to our team</span>. Ryan is originally from Texas and credits his start in speed skating to the Texas Flyers.  He moved to Santa Barbara after college to pursue his <span id="redText">MS and PhD at UCSB</span>.  He now runs his own <span id="redText">software development business</span>, which gives him the freedom to travel and skate often.  
Ryan is 26 years old and has been involved in <span id="redText">various forms of skating</span> for the past 20 years including rec skating, urban skating, aggressive skating and speed skating.  His favorite race is the <span id="redText">Berlin Marathon</span>.  He has been fortunate enough to do this race <span id="redText">twice now</span> and like to continue attending this race for many years to come.  His draw to the Berlin race is the <span id="redText">6,000 race participants</span> along with the fast course through the heart of the city and all of the <span id="redText">history of the area</span>.  
Ryan also enjoys cross country skate skiing, snowboarding, cycling, trail running and tower-running.  
<br><br>
Current skates:  <span id="redText">Bont</span> 3 point vaypors.
<br>
<br>


<br>
<br>

</span>
</section> <!--End mainContent-->
</aside> <!--End leftColumn-->

<aside id="rightColumn">
<br>
    <aside id="sponsorImages" align="center">
        	<?php
					include("../files/sec_sideBar.php");
			?>
    </aside>
</aside> <!--End rightColumn-->
</section> <!--End content-->


<footer id="foot">

	<footer id="footContact">
    	<span id="smallerText">
        	<?php
					include("../files/sec_Links.php");
			?>	
        </span>
    </footer>
    
    <footer id="footContent">
        <span id="smallerText">
            Copyright © 2014 Team SAFE Racing. All rights reserved. Website Design By <span id="whiteText"><a href="jakeMotta.php">Jacob Motta</a> </span><br>
        </span>
    </footer>

    <div id="bottomSkater" align="right">
    	<img src="../images/logos/skater2.gif" />&nbsp&nbsp&nbsp&nbsp
    	<img src="../images/logos/skater.gif" />
    </div>
</footer> <!--End foot-->


</div> <!--End Container-->

</body>
</html>
