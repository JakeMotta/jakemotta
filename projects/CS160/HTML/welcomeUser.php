<!-- <?php session_start();
$user = $_SESSION['User'];
?> -->	
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8">
	<title>Upload</title>
	<link type="text/css" rel="stylesheet" href="mainstyle.css" /> </head>

	<body>
		<div id="background"> 
			<div id="Header">
				<div id="HeaderText">Upload</div>
			</div>
			<div id="body">
				<div id="hamNav" class="hamnav"> 
					<a href="javascript:void(0)" class="closeButton" onclick="closeNav()">&times;</a> 
					<a href="welcomeUser.php">Upload</a> 
					<a href="myvideos.php">My Videos</a> 
					<a href="settings.php">Settings</a> 
				</div>
				<span style="font-size:30px;cursor:pointer;" onclick="openNav()">&#9776;</span>
				<h4 id="WelcomeMsg">
					<?php 
					if (isset($user))
					{ 
						echo "Welcome $user"; 
					} 
					?> 
					<br><a href="logout.php<?php echo htmlspecialchars(SID); ?>"> Log out</a></h4>
					<div id="container">
						<div id="Title">UPLOAD</div> <br>
						<form action="upload.php" method="POST" enctype="multipart/form-data">
							<input type="file" name="file" />
							<input id="upload" type="submit" name="submit" value="Upload" />	
						</form>
						<<?php
						header("Cache-Control: no-cache, must-revalidate"); 
						session_start();

						$my_name = $_SESSION['User'];

						echo "welcome back ". $my_name;

						$host        = "host=127.0.0.1";
						$port        = "port=5432";
						$dbname      = "dbname=cs160";
						$credentials = "user=postgres password=student";

						$db = pg_connect("$host $port $dbname $credentials");


						if(isset($_POST['submit']))
						{
							$name = $_FILES['file']['name'];
							$temp = $_FILES['file']['tmp_name'];
							$username = $my_name;

			// Make parent-directory
							$dir = "./uploaded/".$username;

							if( is_dir($dir) === false )
								mkdir($dir);

			// Make sub-directory. Must do two calls like this since "/videos/$username" doesn't exist yet, so we must create it first
							$dir = "./uploaded/".$username."/".$name;

							if( is_dir($dir) === false )
								mkdir($dir);

							$str = $username . "/" . $name . "/" . $name;

							move_uploaded_file($temp,"uploaded/" . $str);

			// Call C file, send (in order): video_name, username
							system("./postgres $name $username");



			//--------------------------------------------------------------


						}

						?>



						<?php
						if(isset($_POST['submit']))
						{
							$query = "SELECT numframes FROM $username";
							$result = pg_query($query);
							$row = pg_fetch_row($result);
							$num = $row[0];
							$numFrames = $num;
							echo "The number of frames is:".$numFrames;
   			//CREATE TABLES
							echo "CREATE TABLE ".$username."_frame_".$i."_dp";
							for($i = 1; $i <= $numFrames; $i++){
								$sql = 
								"CREATE TABLE ".$username."_frame_".$i."_dp
								(ID SERIAL 		PRIMARY KEY 	NOT NULL,
								name			TEXT			NOT NULL,
								xpoint			REAL			NOT NULL,
								ypoint			REAL			NOT NULL)";
								$ret = pg_query($db, $sql);
							}
			//TABLES CREATED
							echo "<br>".$name." has been uploaded";
							echo "<br>";
							echo "<br>";
				//FIRST FOR LOOP FOR READING EACH FILE
							echo "TESTING BEFORE FOR LOOP!!!!!!!!!!!!";
							echo $numFrames;
							for($i = 1; $i <= $numFrames; $i++){
								echo "TESTING AFTER FOR LOOP!!!!!!!!!!!!";
								$dir = "./videos/".$username."/1.".$i."_det_0.pts"; // name of directory
								$handle = fopen($dir, "r");
								$result = fgets($handle);
								$result = fgets($handle);
								$result = fgets($handle);
								$result = fgets($handle); //skip the beginning filler of file
								while (!feof($handle)) {
									for ($j = 2; $j <= 2; $j++) {
										$points = explode(" ", $result);
										$result = fgets($handle);
										echo "TESTING!!!!!!!!!!!!";
										if (strcmp($points[1], "") != 0) { //my  attempt to make sure it ends at 68 data points
											$query = "INSERT into ".$username."_frame_".$i."_dp(name, xpoint, ypoint) VALUES ('" . $username . "', '" . $points[0] . "', '" . $points[1] . "')";
											$dbquery = pg_query($query);
										}
										else {
											echo "no table created!!";
											break 2;
										} //end if/else
									} //end for loop
								} //end of file reading
								fclose($handle); //close the file
							}

							$handle2 = fopen("test.txt", "r");
							if ($handle2) {
								$result2 = fgets($handle2);
								$result2 = fgets($handle2); //skip the beginning filler of file
								while (!feof($handle2)) {
									for ($i = 2; $i <= 2; $i++) {
										$leftpoints = explode(" ", $result2);
										///* For testing
										echo "leftpoint0 ". $leftpoints[0];
										echo "<br />";
										echo "leftpoint1 ". $leftpoints[1];
										echo "<br />";
										echo "<br />";
										//*/
										$result2 = fgets($handle2);
										$result2 = fgets($handle2);
							
										$rightpoints = explode(" ", $result2);
							
										echo "rightpoint0 ". $rightpoints[0];
										echo "<br />";
										echo "rightpoint1 ". $rightpoints[1];
										echo "<br />";
										echo "<br />";
							
										$result2 = fgets($handle2);
										$result2 = fgets($handle2);	

										$query = "INSERT into ".$username."_frame_".$i."_pp(leftpx, leftpy, rightpx, rightpy) VALUES ('" . $leftpoints[0] . "', '" . $leftpoints[1] . "', '" . $rightpoints[0] . "', '" . $rightpoints[1] ."')";
										$dbquery = pg_query($query);


									//end if/else
								} //end for loop
							} //end of file reading
							fclose($handle2); //close the file
						}
						else {
							// error with file
							echo "Error.";
						}
					}

					?>	















					<!-- <?php
						$host        = "host=127.0.0.1";
					    $port        = "port=5432";
					    $dbname      = "dbname=cs160";
					    $credentials = "user=postgres password=student";
					    $db = pg_connect("$host $port $dbname $credentials");

					    if(isset($_POST['submit'])){
					    	$name = $_FILES["file"]['name'];
					    	$temp = $_FILES['file']['tmp_name'];
					    	$width = 0;
					    	$height = 0;
					        $numFrames = 0;
					    	$fps = 0;
					    	$username = $_SESSION['User'];
						
					    	$url = "http://localhost/uploaded/$name";

					    	move_uploaded_file($temp, "videos/".$name);
					    	echo "The file ". basename($name). " has been uploaded.";

					        $query = "INSERT into " . $username . "(name, width, height, numframes, fps, username, url) VALUES ('". $name . "', '" . $width . "', '" . $height . "', '" . $numFrames . "', '" . $fps . "', '" . $username . "', '" . $url . "')";
					    	$result = pg_query($query);
					    }
					    ?> -->
					</div>
				</div>
				<div id="Footer"></div>
			</div>    
			<script>
				function openNav() 
				{
					document.getElementById("hamNav").style.width = "250px";
					document.getElementById("container").style.marginLeft = "250px";
				}
				function closeNav() 
				{
					document.getElementById("hamNav").style.width = "0";
					document.getElementById("container").style.marginLeft = "0";
				}
			</script>       
		</body>
		</html>
