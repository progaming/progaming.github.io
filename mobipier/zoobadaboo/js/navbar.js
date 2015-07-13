(function(){
	var app = angular.module('navbar', []);
	app.directive("navbarPanels", function(){
		return{
			restrict: 'E',
			templateUrl: './navbar-panels.html',
			controller:function(){
				this.navbar = 1;
				if(location.pathname.indexOf("news.html") != -1)
				{
					this.navbar = 1;
				}
				else if(location.pathname.indexOf("search.html") != -1)
				{
					this.navbar = 2;
				}
				else if(location.pathname.indexOf("top.html") != -1)
				{
					this.navbar = 3;
				}
				else if(location.pathname.indexOf("purchasehistory.html") != -1)
				{
					this.navbar = 4;
				}
				else if(location.pathname.indexOf("dailymission.html") != -1)
				{
					this.navbar = 5;
				}
				else if(location.pathname.indexOf("periodmission.html") != -1)
				{
					this.navbar = 6;
				}
				else if(location.pathname.indexOf("setting.html") != -1)
				{
					this.navbar = 7;
				}
				else if(location.pathname.indexOf("topvip.html") != -1)
				{
					this.navbar = 8;
				}
				//console.log(this.navbar);
				this.isSelectNavbar = function(checkNB){
					return this.navbar == checkNB;
				}
				
				this.logout = function() {
					Parse.User.logOut();
					location.replace("index.html");	
				}
				
				this.gotouserpage = function()
				{
					location.replace("search.html");
				}
				this.gotoNews = function()
				{
					location.replace("news.html");
				}
				this.gotoTopPage = function()
				{
					location.replace("top.html");
				}
				this.gotoTopVIPPage = function()
				{
					location.replace("topvip.html");
				}
				this.gotoPurchasedHistoryPage = function()
				{
					location.replace("purchasehistory.html");
				}
				this.gotoDailyMissionPage = function()
				{
					location.replace("dailymission.html");
				}
				this.gotoPeriodMissionPage = function()
				{
					location.replace("periodmission.html");
				}
				this.gotoSettingPage = function()
				{
					location.replace("setting.html");
				}
			},
			controllerAs: 'navbar'
		}
	});
})();