<?php require_once( 'myAdmin/cms.php' ); ?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Silicon Valley Black Chamber of Commerce</title>

<link href="files/cssReset.css" rel="stylesheet" type="text/css" />
<link href="files/mainCSS.css" rel="stylesheet" type="text/css" />
<link href="files/cmsCSS.css" rel="stylesheet" type="text/css" />

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

<div id="leftColumn">

<!--  USE FOR ALL SIDE LINKS. AUTOMATICAL  -->
<div id="sideLinkDiv">
	<div id="sideLink"><a href="#Donations">Charitable Donations</a></div>
    <div id="sideLink" class="sideLinkBreak"><a href="Programs&Services.php">Giving to Specific Programs</a></div>
    <div id="sideLink" class="sideLinkBreak"><a href=#Volunteer>Volunteer Opportunities & Internships</a></div>
</div>



</div>

<div id="rightColumn">

<cms:editable name='full_page' css='files/cmsCSS.css' type='richtext'>Donate & Giving Page

<!--<div id="Donations" class="anchor"></div> -->

Charitable Donations: We thank you for the opportunity to steward the funds you give.  

Give (possible expense but not tax deductible) to the Silicon Valley Black Chamber of Commerce for general use of funds to keep chamber going (Donate Button)
Give (for a Tax Deduction) to the Silicon Valley Center for Entrepreneurial Development a 501c3 public benefit corporation working with the Silicon Valley Black Chamber of Commerce to promote education, financial literacy and entrepreneurship.
All giving below here is tax deductible. 

You can give directly to a program ( link to program page) or you can give a donation to any of the below causes.

All giving here is tax deductible as funds go to the Silicon Valley Center for Entrepreneurial Development a 501c3 public benefit corporation working with the Silicon Valley Black Chamber of Commerce to promote education and entrepreneurship.

<!--<div id="Fundraisers" class="anchor"></div> -->
Upcoming Fundraiser Events:
Blacks n’ Business, Blacks n’ Technology (link 2 fundraiser pg)
 Confirmed Date:  May 9th, 2015
Hyatt Regency Hotel Santa Clara

Event Description
This ceremonial event is designed to recognize and honor the significant achievements of African Americans in the field of business and technology here in Silicon Valley. It’s not only a way to bring attention to these specific honorees but it’s also a way to bring attention to the fact that African Americans, as a people, have played a major part in building this now well-known Silicon Valley. Many people from around the world have no idea who these African American pioneers are, their contributions or the impact they’ve made on Silicon Valley. At our awards ceremony that night, we honor, recognize and contribute to their continued legacy.

Silicon Valley Heritage Festival, a “Jazz, Blues, Wine & Arts Festival” ( schedule for summer 2016 )

Specific Program Giving:
Giving $$$ to different programs that You choose.
Next Generation Business Academy (link to pgm pg)
It Takes a Village with STEM  (link to pgm pg)
Intern to Perm  (link to pgm pg)
Small Business Development – Incubator Program (link to pgm pg)
General Giving to keep the Chamber going (operating expenses) Donate Button right here

Volunteer Opportunities (picture)  
Give Your Time, Gifts or Talents 
Our chamber is proud to present SVLT, the Silicon Valley Leadership Team, a team of more than 20 volunteers organized to assist the chamber in carrying out its most important projects. Bring your gifts, talents and skills but more importantly bring your heart to help our community become a robust economically empowered self-sustained community. Call (408) 288-8806 for more information
Ask About Internships
Chamber Needs:  
Interns with Office skills
Interns with Graphic design skills
Interns with Marketing skills
Interns seeking to get Management experience
Interns seeking Research experience
New media communications skills, formatting and writing skills
Interns needed NOW !!!:
Coming Soon:

SVBCC Merchandise (cups, hats, T’shirts, sweater, etc.) to purchase with percentage of $$$ going to the chamber.

Crowd Funding (any projects or ideas)?  Call Chamber

</cms:editable>

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


</html>

<?php COUCH::invoke(); ?>