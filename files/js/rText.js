var rText;

rText = Math.floor(Math.random() * 8) + 1;

function rPick(rText)
{
	switch(rText)
	{
		case 0:	window.document.write("Web Designer"); break;
		case 1:	window.document.write("How ya doin'?"); break;
		case 2:	window.document.write("Train like Ippo"); break;
		case 3:	window.document.write("It's lonely here...");	break;			
		case 4:	window.document.write("I like Rex from Toy Story");	break;
		case 5:	window.document.write("Hi Mom"); break;
		case 6:	window.document.write("How you doin'?"); break;
		case 7:	window.document.write("ジェイクです"); break;
		case 8:	window.document.write("Expect the unexpected; or don't..."); break;
		default: window.document.write("ERROR 404!"); break;
	}
}
