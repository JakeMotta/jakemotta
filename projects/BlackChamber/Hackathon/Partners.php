<!DOCTYPE>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Black Youth Hackathon!</title>

<script type="text/javascript" src="files/jquery-1.5.1.min.js"></script>
<script type="text/javascript" src="files/jquery.orbit-1.2.3.min.js"></script>	

            <!--[if IE]>
			     <style type="text/css">
			         .timer { display: none !important; }
			         div.caption { background:transparent; filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000,endColorstr=#99000000);zoom: 1; }
			    </style>
			<![endif]-->

<!-- Run the plugin -->
<script type="text/javascript">
	$(window).load(function() {
	$('#featured').orbit();
	});
</script>

<link rel="stylesheet" type="text/css" href="files/MainCSS.css">
<link rel="stylesheet" type="text/css" href="files/orbit-1.2.3.css">

</head>

<body>`

<div id="container">
<div id="wrapper">
    <div id="banner">
        <div id="bannerText">
            <div align="center">
                <span id="mediumText">Silicon Valley Black Youth</span><br>
                <hr>
                <strong><span id="bigtitle">HACK-A-THON</span></strong>
            </div>
        </div>
    </div>
    
    <div id="slider">
		<div id="featured"> 
        	<?php
					include("files/sushi_slider.php");
			?>
		</div>
   </div>
   
        
    <div id="top-navbar">
        	<?php
					include("files/top-navbar.php");
		?>
    </div>
    
    <div id="content">
    
<span id="text">
<span id="title">Thank you, Partners</span><span id="mediumText"></span><br>
<hr>

This Page highlights the Partners who participated in our 1st Silicon Valley Black Youth hack-a-thon, a culmination of several weeks of recruiting, training and coding to develop a solution to our challenges.<br><br>

The assembly of some of the SF Bay Area’s brightest minds and their creations was on display Saturday Feb 6, 2016 at Rocket Fuel Inc in Redwood City. <br><br>

The heavyweight boxing champion of the world, Deontay Wilder, spoke to our youth at lunch along with Tech heavyweights like Michael Greene VP at Intel and Tony Prophet VP of Microsoft. For more on our Sponsors go to <strong><a href="http://blackchamber.com/hackathon/Sponsors.php">www.blackchaber.com (events/hackathon/sponsors)</a></strong><br><br>

All in all, the Bay Area, parents and teachers were in awe of some of the innovative creations that came from this our 1st Silicon Valley Black Youth hack-a-thon.<br><br>

<hr>

<div align="center">

<span id="mediumText"><strong>A who’s who list of Partners included:</strong></span><br><br>

<a href="http://www.blackenterprise.com/"><img id="leftf" class="fade" src="dummy-images/logo/blackenterprise.jpg"></a><br><br><br>
<a href="http://www.yeswecode.org/"><img id="rightf" class="fade" src="dummy-images/logo/YESWECODE_LOGO_WHITE.png"></a><br><br><br>
<a href="http://www.uncf.org/"><img id="leftf" class="fade" src="dummy-images/logo/uncf.jpg"></a><br><br><br>
<A href="http://www.nbmbaa.org/"><img id="rightf" class="fade" src="dummy-images/logo/Black_MBAs_Logo.png"></a><br><br><br>
<img id="leftf" class="fade" src="dummy-images/logo/black-girls-code-logo.jpg"><br><br><br>
<img id="rightf" class="fade" src="dummy-images/logo/StreetCode.jpg"><br><br><br>
<img id="leftf" class="fade" src="dummy-images/logo/CAAAE.jpg"><br><br><br>
<img id="rightf" class="fade" src="dummy-images/logo/Alliance.jpg"><br><br><br>
<img id="leftf" class="fade" src="dummy-images/logo/codewritingkids.jpg"><br><br><br>
<img id="rightf" class="fade" src="dummy-images/logo/bayarea.gif"><br><br><br><br><br>
<img id="rightf" class="fade" src="dummy-images/logo/jackandjill.jpg"><br><br><br>
</div>
<br><br><br><br><br><br><br><br><br><br><br>
</span>

	</div>
    
    <div id="footer">
    	<?php
					include("files/footer_content.php");
		?>
    </div>
</div>
</div>

</body>
</html>
