<?php
header("Cache-Control: no-cache, must-revalidate"); 
		session_start();

		$my_name = $_SESSION['User'];

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
			$dir = "./videos/".$username;

			if (is_dir($dir) === false) {
                $old = umask(0);
                mkdir($dir, 0777);
                umask($old);
            }
			// Make sub-directory. Must do two calls like this since "/videos/$username" doesn't exist yet, so we must create it first
			$dir = "./videos/".$username."/".$name;

			if (is_dir($dir) === false) {
                $old = umask(0);
                mkdir($dir, 0777);
                umask($old);
            }

			$str = $username . "/" . $name . "/" . $name;

			move_uploaded_file($temp,"videos/" . $str);
			
            
			// Call C file, send (in order): video_name, username
			system("gcc postgres.c -o postgres -lpq -pthread");
			system("./postgres $name $username");
            
			$query = "SELECT numframes, id FROM $username WHERE name = '".$name."'";
	   		$result = pg_query($query);
	   		$row = pg_fetch_row($result);
	   		$numFrames = $row[0];
	   		$id = $row[1];
	   		$url = "videos/".$username."/".$name;

	   		shell_exec("./datapoints_script $numFrames $id $dir");
            shell_exec("./delaunay_script $numFrames $id $url");
            
		}
		
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Face Me - Login</title>

<link rel="stylesheet" type="text/css" href="files/cssreset.css">
<link rel="stylesheet" type="text/css" href="files/mainCSS.css">
<link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet">

</head>

<body>
    <div id="topnav">
    	<div id="top-box-1" class="class-hover-effect"></div>
        <div id="top-box-2" class="class-hover-effect"></div>
        <div id="top-box-3" class="class-hover-effect"></div>
        <div id="top-box-4" class="class-hover-effect"></div>
        <div id="topnav-content">
            <div id="topnav-text"><?php echo "Welcome, ". $my_name; ?></div>
        </div>
        <div id="topnav-footer"></div>
    </div>
    
        
    <div id="container">
        	<div id="header"><span class="header-text">FACE ME</span></div>
        	<div id="content">
            	<div id="form-holder">
                	<div id="form-header">Upload</div>
                    <form action="Upload.php" method="POST" enctype="multipart/form-data"><br>
                        <input type="file" name="file" />
                        <input type="submit" name="submit" value="Upload!" />
                    </form>                    

                    <div id="form-footer"></div>
                </div>
            </div>
    </div>
    
    <div id="footer">
    	<span class="sub-text grey">
			<table id="f-table">
				<tr>
					<td class="f-table-data"><a class="f-bot-links small-text class-hover-effect" href="Upload.php">Upload</a></td>
                    <td class="f-table-data"><a class="f-bot-links small-text class-hover-effect" href="Videos.php">My Videos</a></td>
					<td class="f-table-data-end"><a class="f-bot-links small-text class-hover-effect" href="logout.php">Log Out</a></td>
				</tr>
			</table>
		</span>
    </div>
    
        <?php
             if(isset($_POST['submit']))
                    {
            
                    //CREATE TABLES
                    //echo "CREATE TABLE ".$username."_frame_".$i."_dp";
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
                        //echo "<br>".$name." has been uploaded";
                        //FIRST FOR LOOP FOR READING EACH FILE
                        for($i = 1; $i <= $numFrames; $i++){
                        //DIR IS THE SAME PATH AS -ofdir IN THE SCRIPT 
                        $dir = "./videos/".$username."/".$id.".".$i."_det_0.pts"; // name of directory, 
                        $handle = fopen($dir, "r");
                        $result = fgets($handle);
                        $result = fgets($handle);
                        $result = fgets($handle);
                        $result = fgets($handle); //skip the beginning filler of file
                        while (!feof($handle)) {
                            for ($j = 2; $j <= 2; $j++) {
                                $points = explode(" ", $result);
                                $result = fgets($handle);
                                if (strcmp($points[1], "") != 0) { //my  attempt to make sure it ends at 68 data points
                                    $query = "INSERT into ".$username."_frame_".$i."_dp(name, xpoint, ypoint) VALUES ('" . $username . "', '" . $points[0] . "', '" . $points[1] . "')";
                                    $dbquery = pg_query($query);
                                }
                                else {
                                    break 2;
                                } //end if/else
                            } //end for loop
                        } //end of file reading
                        fclose($handle); //close the file
                        }
                        
                        
                        //echo "CREATE TABLE ".$username."_frame_".$i."_pp";
                        for($i = 1; $i <= $numFrames; $i++){
                        $sql2 = 
                        "CREATE TABLE ".$username."_frame_".$i."_pp
                        (ID SERIAL 		PRIMARY KEY 	NOT NULL,
                        leftpx			INT			NOT NULL,
                        leftpy			INT			NOT NULL,
                        rightpx			INT			NOT NULL,
                        rightpy			INT			NOT NULL)";
                        $ret = pg_query($db, $sql2);
                        }
                        
                        //HARDCODED, NEED TO CHANGE
                        $dir = "./videos/".$username."/test.txt"; // name of directory
                        $handle2 = fopen($dir, "r");
                        if ($handle2) {
                        $result2 = fgets($handle2);
                        $result2 = fgets($handle2); //skip the beginning filler of file
                        
                        
                        
                        $j = 1;
                        while (!feof($handle2)) {
                                if($j <= $numFrames){
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
            
                                $query = "INSERT into ".$username."_frame_".$j."_pp(leftpx, leftpy, rightpx, rightpy) VALUES ('".$leftpoints[0]."', '".$leftpoints[1] ."', '".$rightpoints[0]."', '".$rightpoints[1]."')";
                                echo "<br />";
                                $dbquery = pg_query($query);
                                echo "INSERT into ".$username."_frame_".$j."_pp(leftpx, leftpy, rightpx, rightpy) VALUES ('".$leftpoints[0]."', '".$leftpoints[1]."', '".$rightpoints[0]."', '".$rightpoints[1]."')";
                                echo "<br />";
                                ++$j;
                            } 
                            else{
                                echo "Reached the total amount.";
                            }
                        } //end of file reading
                        
                        
                        
                        
                        fclose($handle2); //close the file
                    }
                    else {
                        // error with file
                        //echo "Error.";
                    } 
                }
                    
            ?>

</body>
</html>
