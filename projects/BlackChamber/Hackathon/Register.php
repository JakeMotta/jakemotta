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

<body>

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
		<div align="center"><img src="images/p1.png"/><img src="images/p2.png"/>
        
        <br><br><br>
		
        <span id="title"><a href="http://events.constantcontact.com/register/event?llr=csdp7hbab&oeidk=a07ebrtxmhx50a81291">Click HERE to Register!</a></span>
		</div>
        
        <br>

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