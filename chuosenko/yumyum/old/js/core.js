var testloginsite = angular.module('testloginsite', []);
var isLoadNews = false;
function mainController($scope, $http, $log) {
	$http.get("http://www.w3schools.com/website/Customers_JSON.php")
	.success(function(response) {$scope.names = response;});
	$scope.message = "start";
	Parse.initialize("1TUti2l1f6Po2jWrbLP0oSMgD3HSFR7rB9w7pZ4X", "HAH1henyq4o0tSLonOEjwKzMbdeTtxpPZsaykZYt");
	
	if(Parse.User.current()){
		$scope.message = "logged in";
		$scope.isLoggedIn = true;
		$scope.buttonSaveDisabled = false;
		$log.log("PathName: " + location.pathname);
		if(location.pathname.indexOf("index.html") != -1 || location.pathname == "/mobipier/")
		{
			location.replace("news.html");
		}
		if(!isLoadNews )
		{
			loadnews();
		}
		if(location.pathname.indexOf("search.html") != -1)
		{
			FindAllUser();
		}
		$log.log("buttonSaveDisabled = " + $scope.buttonSaveDisabled);
	}else{
		$scope.message = "not logged in";
		$scope.isLoggedIn = false;
		if(location.pathname.indexOf("index.html") == -1 && location.pathname != "/mobipier/")
		{
			location.replace("index.html");
		}
	}
	
	if(location.pathname.indexOf("search.html") != -1)
	{
		$scope.isSearch = false;
	}
	else if(location.pathname.indexOf("top.html") != -1)
	{
		$scope.isShowTop = false;
		LoadCurrentSessionToShowWeek();
	}
	
	var newsObject;
	var newsImg;
	var file;
	
	$scope.login = function(form) {
		$scope.message = "Logging In...";
		Parse.User.logIn(form.username, form.password, {
			success: function(user) {
			  $scope.message = "logged in successfully";
			  $scope.isLoggedIn = true;
			  location.replace("news.html");
			  // Do stuff after successful login.
			  var query = new Parse.Query("News");
			  query.first({
				  success: function(object) {
					newsObject = object;
					$scope.message = newsObject.get("image").url;
					
					$scope.imgurl = newsObject.get("image").url;
					location.replace("news.html");
				  },
				  error: function(error) {
					$scope.message = "Can't Load News";
					location.replace("news.html");
				  }
			  });
			
			},
			error: function(user, error) {
				$scope.message = "fail " + error.toString();
				location.replace("index.html");
			// The login failed. Check error to see why.
			}
		});
	}
	
	function loadnews() {
		isLoadNews = true;
		$log.log("loadnews");
		 var query = new Parse.Query("News");
			  query.first({
				  success: function(object) {
					newsObject = object;
					$scope.newstext = newsObject.get("text");
					var imgobj = angular.fromJson(newsObject.get("image"));
					$scope.imgurl = imgobj._url;
					$log.log("loadfinish");
					$scope.$apply()
				  },
				  error: function(error) {
					$scope.message = "Can't Load News";
				  }
			  });

	}
	
	$scope.logout = function() {
		Parse.User.logOut();
		location.replace("index.html");
		
	}
	
	// Set an event listener on the Choose File field.
    $('#fileselect').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];
    });
	
    $scope.uploadbutton = function() {
		$scope.buttonSaveDisabled = true;
		if(file == null)
		{
			var _textNews = document.getElementById("textNewsArea").value;
			 var query = new Parse.Query("News");
			  query.first({
				  success: function(object) {
					newsObject = object;
					newsObject.set("text", _textNews);
					newsObject.save().then(function(newsObj) {
							alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
							newsObject = newsObj;
							$scope.message = "Finished Update Alldata";
							$scope.buttonSaveDisabled = false;
							location.reload();
							
				  }, function(error) {
						$scope.meesage = "NewsObject could not be saved to parse";
				  });
					
				  },
				  error: function(error) {
					$scope.message = "Can't Load News";
				  }
			  });
		}
		else
		{
			var parseFile = new Parse.File(file.name, file);
			parseFile.save().then(function() {
			  // The file has been saved to Parse.
			  $scope.message = "File has been saved to Parse";
			  newsObject.set("text", $scope.newstext);
			  newsObject.set("image", parseFile);
			  newsObject.save().then(function(newsObj) {
							alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
							newsObject = newsObj;
							$scope.message = "Finished Update Alldata";
							$scope.newstext = newsObject.get("text");
							var img = newsObject.get("image");
							$scope.imgurl = img.url;
							$scope.buttonSaveDisabled = false;
							location.reload();
							
			  }, function(error) {
					$scope.meesage = "NewsObject could not be saved to parse";
			  });
			}, function(error) {
				$scope.meesage = "File could not be saved to parse";
			  // The file either could not be read, or could not be saved to Parse.
			});
		}
		
		
    }
	
	$scope.gotouserpage = function()
	{
		location.replace("search.html");
	}
	$scope.gotoNews = function()
	{
		location.replace("news.html");
	}
	$scope.gotoTopPage = function()
	{
		location.replace("top.html");
	}
	
	var userInfoArr;
	var topCurrentPage = 1;
	var topMaxPage = 1;
	var userShowPerPage = 10;
	function FindAllUser()
	{
		$log.log("FindAllUser");
		 var query = new Parse.Query("UserInfo");
		 query.find({
				  success: function(objects) {
					$scope.searchInfo = new Array();
					userInfoArr = new Array();
					$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						$log.log(""+objects[i].get("first_name"));
						userInfoArr.push({firstname:objects[i].get("first_name"), 
						lastname:objects[i].get("last_name"), 
						email:objects[i].get("email")});
						if(i < userShowPerPage)
						{
							$scope.searchInfo.push({firstname:objects[i].get("first_name"), 
							lastname:objects[i].get("last_name"), 
							email:objects[i].get("email")});
						}
					}
					$scope.userdataPageNum = new Array();
					if(objects.length >= userShowPerPage)
					{
						$scope.needMorePage = true;
						topMaxPage = parseInt((objects.length/userShowPerPage) +1);
						topCurrentPage = 1;
						for(var j = 1; j <= topMaxPage; j++)
						{
							$scope.userdataPageNum.push(j);
						}
					}
					else
					{
						$scope.needMorePage = false;
					}
					$scope.isSearch = true;
					$scope.$apply();
					$log.log("searchInfo = " + $scope.searchInfo.length);
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
	}
	
	$scope.searchUser = function()
	{
		 var query1 = new Parse.Query("UserInfo");
		 query1.contains("first_name", $scope.textsearch);
		 
		 var query2 = new Parse.Query("UserInfo");
		 query2.contains("last_name", $scope.textsearch);
		 
		 var query3 = new Parse.Query("UserInfo");
		 query3.contains("email", $scope.textsearch);
		 
		 var compoundQuery = Parse.Query.or(query1, query2, query3);
			  compoundQuery.find({
				  success: function(objects) {
					$scope.searchInfo = new Array();
					$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						userInfoArr.push({firstname:objects[i].get("first_name"), 
						lastname:objects[i].get("last_name"), 
						email:objects[i].get("email")});
						if(i < userShowPerPage)
						{
							$scope.searchInfo.push({firstname:objects[i].get("first_name"), 
							lastname:objects[i].get("last_name"), 
							email:objects[i].get("email")});
						}
					}
					$scope.userdataPageNum = new Array();
					if(objects.length >= userShowPerPage)
					{
						$scope.needMorePage = true;
						topMaxPage = (objects.length/userShowPerPage) +1;
						topCurrentPage = 1;
						for(var j = 1; j <= topMaxPage; j++)
						{
							$scope.userdataPageNum.push(j);
						}
					}
					else
					{
						$scope.needMorePage = false;
					}
					$scope.isSearch = true;
					$scope.$apply();
					$log.log("searchInfo = " + $scope.searchInfo.length);
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
	}
	
	$scope.gotoPage = function(x){
		var lastPage = (x-1) * userShowPerPage;
		var nextPage = (x)*userShowPerPage;
		$scope.searchInfo = new Array();
		for(var i = lastPage; i < nextPage; i++)
		{
			$scope.searchInfo.push(userInfoArr[i]);
		}

		$scope.isSearch = true;
		$scope.$apply();
		
	}
	
	var numberSessionPerPage = 10;
	var currentSessionBT = 1;
	var maxSessionPage = 1;
	var sessionArr;
	function LoadCurrentSessionToShowWeek()
	{
		Parse.Cloud.run('getSession', {}, {
		  success: function(result) {
			$log.log(result);
			var session = parseInt(result);
			$scope.topWeekBT = new Array();
			sessionArr = new Array();
			for(var i = session; i > 0; i--)
			{
				sessionArr.push(i);
				if(session >= numberSessionPerPage)
				{
					if((i) > numberSessionPerPage)
					{
						$scope.topWeekBT.push(i);
					}
				}
				else
				{
					$scope.topWeekBT.push(i);
				}
			}
			if(session >= numberSessionPerPage)
			{
				currentSessionBT = 1;
				maxSessionPage = parseInt((session/numberSessionPerPage) +1);
				$scope.isShowPrevTopWeek = true;
			}
			else
			{
				$scope.isShowPrevTopWeek = false;
			}
			$scope.isShowNextTopWeek = false;
			$log.log("Topweek Length: " + $scope.topWeekBT.length);
			$scope.isShowTop = true;
			$scope.$apply();
			$scope.gotoWeek(session);
		  },
		  error: function(error) {
		  }
		});
	}
	
	$scope.nextTopWeekBT = function()
	{
		currentSessionBT--;
		var lastPage = (currentSessionBT-1) * numberSessionPerPage;
		var nextPage = (currentSessionBT) * numberSessionPerPage;
		if(lastPage < 0)
		{
			lastPage = 0;
		}
		$scope.topWeekBT = new Array();
		for(var i = lastPage; i < nextPage; i++)
		{
			if( i < sessionArr.length)
			{
				$scope.topWeekBT.push(sessionArr[i]);
			}
		}
		
		CheckTopWeekBT();
		
		if(!$scope.$$phase) {
         	$scope.$apply();
   		}
	}
	
	function CheckTopWeekBT()
	{
		
		if(currentSessionBT == 1)
		{
			$scope.isShowNextTopWeek = false;
		}
		else
		{
			$scope.isShowNextTopWeek = true;
		}
		
		if(currentSessionBT == maxSessionPage)
		{
			$scope.isShowPrevTopWeek = false;
		}
		else
		{
			$scope.isShowPrevTopWeek = true;
		}
		
	}
	
	$scope.prevTopWeekBT = function()
	{
		currentSessionBT++;
		var lastPage = (currentSessionBT-1) * numberSessionPerPage;
		var nextPage = (currentSessionBT) * numberSessionPerPage;
		if(lastPage == 0)
		{
			lastPage = 0;
		}
		$scope.topWeekBT = new Array();
		for(var i = lastPage; i < nextPage; i++)
		{
			if( i < sessionArr.length)
			{
				$scope.topWeekBT.push(sessionArr[i]);
			}
		}
		
		CheckTopWeekBT();
		
		
		if(!$scope.$$phase) {
         	$scope.$apply();
   		}
	}
	
	$scope.gotoWeek = function(session)
	{
		$scope.isShowTopWeek = false;
		$scope.$apply();
		$log.log("session = " + session);
		session--;
		 var query = new Parse.Query("Score");
		 query.equalTo("Session", session);
		 query.descending("score");
		 query.find({
				  success: function(objects) {
					$scope.topWeekInfo = new Array();
					$log.log("object = " + objects.length);
					if(objects.length == 0)
					{
						$scope.topWeekInfo.push({firstname:'No Data', 
						lastname:'', 
						score:'0'})	
					}
					for(var i = 0; i < objects.length; i++)
					{
						if(i > 4)
							break;
						$scope.topWeekInfo.push({firstname:objects[i].get("first_name"), 
							lastname:objects[i].get("last_name"), 
							score:objects[i].get("score")});
					}
					
					$scope.isShowTopWeek = true;
					$scope.$apply();
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
		});
		 
	}
	
}