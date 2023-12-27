<?php
	
	$home = "active";
	$about = "empty";
	$sponsors = "empty";
	$register = "empty";
	$speakers = "empty";
	$contact = "empty";
	$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	
	switch ($actual_link)
	{
		case "http://blackchamber.com/hackathon":
			$home = "active";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$speakers = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/About.php":
			$home = "empty";
			$about = "active";
			$sponsors = "empty";
			$register = "empty";
			$speakers = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Sponsors.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "active";
			$register = "empty";
			$speakers = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Register.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "empty";
			$register = "active";
			$speakers = "empty";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Speakers.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$speakers = "active";
			$contact = "empty";
			break;
			
		case "http://blackchamber.com/hackathon/Contact.php":
			$home = "empty";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$speakers = "empty";
			$contact = "active";
			break;
			
		default:
			$home = "active";
			$about = "empty";
			$sponsors = "empty";
			$register = "empty";
			$speakers = "empty";
			$contact = "empty";
			break; 
	}
	
    Echo "<div class='nav'>";
              Echo "<ul>";
                Echo "<li class=Home><a class=$home href=index.php>Home</a></li>";
                Echo "<li class=About><a class=$about href=About.php>About</a></li>";
                Echo "<li class=Sponsor><a class=$sponsors href=Sponsors.php>Sponsors</a></li>";
                Echo "<li class=Register><a class=$register href=https://events.r20.constantcontact.com/register/eventReg?oeidk=a07ebrtxmhx50a81291&oseq=&c=&ch=>Register</a></li>";
                Echo "<li class=#><a href=#>Partners</a></li>";
                Echo "<li class=Speakers><a class=$speakers href=#>Speakers</a></li>";
                Echo "<li class=Contact><a class=$contact href=Contact.php>Contact</a></li>";
              Echo "</ul>";
    Echo "</div>";
?>