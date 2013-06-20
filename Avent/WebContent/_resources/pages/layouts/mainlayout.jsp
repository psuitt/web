<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

	<head>
	
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
	                
	                <li>
	                  <a href="#icons" class="skip" gumby-easing="easeOutQuad" gumby-duration="600" gumby-goto="[data-target='icons']">Search</a>
	                </li>
	                
	                <li>
	                  <a href="#icons" class="skip" gumby-easing="easeOutQuad" gumby-duration="600" gumby-goto="[data-target='icons']">Create</a>
	                </li>
	                
	                <li>
	                  <a href="#icons" class="skip" gumby-easing="easeOutQuad" gumby-duration="600" gumby-goto="[data-target='icons']">Profile</a>
	                </li>
	                
	                <li>
	                  <a href="#icons" class="skip" gumby-easing="easeOutQuad" gumby-duration="600" gumby-goto="[data-target='icons']">Calendar</a>
	                </li>
	                 
	            </ul>	
		            	
	        </div>
			
			<div class="ten columns" > 
				<div class="valign row">  
					<ul class="six columns">
					    <li class="append field" >
							<input class="text input smalltext va-m" type="text" />				
					    	<div class="small primary btn va-m"><a href="#">Search</a></div>
					    </li>
					</ul>
				</div> 
				<div class="valign row"><tiles:insertAttribute name="view" /></div>   
			
			</div>	
			

		</div>
			
	</body>
	
</html>