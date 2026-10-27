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
<div align="center"><span id="medText" >Paul Lomangino</span></div>
<hr />
<section id="mainContent">
<span id="pText">

<img src="../images/bioPics/PaulLomangino.jpg" id="bioPic" />

<span id="boldText">Born:</span><br> - Marion, VA, raised near Mobile, AL, living in Palo Alto, CA.<br><br>

<span id="boldText">Married, wife, kids?:</span><br> - Married to my supportive and understanding wife, Adrienne.  I have a 2 year old son (and potential future skater) Bennet.<br><br>

<span id="boldText">Favorite skate race:</span><br> - Tough question.  Northshore is always a great event.  Athens-to Atlanta is epic and character-revealing.<br><br>

<span id="boldText">Favorite activity:</span><br> - cycling; on and off season.<br><br>

<span id="boldText">Hobbies:</span><br> - I love spending time with family.  I recently read and enjoyed "The Art of Racing in the Rain" by Garth Stein. I have also been enjoying Matt Fraction's run of writing on the Iron Man comic book.<br><br>

<span id="boldText">Favorite musical artist/band:</span><br> - Might be Foo Fighters, but I like what I've heard from One Eskimo.  <br><br>

<span id="boldText">Favorite movie:</span><br> - "O Brother, Where Art Thou"<br><br>

<span id="boldText">Favorite vacation spot:</span><br> - tie between Vancouver and Portland.<br><br>

<span id="boldText">Favorite food:</span><br> - pizza.<br><br>

<span id="boldText">About:</span><br> - I started skating in '91, skated first races soon thereafter.  I got serious in the 2001-2002 season while training first with Milpitas and then with the Michigan Wolverine Team.<br><br>

<div align="center">drpaul@mindspring.com</div><br>

</span> <!--End pText-->

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
