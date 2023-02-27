<!DOCTYPE>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>NinjaDonut</title>


<script src="jquery-1.8.2.min.js"></script>
<link href='http://fonts.googleapis.com/css?family=Carrois+Gothic+SC|Archivo+Black' rel='stylesheet' type='text/css'>

<link rel="stylesheet" href="cssReset.css" type="text/css" />
<link rel="stylesheet" href="mainCSS.css" type="text/css" />


</head>

<body>

<div id="container">

<div id="topLogo">

<div id="ninjadonut">
<strong>NinjaDonut</strong>

<!-- hitwebcounter Code START -->
<a href="http://www.hitwebcounter.com/" target="_blank">
<img src="http://hitwebcounter.com/counter/counter.php?page=4635095&style=0007&nbdigits=5&type=page&initCount=0" title="" Alt=""   border="0" >
</a>

</div>
<div id="sprite">
<img src="Animations/Games.png" />
</div>

</div>

<div id="content">
<div id="context">
<div id="pageTitle">
Games Page

<br />
</div>
<hr />
<div id="gameTypes">
<!--________________JQUERY___________________________________________________-->

<a href="javascript:void(0);" onClick="actionGames();">Action</a> |
<script type="text/javascript">
function actionGames()
{  
		$("#Action").slideToggle("slow"); 
}
</script>

<a href="javascript:void(0);" onClick="adventureGames();">Adventure</a> |
<script type="text/javascript">
function adventureGames()
{
        $("#Adventure").slideToggle("slow");
}
</script>

<a href="javascript:void(0);" onClick="arcadeGames();">Arcade</a> |
<script type="text/javascript">
function arcadeGames()
{
        $("#Arcade").slideToggle("slow"); 
}
</script>

<a href="javascript:void(0);" onClick="stategyDefenseGames();">Strategy & Defense</a> |
<script type="text/javascript">
function stategyDefenseGames()
{
        $("#StrategyDefense").slideToggle("slow"); 
}
</script>

<a href="javascript:void(0);" onClick="shooterGames();">Shooter</a> |
<script type="text/javascript">
function shooterGames()
{
        $("#Shooter").slideToggle("slow"); 
}
</script>

<a href="javascript:void(0);" onClick="puzzleGames();">Puzzle</a>
<script type="text/javascript">
function puzzleGames()
{
        $("#Puzzle").slideToggle("slow"); 
}
</script>



<!--
<a href="javascript:void(0);" onClick="allGames();">All Games</a>
<script type="text/javascript">
function allGames()
{
	$("#Action").slideToggle("slow");
	$("#Adventure").slideToggle("slow");
	$("#Arcade").slideToggle("slow"); 
	$("#StrategyDefense").slideToggle("slow"); 
	$("#Shooter").slideToggle("slow"); 
	$("#Puzzle").slideToggle("slow");  
}
</script>

-->

<br />
<!--________________JQUERY___________________________________________________-->
</div><!--end of div gameTypes-->

<form  name="gameForm" id="gameForm">

<div id="Action">

<div id="title">Action</div><hr />
<select name="action_Games" size="13">
<option value="0" onDblClick="http://jakemotta.com/NinjaDonut/Games/AngryOldWizard.php">Angry Old Wizard</option>
<option value="1" onDblClick="http://jakemotta.com/NinjaDonut/Games/BubbleTanks2.php">Bubble Tanks 2</option>
<option value="2" onDblClick="http://jakemotta.com/NinjaDonut/Games/ChaosFaction.php">Chaos Faction</option>
<option value="3" onDblClick="http://jakemotta.com/NinjaDonut/Games/DarkCut.php">Dark Cut</option>
<option value="4" onDblClick="http://jakemotta.com/NinjaDonut/Games/DarkCut2.php">Dark Cut 2</option>
<option value="5" onDblClick="http://jakemotta.com/NinjaDonut/Games/DarkCut3.php">Dark Cut 3</option>
<option value="6" onDblClick="http://jakemotta.com/NinjaDonut/Games/FiveTil.php">FiveTil</option>
<option value="7" onDblClick="http://jakemotta.com/NinjaDonut/Games/IndestructoCopter.php">IndestructoCopter</option>
<option value="8" onDblClick="http://jakemotta.com/NinjaDonut/Games/IndestructoTank.php">IndestructoTank</option>
<option value="9" onDblClick="http://jakemotta.com/NinjaDonut/Games/IndestructoTank2.php">IndestructoTank2</option>
<option value="10" onDblClick="http://jakemotta.com/NinjaDonut/Games/KnightsOfRock.php">Knights of Rock</option>
<option value="11" onDblClick="http://jakemotta.com/NinjaDonut/Games/LightCut.php">Light Cut</option>
<option value="12" onDblClick="http://jakemotta.com/NinjaDonut/Games/ParachuteRetrospect.php">Para Retrospect</option>
<option value="13" onDblClick="http://jakemotta.com/NinjaDonut/Games/Scribble.php">Scribble</option>
<option value="14" onDblClick="http://jakemotta.com/NinjaDonut/Games/Scribble2.php">Scribble 2</option>
<option value="15" onDblClick="http://jakemotta.com/NinjaDonut/Games/Sonny.php">Sonny</option>
<option value="16" onDblClick="http://jakemotta.com/NinjaDonut/Games/Sonny2.php">Sonny 2</option>
<option value="17" onDblClick="http://jakemotta.com/NinjaDonut/Games/TreadmillasaurusRex.php">TredmillasaurusRex</option>
<option value="18" onDblClick="http://jakemotta.com/NinjaDonut/Games/TwoThree.php">Two-Three</option>
<option value="19" onDblClick="http://jakemotta.com/NinjaDonut/Games/VelBlast.php">VelBlast</option>
</select>

<input name="actionGames" type="button" value="Select" onClick="gamePick(window.document.gameForm.action_Games.value)" />

</div> <!--end of Action div-->

<div id="Adventure">

<div id="title">Adventure</div><hr />
<select name="adventure_Games" size="13">
<option value="20" onDblClick="http://jakemotta.com/NinjaDonut/Games/60sToSaveTheQueen.php">Save The Queen</option>
<option value="21" onDblClick="http://jakemotta.com/NinjaDonut/Games/Coil.php">Coil</option>
<option value="22" onDblClick="http://jakemotta.com/NinjaDonut/Games/FancyPants.php">Fancy Pants</option>
<option value="23" onDblClick="http://jakemotta.com/NinjaDonut/Games/HedgehogLaunch.php">Hedgehog Launch</option>
<option value="24" onDblClick="http://jakemotta.com/NinjaDonut/Games/HedgehogLaunch2.php">Hedgehog Launch</option>
<option value="25" onDblClick="http://jakemotta.com/NinjaDonut/Games/JamesTheBeachZebra.php">Beach Zebra</option>
<option value="26" onDblClick="http://jakemotta.com/NinjaDonut/Games/JamesTheChristmasZebra.php">Christmas Zebra</option>
<option value="27" onDblClick="http://jakemotta.com/NinjaDonut/Games/JamesTheCircusZebra.php">Circus Zebra</option>
<option value="28" onDblClick="http://jakemotta.com/NinjaDonut/Games/JamesTheDeapSeaZebra.php">DeepSea Zebra</option>
<option value="29" onDblClick="http://jakemotta.com/NinjaDonut/Games/JamesTheSpaceZebra.php">Space Zebra</option>
<option value="30" onDblClick="http://jakemotta.com/NinjaDonut/Games/MrWalters.php">Mr. Walters</option>
<option value="31" onDblClick="http://jakemotta.com/NinjaDonut/Games/OceanExplorer.php">Ocean Explorer</option>
<option value="32" onDblClick="http://jakemotta.com/NinjaDonut/Games/Orbita.php">Orbita</option>
<option value="33" onDblClick="http://jakemotta.com/NinjaDonut/Games/SantasticSanta.php">Santastic Santa</option>
<option value="34" onDblClick="http://jakemotta.com/NinjaDonut/Games/SeppuKuties.php">Seppu Kuties</option>
<option value="35" onDblClick="http://jakemotta.com/NinjaDonut/Games/SleeplessKnight.php">Sleepless Knight</option>
<option value="36" onDblClick="http://jakemotta.com/NinjaDonut/Games/SleeplessKnight2.php">Sleepless Knight 2</option>
<option value="37" onDblClick="http://jakemotta.com/NinjaDonut/Games/SleeplessKnightAssassin.php">Sleepless Knight 3</option>
<option value="38" onDblClick="http://jakemotta.com/NinjaDonut/Games/TheRiseOfAKing.php">The Rise of A King</option>
</select>

<input name="adventureGames" type="button" value="Select" onClick="gamePick(window.document.gameForm.adventure_Games.value)" />

</div> <!--end of Adventure div-->

<div id="Arcade">

<div id="title">Arcade</div><hr />
<select name="Arcade_games" size="13">
<option value="39" onDblClick="http://jakemotta.com/NinjaDonut/Games/AchievementUnlocked.php">Achievement</option>
<option value="40" onDblClick="http://jakemotta.com/NinjaDonut/Games/AchievementUnlocked2.php">Achievement 2</option>
<option value="41" onDblClick="http://jakemotta.com/NinjaDonut/Games/ColorKeys.php">Color Keys</option>
<option value="42" onDblClick="http://jakemotta.com/NinjaDonut/Games/ElephantRave.php">Elephant Rave</option>
<option value="43" onDblClick="http://jakemotta.com/NinjaDonut/Games/FourSecondFenzy.php">Four Second Frenzy</option>
<option value="44" onDblClick="http://jakemotta.com/NinjaDonut/Games/FourSecondFury.php">Four Second Fury</option>
<option value="45" onDblClick="http://jakemotta.com/NinjaDonut/Games/IWasHungryButThereWereCannons.php">IWHBTWC</option>
<option value="46" onDblClick="http://jakemotta.com/NinjaDonut/Games/ObeyTheGame.php">Obey the Game</option>
<option value="47" onDblClick="http://jakemotta.com/NinjaDonut/Games/PixelGrower.php">Pixel Grower</option>
<option value="48" onDblClick="http://jakemotta.com/NinjaDonut/Games/Squeezed.php">Squeezed</option>
<option value="49" onDblClick="http://jakemotta.com/NinjaDonut/Games/ThisIsTheOnlyLevel.php">Only Level</option>
<option value="50" onDblClick="http://jakemotta.com/NinjaDonut/Games/ThisIsTheOnlyLevelToo.php">Only Level Too</option>
</select>

<input name="arcadeGames" type="button" value="Select" onClick="gamePick(window.document.gameForm.Arcade_games.value)" />

</div> <!--end of Arcade div-->

<div id="StrategyDefense">

<div id="title">Strategy Defense</div><hr />
<select name="strategy_Games" size="13">
<option value="51" onDblClick="http://jakemotta.com/NinjaDonut/Games/BubbleTanksTowerDefense.php">Bubble Tanks TD</option>
<option value="52" onDblClick="http://jakemotta.com/NinjaDonut/Games/FoxFyre.php">Fox Fyre</option>
<option value="53" onDblClick="http://jakemotta.com/NinjaDonut/Games/GemCraft.php">GemCraft</option>
<option value="54" onDblClick="http://jakemotta.com/NinjaDonut/Games/KnightsCastle.php">Knights Castle</option>
<option value="55" onDblClick="http://jakemotta.com/NinjaDonut/Games/PhageWars.php">Phage Wars</option>
<option value="56" onDblClick="http://jakemotta.com/NinjaDonut/Games/PhageWars2.php">Phage Wars 2</option>
<option value="57" onDblClick="http://jakemotta.com/NinjaDonut/Games/PrinceOfWar2.php">Prince of War 2</option>
<option value="58" onDblClick="http://jakemotta.com/NinjaDonut/Games/SeaOfFire.php">Sea of Fire</option>
<option value="59" onDblClick="http://jakemotta.com/NinjaDonut/Games/SeaOfFire2.php">Sea of Fire 2</option>
<option value="60" onDblClick="http://jakemotta.com/NinjaDonut/Games/StarDefense.php">S.T.A.R Defense</option>
<option value="61" onDblClick="http://jakemotta.com/NinjaDonut/Games/TaintedKingdom.php">Tainted Kingdom</option>
<option value="62" onDblClick="http://jakemotta.com/NinjaDonut/Games/TheLastStand.php">The Last Stand</option>
<option value="63" onDblClick="http://jakemotta.com/NinjaDonut/Games/TheLastStand2.php">The Last Stand 2</option>
<option value="64" onDblClick="http://jakemotta.com/NinjaDonut/Games/TowerOfDoom.php">Tower of Doom</option>
</select>

<input name="strategyGames" type="button" value="Select" onClick="gamePick(window.document.gameForm.strategy_Games.value)" />

</div> <!--end of StrategyDefense div-->

<div id="Shooter">

<div id="title">Shooter</div><hr />
<select name="shooter_Games" size="13">
<option value="65" onDblClick="http://jakemotta.com/NinjaDonut/Games/ArmorTrigger2.php">Armor Trigger 2</option>
<option value="66" onDblClick="http://jakemotta.com/NinjaDonut/Games/DiedHard.php">Died Hard</option>
<option value="67" onDblClick="http://jakemotta.com/NinjaDonut/Games/DoodleDefender.php">Doodle Defender</option>
<option value="68" onDblClick="http://jakemotta.com/NinjaDonut/Games/Letum.php">Letum</option>
<option value="69" onDblClick="http://jakemotta.com/NinjaDonut/Games/Luminara.php">Luminara</option>
</select>

<input name="shooterButton" type="button" value="Select" onClick="gamePick(window.document.gameForm.shooter_Games.value)" />

</div> <!--end of Shooter div-->

<div id="Puzzle">

<div id="title">Puzzle</div><hr />
<select name="puzzle_Games" size="13">
<!--<option value="70" ondblclick="http://jakemotta.com/NinjaDonut/Games/AltShift.php">AltShift</option>-->
<option value="71" onDblClick="http://jakemotta.com/NinjaDonut/Games/BallRevamped.php">Ball Revamped</option>
<option value="72" onDblClick="http://jakemotta.com/NinjaDonut/Games/CattlePult.php">CattlePult</option>
<option value="73" onDblClick="http://jakemotta.com/NinjaDonut/Games/CrushTheCastle.php">Crush the Castle</option>
<option value="74" onDblClick="http://jakemotta.com/NinjaDonut/Games/CrushTheCastle2.php">Crush the Castle 2</option>
<option value="75" onDblClick="http://jakemotta.com/NinjaDonut/Games/Elements.php">Elements</option>
<option value="76" onDblClick="http://jakemotta.com/NinjaDonut/Games/Kinetikz.php">Kinetikz</option>
<option value="77" onDblClick="http://jakemotta.com/NinjaDonut/Games/LightBot.php">LightBot</option>
<option value="78" onDblClick="http://jakemotta.com/NinjaDonut/Games/LightBot2.php">LightBot 2</option>
<option value="79" onDblClick="http://jakemotta.com/NinjaDonut/Games/LlamaAdventure.php">Llmama Adventure</option>
<option value="80" onDblClick="http://jakemotta.com/NinjaDonut/Games/MagicOrbs.php">Magic Orbs</option>
<option value="81" onDblClick="http://jakemotta.com/NinjaDonut/Games/NanoTank.php">Game1</option>
<option value="82" onDblClick="http://jakemotta.com/NinjaDonut/Games/Portal.php">Game1</option>
<option value="83" onDblClick="http://jakemotta.com/NinjaDonut/Games/ScribbleStates.php">Scribble States</option>
<option value="84" onDblClick="http://jakemotta.com/NinjaDonut/Games/Shift.php">Shift</option>
<option value="85" onDblClick="http://jakemotta.com/NinjaDonut/Games/Shift2.php">Shift 2</option>
<option value="86" onDblClick="http://jakemotta.com/NinjaDonut/Games/Shift3.php">Shift 3</option>
<option value="87" onDblClick="http://jakemotta.com/NinjaDonut/Games/Shift4.php">Shift 4</option>
<option value="88" onDblClick="http://jakemotta.com/NinjaDonut/Games/SuperKaroshi.php">Super Karoshi</option>
<option value="89" onDblClick="http://jakemotta.com/NinjaDonut/Games/SushiCat.php">Sushi Cat</option>
<option value="90" onDblClick="http://jakemotta.com/NinjaDonut/Games/TBA.php">TBA</option>
<option value="91" onDblClick="http://jakemotta.com/NinjaDonut/Games/TheMindBender.php">The Mind Bender</option>
</select>

<input name="puzzleButton" type="button" value="Select" onClick="gamePick(window.document.gameForm.puzzle_Games.value)" />
</div> <!--end of Puzzle div-->

</form>


<div id="contentNav">
<a href="Pages/isGuy/isGuy.php"><h3>Play Project isGuy! Click Here!</h3></a>
<br>
<br>
<input name="randomGame" type="button" value="Random Game" onClick="randomGameGet()" />
<br />
<span id="smallFont">(If a game won't load, right click it and select "play". Happens for a game or two)</span>
</div>



<script src="gamePick.js" type="text/javascript">
</script>

</div><!--end of Context div-->
</div><!--end of Content div-->

<div id="navbackground">
<div id="navbar">
<?php

	include("sec_Navbar.php");

?>
</div>
</div>


</div>




</body>
</html>
