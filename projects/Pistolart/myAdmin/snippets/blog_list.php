<!--THIS IS THE DEFAULT LANDING PAGE-->
<!DOCTYPE HTML>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
<meta name="Keywords" content="team, safe, racing, team safe, teamsafe, team safe racing, paul, paul sargenti, sargenti, safe security, security, professional, inline, speed, skates, skating, athlete, ezeefit, sports, bont, glenn, koshi, britteny, schultz, chris, rojo, dennis, cummings, humphrey, john, crysdale, linus, harth, maria, desouza, mark, randle, natassia, hamor, paul, lomangino, robert, motta, jacob, jake, tom, mccue, uel, archuletta">
  
<meta name="Description" content="Team SAFE Racing is dedicated to the purpose of providing individuals with a desire to compete in the sport of inline racing an opportunity to do so in a supportive team environment where all members believe in sportsmanship, training, community service, and offering themselves as role models for aspiring athletes.">

<title>Team SAFE Racing</title>

<!--Style Sheet-->
<link rel="stylesheet" href="files/cssReset.css" type="text/css" />
<link rel="stylesheet" type="text/css" href="files/mainCss.css">

<!--Font and JQuery-->
<script src="files/jquery-1.10.0.min.js"></script>
<link href='http://fonts.googleapis.com/css?family=Roboto+Slab|Marmelad|Domine' rel='stylesheet' type='text/css'>

<!--NavBar-->
<link rel="stylesheet" href="lavalamp/lavalamp_test.css" type="text/css" media="screen">
<script type="text/javascript" src="lavalamp/jquery.lavalamp.js"></script>
<script type="text/javascript" src="lavalamp/jquery.lavalamp.min.js"></script>
<script type="text/javascript" src="lavalamp/jquery.easing.min.js"></script>
<script type="text/javascript">
        $(function() {
            $("#1").lavaLamp({
                fx: "backout", 
                speed: 700,
                click: function(event, menuItem) {
                }
            });
        });
    </script>
        

<!--SlideShow-->
<link rel="stylesheet" href="files/responsiveslides.css">
<link rel="stylesheet" href="files/slideCss.css">
  <script src="files/responsiveslides.min.js"></script>
  <script>
    // You can also use "$(window).load(function() {"
    $(function () {

      // Slideshow 4
      $("#slider4").responsiveSlides({
        auto: true,
        pager: false,
        nav: false,
        speed: 500,
        namespace: "callbacks",
        before: function () {
          $('.events').append("<li>before event fired.</li>");
        },
        after: function () {
          $('.events').append("<li>after event fired.</li>");
        } 
      });
    });
  </script>


<!--[if lt IE 9]>
<script src="files/html5shiv.js"></script>
<![endif]-->

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

</head>

<body>

<div id="container">
   <section id="topNav">
        <span id="largeTextShadow">
      	    Team SAFE Racing
        </span>
        <section id="contact">
            <span id="smallText"><span id="whiteText">
                    Email: teamsaferacing@yahoo.com
            </span></span>      
        </section> <!--End Contact-->
   </section> <!--End topNav-->
   
<header id="head">
<section id="slideDiv">

<!-- Slideshow 4 -->
   <div class="callbacks_container">
      <ul class="rslides" id="slider4">
        <li>
          <img src="images/slide/1.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
        <li>
          <img src="images/slide/2.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
        <li>
          <img src="images/slide/3.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
        <li>
          <img src="images/slide/4.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
        <li>
          <img src="images/slide/5.jpg" alt="">
          <p class="caption">Team SAFE Racing</p>
        </li>
      </ul>
    </div>

</section> <!--End slideDiv-->

<nav id="headNav">
    <span id="navLinkText">
    	<ul class="lavaLampWithImage" id="1">
                <cms:php>
						include("files/sec_topNav.php");
				</cms:php>
       	</ul>     
	</span>
</nav> <!--End headNav-->
</header> <!--End Head-->

<section id="content">
<br>

<aside id="leftColumn">

<section id="mainContent">
<span id="pText">

  			<!--Use to show snippets from cloned pages from the specified master page clones. Shows everything inbetween 'pages' tab-->
            <!--Folder allows for categorization by folder on list page-->
            <!--Paginate limits how many clones show on the list at once-->  
            <cms:pages masterpage='index.php' folder=k_folder_name start_on=k_archive_date stop_before=k_next_archive_date paginate='1' limit='3'>    
                <div id="blogDiv">
                    <div align="center"><span id="medText" ><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></span></div>
                      
                    <div align="center"><img src="<cms:show blog_image />" /></div> <!--Shows image defined at top-->  
                     
                    <div align="center"><span id="smallText" >            
                        <!--Shows the folder of the specific page-->
                        <cms:if k_page_foldertitle >
                            <cms:set my_category=k_page_foldertitle />
                        <cms:else />
                            <cms:set my_category='Uncategorized' />
                        </cms:if>
                        
                        <cms:show my_category /> &bull;
                        
                        <!--Displays the title set in the CMS, and makes it a link to itself!-->
                        <a href="<cms:show k_page_link />"><cms:show k_page_title /></a> &bull; 
                        
                        <!--Shows the date-->
                        <cms:date k_page_date format='jS M, y'/> 
                    </span></div>
                    
                    <hr>
                    
                    <cms:excerptHTML count='400'><cms:show blog_content /></cms:excerptHTML> <!--Shows content defined at top. excerpt shows only a portion-->
                    
                    <div id="myImages" align="center">
                    <img src="<cms:show image_1 />" id='centeredImages'/>
                    <br>
                    <cms:show dual_images />
                    </div>
                    
                    <div id="readMoreDiv">
                    	<div align="right"><a href="<cms:show k_page_link />"><span id="boldText">Read More...</span></a></div> <!--Link to the actual page-->
                    </div>
                    
                    <cms:if k_paginated_bottom >
                        <br><br><div id="optionsDiv" align="right"><a href="<cms:show k_paginate_link_prev />">Newer Posts</a> &nbsp;&bull;&nbsp; <a href="<cms:show k_paginate_link_next />">Previous Posts</a></div><br>
                    <cms:else />
                        <br><br>
                    </cms:if>
                </div>
            </cms:pages>
            
            
</span>
</section> <!--End mainContent-->
</aside> <!--End leftColumn-->

<aside id="rightColumn">
<br>
	<aside id="sideLinks">
    		<!--  USE FOR ALL SIDE LINKS.  -->
            <div id="sideLinkDiv">
                <span id="pText">
                    <cms:embed 'blog_sidebar.html' />    <br><br>
                </span>
            </div>
    </aside>     
    <aside id="sponsorImages" align="center">
        	<cms:php>
					include("files/sec_sideBar.php");
			</cms:php>
    </aside>
</aside> <!--End rightColumn-->
</section> <!--End content-->



<footer id="foot">

	<section id="footContact">
    	<span id="smallerText">
            <cms:php>
					include("files/sec_Links.php");
			</cms:php>
        </span>
    </section>
    
    <section id="footContent">
        <span id="smallerText">
            Copyright © 2014 Team SAFE Racing. All rights reserved. Website Design By <span id="whiteText"><a href="pages/jakeMotta.php">Jacob Motta</a> </span><br>
        </span>
    </section>

    <div id="bottomSkater" align="right">
    	<img src="images/logos/skater2.gif" />&nbsp&nbsp&nbsp&nbsp
    	<img src="images/logos/skater.gif" />
    </div>
</footer> <!--End foot-->

</div> <!--End Container-->

</body>
</html>