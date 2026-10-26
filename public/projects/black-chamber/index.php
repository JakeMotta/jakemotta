<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Silicon Valley Black Chamber of Commerce</title>

<link href="files/cssReset.css" rel="stylesheet" type="text/css" />
<link href="files/mainCSS.css" rel="stylesheet" type="text/css" />

<!--For Sliding Images-->   
<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
<script type="text/javascript" src="files/jssor.core.js"></script>
<script type="text/javascript" src="files/jssor.utils.js"></script>
<script type="text/javascript" src="files/jssor.slider.js"></script>
<script type="text/javascript" src="files/controls.js"></script>

<!--<script type="text/javascript">

if (screen.width <= 800) {
document.location = "http://www.blackchamber.com/mobile";
}

</script>-->

</head>

<body>



<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<div id="bigbox">
		<?php
					include("files/side_logos.php");
		?>

<div id="container">

<div id="header">
		<?php
					include("files/head_links.php");
		?>
</div>

<div id="topNav">
        
        <?php
					include("files/top_nav.php");
		?>

</div>

<div id="content">

<div id="phoneDiv">
<a href="https://www.youtube.com/watch?v=--9ePUXHEqI&feature=youtu.be"><img src="images/phonepicture.fw.png" /></a>
</div>

<div id="banner">

	<!--<img id="subscribeButton" src="images/subscribe.fw.png" />-->
    <div id="memberLogin"><!--MOBILIZED MEMBER LOGIN--></div>
    
</div>

<div id="lowerPage">
<div id="strip">

        <!--For Sliding Images-->
            <div id="slider1_container" style="position: relative; top: 0px; left: 0px; width: 960px; height: 220px; overflow: hidden;">
                <!-- Loading Screen -->
                <div u="loading" style="position: absolute; top: 0px; left: 0px;">
                    <div style="filter: alpha(opacity=70); opacity:0.7; position: absolute; display: block; background-color: #000; top: 0px; left: 0px;width: 100%;height:100%;"> </div>
                    <div style="position: absolute; display: block; background: url(images/loading.gif) no-repeat center center; top: 0px; left: 0px;width: 100%;height:100%;"></div>
                </div>
        
            <?php
					include("files/stripImages.php");
			?>
        
            <!-- Arrow Left -->
            <span u="arrowleft" class="jssora03l" style="width: 55px; height: 55px; top: 123px; left: 8px;">
            </span>
            <!-- Arrow Right -->
            <span u="arrowright" class="jssora03r" style="width: 55px; height: 55px; top: 123px; right: 8px">
            </span>
            </div>
                         
</div>

<div id="footer">
	
    	<?php
					include("files/bot_nav.php");
		?>
    
</div>
</div>
</div>
</div>
</div>

<div id="cmslink">
	<div id="cmsText">
	<p id='smallText' class='fade' align='right'><a href=https://www.linkedin.com/in/jacobmotta>Website created by Jake Motta</a></p>
	</div>
</div>

<!-- Start of StatCounter Code for Default Guide -->
<script type="text/javascript">
var sc_project=10336632; 
var sc_invisible=1; 
var sc_security="4e0ee694"; 
var scJsHost = (("https:" == document.location.protocol) ?
"https://secure." : "http://www.");
document.write("<sc"+"ript type='text/javascript' src='" +
scJsHost+
"statcounter.com/counter/counter.js'></"+"script>");
</script>
<noscript><div class="statcounter"><a title="web counter"
href="http://statcounter.com/" target="_blank"><img
class="statcounter"
src="http://c.statcounter.com/10336632/0/4e0ee694/1/"
alt="web counter"></a></div></noscript>
<!-- End of StatCounter Code for Default Guide -->


</body>
</html>
