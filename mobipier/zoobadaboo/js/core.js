var testloginsite = angular.module('testloginsite', ['ui.bootstrap', 'navbar', 
													 'search', 'news', 'top',
													 'purchasehistory', 
													 'dailymission', 
													 'periodmission', 'setting',
													 'offerwall', 'searchvip']);
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
			uidArr = new Array();
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
	
	
//----- Duplicate -----
	var dupUIdArr;
	var uidArr = new Array();
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
					$log.log("objects = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						//console.log("Objects: " + i);
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
					$log.log("Finish Find all save");
					if(objects.length == 0)
					{
						console.log("DupID: " + $scope.dupUIdArr.length)
						console.log($scope.dupUIdArr[0]);
						$scope.isSearch = true;
						$scope.$apply();
						$log.log("searchInfo = " + uidArr.length);
						//-- Find and Destroy --
						//FindAllDuplicate(0);
					}else
					{
						console.log("Find next");
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

/*var globalDatepickerData = [{'sdt1':null}, {'edt1':null}, 
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
  
}*/

//---------------------------