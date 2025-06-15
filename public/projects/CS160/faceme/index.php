<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Face Me - Login</title>

<link rel="stylesheet" type="text/css" href="files/cssreset.css">
<link rel="stylesheet" type="text/css" href="files/mainCSS.css">
<link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet">


<script type="text/javascript" src="files/html5lightbox/jquery.js"></script>
<script type="text/javascript" src="files/html5lightbox/html5lightbox.js"></script>
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
                	<div id="form-header">Login</div>
                    <form name="logInForms" method="POST" action="authenticate.php">
                        <input type="text" name="Uname" placeholder="Username"><br>
                        <input type="password" name="Password" placeholder="Password"><br>  
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
