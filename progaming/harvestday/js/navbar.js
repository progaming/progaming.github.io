(function(){
	var app = angular.module('navbar', []);
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
				else if(location.pathname.indexOf("gift.html") != -1)
				{
					this.navbar = 2;
				}
				//console.log(this.navbar);
				this.isSelectNavbar = function(checkNB){
					return this.navbar == checkNB;
				}
				
				this.logout = function() {
					Parse.User.logOut();
					location.replace("index.html");	
				}
				
				this.gotoHomePage = function(){
					location.replace("home.html");
				}
				
				this.gotoGiftPage = function(){
					location.replace("gift.html");
				}
			},
			controllerAs: 'navbar'
		}
	});
})();