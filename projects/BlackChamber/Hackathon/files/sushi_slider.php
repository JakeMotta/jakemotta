<?php
			$my_array = array
            (
			"<a href='http://www.blackchamber.com/'><img src='dummy-images/blackchamber.jpg'/></a>",
			"<a href='http://www.blackenterprise.com/'><img src='dummy-images/blackenterprise.jpg'/></a>",
			"<a href='http://bayareatutoringcenters.com/'><img src='dummy-images/bayarea.gif'/></a>	",
			"<img src='dummy-images/thinkdifferent.jpg'/>",
			"<a href='http://rocketfuel.com/'><img src='dummy-images/rocketfuel.gif'/></a>",
			"<a href='http://www.codewritingkids.com/'><img src='dummy-images/codewritingkids.jpg'/></a>",
			"<a href='http://www.uncf.org/'><img src='dummy-images/uncf.jpg' /></a>",
			"<img src='dummy-images/Innovation.jpg'/>",
			"<img src='dummy-images/logos.jpg' />",
			"<img src='dummy-images/Alliance.jpg' />",
			"<a href='http://www.caaae.org/'><img src='dummy-images/CAAAE.jpg' /></a>",
			"<a href='http://www.nbmbaa.org/'><img src='dummy-images/Black_MBAs_Logo.gif' /></a>",
			"<a href='http://www.intel.com/content/www/us/en/homepage.html'><img src='dummy-images/intel.jpg' /></a>",
			"<img src='dummy-images/hackathon.jpg' />",
			"<a href='http://jackandjillinc.org/'><img src='dummy-images/jackandjill.jpg' /></a>x",
			"<img src='dummy-images/StreetCode.jpg' />",
			"<a href='https://www.att.com/'><img src='dummy-images/att.jpg' /></a>",
			"<a href='https://www.microsoft.com/en-us/'><img src='dummy-images/Microsoft.jpg' /></a>",
			"<a href='http://www.siliconvalleycf.org/'><img src='dummy-images/SVCF.jpg' /></a>"
            );
			
			
			shuffle($my_array);
			
			foreach ($my_array as $value) {
				echo "$value";
			}
?>