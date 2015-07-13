(function(){
	var app = angular.module('periodmission', []);
	app.controller("periodmissionController", function($scope){
		//------- PeriodMission --------
		var periodMissionObjects;
		loadPeriodMission();
		
		function loadPeriodMission() {
			console.log("loadPeriodMission");
			periodMissionObjects = new Array();
			var query = new Parse.Query("PeriodMission");
				  query.find({
					  success: function(objects) {
					  	for(var i = 0; i < objects.length; i++)
					  	{
							periodMissionObjects.push(objects[i]);
							document.getElementById("pmc" + (i+1)).value = objects[i].get("Condition");
							document.getElementById("pmt" + (i+1)).value = objects[i].get("Target");
							document.getElementById("pmr" + (i+1)).value = objects[i].get("Reward");
							document.getElementById("pma" + (i+1)).value = objects[i].get("RewardAmount");
							globalDatepickerData['sdt'+ (i+2)] = objects[i].get("StartTime");
							globalDatepickerData['edt' + (i+2)] = objects[i].get("EndTime");
						}
						if(objects.length < 6)
						{
							var blankParseObj = Parse.Object.extend("PeriodMission");
							for(var i = objects.length; i < 6; i++)
							{
								var parseObj = new blankParseObj();
								periodMissionObjects.push(parseObj);
							}
						}
						$scope.$broadcast('setDatepicker');
						$scope.UpdatePM();
						$scope.$apply()
					  },
					  error: function(error) {
						$scope.message = "Can't Load PeriodMission";
					  }
				  });
	
		}
	
		$scope.UpdatePM = function()
		{
			console.log("UpdatePM");
			for(var num = 1; num <= 6; num++)
			{
				var conditionStr = document.getElementById("pmc" + num).value;
				console.log("num: " + num + " conditionStr: " + conditionStr);
				if(conditionStr.toLowerCase() == "levelup" || 
					conditionStr.toLowerCase() == "overtake" ||
					conditionStr == "")
				{
					if(num == 1)
						$scope.pmt1 = true;
					else if(num == 2)
						$scope.pmt2 = true;
					else if(num == 3)
						$scope.pmt3 = true;
					else if(num == 4)
						$scope.pmt4 = true;
					else if(num == 5)
						$scope.pmt5 = true;
					else if(num == 6)
						$scope.pmt6 = true;
				}
				else
				{
					if(num == 1)
						$scope.pmt1 = false;
					else if(num == 2)
						$scope.pmt2 = false;
					else if(num == 3)
						$scope.pmt3 = false;
					else if(num == 4)
						$scope.pmt4 = false;
					else if(num == 5)
						$scope.pmt5 = false;
					else if(num == 6)
						$scope.pmt6 = false;
				}
			}
	
		}

		$scope.uploadpmbutton = function() {
			$scope.buttonPMSaveDisabled = true;
			console.log("periodMissionObjects.length = " + periodMissionObjects.length)
			for(var i = 0; i < periodMissionObjects.length; i ++)
			{
				console.log("i: " + i);
				periodMissionObjects[i].set("Condition", document.getElementById("pmc" + (i+1)).value);
				if(document.getElementById("pmt" + (i+1)).value == "")
				{
					document.getElementById("pmt" + (i+1)).value = 0;
				}
				periodMissionObjects[i].set("Target", parseInt(document.getElementById("pmt" + (i+1)).value));
				periodMissionObjects[i].set("Reward", document.getElementById("pmr" + (i+1)).value);
				if(document.getElementById("pma" + (i+1)).value == "" || document.getElementById("pma" + (i+1)).value == null)
				{
					document.getElementById("pma" + (i+1)).value = 0;
				}
				periodMissionObjects[i].set("RewardAmount", parseInt(document.getElementById("pma" + (i+1)).value));
				periodMissionObjects[i].set("StartTime", globalDatepickerData['sdt' + (i+2)]);
				periodMissionObjects[i].set("EndTime", globalDatepickerData['edt' + (i+2)]);
				console.log(periodMissionObjects[i]);
				/*dailyMissionObjects[i].save().then(function(newsObj) {
						
										
					}, function(error) {
						$scope.meesage = "DMObject could not be saved to parse";
					});*/
			}
			console.log("Save All");
			Parse.Object.saveAll(periodMissionObjects, {
		        success: function(objs) {
		        	console.log("finished");
		            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
		            $scope.message = "Finished Update Alldata";
		            $scope.buttonPMSaveDisabled = false;
		            location.reload();
		            //$scope.apply();
		        },
		        error: function(error) { 
		            // an error occurred...
		            console.log("PeriodMission SaveAll Error: ");
		            console.log(error)
		        }
	    	});
		}
	
		//-----------------------------
		
		var globalDatepickerData = [{'sdt1':null}, {'edt1':null}, 
									{'sdt2': null}, {'edt2':null},
									{'sdt3': null}, {'edt3':null},
									{'sdt4': null}, {'edt4':null},
									{'sdt5': null}, {'edt5':null},
									{'sdt6': null}, {'edt6':null},
									{'sdt7': null}, {'edt7':null}];
		
		$scope.datepickerBool = {
				opened1: false,
				opened2: false,
				opened3: false,
				opened4: false,
				opened5: false,
				opened6: false,
				opened7: false,
				opened8: false,
				opened9: false,
				opened10: false,
				opened11: false,
				opened12: false,
				opened13: false,
				opened14: false
		}
		
		$scope.datepickerData = {
				sdt1: null,
				edt1: null,
				sdt2: null,
				edt2: null,
				sdt3: null,
				edt3: null,
				sdt4: null,
				edt4: null,
				sdt5: null,
				edt5: null,
				sdt6: null,
				edt6: null,
				sdt7: null,
				edt7: null
		}
		
		$scope.minDateData  = {
				sdt1: null,
				edt1: null,
				sdt2: null,
				edt2: null,
				sdt3: null,
				edt3: null,
				sdt4: null,
				edt4: null,
				sdt5: null,
				edt5: null,
				sdt6: null,
				edt6: null,
				sdt7: null,
				edt7: null
		}
		
		$scope.today = function() {
		
		    //$scope.datepickerData['sdt1'] = new Date();
		    //globalDatepickerData['sdt1'] =  $scope.datepickerData['sdt1'];
		    //$scope.datepickerData['edt1'] = new Date();
		    //globalDatepickerData['edt1'] =  $scope.datepickerData['edt1'];
		};
		$scope.today();
		
		$scope.$on('setDatepicker', function(event) {
				console.log("setDatepicker: " + globalDatepickerData['sdt1']);
		  		$scope.datepickerData['sdt1'] =  globalDatepickerData['sdt1'];
		  		$scope.datepickerData['edt1'] = globalDatepickerData['edt1'];
		  		$scope.datepickerData['sdt2'] =  globalDatepickerData['sdt2'];
		  		$scope.datepickerData['edt2'] = globalDatepickerData['edt2'];
		  		$scope.datepickerData['sdt3'] =  globalDatepickerData['sdt3'];
		  		$scope.datepickerData['edt3'] = globalDatepickerData['edt3'];
		  		$scope.datepickerData['sdt4'] =  globalDatepickerData['sdt4'];
		  		$scope.datepickerData['edt4'] = globalDatepickerData['edt4'];
		  		$scope.datepickerData['sdt5'] =  globalDatepickerData['sdt5'];
		  		$scope.datepickerData['edt5'] = globalDatepickerData['edt5'];
		  		$scope.datepickerData['sdt6'] =  globalDatepickerData['sdt6'];
		  		$scope.datepickerData['edt6'] = globalDatepickerData['edt6'];
		  		$scope.datepickerData['sdt7'] =  globalDatepickerData['sdt7'];
		  		$scope.datepickerData['edt7'] = globalDatepickerData['edt7'];
		});
		
		$scope.clear = function () {
		     //$scope.datepickerData['sdt1'] = null;
		};
		
		$scope.changeDatePick = function(which){
		
			globalDatepickerData[which] = $scope.datepickerData[which];
		  	$scope.minDateData[which] = $scope.datepickerData[which];
		  	
		}
		
		// Disable weekend selection
		$scope.disabled = function(date, mode) {
		    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		};
		
		$scope.toggleMin = function() {
		    $scope.minDate1 = $scope.minDate1 ? null : new Date();
		};
		$scope.toggleMin();
		
		$scope.open = function($event, which) {
		    $event.preventDefault();
		    $event.stopPropagation();
		
		    $scope.datepickerBool[which] = true;
		};
		
		$scope.dateOptions = {
		    formatYear: 'yy',
		    startingDay: 1
		};
		
		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		
	});
})();