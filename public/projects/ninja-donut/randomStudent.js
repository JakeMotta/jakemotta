var sNumber;

sNumber = Math.floor(Math.random()*3+1);

function studentGet()
{
if(sNumber == 1)
{
	window.location = "index.php";
}
if(sNumber == 2)
{
	window.location = "Games.php";
}
if(sNumber == 3)
{
	window.location = "Comics.php";
}
}

