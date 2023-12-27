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
	<div id="s-banner-content"><span class="banner-text">CONTACT</span></div>
</div>

<div id="container">

	<div id="leftcolumn">
    
    	<div class="content">
            <span class="med-text bold-text">Contact Info</span><div class="line"></div>
            <span class="gen-text grey">
            	Vince Lozano<br>
                vincehuntn@gmail.com<br>
                (559) 799-3858
            </span>
        </div>
        
    	<div class="content">
            <span class="med-text bold-text">Training Location</span><div class="line"></div>
            <span class="gen-text grey">
            	Training will normally occur at the Avenal Gun Club 32689 Ave 36, located in Avenal, Ca.  There will be an additional $10 charged for use of the range.
				<br><br>
                If you have your own facilities or would like to have training conducted at another location call or send an email and arrangements can be made.  I have my own targets and am fully mobile.
            </span>
        </div>
        
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7677.5429134698215!2d-120.10753370938576!3d35.99564286333571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8094abab7accc255%3A0x34b8b074da7a444e!2sAvenal+Gun+Club!5e0!3m2!1sen!2sus!4v1474418603690" width="580" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>

		<br><br>
		<hr>
        <br>
        
        <div class="content">
                <span class="large-text bold-text">Send Us a Message</span><br>
				<span class="gen-text grey">Please fill in the form below.</span>
        </div>
        
        <form name="htmlform" method="post" action="contact_send.php">
           
           		<label for="first_name"><span class="gen-text grey">First Name</span> <span class="red">*</span></label>
                <input type="text" name="first_name"><br>
            
                <label for="last_name"><span class="gen-text grey">Last Name</span> <span class="red">*</span></label>
                <input type="text" name="last_name"><br>
                
                <label for="email"><span class="gen-text grey">Email Address</span> <span class="red">*</span></label>
                <input type="text" name="email"><br>
                
                <label for="telephone"><span class="gen-text grey">Phone Number</span> <span class="red">*</span></label>
                <input type="text" name="phone"><br>
                
                <label for="message"><span class="gen-text grey">Your Message</span></label>
                <textarea  name="message" maxlength="1000" cols="25" rows="6"></textarea>
              
                <input type="submit" value="Submit">

          </form>
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
