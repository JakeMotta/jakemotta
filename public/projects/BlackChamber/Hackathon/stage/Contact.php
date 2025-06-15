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
        	<a href="http://www.blackchamber.com/"><img src="dummy-images/blackchamber.jpg"/></a>
            <a href="http://www.blackenterprise.com/"><img src="dummy-images/blackenterprise.jpg"/></a>
            <a href="http://bayareatutoringcenters.com/"><img src="dummy-images/bayarea.gif"/></a>	
            <img src="dummy-images/thinkdifferent.jpg"/>
            <a href="http://rocketfuel.com/"><img src="dummy-images/rocketfuel.gif"/></a>
            <a href="http://www.codewritingkids.com/"><img src="dummy-images/codewritingkids.jpg"/></a>
            <a href="http://www.uncf.org/"><img src="dummy-images/uncf.jpg" /></a>
            <img src="dummy-images/Innovation.jpg"/>
            <img src="dummy-images/logos.jpg" />
            <img src="dummy-images/Alliance.jpg" />
            <a href="http://www.caaae.org/"><img src="dummy-images/CAAAE.jpg" /></a>
            <a href="http://www.nbmbaa.org/"><img src="dummy-images/Black_MBAs_Logo.gif" /></a>
		</div>
   </div>
        
    <div id="top-navbar">
    	<?php
					include("files/top-navbar.php");
		?>
    </div>
    
    <div id="content">
		
        <span id="title">Contact Us:</span>
		<hr>
        
        <div class="tabbed">
            <p>
            <span id="mediumText"><strong>The Silicon Valley Black Chamber of Commerce</strong></span><br>
            <span id="text">
                25 N. 14th St, Suite 505<br>
                San Jose, CA 95112<br>
            </span>
            </p>
            
            <p>& </p>
            
            <span id="mediumText"><strong>The Silicon Valley Center for Entrepreneurial Development</strong></span><br>
            <span id="text">
                480 N. 1st Street<br>
                San Jose, CA 95112<br>
            </span>
            
            <br><br>
    
            <span id="text">
            <strong>Office</strong>: <span class="shortTab">(408) 288-8806</span> <br>
            <strong>Direct</strong>: <span class="shortTab">(408) 288-8817</span> <br>
            <strong>Fax</strong>: <span class="shortTab">(760) 652-4818</span> <br>
            pres@blackchamber.com<br>
            <a href="http://www.blackchamber.com/">http://www.blackchamber.com/</a><br>
            </span>
        </div>

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
