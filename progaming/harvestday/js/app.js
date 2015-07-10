var app = angular.module('main', ['ui.bootstrap', 'navbar', 'gift']);

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

app.controller("SearchUserController", function($scope){
	
	var searchCtrl = this;
	this.search = {};
	this.searchInfo = {};
	this.searching = false;
 	$scope.isSearchFinished = false;
	 
	this.searchSubmit = function(){
	 	console.log("Submit fn: " + this.search.firstname + " ln: " + this.search.lastname);
	 	$scope.searching = true;
		 var query1 = null;
	 	var query2 = null;
	 	if(this.search.firstname)
	 	{
		 	query1 = new Parse.Query("UserInfo");
		 	query1.contains("first_name", this.search.firstname);
	 	}
	 	if(this.search.lastname)
	 	{
		 	query1 = new Parse.Query("UserInfo");
		 	query1.contains("last_name", this.search.firstname);
	 	}
	 
	 	var compoundQuery = null;
	 	if(query1 && !query2)
	 	{
		 	compoundQuery = query1;
	 	}
	 	else if(query2 && !query1)
	 	{
		 	compoundQuery = query2;
	 	}
	 	else
	 	{
		 	compoundQuery = Parse.Query.or(query1, query2);
	 	}
	 
	 	compoundQuery.find({
			success:function(objects){
				console.log("SearchResult: " + objects.length);
				$scope.searchInfo = new Array();
				for(var i = 0; i < objects.length; i++)
				{
					$scope.searchInfo.push({firstname: objects[i].get("first_name"),
										  lastname: objects[i].get("last_name"),
										  uid: objects[i].get("uid")});
				}
				console.log("Array: " + $scope.searchInfo.length);
				searchCtrl.search = {};
				$scope.isSearchFinished = true;
				searchCtrl.searching = false;
				$scope.$apply(function(){console.log("Apply! isSearchFinished: " + $scope.isSearchFinished);});
			},
			error: function(error) {
				console.log( "Can't search User.");
			}
	 	});
	 
	 
 	};
	 
});