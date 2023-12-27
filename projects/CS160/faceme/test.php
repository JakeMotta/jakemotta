<?php
   $host        = "host=74.220.207.174";
   $port        = "port=22";
   $dbname      = "dbname=jakemott_cs160";
   $credentials = "user=jakemott password=PaSV3AZ$6";

   $db = pg_connect( "$host $port $dbname $credentials");
   if(!$db){
      echo "Error : Unable to open database\n";
   } else {
      echo "Opened database successfully\n";
   }
   $sql =
      "CREATE TABLE USER_INFO
      (ID SERIAL     PRIMARY KEY NOT NULL,
      FNAME          TEXT        NOT NULL,
      LNAME          TEXT        NOT NULL,
      USERNAME       TEXT        NOT NULL,
      PASSWORD       TEXT        NOT NULL,
      TIMESTAMP      TEXT        NOT NULL)";
	  
	$sql2 =
	  "CREATE TABLE VIDEO_INFO
	  (ID SERIAL   PRIMARY KEY   NOT NULL,
	   name		   TEXT		     NOT NULL,
	   width	   INT	  	     NOT NULL,
	   height	   INT			 NOT NULL,
       numFrames   INT           NOT NULL,
	   fps		   REAL			 NOT NULL,
	   username	   TEXT		     NOT NULL,
	   url		   TEXT		     NOT NULL)";
	   
	  
	$sql4 =
	  "CREATE TABLE PUPIL_POINTS
	  (ID SERIAL   PRIMARY KEY   NOT NULL,
	   leftpx       INT          NOT NULL,
	   leftpy       INT          NOT NULL, 
	   rightpx      INT          NOT NULL,
	   rightpy      INT          NOT NULL)";

   $ret = pg_query($db, "DROP TABLE IF EXISTS USER_INFO");
   $ret = pg_query($db, $sql);

   $ret = pg_query($db, "DROP TABLE IF EXISTS VIDEO_INFO");
   $ret = pg_query($db, $sql2);
   
   $ret = pg_query($db, "DROP TABLE IF EXISTS PUPIL_POINTS");
   $ret = pg_query($db, $sql4);
   
   if(!$ret) {
      echo pg_last_error($db);
   } else {
      echo "Table created successfully 4.0\n";
   }
   pg_close($db);
?>
