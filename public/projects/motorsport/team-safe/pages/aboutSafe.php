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
<div align="center"><span id="medText" >SAFE Security</span></div>
<hr />
<section id="mainContent">
<span id="pText">

<span id="blueText">Since 1988, SAFE</span> has been providing Americans with residential and small business security and life safety.<br><br>

 	<span id="blueText">SAFE’s name and lighthouse logo</span> have been symbols that reflect our philosophy of protection and security, and the solid foundation of our business practice. Initially, as Security Alarm Financing Enterprises (hence SAFE), we adopted the lighthouse as a symbol representing that we are a “safe harbor” for security alarm customers across the nation. As our customer base quickly grew over the years, we have maintained state-of-the-art security equipment offerings, superior customer service and the most current (and secure) office technology available.<br><br>

<span id="blueText">With the idea that a security company should be built</span> around the concept of providing high quality customer care, Paul Sargenti, SAFE's President and CEO, founded the company in August 1988. While a business plan with the customer being at the heart of its focus is not unique, a company that successfully executes that business plan day after day is. SAFE has always understood that without satisfied customers, the business would not survive. Consequently, every division and department at SAFE has
the word "customer" in its mission statement. <br><br>

<span id="blueText">SAFE is proud of our history and performance record</span>, but most of all, proud of the commitment and enduring contribution of its employees/ team members who have created a corporate culture dedicated to providing the highest quality customer care possible. 	 
Paul Sargenti
SAFE's President & CEO<br><br>

 
<span id="blueText">Our Mission</span><br><br>
 
<span id="blueText">SAFE Security provides quality security alarm systems</span>, industry-leading monitoring services, excellence in residential and commercial support, and growth strategies and state-of-the-art business services for independent alarm dealers across the nation. <br><br>

We are guided by Core Values of:<br><br>
<ul>
    <li><span id="boldText">•</span>&nbsp&nbsp&nbsp&nbsp Accountability to execute best business practices.</li>
    <li><span id="boldText">•</span>&nbsp&nbsp&nbsp&nbsp Teamwork to promote excellence within.</li>
    <li><span id="boldText">•</span>&nbsp&nbsp&nbsp&nbsp Integrity and professionalism in our actions.</li>
    <li><span id="boldText">•</span>&nbsp&nbsp&nbsp&nbsp Performance excellence that returns value to the customer and company.</li>
    <li><span id="boldText">•</span>&nbsp&nbsp&nbsp&nbsp Customer Focus that inspires trust, confidence and loyalty.</li>
</ul>
<br><br>

To learn more about SAFE Security®, call us at <span id="boldText">1-800-669-7779</span> or <a href="http://www.safesecurity.com/sf/products_services/request.aspx"><span id="boldText">CLICK HERE</span></a> to request more information.
<br><br>



       
</span>

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
