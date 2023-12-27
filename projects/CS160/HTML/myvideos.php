<?php session_start();
$user = $_SESSION['User'];
?>	
<html>
<head>
<meta charset="utf-8">
<title>MY VIDEOS</title>
<link rel="stylesheet" type="text/css" href="files/cssreset.css">
<link rel="stylesheet" type="text/css" href="files/mainCSS.css">
</head>

<body>

	<div id="background">
		<div id="Header"></div>
    	<div id="body">
		<div id="Title">MY VIDEOS</div>
		<div id="Videos">
			<?php
			class myVideos{
				public function getVideos(){
					$host        = "host=127.0.0.1";
					$port        = "port=5432";
					$dbname      = "dbname=cs160";
					$credentials = "user=postgres password=student";
					$db = pg_connect("$host $port $dbname $credentials");
					$username = $_SESSION['User'];
			
					$query = "SELECT * FROM " . $username;
					$result = pg_query($query); 

					while($row = pg_fetch_row($result))
					{
						$url = $row[7];
						$tags = ".avi";
						$newurl = str_replace($tags, "", $url);
						$width = $row[2];
						$height = $row[3];
						echo "<a href=$url download>$newurl</a>";
						echo "<br>";

						//echo "<video width='$width' height='$height' controls=''><source src='$url' type='video/mp4'></source></video>";
						//echo "<embed src='$url' width='$width' height='$height'></embed>";
					}
				}
			}
			$videos = new myVideos();
			$videos->getVideos();
			pg_close($db);
			?>
			<a href="Upload.php"> Return to upload page</a>
		</div>
		<div id="Footer">
        	<div id="FooterText">MY VIDEOS</div>
        </div>
    </div>
</body>
