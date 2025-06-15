<?php
	
	$home = "active";
	$about = "empty";
	$sponsors = "empty";
	$register = "empty";
	$partners = "empty";
	$speakers = "empty";
	$media = "empyly";
	$contact = "empty";
	$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	
	switch ($actual_link)
	{
		case "http://blackchamber.com/hackathon":
			$home = "active";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$partners = "empty";
			$speakers = "empty";
			$media = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/About.php":
			$home = "empty";
			$about = "active";
			$sponsors = "empty";
			$register = "empty";
			$partners = "empty";
			$speakers = "empty";
			$media = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Sponsors.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "active";
			$register = "empty";
			$partners = "empty";
			$speakers = "empty";
			$media = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Register.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "empty";
			$register = "active";
			$partners = "empty";
			$speakers = "empty";
			$media = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Partners.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$partnets = "active";
			$speakers = "empty";
			$media = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Speakers.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$partners = "empty";
			$speakers = "active";
			$media = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Media.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$partners = "empty";
			$speakers = "empty";
			$media = "active";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Contact.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$partners = "empty";
			$speakers = "empty";
			$media = "empty";
			$contact = "active";
			break;
			
		default:
			$home = "active";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$partners = "empty";
			$speakers = "empty";
			$media = "empty";
			$contact = "empty";
			break; 
	}
	
    Echo "<div class='nav'>";
              Echo "<ul>";
                Echo "<li class=Home><a class=$home id='start' href=index.php>Home</a></li>";
                Echo "<li class=About><a class=$about href=About.php>About</a></li>";
                Echo "<li class=Sponsor><a class=$sponsors href=Sponsors.php>Sponsors</a></li>";
                Echo "<li class=Register><a class=$register href=https://events.r20.constantcontact.com/register/eventReg?oeidk=a07ebrtxmhx50a81291&oseq=&c=&ch=>Register</a></li>";
                Echo "<li class=Partners><a class=$partners href=Partners.php>Partners</a></li>";
                Echo "<li class=Speakers><a class=$speakers href=Speakers.php>Speakers</a></li>";
				Echo "<li class=Media><a class=$media href=Media.php>Media</a></li>";
                Echo "<li class=Contact><a class=$contact id=end href=Contact.php>Contact</a></li>";
              Echo "</ul>";
    Echo "</div>";
?>