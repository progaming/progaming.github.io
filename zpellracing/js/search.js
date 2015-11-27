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
		searchCtrl.total = 0;
		var lessThan = null;
		var isNeedAllUser = false;
		//FindAllUser();
		GetCount();
		//------------
		
		function GetCount()
		{
			var Score = Parse.Object.extend("Score");
			var query = new Parse.Query(Score);
			query.count({
			success: function(count) {
				// The count request succeeded. Show the count
				//alert("Sean has played " + count + " games");
				searchCtrl.total = count;
				FindAllUser();
			},
			error: function(error) {
				// The request failed
			}
			});
		}
		
		function FindAllUser(){
			console.log("FindAllUser");
		 	var query = new Parse.Query("Score");
		 	query.descending("updatedAt");
		 	if(searchCtrl.lessThan != null)
		 		query.lessThan("updatedAt", searchCtrl.lessThan);
			query.descending("score");
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
						
						var createdtime = objects[i].createdAt;
						var createdtimeStr = GetTimeString(createdtime);
						var updatetime = objects[i].updatedAt;
						var updatetimeStr = GetTimeString(updatetime);
						
						searchCtrl.allUserInfoArr.push({firstname:objects[i].get("first_name"), 
						lastname:objects[i].get("last_name"), 
						createdAt:createdtimeStr,
						updateAt:updatetimeStr,
						score: objects[i].get("score"),
						uid:objects[i].get("uid")});

						searchCtrl.userInfoArr.push(searchCtrl.allUserInfoArr[searchCtrl.allUserCnt]);
						if(searchCtrl.allUserCnt < searchCtrl.userShowPerPage)
						{
							$scope.searchInfo.push(searchCtrl.userInfoArr[searchCtrl.allUserCnt]);
						}
						searchCtrl.allUserCnt++;
						
						searchCtrl.lessThan = objects[i].updatedAt;
					}
					
					if(objects.length == 0 || !isNeedAllUser)
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
				for(var j = 1; j < searchCtrl.topMaxPage; j++)
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
			 var query1 = new Parse.Query("Score");
			 query1.contains("first_name", $scope.textsearch);
			 
			 var query2 = new Parse.Query("Score");
			 query2.contains("last_name", $scope.textsearch);
			 
			 var query3 = new Parse.Query("Score");
			 query3.contains("email", $scope.textsearch);
			 
			 var compoundQuery = Parse.Query.or(query1, query2, query3);
				  compoundQuery.find({
					  success: function(objects) {
						$scope.searchInfo = new Array();
						searchCtrl.userInfoArr = new Array();
						console.log("object = " + objects.length);
						for(var i = 0; i < objects.length; i++)
						{
							var _uid = objects[i].get("uid");
							
							var createdtime = objects[i].createdAt;
							var createdtimeStr = GetTimeString(createdtime);
							var updatetime = objects[i].updatedAt;
							var updatetimeStr = GetTimeString(updatetime);
							
							searchCtrl.userInfoArr.push({firstname:objects[i].get("first_name"), 
							lastname:objects[i].get("last_name"), 
							createdAt:createdtimeStr,
							updateAt:updatetimeStr,
							score: objects[i].get("score"),
							uid:objects[i].get("uid")});
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