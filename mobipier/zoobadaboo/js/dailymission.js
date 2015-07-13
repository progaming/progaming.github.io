(function(){
	var app = angular.module('dailymission', []);
	app.controller("dailymissionController", function($scope){
		var dailyMissionObjects;
		loadDailyMission();
		
		function loadDailyMission() {
			console.log("loadDailyMission");
			dailyMissionObjects = new Array();
			var query = new Parse.Query("DailyMission");
				  query.find({
					  success: function(objects) {
					  	for(var i = 0; i < objects.length; i++)
					  	{
							dailyMissionObjects.push(objects[i]);
							document.getElementById("dmc" + (i+1)).value = objects[i].get("Condition");
							document.getElementById("dmt" + (i+1)).value = objects[i].get("Target");
							document.getElementById("dmr" + (i+1)).value = objects[i].get("Reward");
							document.getElementById("dma" + (i+1)).value = objects[i].get("RewardAmount");
							
						}
						if(objects.length < 6)
						{
							var blankParseObj = Parse.Object.extend("DailyMission");
							for(var i = objects.length; i < 6; i++)
							{
								var parseObj = new blankParseObj();
								dailyMissionObjects.push(parseObj);
							}
						}
						$scope.UpdateDM();
						$scope.$apply()
					  },
					  error: function(error) {
						$scope.message = "Can't Load DailyMission";
					  }
				  });
	
		}
	
		$scope.UpdateDM = function()
		{
			console.log("UpdateDM");
			for(var num = 1; num <= 6; num++)
			{
				var conditionStr = document.getElementById("dmc" + num).value;
				console.log("num: " + num + " conditionStr: " + conditionStr);
				if(conditionStr.toLowerCase() == "levelup" || 
					conditionStr.toLowerCase() == "overtake" ||
					conditionStr == "")
				{
					if(num == 1)
						$scope.dmt1 = true;
					else if(num == 2)
						$scope.dmt2 = true;
					else if(num == 3)
						$scope.dmt3 = true;
					else if(num == 4)
						$scope.dmt4 = true;
					else if(num == 5)
						$scope.dmt5 = true;
					else if(num == 6)
						$scope.dmt6 = true;
				}
				else
				{
					if(num == 1)
						$scope.dmt1 = false;
					else if(num == 2)
						$scope.dmt2 = false;
					else if(num == 3)
						$scope.dmt3 = false;
					else if(num == 4)
						$scope.dmt4 = false;
					else if(num == 5)
						$scope.dmt5 = false;
					else if(num == 6)
						$scope.dmt6 = false;
				}
			}
	
		}
	
		$scope.uploaddmbutton = function() {
			$scope.buttonDMSaveDisabled = true;
			console.log("dailyMissionObjects.length = " + dailyMissionObjects.length)
			for(var i = 0; i < dailyMissionObjects.length; i ++)
			{
				console.log("i: " + i);
				dailyMissionObjects[i].set("Condition", document.getElementById("dmc" + (i+1)).value);
				if(document.getElementById("dmt" + (i+1)).value == "")
				{
					document.getElementById("dmt" + (i+1)).value = 0;
				}
				dailyMissionObjects[i].set("Target", parseInt(document.getElementById("dmt" + (i+1)).value));
				if(document.getElementById("dma" + (i+1)).value == "" || document.getElementById("dma" + (i+1)).value == null)
				{
					document.getElementById("dma" + (i+1)).value = 0;
				}
				dailyMissionObjects[i].set("Reward", document.getElementById("dmr" + (i+1)).value);
				dailyMissionObjects[i].set("RewardAmount", parseInt(document.getElementById("dma" + (i+1)).value));
				console.log(dailyMissionObjects[i]);
				/*dailyMissionObjects[i].save().then(function(newsObj) {
						
										
					}, function(error) {
						$scope.meesage = "DMObject could not be saved to parse";
					});*/
			}
			console.log("Save All");
			Parse.Object.saveAll(dailyMissionObjects, {
		        success: function(objs) {
		        	console.log("finished");
		            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
		            $scope.message = "Finished Update Alldata";
		            $scope.buttonDMSaveDisabled = false;
		            location.reload();
		            //$scope.apply();
		        },
		        error: function(error) { 
		            // an error occurred...
		            console.log("DailyMission SaveAll Error: ");
		            console.log(error)
		        }
	    	});
		}
	
		//-----------------------------
	});
})();