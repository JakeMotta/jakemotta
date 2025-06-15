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
	<div id="sideLink"><a href="#Mission">Mission</a></div>
    <div id="sideLink" class="sideLinkBreak"><a href="#Leadership">Leadership</a></div>
    <div id="sideLink" class="sideLinkBreak"><a href="#Contact">Contact Us</a></div>
</div>

</div>

<div id="rightColumn">

<cms:editable name='full_page' css='files/cmsCSS.css' type='richtext'>

ABOUT US PAGE
Silicon Valley Center for Entrepreneurial Development 

SVCED


Our Mission
To train, educate and promote business and financial literacy to disadvantaged families and communities, including low-to-moderate-Income families and communities. 
 
Our History
The Silicon Valley Center for Entrepreneurial Development was incorporated as a 501(c)3, in 2004.  


Leadership stuff is in Board file

Opportunity to Serve: (take out for now)…no dropdown !!


Contact Us (below)
The Silicon Valley Center for Entrepreneurial Development
480 N. 1st Street  
San Jose, CA 95113
(408) 288-8806 Office
(760) 652-4818 Fax
info@svced.org 
http://www.svced.org/
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