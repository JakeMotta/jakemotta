
<?php

		$config = include("config.php");

   $db = pg_connect($config->host." ".$config->port." ".$config->dbname." ".$config->user." ".$config->password);

		$time = date('m/d/Y h:i:s a', time());

		$query = "INSERT into user_info(timestamp) VALUES ('". $time . "')";
		$result = pg_query($query);
	

?>
