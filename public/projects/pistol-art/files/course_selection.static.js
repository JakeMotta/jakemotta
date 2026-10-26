// Set for "Register" button link
function register()
{
	window.location.href = "/projects/pistol-art/register.html";
}

// Selects "next page" for courses
function nextPage(current_page)
{
	switch (current_page)
	{
		case 1:
			window.location.href = "Pistol_ART_II.html";
			break;
			
		case 2:
			window.location.href = "Pistol_ART_III.html";
			break;
			
		case 3:
			window.location.href = "Pistol_ART_IV.html";
			break;
			
		case 4:
			window.location.href = "Force-on-Force.html";
			break;
		
		case 5:
			window.location.href = "CCW.html";
			break;
			
		case 6:
			window.location.href = "Low_Light.html";
			break;
		
		case 7:
			window.location.href = "CQVT.html";
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
			window.location.href = "Pistol_ART_I.html";
			break;
			
		case 3:
			window.location.href = "Pistol_ART_II.html";
			break;
			
		case 4:
			window.location.href = "Pistol_ART_III.html";
			break;
			
		case 5:
			window.location.href = "Pistol_ART_IV.html";
			break;
			
		case 6:
			window.location.href = "Force-on-Force.html";
			break;

		case 7:
			window.location.href = "CCW.html";
			break;

		case 8:
			window.location.href = "Low_Light.html";
			break;

		case 9:
			window.location.href = "CQVT.html";
			break;
	}
}