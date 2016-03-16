<!DOCTYPE html>
<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
<head>
<meta charset="utf-8" />
    <?php $namasekolah 	= $db->fob("NAMA",$tpref."msekolah","WHERE No='".$_SESSION['kdskl_id']."'"); ?>    
	<title>7Pagi.com - <?php echo $namasekolah; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta content="" name="description" />
<meta content="" name="author" />
<link href="<?PHP echo $template_syst; ?>assets/plugins/pace/pace-theme-flash.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="<?PHP echo $template_syst; ?>assets/plugins/jquery-nestable/jquery.nestable.css" rel="stylesheet" type="text/css" media="screen"/>
<!-- END PLUGIN CSS -->
<!-- BEGIN CORE CSS FRAMEWORK -->
<link href="<?PHP echo $template_syst; ?>assets/plugins/boostrapv3/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/plugins/boostrapv3/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/plugins/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/css/animate.min.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/plugins/jquery-scrollbar/jquery.scrollbar.css" rel="stylesheet" type="text/css"/>
<!-- END CORE CSS FRAMEWORK -->
<!-- BEGIN CSS TEMPLATE -->
<link href="<?PHP echo $template_syst; ?>assets/plugins/bootstrap-select2/select2.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="<?PHP echo $template_syst; ?>assets/css/style.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/css/large_screen_tweak.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/css/responsive.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/css/custom-icon-set.css" rel="stylesheet" type="text/css"/>

<link href="<?PHP echo $template_syst; ?>assets/plugins/jquery-slider/css/jquery.sidr.light.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="<?PHP echo $template_syst; ?>assets/plugins/jquery-superbox/css/style.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="<?PHP echo $template_syst; ?>assets/plugins/dropzone/css/dropzone.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css" rel="stylesheet" type="text/css"/>
<link type="text/css" href="<?PHP echo $template_syst; ?>assets/plugins/scroll/style/jquery.jscrollpane.css" rel="stylesheet" media="all" />
<link href="plugins/fullcalendar/fullcalendar.css" rel="stylesheet" type="text/css" media="screen"/>
<!-- END CORE CSS FRAMEWORK -->
<link href="<?PHP echo $template_syst; ?>assets/pe-icon-7-stroke/css/pe-icon-7-stroke.css" rel="stylesheet" type="text/css"/>
<link href="<?PHP echo $template_syst; ?>assets/pe-icon-7-stroke/css/helper.css" rel="stylesheet" type="text/css"/>

<?php
	if(!empty($module)){ 
		if(is_file($dirhost."/".$page_dir."/css/style.css")){?>
        	<link rel="stylesheet" href="<?php echo $dirhost; ?>/<?php echo $page_dir; ?>/css/style.css" type="text/css" /> 
        <?php 
		}
	} 
?>
<?php include($basepath."/templates/system/assets/plugins/fancybox/fancybox.php");?>
</head>
    <?php
    //GENEREAL PLUGINS
    include($basepath."plugins/facebox/index.php"); 
    include($basepath."plugins/fileinput/index.php");
    //END OF GENERAL PLUGINS//
    ?>
    <?php  include($basepath."plugins/gritter/index.php"); ?>
	<link rel="shortcut icon" href="<?PHP echo $template_syst; ?>favicon.ico" />

<!-- END HEAD -->
<?php 
    if(!empty($_SESSION['id_user'])){
        if(
        $page == "daftar_guru_privat" || 
        $page == "laporan_nilai_tugas" ||
        $page == "penilaian_tugas" ||
        $page == "pendaftaran_kursus_online"){ ?>
       <!-- <script type="text/javascript">jQuery.noConflict();</script> -->
        <?php }
    }
    ?>
	<?php
		$id_usertype_for = $db->fob("ID_USERTYPE",$tpref."users","where No='".$_SESSION['id_user']."'");
		if(!empty($id_usertype_for)){
			switch($id_usertype_for){
				case "1":
				$tbl_user 		= $tpref."mkaryawan";
				break;
				case "2": 
				$tbl_user 		= $tpref."msiswa";
				break;
				case "3": 
				$tbl_user 		= $tpref."mwalisiswa";
				break;
			}
		}
		 $quser_info	= $db->query("SELECT * FROM ".$tbl_user." WHERE USER_ID='".$_SESSION['id_user']."'");
		 $dtuser_info	= $db->fetchNextObject($quser_info);
		 $namainfo 		= $dtuser_info->NAMA; 
		 $id 			= $dtuser_info->USER_ID;
		 $foto 			= $dtuser_info->PHOTO;
		 $nama_usertype = $db->fob("NAMA",$tpref."musertypes","where No='".$id_usertype_for."'");
	?>
<!-- BEGIN BODY -->
<body class="horizontal-menu">
<!-- BEGIN HEADER -->
<div class="header navbar navbar-inverse ">
  <!-- BEGIN TOP NAVIGATION BAR -->
  <div class="navbar-inner">
  	<div class="header-seperation">
      <ul class="nav pull-left notifcation-center" id="main-menu-toggle-wrapper" >
        <li class="dropdown"> <a id="main-menu-toggle" href="#main-menu"  class="" >
          <div class="iconset top-menu-toggle-dark"></div>
          </a> </li>
      </ul>
      <!-- BEGIN LOGO -->
      <a href="index.html"><img src="<?PHP echo $template_syst; ?>assets/img/logo-icon.png" alt="logo" class="logo" alt=""  data-src="<?PHP echo $template_syst; ?>assets/img/logo-icon.png" data-src-retina="<?PHP echo $template_syst; ?>assets/img/logo-icon.png" height="40"/></a>
      <!-- END LOGO -->
      <ul class="nav pull-right notifcation-center">
        <li class="dropdown" id="header_inbox_bar" > <a href="email.html" class="dropdown-toggle" >
          <i class="fa fa-2x fa-bell">&nbsp;</i>
          <span class="badge" id="msgs-badge">2</span> </a></li>
      </ul>
    </div>
    <div class="menu-bar clearfix">
    	<ul class="nav quick-section visible-xs">
          <li class="quicklinks">
			<a href="#" class="" onclick="$('.page-content .content aside').fadeToggle()">
				<span class="iconset top-menu-toggle-dark"></span>
            </a>
		  </li>
        </ul>
    	<div class="container">
        	<div class="pull-left">
                <ul class="clearfix"> 
                	<li class="logo">
                    	<img src="<?PHP echo $template_syst; ?>assets/img/logo-biru.png" alt="logo" />
                    </li>
                    <?php
	$y = 0;
	$qmenu = $db->query("SELECT * FROM ".$tpref."pages WHERE ID_PARENT = '0' AND DEPTH = '1' AND POSISI='left' AND STATUS='1' ORDER BY SERI ASC");
	while($dtmenu = $db->fetchNextObject($qmenu)) {
		$y++;
		$icon 		= "";
		$menu_icon	= "";
		$class		= "";
		$is_folder = $db->fob("IS_FOLDER",$tpref."pages","where No='".$dtmenu->No."'");
		if($is_folder == 2){ 
		$url 	= $dtmenu->NAMA; 
			if($dtmenu->ICON != "")	{ $icon = $dtmenu->ICON; }
		}
		else { 
		$url	= $dtmenu->NAMA;  
			if($dtmenu->ICON != "")	{ $icon = $dtmenu->ICON; }
		}
		
		$chakakses = $db->recount("select * from ".$tpref."hakakses where ID_USER_LEVEL='".$id_user_level."' and ID_PAGE='".$dtmenu->No."'");
		if($chakakses > 0){
	?>
		 <?php $namapages = $db->fob("NAMA",$tpref."pages","where No='".$id_page."' "); ?>

					<li>
<?php //echo $url; ?>
		<a href="?mod=<?php echo $module; ?>&page=<?php echo $dtmenu->HALAMAN ?>" class="tip <?php if($dtmenu->HALAMAN==$page) 
echo "cur"; ?>" data-toggle="tooltip" title="<?php echo $url; ?>" data-placement="right">
								<span class=" fa fa-<?php echo $icon; ?>"></span>
							<span><?php echo $url; ?></span>
						 <?php 
							if($dtmenu->IS_FOLDER == 1){
								echo treeview2($dtmenu->No); 
							}
							?>
		</a>
	</li>
					<?php
						}
					}
                ?>
                </ul>
            </div>
            
            
            <!-- BEGIN USER TOGGLER -->
      <?php 
		$next_mon	= date('Y-m-d', strtotime('next saturday +1 '));
		$qtugas 	= $db->query("SELECT * FROM si_jadwal_akademik WHERE FOR_ID='".$_SESSION['id_user']."' AND MULAI BETWEEN '".$tglupdate."' AND '".$next_mon."' ORDER BY MULAI DESC");
		$nuTugas	= $db->numRows($qtugas);
		$qnotif = "SELECT * FROM si_notif_user WHERE USER_ID = '".$_SESSION['id_user']."' AND ID_KDSKL = '".$_SESSION['kdskl_id']."' ORDER BY TGL DESC LIMIT 10";
		$notreadnotif = $db->recount("SELECT * FROM si_notif_user WHERE USER_ID = '".$_SESSION['id_user']."' AND ID_KDSKL = '".$_SESSION['kdskl_id']."' AND STATUS = 0");
		$jmlnotif = $db->recount($qnotif);
		
		
		$q_msg = $db->query("SELECT user_from FROM si_message WHERE user_for = '".$_SESSION['id_user']."' AND status = 0 GROUP BY user_from");
		$jml_msg = $db->numRows($q_msg);
		$q_msg = $db->query("SELECT user_from,tgl_send FROM si_message WHERE user_for = '".$_SESSION['id_user']."' GROUP BY user_from ORDER BY tgl_send DESC LIMIT 5");
		$row_msg = $db->numRows($q_msg);
		
		$q_event = $db->query("SELECT KETERANGAN as ket, ISI as judul, MULAI as tgl_mulai,WMULAI as jam_mulai FROM si_jadwal_akademik WHERE TGLUPDATE >= NOW() - INTERVAL 7 DAY AND ID_KDSKL = '".$_SESSION['kdskl_id']."'");
		$row_event = $db->numRows($q_event);
		$event = array();
		if($row_event > 0)
		{
			while($d_e = $db->fetchNextObject($q_event))
			{
				$event[] = array("judul"=>$d_e->judul,"tgl"=>$d_e->tgl_mulai,"jam"=>$d_e->jam_mulai,"ket"=>$d_e->ket);
			}
		}
		
	?>
      <div class="pull-right user">
        <div class="chat-toggler nav"> 
        <a href="#" class="dropdown-toggle" data-content='' data-toggle="dropdown">
            <?php echo $namainfo; ?>
            <span class="profile-pic">
            <?php if(is_file("files/".$nama_usertype."/".$id."/photos/".$foto)){?>
			<img alt="avatar" src="<?php echo "files/".$nama_usertype."/".$id."/photos/".$foto; ?>" data-src="<?php echo "files/".$nama_usertype."/".$id."/photos/".$foto; ?>" data-src-retina="<?php echo "files/".$nama_usertype."/".$id."/photos/".$foto; ?>" /> 
			<?php }else{ ?>
			<img alt="avatar" src="<?php echo "files/no-pic.jpg"; ?>" />
			<?php } ?> 
            </span>
          	<span class="iconset top-down-arrow"></span>
          </a>
          
          <ul class="dropdown-menu  pull-right" role="menu" aria-labelledby="user-options">
              <li><a href="user-profile.html"> My Account</a> </li>
              <li><a href="calender.html">My Calendar</a> </li>
              <li><a href="email.html"> My Inbox&nbsp;&nbsp;<span class="badge badge-important animated bounceIn">2</span></a> </li>
              <li class="divider"></li>
              <li><a href="login.html"><i class="fa fa-power-off"></i>&nbsp;&nbsp;Log Out</a></li>
            </ul>
        </div>
      </div>
      
      <div class="pull-right">
      	<ul class="nav quick-section ">
      	
        	<li class="quicklinks">
            	<a data-toggle="dropdown" id="my-task-list" data-placement="bottom" class="dropdown-toggle  pull-right" href="#">	
                    <i class="fa fa-bell">&nbsp;</i>
                    <span class="badge badge-important animated bounceIn" id="chat-message-count jmlnotif"><?php echo $notreadnotif; ?></span>
				</a>
                  
                        <a href="<?php echo $dt_notif->LINK; ?>">
                <div id="notification-list" style="display:none">
						  <div class="notification-messages info">
									<div class="message-wrapper">
										<div class="heading">
											<?php echo $db->fob("NAMA","si_".$t,"WHERE USER_ID = '".$dt_notif->FROM_ID."'"); ?>
										</div>
										<div class="description">
											 <?php echo $dt_notif->ISI; ?>
										</div>
										<div class="date pull-left">
										<?php echo getElapsedTime($dt_notif->TGL); ?>
										</div>										
									</div>
									<div class="clearfix"></div>									
								</div>	
							<div class="notification-messages danger">
								<div class="iconholder">
									<i class="icon-warning-sign"></i>
								</div>
								<div class="message-wrapper">
									<div class="heading">
										Server load limited
									</div>
									<div class="description">
										Database server has reached its daily capicity
									</div>
									<div class="date pull-left">
									2 mins ago
									</div>
								</div>
								<div class="clearfix"></div>
							</div>	
							<div class="notification-messages success">
								<div class="message-wrapper">
									<div class="heading">
										You haveve got 150 messages
									</div>
									<div class="description">
										150 newly unread messages in your inbox
									</div>
									<div class="date pull-left">
									An hour ago
									</div>									
								</div>
								<div class="clearfix"></div>
							</div>							
								
				</div>
            </li>
            
        </ul>
      </div>
      <!-- END USER TOGGLER -->
            
            
        </div>       
	</div>
    
    <!-- END TOP NAVIGATION MENU -->
  </div>
  <!-- END TOP NAVIGATION BAR -->
</div>






 
<!-- BEGIN CONTAINER -->

 <!-- BEGIN SIDEBAR -->

  
 <!-- BEGIN CONTAINER -->
<div class="page-container row">
  <a href="#" class="scrollup">Scroll</a>
  <!-- BEGIN PAGE CONTAINER-->
  <div class="page-content">
    <!-- BEGIN MODEL-->
    <div id="portlet-config" class="modal hide">
      <div class="modal-header">
        <button data-dismiss="modal" class="close" type="button"></button>
        <h3>Widget Settings</h3>
      </div>
      <div class="modal-body"> Widget settings form goes here </div>
    </div>
    <!-- END MODEL-->
    <div class="clearfix"></div>
		<?php 
		$namapages		 	= $db->fob("NAMA",$tpref."pages","where No='".$id_page."' "); 
		$id_usertype_for 	= $db->fob("ID_USERTYPE",$tpref."users","where No='".$id_user."'"); 
		$usertype 			= $db->fob("NAMA",$tpref."musertypes","where No='".$id_usertype_for."'");

		if(empty($_SESSION['id_user']))		{ include("templates/elements/login/index.php"); 	}
		if(!empty($msg)){
			switch($msg){
				case "rightaccess":
				echo msg("Maaf Anda Tidak Memiliki Akses Untuk Halaman Ini","false");
				break;
				case "invalid_module":
				echo msg("Whopss...Module dan Halaman Ini Tidak Ditemukan","false");	
				break;
			}
		}
		if(is_file("modules/index.php")) 	{ include("modules/index.php");				} 
		?>

  </div>
</div>

</div>


<!-- END CONTAINER --> 
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-1.8.3.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/boostrapv3/js/bootstrap.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/breakpoints.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-unveil/jquery.unveil.min.js" type="text/javascript"></script>
<!-- END CORE JS FRAMEWORK -->

<!-- BEGIN PAGE LEVEL JS -->
<script src="<?PHP echo $template_syst; ?>assets/plugins/pace/pace.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-scrollbar/jquery.scrollbar.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-block-ui/jqueryblockui.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-numberAnimate/jquery.animateNumbers.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/bootstrap-select2/select2.min.js" type="text/javascript"></script>

<!-- END PAGE LEVEL PLUGINS -->
<script src="<?PHP echo $template_syst; ?>assets/js/tabs_accordian.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/js/form_elements.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/js/jquery.collagePlus.js" type="text/javascript"></script>
<!-- BEGIN CORE TEMPLATE JS -->
<script src="<?PHP echo $template_syst; ?>assets/js/core.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/js/chat.js" type="text/javascript"></script> 
<script src="<?PHP echo $template_syst; ?>assets/js/demo.js" type="text/javascript"></script>



<!-- END CORE JS FRAMEWORK -->
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-slider/jquery.sidr.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<script src="<?PHP echo $template_syst; ?>assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets2/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-inputmask/jquery.inputmask.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-autonumeric/autoNumeric.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/ios-switch/ios7-switch.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/bootstrap-tag/bootstrap-tagsinput.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/dropzone/dropzone.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/metro/scripts/ui-jqueryui.js"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-mixitup/jquery.mixitup.min.js" type="text/javascript"></script>

<script src='plugins/fullcalendar/lib/moment.min.js'></script>
<script src="plugins/fullcalendar/fullcalendar.min.js"></script>
<script type="text/javascript" src="jquery.form.min.js"></script>
<input type='hidden' id='userid' value='<?php echo $_SESSION['id_user']; ?>' />
<input type='hidden' class='dirhost' value='<?php echo $dirhost; ?>' />
<input type='hidden' id='jml_msg_val' value='<?php echo $jml_msg;?>' />
<input type="hidden" id="ajax_dir" value="<?php echo $ajax_dir; ?>" />
<script src="http://js.pusher.com/2.2/pusher.min.js"></script>
<script type="text/javascript" src="<?PHP echo $template_syst; ?>assets/plugins/scroll/script/jquery.mousewheel.js"></script>
<script type="text/javascript" src="<?PHP echo $template_syst; ?>assets/plugins/scroll/script/mwheelIntent.js"></script>
<script type="text/javascript" src="<?PHP echo $template_syst; ?>assets/plugins/scroll/script/jquery.jscrollpane.min.js"></script>

<?php if(is_file($page_dir."/js.js")){ ?>
        <script type="text/javascript" src="<?php echo $dirhost; ?>/<?php echo $page_dir; ?>/js.js"></script>
<?php } ?>
<!-- JavaScript Includes -->

<?php if($page=='timeline'){?>
<script src="<?PHP echo $template_syst; ?>assets/js/tabs_accordian.js" type="text/javascript"></script>
<?php } ?>
<?php if($page=='album_sekolah' || $page == 'album_pribadi'){ ?>
<script src="<?PHP echo $template_syst; ?>assets/js/dashboard_v2.js" type="text/javascript"></script>
<?php } ?>
<?php
	if($_SESSION['id_user_level']==12){
        $qlog = $db->recount("SELECT USER_ID FROM si_users_logs WHERE USER_ID = '".$_SESSION['id_user']."' ");
    }else{
        $qlog = 1000;
    }
    $qlog = $db->recount("SELECT USER_ID FROM si_users_logs WHERE USER_ID = '".$_SESSION['id_user']."' ");
    if($qlog <= 1){
?>
        <script>
        	       	
            $(document).ready(function(){
               $("#gantipasswordmodal").modal("show"); 
            });
            function gantiPass(){
           	    var dirhost = $(".dirhost").val();
                var username = $("#username").val();
                var password = $("#password").val();
                $("#simpan").html("Please Wait...");
                $(".btn").attr("disabled","disabled");
                if(username!='' && password!= ''){
                    $.ajax({
                        url : dirhost+"/ceknotif.php",
                        type : "POST",
                        data : {"username":username,"password":password,"cek":"gantipassword"},
                        success : function(res){
                            var x = res.split("|||");
                            if(x[1] == 'sukses')
                            {
                                alert("username dan password berhasil diganti");
                                window.location.reload();
                            }
                                else
                                if(x[1] == "sudahada")
                            {
                                $(".notiftext").show();
                                $("#textview").html("Username sudah terdaftar !");
                                $("#username").addClass("error").focus();
                                $("#simpan").html("Simpan");
                                $(".btn").removeAttr("disabled");
                            }
                                else
                                if(x[1] == "spasi")
                            {
                                $(".notiftext").show();
                                $("#textview").html("Spasi tidak diinjinkan !");
                                $("#username").addClass("error").focus();
                                $("#simpan").html("Simpan");
                                $(".btn").removeAttr("disabled");
                            }
                                else
                            {
                                $("#simpan").html("Simpan");
                                $(".btn").removeAttr("disabled");
                                alert("Error.");
                            }
                        }
                    });
                }else{
                    if(username == ''){
                        $("#username").addClass("error").focus();
                    }
                    if(password == ''){
                        $("#password").addClass("error").focus();
                    }
                        $("#simpan").html("Simpan");
                        $(".btn").removeAttr("disabled");
                }
            }
        </script>

        <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49504758-1', '7pagi.com');
  ga('send', 'pageview');

</script>
<?php
        include "modpassword.php";
    }
?>

<script src="<?PHP echo $template_syst; ?>assets/js/messages_notifications.js" type="text/javascript"></script>

<script>
	function cekMessage(){
		var jml_msg = $("#jml_msg_val").val();
		if(jml_msg != 0){
			$("#jml_msg").html("0");
			var dirhost = $(".dirhost").val();
			$.ajax({
				url : dirhost+"/cek_message.php",
				type : "POST",
				data : {},
				success : function(){
					$("#jml_msg_val").val(0);
				}
			});
		}
	}
	$(function() {
		// Create Pusher object.
		var pusher = new Pusher('699c4a05036d3995c114');
		// Listen to desired channel.
		var channel = pusher.subscribe('test_channel');
		// Catch notification message
		var userid = $("#userid").val();
		channel.bind('my_event', function(data) {
			
			if(data.id==userid){
				addNotif(data.message,data.url,data.id);
			}
		});

		// Display notification message.
		function addNotif(message,url,id) {
            showNotif('Notification','<a href="'+url+'">'+message+'</a>','8000');
			var dirhost = $(".dirhost").val();
			$.ajax({
				url : dirhost+"/ceknotif.php",
				type : "POST",
				data : {"cek":"true"},
				success : function(response){
					
					$.ajax({
						url : dirhost+"/notif.php",
						type : "POST",
						data : {"cek":"true"},
						success : function(resp){
							$("#jmlnotif").html(response);
							$("#my-task-list").removeAttr("data-original-title").attr("data-original-title","Anda mempunyai "+response+" pemberitahuan baru");
							$("#my-task-list").removeAttr("data-content").attr("data-content",resp);
						}
					});
				}
			});
		}
        $('.input-append.date').datepicker({
        format : "yyyy-mm-dd",
        autoclose : true
    });
    $('.image-checkbox-container img').on('click', function(){
        if(!$(this).prev('input[type="checkbox"]').prop('checked')){
            $(this).prev('input[type="checkbox"]').prop('checked', true).attr('checked','checked');
            this.style.border = '4px solid #38A';
            this.style.margin = '7px';
        }else{
            $(this).prev('input[type="checkbox"]').prop('checked', false).removeAttr('checked');
            this.style.border = '0';
            this.style.margin = '7px';
        }
    });
}); 
</script>
<!-- END PAGE LEVEL PLUGINS --> 	
<script type="text/javascript" src="<?php echo $dirhost; ?>/plugins/jquery.alert.js"></script>
<script src="<?PHP echo $template_syst; ?>assets/js/form_elements.js" type="text/javascript"></script>
<!-- BEGIN CORE TEMPLATE JS --> 
<script src="<?PHP echo $template_syst; ?>assets/plugins/jquery-superbox/js/superbox.js" type="text/javascript"></script>
<script src="<?PHP echo $template_syst; ?>assets/js/search_results.js" type="text/javascript"></script>

<!-- END CORE TEMPLATE JS --> 
<script>
    $(function() {    
      // Call SuperBox - that's it!
      $('.superbox').SuperBox();    
    });
</script>
<script src="plugins/ajaxupload/assets/js/jquery.knob.js"></script>
<!-- jQuery File Upload Dependencies -->
<script src="plugins/ajaxupload/assets/js/jquery.ui.widget.js"></script>
<script src="plugins/ajaxupload/assets/js/jquery.iframe-transport.js"></script>
<script src="plugins/ajaxupload/assets/js/jquery.fileupload.js"></script>
<!-- Our main JS file -->
<script src="plugins/ajaxupload/assets/js/script.js"></script>



</body>
</html>