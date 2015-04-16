var testloginsite = angular.module('testloginsite', ['ui.bootstrap']);
var isLoadNews = false;
function mainController($scope, $http, $log) {
	
	$scope.message = "start";
	var _0xd703=["\x44\x79\x59\x49\x48\x68\x33\x47\x54\x74\x42\x48\x4B\x33\x32\x61\x53\x52\x71\x70\x48\x67\x47\x42\x66\x48\x57\x6D\x65\x30\x75\x43\x30\x79\x49\x32\x79\x46\x7A\x52","\x54\x41\x5A\x32\x62\x35\x76\x56\x32\x73\x4F\x30\x51\x78\x41\x44\x6A\x4E\x73\x39\x46\x36\x58\x66\x65\x38\x6C\x44\x46\x54\x67\x76\x75\x67\x59\x6B\x68\x68\x47\x72","\x69\x6E\x69\x74\x69\x61\x6C\x69\x7A\x65"];Parse[_0xd703[2]](_0xd703[0],_0xd703[1]);
	
	if(Parse.User.current()){
		$scope.message = "logged in";
		$scope.isLoggedIn = true;
		$scope.buttonSaveDisabled = false;
		$log.log("PathName: " + location.pathname);
		if(location.pathname.indexOf("index.html") != -1 )//|| location.pathname == "/mobipier/")
		{
			location.replace("userinfo.html");
		}
		if(location.pathname.indexOf("userinfo.html") != -1)
		{
			$scope.isSearch = false;
			greaterThen = "";
			topCurrentPage = 1;
			allUserCnt = 0;
			$scope.searchInfo = new Array();
			userInfoArr = new Array();
			FindAllUser();
		}
		else if(location.pathname.indexOf("top.html") != -1)
		{
			$scope.activeFind = false;
			$scope.isShowTop = false;
			//var today = new Date();
			//document.getElementById("sdt").value = today;
			//document.getElementById("edt").value = today;
			
			//$scope.datepickerData["sdt"] = new Date();
			//$scope.datepickerData["edt"] = new Date();
			LoadCurrentSessionToShowWeek();
		}
		else if(location.pathname.indexOf("purchasehistory.html") != -1)
		{
			$scope.isShowPurchasedInfo = false;
			LoadPurchasedHistory();
		}
		else if(location.pathname.indexOf("numberalluser.html") != -1)
		{
			$scope.alluniqueplayer = 0;
			$scope.allplayer = 0;
			greaterThen = "";
			$scope.isShow = false;
			FindAllPlayerCount();
		}
		
	}else{
		$scope.message = "not logged in";
		$scope.isLoggedIn = false;
		if(location.pathname.indexOf("index.html") == -1 && location.pathname != "/mobipier/")
		{
			location.replace("index.html");
		}
	}

	var newsObjects;
	var newsImg;
	var files = [null, null, null, null];

	$scope.isOn = [false, false, false, false];
	$scope.priority = [0, 0, 0, 0];
	
	$scope.login = function(form) {
		$scope.message = "Logging In...";
		Parse.User.logIn(form.username, form.password, {
			success: function(user) {
			  $scope.message = "logged in successfully";
			  $scope.isLoggedIn = true;
			  location.replace("userinfo.html");
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
	//----------------- Go To Page -------------
	$scope.gotouserpage = function()
	{
		location.replace("userinfo.html");
	}
	$scope.gotoNumberUser = function()
	{
		location.replace("numberalluser.html");
	}
	$scope.gotoTopPage = function()
	{
		location.replace("top.html");
	}
	//-------------------------------------------
	
	
	var userInfoArr;
	var topCurrentPage = 1;
	var topMaxPage = 1;
	var userShowPerPage = 50;
	var allUserCnt = 0;
	function FindAllUser()
	{
		$log.log("FindAllUser");
		 var query = new Parse.Query("UserInfo");
		 query.ascending("uid");
		 if(greaterThen != "")
		 	query.greaterThan("uid", greaterThen);
		 query.limit(1000);
		 query.find({
				  success: function(objects) {
					$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						var createdtime = objects[i].createdAt;
						var createdtimeStr = createdtime.getDate() + "/" + 
						                     (createdtime.getMonth() + 1) + "/" + 
						                     createdtime.getFullYear() +" " + 
						                     SetIntToString(createdtime.getHours()) + ":" + 
						                     SetIntToString(createdtime.getMinutes()) + ":" + 
						                     SetIntToString(createdtime.getSeconds());
						//$log.log(""+objects[i].get("first_name"));
						var tel = objects[i].get("tel");
						if(tel != undefined)
							tel = "0" + tel;
						userInfoArr.push({
							runningno:allUserCnt,
							firstname:objects[i].get("first_name"), 
							lastname:objects[i].get("last_name"),
							uid:objects[i].get("uid"),
							realname:objects[i].get("real_name"),
							tel:tel,
							email:objects[i].get("email"),
							createdtime:createdtimeStr,
						    android:objects[i].get("Android"),
							facebook:objects[i].get("Facebook"),
							ios:objects[i].get("iOS")
						});

						if(allUserCnt < userShowPerPage)
						{
							$scope.searchInfo.push(userInfoArr[i]);
						}

						allUserCnt++;

						greaterThen = objects[i].get("uid");
					}
					$scope.userdataPageNum = new Array();
					$scope.userInfoArr = userInfoArr;
					
					if(objects.length == 0)
					{
						$scope.isSearch = true;
						$log.log("searchInfo = " + $scope.searchInfo.length);
						SetupPage();
						$scope.$apply();
					}else
					{
						FindAllUser();
					}
					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
	}

	function SetupPage()
	{
		if(allUserCnt >= userShowPerPage)
					{
						$scope.needMorePage = true;
						topMaxPage = parseInt((allUserCnt/userShowPerPage) +1);
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
	}
	
	$scope.gotoPage = function(x){
		var lastPage = (x-1) * userShowPerPage;
		var nextPage = (x)*userShowPerPage;
		$scope.searchInfo = new Array();
		for(var i = lastPage; i < nextPage; i++)
		{
			if(userInfoArr.length > i)
			{
				$scope.searchInfo.push(userInfoArr[i]);
			}
		}

		$scope.isSearch = true;
		if(!$scope.$$phase) {
         	$scope.$apply();
   		}
		
	}

	//---Number All User ----------------
	var skip = 0;
	var greaterThen = "";
	var allplayerCnt = 0;
	function FindAllPlayerCount()
	{
		$log.log("FindAllUser");
		 var query = new Parse.Query("UserInfo");
		 query.ascending("uid");
		 if(greaterThen != "")
		 	query.greaterThan("uid", greaterThen);
		 query.limit(1000);
		 
		 query.find({
				  success: function(objects) {
				  	allplayerCnt += objects.length;
					$log.log("Length: " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						var realname = objects[i].get("real_name");
						if(realname != undefined)
							$scope.alluniqueplayer ++;
						var cnt = objects[i].get("count");
						if(cnt != undefined)
						{
							$scope.allplayer += cnt;
						}
						else
						{
							$scope.allplayer ++;
						}
						greaterThen = objects[i].get("uid");
					}
					if(objects.length == 0)
					{
						$log.log("allplayerCnt" + allplayerCnt);
						$scope.isShow = true;
						$scope.$apply();
					}
					else
						FindAllPlayerCount();
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
	}


	//----------------------------------

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

	//-------------- DatePicker -----------------

	var isFindTop = "";

	$scope.open = function($event, which) {
		$event.preventDefault();
	    $event.stopPropagation();

	    which = true;
	};

	$scope.changeDatePick = function(which)
	{
		$log.log($scope.datepickerData[which]);
		$log.log($scope.datepickerData["edt"]);
		$scope.activeFind = false;
	};

	$scope.findUser = function()
	{
		if($scope.datepickerData["sdt"] == undefined || 
			$scope.datepickerData["edt"] == undefined)
		{
			return;
		}
		isFindTop = "findUser";
		$log.log("findUser");
		$scope.isShowTopPlay = false;
		$scope.topPlayInfo = new Array();
		//topPlaylessThan = -100;
		topPlayPlayerCnt = 0;
		findTopPlayByDate();

		$scope.isShowTopShare = false;
		$scope.topShareInfo = new Array();
		//topSharelessThan = -100;
		topSharePlayerCnt = 0;
		findTopShareByDate();

		$scope.isShowTopWeekScore = false;
		$scope.topWeekScoreInfo = new Array();
		//topWeeklessThan = -100;
		topWeekPlayerCnt = 0;
		fideTopScorebyDate();
		
		
		
	}


	//-------------------------------------------

	//-------------- Search ---------------------

	function fideTopScorebyDate()
	{
		if(isFindTop != "findUser")
			return;
		var uidArr = new Array();
		var query = new Parse.Query("Score");
		query.descending("score");
		
		query.greaterThanOrEqualTo("createdAt", $scope.datepickerData["sdt"]);
		query.lessThanOrEqualTo("createdAt", $scope.datepickerData["edt"]);
		 query.limit(1000);
		//query.limit(10);
		query.find({
				  success: function(objects) {
					
					$log.log("object = " + objects.length);
					
					for(var i = 0; i < objects.length; i++)
					{
						topWeekPlayerCnt++;
						uidArr.push(objects[i].get("uid"));
						$scope.topWeekScoreInfo.push({uid:objects[i].get("uid"),
							score:objects[i].get("score"), runnigno:topWeekPlayerCnt});
					}
					
					if(objects.length > 0)
					{
						var findIdQuery = new Parse.Query("UserInfo");
						findIdQuery.containedIn("uid", uidArr);
						findIdQuery.limit(1000);
						findIdQuery.find({
							success: function(idObjects){
								//$log.log("idObjects: " + idObjects.length);
								for (var i = 0; i < idObjects.length; i++) {
									var _findid = idObjects[i].get("uid");
									for(var j = 0; j < $scope.topWeekScoreInfo.length; j++)
									{
										//$log.log("_findid: " + _findid + " uidInfoList[j].uid: " + uidInfoList[j].uid);
										if(_findid == $scope.topWeekScoreInfo[j].uid)
										{
											$scope.topWeekScoreInfo[j].realname = idObjects[i].get("real_name");
											$scope.topWeekScoreInfo[j].email = idObjects[i].get("email");
											var tel = idObjects[i].get("tel");
											if(tel != undefined)
												tel = "0" + tel;
											$scope.topWeekScoreInfo[j].tel = tel;
											//$log.log($scope.topWeekScoreInfo[j].real_name);

										}
									
									}
								}
								$log.log("topWeekPlayerCnt:" + topWeekPlayerCnt);
								$scope.isShowTopWeekScore = true;
								$scope.$apply();
								
							
						},
						error: function(error)
						{
							$log.log("can't findIdQuery: " + error.toString());
							$log.log(error);
						}

						});
					}
					else
					{
						$log.log("topWeekPlayerCnt:" + topWeekPlayerCnt);
						$scope.isShowTopWeekScore = true;
						$scope.$apply();
					}
						
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
		});
	}

	function findTopPlayByDate()
	{
		if(isFindTop != "findUser")
			return;
		var uidArr = new Array();
		var query = new Parse.Query("Score");
		query.descending("count");
		query.greaterThanOrEqualTo("createdAt", $scope.datepickerData["sdt"]);
		query.lessThanOrEqualTo("createdAt", $scope.datepickerData["edt"]);
		 query.limit(1000);
		//query.limit(10);
		query.find({
				  success: function(objects) {
					topPlayInfoArr = new Array();
					$log.log("object = " + objects.length);
					/*if(objects.length == 0)
					{
						$scope.topPlayInfo.push({firstname:'No Data', 
						lastname:'', 
						score:'0'})	
					}*/
					for(var i = 0; i < objects.length; i++)
					{
						topPlayPlayerCnt++;
						uidArr.push(objects[i].get("uid"));
						$scope.topPlayInfo.push({uid:objects[i].get("uid"),
							score:objects[i].get("count"), runnigno:topPlayPlayerCnt});
					}
					
					if(objects.length > 0)
					{
						var findIdQuery = new Parse.Query("UserInfo");
						findIdQuery.containedIn("uid", uidArr);
						findIdQuery.limit(1000);
						findIdQuery.find({
							success: function(idObjects){
								//$log.log("idObjects: " + idObjects.length);
								for (var i = 0; i < idObjects.length; i++) {
									var _findid = idObjects[i].get("uid");
									for(var j = 0; j < $scope.topPlayInfo.length; j++)
									{
										//$log.log("_findid: " + _findid + " uidInfoList[j].uid: " + uidInfoList[j].uid);
										if(_findid == $scope.topPlayInfo[j].uid)
										{
											$scope.topPlayInfo[j].realname = idObjects[i].get("real_name");
											$scope.topPlayInfo[j].email = idObjects[i].get("email");
											var tel = idObjects[i].get("tel");
											if(tel != undefined)
												tel = "0" + tel;
											$scope.topPlayInfo[j].tel = tel;
											topPlayInfoArr.push($scope.topPlayInfo[j]);
											//$log.log($scope.topPlayInfo[j].real_name);

										}
									
									}
								}
								$log.log("topPlayPlayerCnt:" + topPlayPlayerCnt);
								$scope.isShowTopPlay = true;
								$scope.$apply();
							},
							error: function(error)
							{
								$log.log("can't findIdQuery: " + error.toString());
								$log.log(error);
							}

						});
					}
					else
					{
						$log.log("topPlayPlayerCnt:" + topPlayPlayerCnt);
						$scope.isShowTopPlay = true;
						$scope.$apply();
					}

					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
		});
	}

	function findTopShareByDate()
	{
		if(isFindTop != "findUser")
			return;
		var uidArr = new Array();
		var query = new Parse.Query("Score");
		query.descending("sharecount");
		query.greaterThanOrEqualTo("createdAt", $scope.datepickerData["sdt"]);
		query.lessThanOrEqualTo("createdAt", $scope.datepickerData["edt"]);
		 query.limit(1000);
		//query.limit(10);
		query.find({
				  success: function(objects) {
					
					$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						topSharePlayerCnt++;
						uidArr.push(objects[i].get("uid"));
						$scope.topShareInfo.push({uid:objects[i].get("uid"),
							score:objects[i].get("sharecount"), 
							runnigno:topSharePlayerCnt});
					}
					
					if(objects.length > 0)
					{
						var findIdQuery = new Parse.Query("UserInfo");
						findIdQuery.containedIn("uid", uidArr);
						findIdQuery.limit(1000);
						findIdQuery.find({
							success: function(idObjects){
								//$log.log("idObjects: " + idObjects.length);
								for (var i = 0; i < idObjects.length; i++) {
									var _findid = idObjects[i].get("uid");
									for(var j = 0; j < $scope.topShareInfo.length; j++)
									{
										//$log.log("_findid: " + _findid + " uidInfoList[j].uid: " + uidInfoList[j].uid);
										if(_findid == $scope.topShareInfo[j].uid)
										{
											$scope.topShareInfo[j].realname = idObjects[i].get("real_name");
											$scope.topShareInfo[j].email = idObjects[i].get("email");
											var tel = idObjects[i].get("tel");
											if(tel != undefined)
												tel = "0" + tel;
											$scope.topShareInfo[j].tel = tel;
											//$log.log($scope.topShareInfo[j].real_name);

										}
									
									}
								}
								$log.log("topSharePlayerCnt:" + topSharePlayerCnt);
								$scope.isShowTopShare = true;
								$scope.$apply();
							},
							error: function(error)
							{
								$log.log("can't findIdQuery: " + error.toString());
								$log.log(error);
							}

						});
					}
					else
					{
						$log.log("topSharePlayerCnt:" + topSharePlayerCnt);
						$scope.isShowTopShare = true;
						$scope.$apply();
					}

					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
		});
	}


	//-------------------------------------------

	//-------------- Week -----------------------
	
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
			session++;
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

	var topWeeklessThan = -100;
	var topWeekPlayerCnt = 0;

	var topPlaylessThan = -100;
	var topPlayPlayerCnt = 0;
	var topPlayInfoArr;

	var topSharelessThan = -100;
	var topSharePlayerCnt = 0;
	
	$scope.gotoWeek = function(session)
	{
		isFindTop = "goToWeek";

		$scope.isShowTopPlay = false;
		$scope.topPlayInfo = new Array();
		topPlaylessThan = -100;
		topPlayPlayerCnt = 0;
		findTopPlay(session);

		$scope.isShowTopShare = false;
		$scope.topShareInfo = new Array();
		topSharelessThan = -100;
		topSharePlayerCnt = 0;
		findTopShare(session);

		$scope.isShowTopWeekScore = false;
		$scope.topWeekScoreInfo = new Array();
		topWeeklessThan = -100;
		topWeekPlayerCnt = 0;
		fideallbyweek(session);
	}

	function fideallbyweek(session)
	{
		if(isFindTop != "goToWeek")
			return;
		//$scope.$apply();
		$log.log("session = " + session);
		session--;
		var uidArr = new Array();
		var query = new Parse.Query("Score");
		if(session >= 0)
			query.equalTo("Session", session);
		query.descending("score");
		if(topWeeklessThan != -100)
		 	query.lessThan("score", topWeeklessThan);
		 query.limit(1000);
		//query.limit(10);
		query.find({
				  success: function(objects) {
					
					$log.log("object = " + objects.length);
					/*if(objects.length == 0)
					{
						$scope.topWeekScoreInfo.push({firstname:'No Data', 
						lastname:'', 
						score:'0'})	
					}*/
					for(var i = 0; i < objects.length; i++)
					{
						topWeekPlayerCnt++;
						uidArr.push(objects[i].get("uid"));
						$scope.topWeekScoreInfo.push({uid:objects[i].get("uid"),
							score:objects[i].get("score"), runnigno:topWeekPlayerCnt});
						topWeeklessThan = objects[i].get("score");
					}
					
					if(objects.length > 0)
					{
						var findIdQuery = new Parse.Query("UserInfo");
						findIdQuery.containedIn("uid", uidArr);
						findIdQuery.limit(1000);
						findIdQuery.find({
							success: function(idObjects){
								//$log.log("idObjects: " + idObjects.length);
								for (var i = 0; i < idObjects.length; i++) {
									var _findid = idObjects[i].get("uid");
									for(var j = 0; j < $scope.topWeekScoreInfo.length; j++)
									{
										//$log.log("_findid: " + _findid + " uidInfoList[j].uid: " + uidInfoList[j].uid);
										if(_findid == $scope.topWeekScoreInfo[j].uid)
										{
											$scope.topWeekScoreInfo[j].realname = idObjects[i].get("real_name");
											$scope.topWeekScoreInfo[j].email = idObjects[i].get("email");
											var tel = idObjects[i].get("tel");
											if(tel != undefined)
												tel = "0" + tel;
											$scope.topWeekScoreInfo[j].tel = tel;
											//$log.log($scope.topWeekScoreInfo[j].real_name);

										}
									
									}
								}
								fideallbyweek(++session);
								
							
						},
						error: function(error)
						{
							$log.log("can't findIdQuery: " + error.toString());
							$log.log(error);
						}

						});
					}
					else
					{
						$log.log("topWeekPlayerCnt:" + topWeekPlayerCnt);
						$scope.isShowTopWeekScore = true;
						$scope.$apply();
					}
						
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
		});
	}

	function findTopPlay(session)
	{
		if(isFindTop != "goToWeek")
			return;
		//$scope.$apply();
		$log.log("session = " + session);
		session--;
		var uidArr = new Array();
		var query = new Parse.Query("Score");
		if(session >= 0)
			query.equalTo("Session", session);
		query.descending("count");
		if(topPlaylessThan != -100)
		 	query.lessThan("count", topPlaylessThan);
		 query.limit(1000);
		//query.limit(10);
		query.find({
				  success: function(objects) {
					topPlayInfoArr = new Array();
					$log.log("object = " + objects.length);
					/*if(objects.length == 0)
					{
						$scope.topPlayInfo.push({firstname:'No Data', 
						lastname:'', 
						score:'0'})	
					}*/
					for(var i = 0; i < objects.length; i++)
					{
						topPlayPlayerCnt++;
						uidArr.push(objects[i].get("uid"));
						$scope.topPlayInfo.push({uid:objects[i].get("uid"),
							score:objects[i].get("count"), runnigno:topPlayPlayerCnt});
						topPlaylessThan = objects[i].get("count");
					}
					
					if(objects.length > 0)
					{
						var findIdQuery = new Parse.Query("UserInfo");
						findIdQuery.containedIn("uid", uidArr);
						findIdQuery.limit(1000);
						findIdQuery.find({
							success: function(idObjects){
								//$log.log("idObjects: " + idObjects.length);
								for (var i = 0; i < idObjects.length; i++) {
									var _findid = idObjects[i].get("uid");
									for(var j = 0; j < $scope.topPlayInfo.length; j++)
									{
										//$log.log("_findid: " + _findid + " uidInfoList[j].uid: " + uidInfoList[j].uid);
										if(_findid == $scope.topPlayInfo[j].uid)
										{
											$scope.topPlayInfo[j].realname = idObjects[i].get("real_name");
											$scope.topPlayInfo[j].email = idObjects[i].get("email");
											var tel = idObjects[i].get("tel");
											if(tel != undefined)
												tel = "0" + tel;
											$scope.topPlayInfo[j].tel = tel;
											topPlayInfoArr.push($scope.topPlayInfo[j]);
											//$log.log($scope.topPlayInfo[j].real_name);

										}
									
									}
								}
								//alasql("SELECT * INTO CSV('cities.csv') FROM ?",[topPlayInfoArr]);
								findTopPlay(++session);
							},
							error: function(error)
							{
								$log.log("can't findIdQuery: " + error.toString());
								$log.log(error);
							}

						});
					}
					else
					{
						$log.log("topPlayPlayerCnt:" + topPlayPlayerCnt);
						$scope.isShowTopPlay = true;
						$scope.$apply();
					}

					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
		});
	}

	function findTopShare(session)
	{
		if(isFindTop != "goToWeek")
			return;
		//$scope.$apply();
		$log.log("session = " + session);
		session--;
		var uidArr = new Array();
		var query = new Parse.Query("Score");
		if(session >= 0)
			query.equalTo("Session", session);
		query.descending("sharecount");
		if(topSharelessThan != -100)
		 	query.lessThan("sharecount", topSharelessThan);
		 query.limit(1000);
		//query.limit(10);
		query.find({
				  success: function(objects) {
					
					$log.log("object = " + objects.length);
					/*if(objects.length == 0)
					{
						$scope.topShareInfo.push({firstname:'No Data', 
						lastname:'', 
						score:'0'})	
					}*/
					for(var i = 0; i < objects.length; i++)
					{
						topSharePlayerCnt++;
						uidArr.push(objects[i].get("uid"));
						$scope.topShareInfo.push({uid:objects[i].get("uid"),
							score:objects[i].get("sharecount"), 
							runnigno:topSharePlayerCnt});
						topSharelessThan = objects[i].get("sharecount");
					}
					
					if(objects.length > 0)
					{
						var findIdQuery = new Parse.Query("UserInfo");
						findIdQuery.containedIn("uid", uidArr);
						findIdQuery.limit(1000);
						findIdQuery.find({
							success: function(idObjects){
								//$log.log("idObjects: " + idObjects.length);
								for (var i = 0; i < idObjects.length; i++) {
									var _findid = idObjects[i].get("uid");
									for(var j = 0; j < $scope.topShareInfo.length; j++)
									{
										//$log.log("_findid: " + _findid + " uidInfoList[j].uid: " + uidInfoList[j].uid);
										if(_findid == $scope.topShareInfo[j].uid)
										{
											$scope.topShareInfo[j].realname = idObjects[i].get("real_name");
											$scope.topShareInfo[j].email = idObjects[i].get("email");
											var tel = idObjects[i].get("tel");
											if(tel != undefined)
												tel = "0" + tel;
											$scope.topShareInfo[j].tel = tel;
											//$log.log($scope.topShareInfo[j].real_name);

										}
									
									}
								}
								//
								findTopShare(++session);
							},
							error: function(error)
							{
								$log.log("can't findIdQuery: " + error.toString());
								$log.log(error);
							}

						});
					}
					else
					{
						$log.log("topSharePlayerCnt:" + topSharePlayerCnt);
						$scope.isShowTopShare = true;
						$scope.$apply();
					}

					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
		});
	}


	$scope.ExportData = function(data, fileName)
	{
		alasql("SELECT * INTO CSV('"+ fileName +".csv') FROM ?",[data]);
	}
	 
	
}