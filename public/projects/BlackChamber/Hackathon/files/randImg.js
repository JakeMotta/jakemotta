function randImg()
		{
			var arr = [16]
			
			0 = "<a href='http://www.blackchamber.com/'><img src='dummy-images/blackchamber.jpg'/></a>"
            1 = "<a href='http://www.blackenterprise.com/'><img src='dummy-images/blackenterprise.jpg'/></a>"
            2 = "<a href='http://bayareatutoringcenters.com/'><img src='dummy-images/bayarea.gif'/></a>	"
            3 = "<img src='dummy-images/thinkdifferent.jpg'/>"
            4 = "<a href='http://rocketfuel.com/'><img src='dummy-images/rocketfuel.gif'/></a>"
            5 = "<a href='http://www.codewritingkids.com/'><img src='dummy-images/codewritingkids.jpg'/></a>"
            6 = "<a href='http://www.uncf.org/'><img src='dummy-images/uncf.jpg' /></a>"
            7 = "<img src='dummy-images/Innovation.jpg'/>"
            8 = "<img src='dummy-images/logos.jpg' />"
            9 = "<img src='dummy-images/Alliance.jpg' />"
            10 = "<a href='http://www.caaae.org/'><img src='dummy-images/CAAAE.jpg' /></a>"
            11 = "<a href='http://www.nbmbaa.org/'><img src='dummy-images/Black_MBAs_Logo.gif' /></a>"
            12 = "<a href='http://www.intel.com/content/www/us/en/homepage.html'><img src='dummy-images/intel.jpg' /></a>"
            13 = "<img src='dummy-images/hackathon.jpg' />"
            14 = "<a href='http://jackandjillinc.org/'><img src='dummy-images/jackandjill.jpg' /></a>"
            15 = "<img src='dummy-images/StreetCode.jpg' />"	
			
			shuffle(arr);
		}
		
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}