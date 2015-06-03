var testloginsite = angular.module('testloginsite', ['ui.bootstrap']);
var isLoadNews = false;
function mainController($scope, $http, $log) {
	$scope.message = "start";
	
	Parse.initialize("zlL3kUvdqZ1N8lDI4pl0ytk1QXf7Q3mOYtR5DVHj", "vczItbFBVnIE888w3LTOH8NpyCmgUHA9Aff0b78o");
	
	if(Parse.User.current()){
		$scope.message = "logged in";
		$scope.isLoggedIn = true;
		$scope.buttonSaveDisabled = false;
		$log.log("PathName: " + location.pathname);
		if(location.pathname.indexOf("index.html") != -1 || location.pathname == "/mobipier/zoobadaboo/")
		{
			location.replace("topicinfo.html");
		}
		$log.log("buttonSaveDisabled = " + $scope.buttonSaveDisabled);
	}else{
		$log.log("fanot logged inil");
		$scope.message = "not logged in";
		$scope.isLoggedIn = false;
		if(location.pathname.indexOf("index.html") == -1 && location.pathname != "/mobipier/zoobadaboo/")
		{
			location.replace("index.html");
		}
	}
	if(location.pathname.indexOf("userinfo.html") != -1)
	{
		lessThan = null;
		ageArr = new Array();
		$scope.userInfo = new Array();
		userCnt = 0;
		for(var i = 10; i <= 30; i++)
		{
			ageArr[i] = userCnt;
			$scope.userInfo.push({age:i, female:0, male:0});
			userCnt++;
		}
		userCnt = 0;
		FindAllUserInfo();
	}
	
	if(location.pathname.indexOf("topicinfo.html") != -1)
	{
		$scope.topicInfo = new Array();
		FindTopicInfo();
	}
	
	
	var dataObjects;
	var dataArray;
	
	$scope.login = function(form) {
		$scope.message = "Logging In...";
		Parse.User.logIn(form.username, form.password, {
			success: function(user) {
			  $log.log = "logged in successfully";
			  $scope.isLoggedIn = true;
			  location.replace("userinfo.html");
			},
			error: function(user, error) {
				$log.log = "fail " + error.toString();
				location.replace("index.html");
			// The login failed. Check error to see why.
			}
		});
	}
	
	var lessThan = null;
	var ageArr;
	var userCnt = 0;
	function FindAllUserInfo()
	{
		$log.log("FindAllUserInfo");
		 var query = new Parse.Query("PlayerInfo");
		 query.descending("updatedAt");
		 if(lessThan != null)
		 	query.lessThan("updatedAt", lessThan);
		 query.limit(1000);
		 $log.log("Find");
		 query.find({
				  success: function(objects) {
					$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						var age = objects[i].get("age");
						var gender = objects[i].get("gender");
						var _cnt = 0;
						console.log("gender: " + gender + " age: " + age);
						if(ageArr[age] != undefined)
						{
							_cnt = ageArr[age];
						}
						/*if(ageArr[age] == undefined)
						{
							ageArr[age] = userCnt;
							_cnt = userCnt;
							userCnt++;
							$scope.userInfo.push({age:age, female:0, male:0});
						}
						else
						{
							_cnt = ageArr[age];
						}*/
						
						if(gender == "female")
						{
							$scope.userInfo[_cnt].female++;
						}
						else
						{
							$scope.userInfo[_cnt].male++;
						}
			
						lessThan = objects[i].updatedAt;
					}
					
					if(objects.length == 0)
					{
						$scope.isSearch = true;
						$scope.$apply();
						$log.log("searchInfo = " + $scope.userInfo.length);
					}else
					{
						FindAllUserInfo();
					}
					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
	}
	
	function FindTopicInfo()
	{
		$log.log("FindTopicInfo");
		 var query = new Parse.Query("TopicData");
		 query.descending("updatedAt");
		 if(lessThan != null)
		 	query.lessThan("updatedAt", lessThan);
		 query.limit(1000);
		 $log.log("Find");
		 query.find({
				  success: function(objects) {
					
					if(objects.length > 0)
					{
						var str = objects[0].get("Topic");
						var topicStrArr = str.split(',');
						for(var i = 0; i < topicStrArr.length; i++)
						{
							var _detail = topicStrArr[i].split('=');
							$scope.topicInfo.push({topic:_detail[0], count:_detail[1]});
						}
					}
					
					
					$scope.isSearch = true;
					$scope.$apply();
					$log.log("searchInfo = " + $scope.topicInfo.length);
					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
	}
	
	$scope.logout = function() {
		Parse.User.logOut();
		location.replace("index.html");
		
	}

	$scope.gotoTopicInfo = function()
	{
		location.replace("topicinfo.html");
	}
	
	$scope.gotoUserInfo = function()
	{
		location.replace("userinfo.html");
	}
	
	
	
	
}

