(function(){
	var app = angular.module('search', []);
	app.controller("searchController", function($scope){
		//set Start
		var searchCtrl = this;
		$scope.isSearch = false;
		searchCtrl.uidArr = new Array();
		searchCtrl.allUserInfoArr = new Array();
		searchCtrl.lessThan = null;
		searchCtrl.allUserCnt = 0;
		$scope.searchInfo = new Array();
		searchCtrl.userInfoArr = new Array();
		searchCtrl.userShowPerPage = 100;
		searchCtrl.vipIdArr = new Array();
		searchCtrl.isFindVip = false;
		var lessThan = null;
		//FindAllUser();
		LoadVipId();
		//------------
		
		function LoadVipId()
		{
			var query = new Parse.Query("VIP");
		 	query.descending("updatedAt");
		 	if(lessThan != null)
		 		query.lessThan("updatedAt", lessThan);
		 	query.limit(1000);
			query.find({
				  success: function(objects) {
					console.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						var _active = objects[i].get("active");
						var uid = objects[i].get("uid");
						if(objects[i].has("active") && _active == true)
						{
							if(objects[i].has("uid"))
							{
								//console.log("add id" + uid);
								searchCtrl.vipIdArr.push(uid);
							}
						}
						else
						{
							if(objects[i].has("EndDate"))
							{
								var _endDate = objects[i].get("EndDate");
								var _date = new Date();
								if( _endDate > _date )
								{
									//console.log("add id" + uid + " _date: " + _date.toString() + " _endDate: " + _endDate.toString());
									if(objects[i].has("uid"))
									{
										searchCtrl.vipIdArr.push(uid);
									}	
								}
								else
								{
									//console.log("don't add id" + uid + " _date: " + _date.toString() + " _endDate: " + _endDate.toString());
								}
							}
						}
						
						lessThan = objects[i].updatedAt;
					}
					
					if(objects.length == 0)
					{
						FindAllUser();
					}else
					{
						LoadVipId();
					}
					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
		}
		
		function FindAllUser(){
			console.log("FindAllUser");
		 	var query = new Parse.Query("UserInfo");
		 	query.descending("updatedAt");
		 	if(searchCtrl.lessThan != null)
		 		query.lessThan("updatedAt", searchCtrl.lessThan);
		 	query.limit(1000);
		 	query.find({
				  success: function(objects) {
					console.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						var _uid = objects[i].get("uid");
						if(searchCtrl.uidArr.indexOf(_uid) == -1)
						{
							searchCtrl.uidArr.push(_uid);
						}
						
						var _isVip = "No";
						if(searchCtrl.vipIdArr.indexOf(_uid) != -1)
						{
							_isVip = "Yes";
						}
						
						var createdtime = objects[i].createdAt;
						var createdtimeStr = GetTimeString(createdtime);
						var updatetime = objects[i].updatedAt;
						var updatetimeStr = GetTimeString(updatetime);
						
						searchCtrl.allUserInfoArr.push({firstname:objects[i].get("first_name"), 
						lastname:objects[i].get("last_name"), 
						email:objects[i].get("email"), 
						createdAt:createdtimeStr,
						updateAt:updatetimeStr,
						highscore: objects[i].get("highscore"),
						highscoreChar: objects[i].get("highscoreCharacter"),
						score: objects[i].get("score"),
						scoreChar: objects[i].get("scoreCharacter"),
						count: objects[i].get("count"),
						android: objects[i].get("Android"),
						ios: objects[i].get("iOS"),
						vip:_isVip});

						searchCtrl.userInfoArr.push(searchCtrl.allUserInfoArr[searchCtrl.allUserCnt]);
						if(searchCtrl.allUserCnt < searchCtrl.userShowPerPage)
						{
							$scope.searchInfo.push(searchCtrl.userInfoArr[searchCtrl.allUserCnt]);
						}
						searchCtrl.allUserCnt++;
						
						searchCtrl.lessThan = objects[i].updatedAt;
					}
					
					if(objects.length == 0)
					{
						
						SetPage();
						$scope.isSearch = true;
						$scope.$apply();
						console.log("searchInfo = " + searchCtrl.allUserInfoArr.length);
						
					}else
					{
						FindAllUser();
					}
					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
			
		};
		
		function SetPage()
		{
	
			$scope.userdataPageNum = new Array();
			if(searchCtrl.allUserInfoArr.length >= searchCtrl.userShowPerPage)
			{
				$scope.needMorePage = true;
				searchCtrl.topMaxPage = Math.floor((searchCtrl.allUserInfoArr.length/searchCtrl.userShowPerPage) +1);
				searchCtrl.topCurrentPage = 1;
				for(var j = 1; j <= searchCtrl.topMaxPage; j++)
				{
					$scope.userdataPageNum.push(j);
				}
			}
			else
			{
				$scope.needMorePage = false;
			}
	
		}
		
		this.ExportData = function()
		{
			alasql("SELECT * INTO CSV('AllUser.csv') FROM ?",[searchCtrl.allUserInfoArr]);
		}
		
		this.searchUser = function()
		{
			if( searchCtrl.isFindVip &&searchCtrl.vipIdArr.length == 0)
			{
				$scope.searchInfo = new Array();
				searchCtrl.userInfoArr = new Array();
				$scope.needMorePage = false;
				$scope.isSearch = true;
				$scope.$apply();
				return;
			}
			console.log("searchUser isFindVIP: " + searchCtrl.isFindVip);
			 var query1 = new Parse.Query("UserInfo");
			 query1.contains("first_name", $scope.textsearch);
			 
			 var query2 = new Parse.Query("UserInfo");
			 query2.contains("last_name", $scope.textsearch);
			 
			 var query3 = new Parse.Query("UserInfo");
			 query3.contains("email", $scope.textsearch);
			 
			if(searchCtrl.isFindVip)
			{
				query1.containedIn("uid", searchCtrl.vipIdArr);
				query2.containedIn("uid", searchCtrl.vipIdArr);
				query3.containedIn("uid", searchCtrl.vipIdArr);
			}
			 
			 var compoundQuery = Parse.Query.or(query1, query2, query3);
				  compoundQuery.find({
					  success: function(objects) {
						$scope.searchInfo = new Array();
						searchCtrl.userInfoArr = new Array();
						console.log("object = " + objects.length);
						for(var i = 0; i < objects.length; i++)
						{
							var _uid = objects[i].get("uid");
							var _isVip = "No";
							if(searchCtrl.vipIdArr.indexOf(_uid) != -1)
							{
								_isVip = "Yes";
							}
							
							var createdtime = objects[i].createdAt;
							var createdtimeStr = GetTimeString(createdtime);
							var updatetime = objects[i].updatedAt;
							var updatetimeStr = GetTimeString(updatetime);
							
							searchCtrl.userInfoArr.push({firstname:objects[i].get("first_name"), 
							lastname:objects[i].get("last_name"), 
							email:objects[i].get("email"), 
							createdAt:createdtimeStr,
							updateAt:updatetimeStr,
							highscore: objects[i].get("highscore"),
							highscoreChar: objects[i].get("highscoreCharacter"),
							score: objects[i].get("score"),
							scoreChar: objects[i].get("scoreCharacter"),
							count: objects[i].get("count"),
							android: objects[i].get("Android"),
							ios: objects[i].get("iOS"),
							vip:_isVip});
							if(i < searchCtrl.userShowPerPage)
							{
								$scope.searchInfo.push(searchCtrl.userInfoArr[i]);
							}
						}
						$scope.userdataPageNum = new Array();
						if(objects.length >= searchCtrl.userShowPerPage)
						{
							$scope.needMorePage = true;
							searchCtrl.topMaxPage = (objects.length/searchCtrl.userShowPerPage) +1;
							searchCtrl.topCurrentPage = 1;
							for(var j = 1; j <= searchCtrl.topMaxPage; j++)
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
						console.log("searchInfo = " + $scope.searchInfo.length);
					  },
					  error: function(error) {
						$scope.message = "Can't search User.";
					  }
				  });
		}
	
		this.gotoPage = function(x){
			var lastPage = (x-1) * searchCtrl.userShowPerPage;
			var nextPage = (x)* searchCtrl.userShowPerPage;
			$scope.searchInfo = new Array();
			for(var i = lastPage; i < nextPage; i++)
			{
				if(searchCtrl.userInfoArr.length > i)
				{
					$scope.searchInfo.push(searchCtrl.userInfoArr[i]);
				}
			}
	
			$scope.isSearch = true;
			if(!$scope.$$phase) {
	         	$scope.$apply();
	   		}
			
		}
	});
	
	function GetTimeString(_time)
	{
		return _time.getDate() + "/" + (_time.getMonth()+1) + "/" + 
			   _time.getFullYear() +" " + 
			   SetIntToString(_time.getHours()) + ":" + 
			   SetIntToString(_time.getMinutes()) + ":" + 
			   SetIntToString(_time.getSeconds());
	}
	
	function SetIntToString(i)
	{
		var str = ""
		if(i > 9)
			str = "" + i;
		else
			str = "0" + i;
		return str;
	}
	
})();