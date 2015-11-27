var testloginsite = angular.module('testloginsite', ['ui.bootstrap', 'navbar', 
													 'search']);
function mainController($scope, $http, $log) {
	$scope.message = "start";
	//ZpellRacing
	Parse.initialize("ChcPl6eO0oMIElOdz8wpp6JauAnXzGyS9wDFKykS", "8JGbt8oPEeb22PfQlSiPp5i9csnqA6rcKLHTrhzd");
	//Parse.initialize("ZqkjVW863EB3VfGmbKecyDOmiv8nD7UqeSgORcC6", "cvhTO9EEXR1d1RmVQe7MOQ1D02hRo07cgmxs4bP9");
	
	if(Parse.User.current()){
		$scope.message = "logged in";
		$scope.isLoggedIn = true;
		$scope.buttonSaveDisabled = false;
		$log.log("PathName: " + location.pathname);
		if(location.pathname.indexOf("index.html") != -1 || location.pathname.indexOf(".html") == -1)
		{
			location.replace("search.html");
		}
		
		$log.log("buttonSaveDisabled = " + $scope.buttonSaveDisabled);
	}else{
		$scope.message = "not logged in";
		$scope.isLoggedIn = false;
		if(location.pathname.indexOf("index.html") == -1)
		{
			location.replace("index.html");
		}
	}
	
	
	
	$scope.login = function(form) {
		$scope.message = "Logging In...";
		Parse.User.logIn(form.username, form.password, {
			success: function(user) {
			  $scope.message = "logged in successfully";
			  $scope.isLoggedIn = true;
			  location.replace("search.html");
			},
			error: function(user, error) {
				$scope.message = "fail " + error.toString();
				location.replace("index.html");
			// The login failed. Check error to see why.
			}
		});
	}
	
	$scope.logout = function() {
		Parse.User.logOut();
		location.replace("index.html");
		
	}

}