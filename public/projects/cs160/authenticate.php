
<?php

class authenticate
{

	
public function logIn()
{


	if(!empty($_POST)){

		$username=filter_input(INPUT_POST,'Uname', FILTER_SANITIZE_STRING);
		$password=filter_input(INPUT_POST,'Password', FILTER_SANITIZE_STRING);
		$hashed='$5$rounds=5000$crazysaaltstringsowecanencryptdatasalt$'; // crazy salt salt		

		session_start();

		$my_name = $_SESSION['User'] = $username;


		$config = include("config.php");
		$db = pg_connect($config->host." ".$config->port." ".$config->dbname." ".$config->user." ".$config->password);

		$query = "SELECT * FROM user_info";
   		$result = pg_query($query);
	
		/* 1. Cycles through each row in database
		 * 2. Checks if username is equal any string in "username" column (not case sensitive)
		 * 3. If there is a username match, it then checks the corresponding password (case sensitive)
		 * 4. If username/password match, you are "logged-in", else it will say there was incorrect data
		 */
		$count = 1;

		while($row = pg_fetch_row($result))
		{
			// Check if username from form is equal to a username in the database (not case sensitive)
			if(strcasecmp($username, $row[3]) == 0) {
				$count++;
				if($row[4] == crypt($password, $hashed)) { // Check password associated to the username (case sensitive)
					$count = 0;
				}
			}
		}

		switch ($count) {
			case 0: // log-in was successful
				header("Location: Upload.php"); /* Redirect browser */
			break;

			case 1: // if count never incremented from 1, no username was found in the db
				echo "Username not found!";
			break;

			default: // username/password incorrect
				echo "Username or password not correct! Please try again.";
			break;
		}

	}
}

}



$auth = new authenticate();
$auth->logIn();


