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
						include("../sec_pages_topNav.php");
				?>
       	</ul>     
	</span>
</nav> <!--End headNav-->
</header> <!--End Head-->


<section id="content">
<br>

<aside id="leftColumn">
<div align="center"><span id="medText" >John Crysdale</span></div>
<hr />
<section id="mainContent">
<span id="pText">

<img src="../images/bioPics/JohnCrisdale.jpg" id="bioPic" />

I was born in Milwaukee, Wisconsin.  I currently live in Rohnert Park, California, which is about 45 minutes north of San Francisco when the traffic is good.  I am single and still feel like a kid.  Life has gone by too fast.  I have six brothers and sisters and 13 nieces and nephews, six of them living here in California. 
<br><br>

I started on my rec skates in 1989 and finally moved into racing in 1999.  Before this I was a long distance runner competing in track meets and road races until injuring my hamstring in 1989.  Tried running on it for a few more years, but the impact was just too uncomfortable.  I love inline skating, but wish more people did it so workouts were more fun.  My favorite inline marathon is North Shore, but Chicago is getting better every year with large packs and good competition.  In a perfect world I would be traveling and racing in marathons twice every month during the skating season.  My favorite activity during the off season is to ride with the Santa Rosa cycling club climbing the biggest hills in Sonoma county on some 60 to 80 mile rides.  Other leisure activities I enjoy include hot Bickram yoga and swimming.  I can’t say enough about Bickram yoga.  I truly believe it is going to enable me to compete successfully for years to come.  It stretches and strengthens all the muscles of the body.  I also enjoy spending quality time with friends and family.  I like to read, play board games and shoot pool as well.  Downhill skiing, golf and fishing are fun too, but never seem to have enough time and money for that. 
<br><br>

<span id="boldText">Favorite music:</span><br> - live blues music.  I like all kinds of music though. <br><br>

<span id="boldText">Favorite movie:</span><br> - “Dogtown Z boys” the documentary, not the movie.  Great documentary about the California kids of the 1970's who revolutionized skate boarding.<br><br>

<span id="boldText">Favorite vacation spot:</span><br> - My favorite vacation spot would probably be way up in the north woods of Wisconsin where I could hike, fish, eat and drink with good friends or family far away from the rat race.<br><br>

<span id="boldText">Favorite food:</span><br> - I like all kinds of food, but my favorite is probably Italian and Mexican with a cold beer right beforehand when I have already worked up a big appetite. 

 <br><br>
<div align="center">jcrysdale@vcentertainment.com</div><br>
 
</span> <!--End pText-->

</section> <!--End mainContent-->
</aside> <!--End leftColumn-->

<aside id="rightColumn">
<br>
    <aside id="sponsorImages" align="center">
        <?php
					include("../sec_pages_sideBar.php");
			?>
    </aside>
</aside> <!--End rightColumn-->
</section> <!--End content-->

<footer id="foot">

	<footer id="footContact">
    	<span id="smallerText">
        	<?php
					include("../sec_pages_Links.php");
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
