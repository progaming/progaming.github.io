(function(){
	var app = angular.module('top', []);
	app.controller("topController", function($scope){
		
		var numberSessionPerPage = 10;
		var currentSessionBT = 1;
		var maxSessionPage = 1;
		var sessionArr;
		
		$scope.isShowTop = false;
		LoadCurrentSessionToShowWeek();
		
		function LoadCurrentSessionToShowWeek()
		{
			Parse.Cloud.run('getSession', {}, {
			  success: function(result) {
				console.log(result);
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
				console.log("Topweek Length: " + $scope.topWeekBT.length);
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
			console.log("session = " + session);
			session--;
			 var query = new Parse.Query("Score");
			 query.equalTo("Session", session);
			 query.descending("score");
			 query.find({
					  success: function(objects) {
						$scope.topWeekInfo = new Array();
						console.log("object = " + objects.length);
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
	});
})();