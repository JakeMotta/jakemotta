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
	<div id="sideLink"><a href="#Donations">Charitable Donations</a></div>
    <div id="sideLink" class="sideLinkBreak"><a href="#Fundraisers">Fundraiser Events</a></div>
    <div id="sideLink" class="sideLinkBreak"><a href="Programs.php#NextGen">Giving to Specific Programs</a></div>
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