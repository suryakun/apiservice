/* Webarch Admin Dashboard 
/* This JS is only for DEMO Purposes - Extract the code that you need
-----------------------------------------------------------------*/	
//Cool ios7 switch - Beta version
//Done using pure Javascript

$(document).ready(function(){
	  //Dropdown menu - select2 plug-in
	  /*$("#source").select2();*/
	  
	  //Multiselect - Select2 plug-in
	  $(".multiple-ruang").val(["r1","r2"]).select2();
	  
	  
	  //Add Append Input
	  qq = 2;
	  $('#add_question').click(function(){
		  qq++;
		 $('<div class="controls input-group clearfix"><span class="input-group-addon primary"><span class="arrow"></span><i class="fa fa-check-circle"></i></span><input type="text" placeholder="Answer #'+qq+'" class="col-xs-11"> <a href="#" class="col-xs-1"> <i class="">&times;</i></a></div>').appendTo('#question_append'); 
		 $('#question_append a').click(function(){
			$(this).parent().remove();
		});
	  });
	  
	  
	  /*//Date Pickers
	  $('.input-append.date').datepicker({
				autoclose: true,
				todayHighlight: true
	   });
	 
	 $('#dp5').datepicker();
	 
	 $('#sandbox-advance').datepicker({
			format: "dd/mm/yyyy",
			startView: 1,
			daysOfWeekDisabled: "3,4",
			autoclose: true,
			todayHighlight: true
    });
	
	//Time pickers
	$('.clockpicker ').clockpicker({
        autoclose: true
    });
	//Color pickers
	$('.my-colorpicker-control').colorpicker()
	
	//Input mask - Input helper
	$(function($){
	   $("#date").mask("99/99/9999");
	   $("#phone").mask("(999) 999-9999");
	   $("#tin").mask("99-9999999");
	   $("#ssn").mask("999-99-9999");
	});
	
	//Autonumeric plug-in - automatic addition of dollar signs,etc controlled by tag attributes
	$('.auto').autoNumeric('init');
	
	//HTML5 editor
	$('#text-editor').wysihtml5();
	
	//Drag n Drop up-loader
	$("div#myId").dropzone({ url: "/file/post" });
	
	//Single instance of tag inputs  -  can be initiated with simply using data-role="tagsinput" attribute in any input field
	$('#source-tags').tagsinput({
		typeahead: {
			source: ['Amsterdam', 'Washington', 'Sydney', 'Beijing', 'Cairo']
		}	
	});*/
});