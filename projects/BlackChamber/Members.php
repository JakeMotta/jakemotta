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
	<div id="sideLinkTopic"><a href="#MembershipTypes">Membership Types:</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#Corporate">Corporate</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#SmallBusiness">Small Business</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#Individuals">Individuals</a></div>
    <div id="sideLinkTopic" class="break">Membership Options:</div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#Benefits">Membership Benefits</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a id="bold" href="https://www.blackchambercommerce.org/membership.asp">Become A Member</a></div>
    <div id="sideLinkTopic" class="break"><a href="#Sponsors">Sponsorship Opportunities:</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#titleSponsors">Title</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#platinumSponsors">Platinum</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#goldSponsors">Gold</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#silverSponsors">Silver</a></div>
    <div id="sideLinkOption"><img src="images/roundDot.gif" /><a href="#tableSponsors">Table</a></div>
</div>

</div>

<div id="rightColumn">
        
<cms:editable name='full_page' css='files/cmsCSS.css' type='richtext'>MEMBERSHIP PAGE

Want to become a Mobile Member or Mobile Subscriber (click here)

You are welcome to be a part of our Chamber of Commerce whether you are a Business, Individual, 
Group, Organization or Association. 

Everyone is Welcome, we do not discriminate. 
No applicant or member shall be discriminated against because of race, religion, ethnic or cultural background, or previous membership in a lawful organization. Our membership is determined by alignment with our Mission; to create, identify and/or expand economy development opportunities for African Americans and minorities in Silicon Valley.

Yearly Fees are determined by the Class Category and Type of your business, organization or group.

SVBCC Class Categories of Memberships are
Corporation
Small Business
Individual

Within a specific Class Category may be different Types (see below)

Corporations interested in sponsoring a specific program or event (which includes optional membership) see below.

For more info on Corporate Sponsors for Programs, Events, etc., click appropriate link below:
Title Sponsor (click here)
Platinum Sponsor (click here)
Gold Sponsor (click here)
Silver Sponsor (click here)


SVBCC Membership Info Below

Corporate Membership – $1,000  per/year
Major Corporations - are businesses that have MORE than 50 employees and/or Gross Revenue is MORE than $1,000,000 per/year 



Small Business (Category)
Micro Small  – $150 per/year 
Micro Small Businesses – are businesses that have NO employees and/or Gross Revenue is LESS than $100,000 per/year

Small  – $200 per/year 
Small Businesses – are businesses that have 1 employee and/or Gross Revenue is LESS than $100,000 per/year

Average – $250 per/year   (maybe use Average versus Medium) 
Average Business – are businesses that have MORE than 1 but LESS than 10 (2-9) employees and/or Gross Revenue is MORE than $100,000 but LESS than $500,000 per/year

Large  – $350 per/year 
Large Businesses - are businesses that have 10 or MORE but LESS than 50 (11-49) employees and/or Gross Revenue is MORE than $500,000 per/year but LESS than $1,000,000 per/year

Individual (Category)
Students & Seniors – $50 per/year 
Students & Seniors – students must have and show valid student ID.  Seniors must have and show a valid ID showing age 65 or over.

Individuals  – $100 per/year 
Individuals - people who would like to be connected/associated with the SVBCC and do not have a business.

Organizations, Groups and Associations – $150 per/year
Organizations/Group/Associations - Non-Profits Organizations/Group/Associations that want to be connected/associated with the SVBCC and are not a business.

<!--<div id="Sponsors" class="anchor"></div>-->
Title Sponsor: $25,000
Corporate Membership Included (optional)
Mobile Specific:
Local, Regional or National Mobile Sponsor (your choice) with preferred services and group messaging capabilities.

Event Specific:
Blacks n’ Business, Blacks n’ Technology
Company name included in Title of event/program for 1 year
Company name and logo prominently displayed on all Ads, Website, Flyers, Posters (including social media sources) concerning program. 
Award(s) named after company 
Prominent Signage at event 
VIP Hosting Opportunity
Special Photo Op with Awardees
# VIP tickets and seating 
Recognition of sponsorship on-stage night of event, Beginning, Middle, End of show 
Company Video message on Big Screen 
Full Page Ad in Souvenir Program 




Platinum Sponsor: $10,000
Corporate Membership Included (optional)
Mobile Specific:
Local Mobile Sponsor with preferred services and group messaging capabilities.

Event Specific:
Blacks n’ Business, Blacks n’ Technology
Company name and logo prominently displayed on all Ads, Website, Flyers, Posters (including social media sources) concerning program. 
Prominent Signage at event 
VIP Hosting Opportunity
# VIP tickets and seating 
Recognition of sponsorship on-stage night of event, Beginning, Middle, End of show 
Company Video message on Big Screen 
Half Page Ad in Souvenir Program 



Gold Sponsor: $5,000
Corporate Membership Included (optional)
Mobile Specific:
Local Mobile Sponsor with limited preferred services and group messaging capabilities.

Event Specific:
Blacks n’ Business, Blacks n’ Technology
Company name displayed on all Ads, Website, Flyers, Posters (including social media sources) concerning program. 
# VIP tickets and seating 
Recognition of sponsorship on-stage night of event, Beginning, Middle, End of show 
Company name on Big Screen 
Quarter Page Ad in Souvenir Program 


 
Silver Sponsor: $2,500
Corporate Membership Included (optional)
Mobile Specific:
Limited Advertising opportunities with Limited preferred services and group messaging capabilities

Event Specific:
Blacks n’ Business, Blacks n’ Technology
Company name displayed on all Ads, Website, Flyers, Posters (including social media sources) concerning program. 
# VIP tickets and seating 
Company name on Big Screen 
Quarter Page Ad in Souvenir Program 

Benefits of Chamber Membership: 
Promote your business/organization through our Chamber
Learn how to properly Start your business
Learn how to Finance your business
Learn how to Operate your business
Learn how to Grow your business
Learn how to Exit your business
Learn about Mergers & Acquisitions, how to Partner, Collaborate and Joint Venture to achieve larger and more lucrative contracts
Participate in other trainings, seminars and workshops tailored for your needs
Network with likeminded successful business owners
Receive 1-on-1 Individualized support through our SBDC Certified Business Counselors
Receive various Leads and Business Referrals
Participate in special Breakfast, Lunch and Dinner networking opportunities at special Member prices
Benefit from Corporate Diversity Supplier Programs though relationships created by our Chamber
Learn how to do business with the City, County, State and Federal Government
Become listed in the Chamber's Global e-Mobile Directory (when available)
Win special Chamber awards and recognitions
Benefit from Access to Capital not available to everyone
</cms:editable>

<br>
<br>

<div align="center"><a href="https://www.blackchambercommerce.org/membership.asp"><img src="images/logos/Member.fw.png"/></a></div>
            
            <br>
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