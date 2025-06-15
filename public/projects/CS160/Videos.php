<?php session_start();
$user = $_SESSION['User'];
?>  
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Face Me - Videos</title>

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
                    <div id="form-header">My Videos</div>
                    
                    <?php
                        class myVideos{
                            public function getVideos(){
                                $host        = "host=127.0.0.1";
                                $port        = "port=5432";
                                $dbname      = "dbname=cs160";
                                $credentials = "user=postgres password=student";
                                $db = pg_connect("$host $port $dbname $credentials");
                                $username = $_SESSION['User'];
                        
                                $query = "SELECT * FROM " . $username;
                                $result = pg_query($query); 

                                while($row = pg_fetch_row($result))
                                {
                                    $url = $row[7];
                                    $tags = ".avi";
                                    $newurl = str_replace($tags, "", $url);
                                    $width = $row[2];
                                    $height = $row[3];
									
                                    echo "
									
										<div class='video_div'>
											<div class='video_div_header'>" .$url. "</div>
											<a href=".$url." class='html5lightbox'>".$newurl."</a>
										</div>																	
									
									";
                                   

                                    //echo "<video width='$width' height='$height' controls=''><source src='$url' type='video/mp4'></source></video>";
                                    //echo "<embed src='$url' width='$width' height='$height'></embed>";
                                }
                            }
                        }
                        $videos = new myVideos();
                        $videos->getVideos();
                        pg_close($db);
                    ?>

                    <div id="form-footer"></div>
                </div>
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

</body>
</html>
