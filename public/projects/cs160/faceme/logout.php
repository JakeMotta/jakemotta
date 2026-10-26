<?php
session_start();
$my_name = $_SESSION['User']
?>

<?php
session_destroy();
?>
	
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Face Me - Log Out</title>

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
        <div id="topnav-footer"></div>
    </div>
    
        
    <div id="container">
        	<div id="header"><span class="header-text">FACE ME</span></div>
        	<div id="content">
            	<div id="form-holder">
                	<div id="form-header">Log Out</div>
                    <div id="form-subheader">You have successfully logged out!</div>
                    <form name="logInButton" method="POST" action="index.php"><br>
                        <input type="submit" class="class-hover-effect" value="Login">                
                    </form>

                    <form name="singUpButton" method="POST" action="SignUp.php">
                        <input type="submit" class="class-hover-effect" value="Sign Up">
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
