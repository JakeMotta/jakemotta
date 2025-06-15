<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>SVCED</title>

<!-- Links to the css -->
<link href="files/cssReset.css" rel="stylesheet" type="text/css" />
<link href="files/mainCSS.css" rel="stylesheet" type="text/css" />

</head>

<body>

<div id="bigbox">

		<div id="mobileBanner"></div>

		<?php
					include("files/side_logos.php");
		?>
		
<div id="container">

<!-- Calendar icon. Background Chamber image is in the css -->
<div id="header">
<a id="spanLink2" href="#"><span id="spanlink"></span></a>
</div>


<!-- The top navigation bar -->
<div id="topNav">
	
	<?php
			include("files/topNav.php");
	?>
    
</div>

<!-- Content div holds both left/right columns. The real "content" you'd be putting for the page goes into the "rightColumn" div -->
<div id="content">

<div id="banner">
    
</div>

<!-- The footer of the page. Self explanitory. -->
<div id="footer">

		<?php
			include("files/botNav.php");
		?>
</div>
</div>
</div>
</div>

<!-- Credits of the web page. Feel free to include yourself Berry -->
<div id="cmslink">
	<div id="cmsText">
	<p id='smallText' class='fade' align='right'><a href=https://www.linkedin.com/in/jacobmotta>Website created by Jake Motta</a></p>
	</div>
</div>


</html>