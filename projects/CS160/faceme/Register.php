<?php header('Content-Type: text/html; charset=utf-8');?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Face Me - Registration</title>

<link rel="stylesheet" type="text/css" href="files/cssreset.css">
<link rel="stylesheet" type="text/css" href="files/mainCSS.css">
<link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet">

</head>

<body>
	<?php class register {
			public function signIn() {
				if(!empty($_POST)) {
					$timestamp = date('m-d-Y H-i-s');
					$data[0]=filter_input(INPUT_POST,'firstName', FILTER_SANITIZE_STRING);
					$data[1]=filter_input(INPUT_POST,'lastName', FILTER_SANITIZE_STRING);
					$data[2]=filter_input(INPUT_POST,'Uname', FILTER_SANITIZE_STRING);
					$data[3]=filter_input(INPUT_POST,'Password', FILTER_SANITIZE_STRING);
					$data[6]=filter_input(INPUT_POST,'Password_Confirm', FILTER_SANITIZE_STRING);
					$data[4]=$timestamp;
					$data[5]=$_SERVER['REMOTE_ADDR'];
					
					$password_check = strcmp($data[3],$data[6]) ;
					
					if($password_check != 0)
						header("Location: SignUp.php");
					else {
						$config = include("config.php");
						$db = pg_connect($config->host." ".$config->port." ".$config->dbname." ".$config->user." ".$config->password);
						$hashed_password = crypt($data[3], '$5$rounds=5000$crazysaaltstringsowecanencryptdatasalt$'); // crazy salt
	
						$query = "SELECT * from user_info where username = '". $data[2] . "';";
						$result = pg_query($query);
						session_start();
						$user = $_POST["Uname"];
						$_SESSION['User'] = $user;
	
						if(pg_num_rows($result) == 0) {
							$query = "INSERT into user_info(fname, lname, username, password, timestamp, ipaddress) VALUES ('". $data[0] . "', '" . $data[1] . "', '" . $data[2] . "', '" . $hashed_password . "', '". $data[4] . "', '". $data[5] . "')";
								$sql = 
							"CREATE TABLE " . $user . "
							(ID SERIAL 		PRIMARY KEY 	NOT NULL,
							name			TEXT			NOT NULL,
							width			INT				NOT NULL,
							height			INT				NOT NULL,
							numFrames		INT 			NOT NULL,
							fps				REAL			NOT NULL,
							username		TEXT			NOT NULL,
							url				TEXT			NOT NULL)";
	
							$ret = pg_query($query);
							$ret = pg_query($db, $sql);
	
							if(!$ret) {
								echo pg_last_error($db);
							} 
							else {
								echo "Table created successfully\n";
							}
	
							pg_close($db);
						}
						else {
							echo "<script>alert('Whoops! Looks like that username is already taken!');</script>";
						}
					}

				}
			}
		}
		$register = new register();
		$register->signIn();
		?>
        
    <div id="topnav">
    	<div id="top-box-1" class="class-hover-effect"></div>
        <div id="top-box-2" class="class-hover-effect"></div>
        <div id="top-box-3" class="class-hover-effect"></div>
        <div id="top-box-4" class="class-hover-effect"></div>
        <div id="topnav-footer"></div>
    </div>
    
        
    <div id="container">
        	<div id="header"><span class="header-text">FACE ME</span></div>
        	<div id="content">
            	<div id="form-holder">
                	<div id="form-header">Registration Complete</div>
                    <div id="form-subheader">Your profile has successfully created! 
                    </div>
                    <form action="Upload.php" method="POST" enctype="multipart/form-data"><br>
                        <input type="submit" class="class-hover-effect" value="Login">
                    </form>
                    <div id="form-footer"></div>
                </div>
            </div>
    </div>
    
    <div id="footer">
    	<span class="sub-text grey">
			<table id="f-table">
				<tr>
					<td class="f-table-data"><a class="f-bot-links small-text class-hover-effect" href="index.php">Login</a></td>
					<td class="f-table-data-end"><a class="f-bot-links small-text class-hover-effect" href="SignUp.php">Sign Up</a></td>
				</tr>
			</table>
		</span>
    </div>

</body>
</html>
