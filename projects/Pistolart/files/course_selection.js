// Set for "Register" button link
function register()
{
	window.location.href = "http://pistolart.net/register.php";
}

// Selects "next page" for courses
function nextPage(current_page)
{
	switch (current_page)
	{
		case 1:
			window.location.href = "Pistol_ART_II.php";
			break;
			
		case 2:
			window.location.href = "Pistol_ART_III.php";
			break;
			
		case 3:
			window.location.href = "Pistol_ART_IV.php";
			break;
			
		case 4:
			window.location.href = "Force-on-Force.php";
			break;
		
		case 5:
			window.location.href = "CCW.php";
			break;
			
		case 6:
			window.location.href = "Low_Light.php";
			break;
		
		case 7:
			window.location.href = "CQVT.php";
			break;

		case 8:
			break;
	}
}

// Selects "previous page" for courses
function prevPage(current_page)
{
	switch (current_page)
	{
		case 1:
			break;
			
		case 2:
			window.location.href = "Pistol_ART_I.php";
			break;
			
		case 3:
			window.location.href = "Pistol_ART_II.php";
			break;
			
		case 4:
			window.location.href = "Pistol_ART_III.php";
			break;
			
		case 5:
			window.location.href = "Pistol_ART_IV.php";
			break;
			
		case 6:
			window.location.href = "Force-on-Force.php";
			break;

		case 7:
			window.location.href = "CCW.php";
			break;

		case 8:
			window.location.href = "Low_Light.php";
			break;

		case 9:
			window.location.href = "CQVT.php";
			break;
	}
}