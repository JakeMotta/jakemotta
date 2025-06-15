<?php
class grabPoints
{
	public function dbConnect()
	{
		// connect to DB
		$config = include("config.php");

   $db = pg_connect($config->host." ".$config->port." ".$config->dbname." ".$config->user." ".$config->password);
		// connected to DB
		if (!$db) {
			echo "Error : Unable to open database ";
		}
		else {
			echo "Opened database successfully <br />";
		}
	}

	public function insertPoints()
	{
		$handle = fopen("buildpath.txt", "r");
		$name = "test";
		// var_dump(debug_backtrace()); for testing
		if ($handle) {
			$result = fgets($handle);
			$result = fgets($handle);
			$result = fgets($handle);
			$result = fgets($handle); //skip the beginning filler of file
			while (!feof($handle)) {
				for ($i = 2; $i <= 2; $i++) {
					$points = explode(" ", $result);
					/* For testing
					echo $points[0];
					echo "<br />";
					echo $points[1];
					echo "<br />";
					echo "<br />";
					*/
					$result = fgets($handle);
					/* For testing
					echo "Fgets is now $result";
					echo "<br />";
					echo "<br />";
					*/
					if (strcmp($points[1], "") != 0) { //my  attempt to make sure it ends at 68 data points
						$query = "INSERT into data_points(name, xpoint, ypoint) VALUES ('" . $name . "', '" . $points[0] . "', '" . $points[1] . "')";
						$dbquery = pg_query($query);
					}
					else {
						break 2;
					} //end if/else
				} //end for loop
			} //end of file reading
			fclose($handle); //close the file
		} //end if
		else {
			// error with file
			echo "Error.";
		} //end else
	} //end insertPoints() function
} //end class grabPoints

$grabPoints = new grabPoints();
$grabPoints->dbConnect();
$grabPoints->insertPoints();
?>
