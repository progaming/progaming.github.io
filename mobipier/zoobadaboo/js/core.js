var testloginsite = angular.module('testloginsite', ['ui.bootstrap', 'navbar', 
													 'search', 'news', 'top']);
function mainController($scope, $http, $log) {
	$scope.message = "start";
	var _0xae5b=["\x35\x51\x33\x76\x74\x50\x49\x5A\x6C\x4C\x55\x45\x32\x4B\x6B\x41\x34\x4D\x66\x69\x6A\x4C\x31\x38\x72\x57\x61\x6F\x39\x77\x4E\x47\x48\x69\x54\x45\x72\x4F\x49\x6E","\x6B\x57\x52\x72\x53\x41\x49\x4C\x5A\x41\x61\x55\x32\x7A\x33\x6D\x72\x71\x35\x79\x41\x6B\x45\x42\x4E\x55\x4D\x4C\x6D\x32\x68\x4F\x4C\x36\x4A\x4D\x32\x53\x30\x78","\x69\x6E\x69\x74\x69\x61\x6C\x69\x7A\x65"];Parse[_0xae5b[2]](_0xae5b[0],_0xae5b[1]);
	
	if(Parse.User.current()){
		$scope.message = "logged in";
		$scope.isLoggedIn = true;
		$scope.buttonSaveDisabled = false;
		$log.log("PathName: " + location.pathname);
		if(location.pathname.indexOf("index.html") != -1 || location.pathname == "/mobipier/zoobadaboo/")
		{
			location.replace("news.html");
		}
		if( location.pathname.indexOf("duplicate.html") != -1 )
		{
			//-- FindAllSave --
			dupUIdArr = new Array();
			$scope.dupUIdArr = new Array();
			allUserInfoArr = new Array();
			lessThan = null;
			allUserCnt = 0;
			$scope.searchInfo = new Array();
			userInfoArr = new Array();
			FindAllSave();
			//-----------------
		}
		
		$log.log("buttonSaveDisabled = " + $scope.buttonSaveDisabled);
	}else{
		$scope.message = "not logged in";
		$scope.isLoggedIn = false;
		if(location.pathname.indexOf("index.html") == -1 && location.pathname != "/mobipier/zoobadaboo/")
		{
			location.replace("index.html");
		}
	}
	
	if(location.pathname.indexOf("purchasehistory.html") != -1)
	{
		$scope.isShowPurchasedInfo = false;
		phCurrentPage = 0;
		phGreaterThen = null;
		phUserCnt = 0;
		phArr = new Array();
		$scope.purchasedHistoryInfo = new Array();
		LoadPurchasedHistory();
	}
	else if(location.pathname.indexOf("dailymission.html") != -1)
	{
		loadDailyMission();
	}
	else if(location.pathname.indexOf("periodmission.html") != -1)
	{
		loadPeriodMission();
	}
	else if(location.pathname.indexOf("setting.html") != -1)
	{
		loadShowBTVIP();
	}
	
	
	
	$scope.login = function(form) {
		$scope.message = "Logging In...";
		Parse.User.logIn(form.username, form.password, {
			success: function(user) {
			  $scope.message = "logged in successfully";
			  $scope.isLoggedIn = true;
			  location.replace("news.html");
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
	
	var allUserInfoArr;
	var userInfoArr;

	//--------- PurchasedHistory

	var phCurrentPage = 1;
	var phMaxPage = 1;
	var phShowPerPage = 100;
	var phGreaterThen = null;
	var phUserCnt = 0;
	var phArr = new Array();
  	function LoadPurchasedHistory()
	{
		var query = new Parse.Query("PurchasedHistory");
		query.limit(1000);
		query.descending("createdAt");
		if(phGreaterThen != null)
		 	query.lessThan("createdAt", phGreaterThen);
		query.find({
			success: function(objects) {
				
				$log.log("object = " + objects.length);
				if(objects.length == 0)
				{
						$scope.purchasedHistoryInfo.push({uid:'No Data', 
						lastruby:'0', 
						buyruby:'0',
						time:'0'})	
				}
				for(var i = 0; i < objects.length; i++)
				{
					var purchasedTime = objects[i].get("PurchaseTime");
					var purchasedTimeStr = purchasedTime.getDate() + "/" + (purchasedTime.getMonth() + 1) + "/" + purchasedTime.getFullYear() +" " + SetIntToString(purchasedTime.getHours()) + ":" + SetIntToString(purchasedTime.getMinutes()) + ":" + SetIntToString(purchasedTime.getSeconds());
					phArr.push({uid:objects[i].get("uid"), 
						lastruby:objects[i].get("lastRuby"),
						buyruby:objects[i].get("buyRuby"), 
						time:purchasedTimeStr});
					if(phUserCnt < phShowPerPage)
					{
						$scope.purchasedHistoryInfo.push(phArr[phUserCnt]);
					}
					

					phGreaterThen = objects[i].createdAt;
					phUserCnt++;
				}

					if(objects.length == 0)
					{
						SetPHPage();
						$scope.isShowPurchasedInfo = true;
						$scope.$apply();
					}else
					{
						LoadPurchasedHistory();
					}
			},
			error: function(error) {
				$scope.message = "Can't search User.";
			}
		});
	}

	function SetPHPage()
	{

		$scope.userdataPageNum = new Array();
		if(phArr.length >= phShowPerPage)
		{
			$scope.needMorePage = true;
			phMaxPage = Math.floor((phArr.length/phShowPerPage) +1);
			phCurrentPage = 1;
			for(var j = 1; j <= phMaxPage; j++)
			{
				$scope.userdataPageNum.push(j);
			}
		}
		else
		{
			$scope.needMorePage = false;
		}

	}

	$scope.gotoPHPage = function(x){
		var lastPage = (x-1) * phShowPerPage;
		var nextPage = (x)*phShowPerPage;
		$scope.purchasedHistoryInfo = new Array();
		for(var i = lastPage; i < nextPage; i++)
		{
			if(phArr.length > i)
			{
				$scope.purchasedHistoryInfo.push(phArr[i]);
			}
		}

		$scope.isShowPurchasedInfo = true;
		if(!$scope.$$phase) {
         	$scope.$apply();
   		}
		
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
	//-----------------------------
	//------- DailyMission --------
	var dailyMissionObjects;
	function loadDailyMission() {
		$log.log("loadDailyMission");
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
		$log.log("UpdateDM");
		for(var num = 1; num <= 6; num++)
		{
			var conditionStr = document.getElementById("dmc" + num).value;
			$log.log("num: " + num + " conditionStr: " + conditionStr);
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
		$log.log("dailyMissionObjects.length = " + dailyMissionObjects.length)
		for(var i = 0; i < dailyMissionObjects.length; i ++)
		{
			$log.log("i: " + i);
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
			$log.log(dailyMissionObjects[i]);
			/*dailyMissionObjects[i].save().then(function(newsObj) {
					
									
				}, function(error) {
					$scope.meesage = "DMObject could not be saved to parse";
				});*/
		}
		$log.log("Save All");
		Parse.Object.saveAll(dailyMissionObjects, {
	        success: function(objs) {
	        	$log.log("finished");
	            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
	            $scope.message = "Finished Update Alldata";
	            $scope.buttonDMSaveDisabled = false;
	            location.reload();
	            //$scope.apply();
	        },
	        error: function(error) { 
	            // an error occurred...
	            $log.log("DailyMission SaveAll Error: ");
	            $log.log(error)
	        }
    	});
	}

	//-----------------------------
	//------- PeriodMission --------
	var periodMissionObjects;
	function loadPeriodMission() {
		$log.log("loadPeriodMission");
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
		$log.log("UpdatePM");
		for(var num = 1; num <= 6; num++)
		{
			var conditionStr = document.getElementById("pmc" + num).value;
			$log.log("num: " + num + " conditionStr: " + conditionStr);
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
		$log.log("periodMissionObjects.length = " + periodMissionObjects.length)
		for(var i = 0; i < periodMissionObjects.length; i ++)
		{
			$log.log("i: " + i);
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
			$log.log(periodMissionObjects[i]);
			/*dailyMissionObjects[i].save().then(function(newsObj) {
					
									
				}, function(error) {
					$scope.meesage = "DMObject could not be saved to parse";
				});*/
		}
		$log.log("Save All");
		Parse.Object.saveAll(periodMissionObjects, {
	        success: function(objs) {
	        	$log.log("finished");
	            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
	            $scope.message = "Finished Update Alldata";
	            $scope.buttonPMSaveDisabled = false;
	            location.reload();
	            //$scope.apply();
	        },
	        error: function(error) { 
	            // an error occurred...
	            $log.log("PeriodMission SaveAll Error: ");
	            $log.log(error)
	        }
    	});
	}

	//-----------------------------
	//------- Setting --------
	var appObject;
	function loadShowBTVIP() {
		$log.log("loadShowBTVIP");
		$scope.isShowBT = false;
		var query = new Parse.Query("App");
			  query.find({
				  success: function(objects) {
				  	if(objects.length > 0)
					{
						appObject = objects[0];
						$scope.showVIPBT = objects[0].get("showVIPTelBT");
					}
					$scope.isShowBT = true;
					$scope.$apply()
				  },
				  error: function(error) {
					$scope.message = "Can't Load ShowBTVIP";
				  }
			  });

	}

	$scope.UpdateBTVIP = function()
	{
		$scope.settingDisabledSaveBT = true;
		appObject.set("showVIPTelBT", $scope.showVIPBT);
		appObject.save().then(function(newsObj) {	
					$scope.settingDisabledSaveBT = false;
					alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
		            location.reload();
				  }, function(error) {
				  		$log.log("error: " + error);
						$scope.meesage = "UpdateBTVIP could not be saved to parse";
				  });
	}

	//-----------------------------
	
	
//----- Duplicate -----
	var dupUIdArr;
	var uidArr;
	var allUserCnt = 0;
	var lessThan = null;
	function FindAllSave()
	{
		$log.log("FindAllSave");
		 var query = new Parse.Query("Save");
		 query.descending("updatedAt");
		 if(lessThan != null)
		 	query.lessThan("updatedAt", lessThan);
		 query.limit(1000);
		 query.find({
				  success: function(objects) {
					$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						var _uid = objects[i].get("uid");
						if(uidArr.indexOf(_uid) != -1)
						{
							if(dupUIdArr.indexOf(_uid) == -1)
							{
								dupUIdArr.push(_uid);
								$scope.dupUIdArr.push({id:_uid});
								//console.log(_uid);
							}
							
						}
						else
						{
							uidArr.push(_uid);
							//console.log("uid: " + _uid);
						}
						
						allUserCnt++;
						
						lessThan = objects[i].updatedAt;
					}
					
					if(objects.length == 0)
					{
						console.log("DupID: " + $scope.dupUIdArr.length)
						$scope.isSearch = true;
						$scope.$apply();
						$log.log("searchInfo = " + uidArr.length);
						//-- Find and Destroy --
						//FindAllDuplicate(0);
					}else
					{
						FindAllSave();
					}
					
				  },
				  error: function(error) {
					$scope.message = "Can't search Save.";
				  }
			  });
	}
	
	function FindAllDuplicate(index)
	{
		$log.log("FindAllDuplicate");
		 var query = new Parse.Query("Save");
		 query.descending("updatedAt");
		 query.equalTo("uid", dupUIdArr[index]);
		 query.limit(1000);
		 query.find({
				  success: function(objects) {
					$log.log("object = " + objects.length);
					var _cnt = objects.length-1;
					for(var i = _cnt; i > 0; i--)
					{
						objects[i].destroy(null);
						
					}
					index++;
					if(dupUIdArr.length <= index)
					{
						console.log("DupID: " + $scope.dupUIdArr.length)
						//$scope.dupUIdArr = new Array();
						$scope.dupUIdArr.push({id:"Finished",
											   update:"Finished"});
						$scope.isSearch = true;
						$scope.$apply();
						$log.log("searchInfo = " + uidArr.length);
					}else
					{
						FindAllDuplicate(index);
					}
					
				  },
				  error: function(error) {
					$scope.message = "Can't search Save.";
				  }
			  });
	}
// -----------------------------------

}


//------- datepick ---------

var globalDatepickerData = [{'sdt1':null}, {'edt1':null}, 
							{'sdt2': null}, {'edt2':null},
							{'sdt3': null}, {'edt3':null},
							{'sdt4': null}, {'edt4':null},
							{'sdt5': null}, {'edt5':null},
							{'sdt6': null}, {'edt6':null},
							{'sdt7': null}, {'edt7':null}];

function DatepickerDemoCtrl($scope, $log) {
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
		$log.log("setDatepicker: " + globalDatepickerData['sdt1']);
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
  
}

//---------------------------