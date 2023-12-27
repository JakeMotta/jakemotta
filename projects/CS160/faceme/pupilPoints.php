<?php
class pupilPoints
{
	public function insertPoints()
	{
		$host = "host=127.0.0.1";
		$port = "port=5432";
		$dbname = "dbname=cs160";
		$credentials = "user=postgres password=student";
		$db = pg_connect("$host $port $dbname $credentials");
		// connected to DB
		if (!$db) {
			echo "Error : Unable to open database ";
		}
		else {
			echo "Opened database successfully <br />";
		}

		$handle = fopen("test.txt", "r");
		$name = "test";

		// var_dump(debug_backtrace()); for testing
		if ($handle) {
			$result = fgets($handle);
			$result = fgets($handle); //skip the beginning filler of file
			while (!feof($handle)) {
				for ($i = 2; $i <= 2; $i++) {
					$leftpoints = explode(" ", $result);
					///* For testing
					echo "leftpoint0 ". $leftpoints[0];
					echo "<br />";
					echo "leftpoint1 ". $leftpoints[1];
					echo "<br />";
					echo "<br />";
					//*/
					$result = fgets($handle);
					$result = fgets($handle);
					
					$rightpoints = explode(" ", $result);
					
					echo "rightpoint0 ". $rightpoints[0];
					echo "<br />";
					echo "rightpoint1 ". $rightpoints[1];
					echo "<br />";
					echo "<br />";
					
					$result = fgets($handle);
					$result = fgets($handle);
					///* For testing
					//*/
					$sql =
					  "CREATE TABLE PUPIL_POINTS
					  (ID SERIAL   PRIMARY KEY   NOT NULL,
					   leftpx       INT          NOT NULL,
					   leftpy       INT          NOT NULL, 
					   rightpx      INT          NOT NULL,
					   rightpy      INT          NOT NULL)";
					$ret = pg_query($db, $sql);
					
					
					$query = "INSERT into pupil_points(leftpx, leftpy, rightpx, rightpy) VALUES ('" . $leftpoints[0] . "', '" . $leftpoints[1] . "', '" . $rightpoints[0] . "', '" . $rightpoints[1] ."')";
					$dbquery = pg_query($query);
					
					
					//end if/else
				} //end for loop
			} //end of file reading
			fclose($handle); //close the file
		}
		else {
			// error with file
			echo "Error.";
		} //end if/else
	} //end insertPoints() function
} //end class grabPoints

$pupilPoints = new pupilPoints();
$pupilPoints->insertPoints();
?>
