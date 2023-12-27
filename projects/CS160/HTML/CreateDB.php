<?php
  $config = include("config.php");
$db = pg_connect($config->host." ".$config->port." ".$config->dbname." ".$config->user." ".$config->password);
   if(!$db){
      echo "Error : Unable to open database\n";
   } else {
      echo "Opened database successfully\n";
   }
   $sql =
      "CREATE TABLE USER_INFO
      (ID SERIAL PRIMARY KEY     NOT NULL,
      FNAME          TEXT     NOT NULL,
      LNAME          TEXT     NOT NULL,
      USERNAME       TEXT     NOT NULL,
      PASSWORD       TEXT     NOT NULL,
      TIMESTAMP      TEXT     NOT NULL,
      IPADDRESS      TEXT     NOT NULL)";
	  
	$sql2 =
	  "CREATE TABLE VIDEO_INFO
	  (ID SERIAL PRIMARY KEY 	NOT NULL,
	  name			TEXT		NOT NULL,
	  width			INT			NOT NULL,
	  height		INT			NOT NULL,
	  numFrames		INT 		NOT NULL,
	  fps			REAL		NOT NULL,
	  username		TEXT		NOT NULL,
	  url			TEXT		NOT NULL)";

   $ret = pg_query($db, "drop schema public cascade;");
   $ret = pg_query($db, "create schema public");
   $ret = pg_query($db, $sql);
   $ret = pg_query($db, $sql2);

   if(!$ret){
      echo pg_last_error($db);
   } else {
      echo "Table created successfully\n";
   }
   pg_close($db);
?>
