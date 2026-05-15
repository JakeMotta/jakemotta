<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>ART</title>

<link rel="stylesheet" type="text/css" href="files/maincss.css">
<link rel="stylesheet" type="text/css" href="files/reset.css">
<link rel="stylesheet" type="text/css" media="all" href="menu/css/styles.css">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:700" rel="stylesheet">

<!--Nav Scripts-->
<script type="text/javascript" src="menu/js/jquery-1.11.1.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.4.min.js"></script>

</head>

<body>

<div id="top-nav"></div>

<?php
					include("files/lead-nav.php");
?>
<script type="text/javascript"> <!--Used for lead-nav functionallity. Do not remove-->
    $(function(){
      $('a[href="#"]').on('click', function(e){
        e.preventDefault();
      });
      
      $('#menu > li').on('mouseover', function(e){
        $(this).find("ul:first").show();
        $(this).find('> a').addClass('active');
      }).on('mouseout', function(e){
        $(this).find("ul:first").hide();
        $(this).find('> a').removeClass('active');
      });
      
      $('#menu li li').on('mouseover',function(e){
        if($(this).has('ul').length) {
          $(this).parent().addClass('expanded');
        }
        $('ul:first',this).parent().find('> a').addClass('active');
        $('ul:first',this).show();
      }).on('mouseout',function(e){
        $(this).parent().removeClass('expanded');
        $('ul:first',this).parent().find('> a').removeClass('active');
        $('ul:first', this).hide();
      });
    });
</script>

<div id="s-banner" style="background-image:url(images/banners/contact.jpg)">
	<div id="s-banner-content"><span class="banner-text">REGISTER</span></div>
</div>

<div id="container">

	<div id="leftcolumn">
    
    		<div class="content">
                <span class="large-text bold-text">Registration Form</span><br>
                <span class="gen-text grey">Please fill in the form below.</span>
            </div>
           
           
          <script type="text/javascript" src="https://form.jotform.com/jsform/82907418724160"></script>
           
    </div>
    
    <?php
					include("files/rightcolumn.php");
	?>
    
    <!--Fixes auto-height for container-->
    <div id="container-footer"></div>

</div>

	<?php
					include("files/footer.php");
	?>

</body>
</html>
