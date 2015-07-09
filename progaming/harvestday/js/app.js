var app = angular.module('main', ['ui.bootstrap', 'navbar']);

app.controller("mainController",['$http', function ($http) {
	
	Parse.initialize("cof29AFjcuyt9x0D0tTfI5ggnK9FiNK9nZHB7mDS", "xzk6SfARIvNYSkZlu0g3gMn885ltSYRMGY8l0Htw");
	
	if(Parse.User.current()){
		this.isLoggedIn = true;
		console.log("PathName: " + location.pathname);
		if(location.pathname.indexOf("index.html") != -1)
		{
			location.replace("home.html");
		}
		
		
	}else{
		this.isLoggedIn = false;
		if(location.pathname.indexOf("index.html") == -1 && location.pathname != "/mobipier/zoobadaboo/")
		{
			location.replace("index.html");
		}
	}
	
	this.login = function(form) {
		this.message = "Logging In...";
		Parse.User.logIn(form.username, form.password, {
			success: function(user) {
			  this.message = "logged in successfully";
			  this.isLoggedIn = true;
			  location.replace("home.html");
			},
			error: function(user, error) {
				this.message = "fail " + error.toString();
				location.replace("index.html");
			// The login failed. Check error to see why.
			}
		});
	}
	
	
	
	

}]);

/*app.controller("navbarController", function(){
	this.navbar = 1;
	if(location.pathname.indexOf("home.html") != -1)
	{
		this.navbar = 1;
	}
	//console.log(this.navbar);
	this.isSelectNavbar = function(checkNB){
		return this.navbar == checkNB;
	}
	
	this.logout = function() {
		Parse.User.logOut();
		location.replace("index.html");	
	}
	
});*/



app.directive("navbarPanels", function(){
		return{
			restrict: 'E',
			templateUrl: './navbar-panels.html',
			controller:function(){
				this.navbar = 1;
				if(location.pathname.indexOf("home.html") != -1)
				{
					this.navbar = 1;
				}
				//console.log(this.navbar);
				this.isSelectNavbar = function(checkNB){
					return this.navbar == checkNB;
				}
				
				this.logout = function() {
					Parse.User.logOut();
					location.replace("index.html");	
				}
			},
			controllerAs: 'navbar'
		}
	});
