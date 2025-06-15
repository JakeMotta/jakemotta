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

<div id="rightColumnLarge">

<div class="center"><span id="pageTitle">We're Moving!</span></div>
<br>
<div align="center">New Website coming soon! Please check back with us May 1st!</div>

</div>

<div id="strip">

        <!--For Sliding Images-->
            <div id="slider1_container" style="position: relative; top: 0px; left: 0px; width: 960px; height: 220px; overflow: hidden;">
                <!-- Loading Screen -->
                <div u="loading" style="position: absolute; top: 0px; left: 0px;">
                    <div style="filter: alpha(opacity=70); opacity:0.7; position: absolute; display: block; background-color: #000; top: 0px; left: 0px;width: 100%;height:100%;"> </div>
                    <div style="position: absolute; display: block; background: url(Pages/images/loading.gif) no-repeat center center; top: 0px; left: 0px;width: 100%;height:100%;"></div>
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

<div id="cmslink">
	<div id="cmsText">
	<?php
                include("files/support.php");
    ?>
	</div>
</div>
</html>