<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

	<head>
	
		<base href="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/" />
	
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	
		<link rel="stylesheet" href="_resources/static/css/gumby.css">
		<link rel="stylesheet" href="_resources/static/css/style.css">
		<link rel="stylesheet" href="_resources/static/css/fullcalendar.css"  />
		<link rel="stylesheet" href="_resources/static/css/fullcalendar.print.css" media="print" />
	
		<script src="_resources/static/js/libs/modernizr-2.6.2.min.js"></script>
		
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		
		<script src="_resources/static/js/libs/fullcalendar.js"></script>
		
		<script src="_resources/static/js/libs/gumby.min.js"></script>
  		<script src="_resources/static/js/plugins.js"></script>
		
		<!--
		  Include gumby.js followed by UI modules.
		  Or concatenate and minify into a single file
		  <script src="_resources/static/js/libs/gumby.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.retina.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.fixed.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.skiplink.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.toggleswitch.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.checkbox.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.radiobtn.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.tabs.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.navbar.js"></script>
		  <script src="_resources/static/js/libs/ui/gumby.fittext.js"></script>
		  <script src="_resources/static/js/libs/ui/jquery.validation.js"></script>
		  <script src="_resources/static/js/libs/gumby.init.js"></script>-->
		
		<script type="text/javascript" src="_resources/static/js/main.js"></script>	
		
		<title>Insert title here</title>
	</head>
	
	<body>
	
		<div class= "row">
			<div class="two columns push_ten">
				<a>Sign In</a>
	        </div>
		</div>
		<div class= "row">
			<div class="five columns centered">
				Event Planning Done Right
	        </div>
		</div>
		<div class= "row">
		
			<div class="two columns">
			
				<ul id="sidebar-nav">
	                
	                <li class="selected" >
	                  <a>Search</a>
	                </li>
	                
	                <li>
	                  <a>Create</a>
	                </li>
	                
	                <li>
	                  <a>Profile</a>
	                </li>
	                
	                <li>
	                  <a>Calendar</a>
	                </li>
	                 
	            </ul>	
		            	
	        </div>
			
			<div class="ten columns" > 
				<div class="valign row">  
					<ul class="six columns">
					    <li class="append field" >
							<input id="search" class="text input smalltext va-m" type="text" />				
					    	<div class="small primary btn va-m"><a href="#">Search</a></div>
					    </li>
					</ul>
				</div> 
				<div id="view" class="valign row"></div>   
			
			</div>	
			

		</div>
			
	</body>
	
	<script>
	
		//Document ready
		$(document).ready(function() {
			$("#sidebar-nav li a").on("click", function() {
				var jThis = $(this);
				$("#sidebar-nav li").removeClass("selected");
				jThis.parent().addClass("selected");
				
				$.ajax({
					  type: "GET",
					  url: "home/" + jThis.html().toLowerCase() + ".",
					}).done(function( data ) {
						$("#view").html(data);
					});
				
				
			     // Prevent the anchor link.
			     return false;
			});
			//$("#search").autocomplete();
		});
		
		var selectMenuItemColor = function() {
			$("#sidebar-nav ul li a").removeClass("selected");
		};
	

	</script>
	
</html>

