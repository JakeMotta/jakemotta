function displayText(color1, color2, sheight, fsize)
{
window.document.getElementById('targetSpan').innerHTML = color1 + " is the coolest color!";
		
window.document.getElementById('targetSpan').style.backgroundColor = color1;

window.document.getElementById('targetSpan').style.borderColor = color2;

window.document.getElementById('targetSpan').style.height = sheight;	

window.document.getElementById('targetSpan').style.fontSize = fsize;	
}