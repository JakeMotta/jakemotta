<!DOCTYPE>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>NinjaDonut</title>

<link href='http://fonts.googleapis.com/css?family=Carrois+Gothic+SC|Archivo+Black' rel='stylesheet' type='text/css'>

<link rel="stylesheet" href="cssReset.css" type="text/css" />
<link rel="stylesheet" href="mainCSS.css" type="text/css" />

<script src="randomSelect.js" type="text/javascript">
</script>

<script>

function switchPage() {
document.getElementsByTagName(randomGet())[0].focus();
}
window.onload = switchPage;

</script>


</head>

<body>

<div id="container">

<div id="topLogo">

<div id="ninjadonut">
<strong>NinjaDonut</strong>
</div>
<div id="sprite">
<img src="Animations/Filler.png" />
</div>

</div>

<div id="content">
<div id="context">
<div id="pageTitle">
Random Page
</div>
<hr />

<div align="center">
<span id="text">
Loading...
</span>
</div>

<div id="contentNav">
<input name="randomButton" type="button" value="Random" onClick="randomGet()" />
</div>


</div><!--end of Context div-->
</div><!--end of Content div-->

<div id="navbackground">
<div id="navbar">
<?php

	include("sec_Navbar.php");

?>
</div>


</div>

</body>
</html>
