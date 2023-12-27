<?php require_once( 'myAdmin/cms.php' ); ?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>SVCED</title>

<link href="files/cssReset.css" rel="stylesheet" type="text/css" />
<link href="files/mainCSS.css" rel="stylesheet" type="text/css" />
<link href="files/cmsCSS.css" rel="stylesheet" type="text/css" />

</head>

<body>

<div id="bigbox">


<div id="container">
<div id="header">
<a id="spanLink2" href="#"><span id="spanlink"></span></a>
</div>

<div id="topNav">
		<?php
					include("files/topNav.php");
		?>
</div>

<div id="content">

<div id="leftColumn">

<!--  USE FOR ALL SIDE LINKS. AUTOMATICAL  -->
<div id="sideLinkDiv">
	<div id="sideLinkTopic"><a href="#Programs">Programs:</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href=#NextGen>Next Generation Business Academy</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href=#STEM>It Takes a Village with STEM</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href=#Intern>Intern to Perm</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href=#IncubatorProgram>Incubator Program</a></div>
</div>

</div>

<div id="rightColumn">

<cms:editable name='full_page' css='files/cmsCSS.css' type='richtext'>

</cms:editable>
<br>
</div>

<div id="footer">
    	<?php
					include("files/botNav.php");
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

<?php COUCH::invoke(); ?>