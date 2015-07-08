var testloginsite = angular.module('testloginsite', ['ui.bootstrap']);
var isLoadNews = false;
function mainController($scope, $http, $log) {
	$scope.message = "start";
	Parse.initialize("T8J4rfLskMyr88hyEz1FZt9ockRD188sftGDxb9l", "OXlmhHKsIfavgrQc7YbLoL4qXbPLcjFnBFZtthWn");
	
	if(Parse.User.current()){
		$scope.message = "logged in";
		$scope.isLoggedIn = true;
		$scope.buttonSaveDisabled = false;
		$log.log("PathName: " + location.pathname);
		if(location.pathname.indexOf("index.html") != -1 || location.pathname == "/mobipier/zoobadaboo/")
		{
			location.replace("news.html");
		}
		
		if(location.pathname.indexOf("search.html") != -1)
		{
			allUserInfoArr = new Array();
			lessThan = null;
			allUserCnt = 0;
			$scope.searchInfo = new Array();
			userInfoArr = new Array();
			FindAllUser();
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
	if(location.pathname.indexOf("news.html") != -1)
	{
		loadnews();
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
	else if(location.pathname.indexOf("purchasehistory.html") != -1)
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
	else if(location.pathname.indexOf("words.html") != -1)
	{
		$scope.isShow = false;
		wordClassStr = "LevelOne";
		lvOneArr = new Array();
		lvTwoArr = new Array();
		lvThreeArr = new Array();
		lvFourArr = new Array();
		lvFiveArr = new Array();
		lvSixArr = new Array();
		currentLvPageArr = new Array();
		$scope.isSelected = false;
		wordParseObjArr = new Array();
		$scope.isLoading = false;
		for(var i = 0; i<6; i++)
		{
			currentLvPageArr.push(1);
		}
		console.log("currentLvPageArr: " + currentLvPageArr.length);
		wCnt = 0;
		lessThan = null;
		FindAllWords();
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
			  location.replace("news.html");
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
		$scope.imgurls = new Array();
		$scope.isOn = new Array();
		$scope.priority = new Array();
		$scope.newstext = new Array();
		newsObjects = new Array();
		var query = new Parse.Query("News");
			  query.find({
				  success: function(objects) {
				  	for(var i = 0; i < objects.length; i++)
				  	{
						newsObjects.push(objects[i]);
						$scope.newstext.push(objects[i].get("text"));
						var imgobj = angular.fromJson(objects[i].get("image"));
						$scope.imgurls.push(imgobj._url);
						$scope.isOn.push(objects[i].get("on"));
						if(document.getElementById("checkbox" + (i+1)) != null)
						{
							document.getElementById("checkbox" + (i+1)).checked = objects[i].get("on");
							$scope.isOn[i] = objects[i].get("on");
							//$scope.priority.push(objects[i].get("priority"));
							$scope.priority[i] = objects[i].get("priority");
							document.getElementById("priority" + (i+1)).value = objects[i].get("priority");
							globalDatepickerData['sdt'+ (i+1)] = objects[i].get("startDay");
							globalDatepickerData['edt' + (i+1)] = objects[i].get("endDay");
						}
					}
					$log.log(globalDatepickerData['sdt1']);
					$log.log("loadfinish");
					$scope.$broadcast('setDatepicker');//$emit('setDatepicker', null);
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
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      $log.log(_files[0]);
      files[0] = _files[0];
    });

    $('#fileselect2').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
       $log.log(_files[0]);
      files[1] = _files[0];
    });

    $('#fileselect3').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      files[2] = _files[0];
    });

    $('#fileselect4').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      files[3] = _files[0];
    });
	
	$('#fileselect5').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      files[4] = _files[0];
    });
	
	$('#fileselect6').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      files[5] = _files[0];
    });
	
	$('#fileselect7').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      files[6] = _files[0];
    });
	
    $scope.uploadbutton = function() {
		$scope.buttonSaveDisabled = true;
		$log.log("newsObjects.length = " + newsObjects.length)
		SaveNewsData(0);
		
    }

    function SaveNewsData(_index)
    {
    	$log.log("SaveNewsData: " + _index);
    	if(_index >= newsObjects.length)
    	{
    		Parse.Object.saveAll(newsObjects, {
		        success: function(objs) {
		            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
		            $scope.message = "Finished Update Alldata";
		            $scope.buttonSaveDisabled = false;
		            location.reload();
		            return;
		        },
		        error: function(error) { 
		            // an error occurred...
		        }
	    	});
    	}
    	else
    	{
    		$log.log("files: " + files[_index]);
    		if(files[_index] == null)
			{
				var _textNews = document.getElementById("textNewsArea" + _index).value;
				newsObjects[_index].set("text", _textNews);
				newsObjects[_index].set("startDay", globalDatepickerData['sdt' + (_index+1)]);
				newsObjects[_index].set("endDay", globalDatepickerData['edt' + (_index+1)]);
				newsObjects[_index].set("on", $scope.isOn[_index]);
				newsObjects[_index].set("priority", $scope.priority[_index]);
				newsObjects[_index].save().then(function(newsObj) {
					SaveNewsData(++_index);
									
				}, function(error) {
					$scope.meesage = "NewsObject could not be saved to parse";
				});
			}
			else
			{
				$log.log("files name: " + files[_index].name);
				var parseFile = new Parse.File(files[_index].name, files[_index]);
				$log.log("before save : " + parseFile);
				parseFile.save().then(function() {
				  // The file has been saved to Parse.
				  $log.log("File has been saved to Parse");
				  $scope.message = "File has been saved to Parse";
				  var _textNews = document.getElementById("textNewsArea" + _index).value;
				  newsObjects[_index].set("text", _textNews);
				  newsObjects[_index].set("image", parseFile);
				  $log.log("globalDatepickerData" + globalDatepickerData['sdt' + (_index+1)]);
				  newsObjects[_index].set("startDay", globalDatepickerData['sdt' + (_index+1)]);
				  newsObjects[_index].set("endDay", globalDatepickerData['edt' + (_index+1)]);
				  newsObjects[_index].set("on", $scope.isOn[_index]);
				  newsObjects[_index].set("priority", $scope.priority[_index]);
				  $log.log("Before Save News");
				  newsObjects[_index].save().then(function(newsObj) {	
						SaveNewsData(++_index);		
				  }, function(error) {
				  		$log.log("error: " + error);
						$scope.meesage = "NewsObject could not be saved to parse";
				  });
				}, function(error) {
					$scope.meesage = "File could not be saved to parse";
				  // The file either could not be read, or could not be saved to Parse.
				});
			}
    	}
    	
    }

    function isNumberKey(evt){
	    var charCode = (evt.which) ? evt.which : event.keyCode
	    if (charCode > 31 && (charCode < 48 || charCode > 57))
	    {
	    	evt.preventDefault();
	        return false;
	    }
	    return true;
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
	$scope.gotoPurchasedHistoryPage = function()
	{
		location.replace("purchasehistory.html");
	}
	$scope.gotoDailyMissionPage = function()
	{
		location.replace("dailymission.html");
	}
	$scope.gotoPeriodMissionPage = function()
	{
		location.replace("periodmission.html");
	}
	$scope.gotoSettingPage = function()
	{
		location.replace("setting.html");
	}
	$scope.gotoWordsPage= function()
	{
		location.replace("words.html");
	}
	
	var allUserInfoArr;
	var userInfoArr;
	var topCurrentPage = 1;
	var topMaxPage = 1;
	var userShowPerPage = 100;
	var lessThan = null;
	var allUserCnt = 0;
	function FindAllUser()
	{
		$log.log("FindAllUser");
		 var query = new Parse.Query("UserInfo");
		 query.descending("updatedAt");
		 if(lessThan != null)
		 	query.lessThan("updatedAt", lessThan);
		 query.limit(1000);
		 query.find({
				  success: function(objects) {
					$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						//$log.log(""+objects[i].get("first_name"));
						var createdtime = objects[i].createdAt;
						var createdtimeStr = createdtime.getDate() + "/" + 
						                     (createdtime.getMonth()+1) + "/" + 
						                     createdtime.getFullYear() +" " + 
						                     SetIntToString(createdtime.getHours()) + ":" + 
						                     SetIntToString(createdtime.getMinutes()) + ":" + 
						                     SetIntToString(createdtime.getSeconds());
						var updatetime = objects[i].updatedAt;
						var updatetimeStr = updatetime.getDate() + "/" + 
						                     (updatetime.getMonth()+1) + "/" + 
						                     updatetime.getFullYear() +" " + 
						                     SetIntToString(updatetime.getHours()) + ":" + 
						                     SetIntToString(updatetime.getMinutes()) + ":" + 
						                     SetIntToString(updatetime.getSeconds());
						allUserInfoArr.push({firstname:objects[i].get("first_name"), 
						lastname:objects[i].get("last_name"), 
						email:objects[i].get("email"), 
						createdAt:createdtimeStr,
						updateAt:updatetimeStr,
						highscore: objects[i].get("highscore"),
						score: objects[i].get("score"),
						count: objects[i].get("count"),
						android: objects[i].get("Android"),
						ios: objects[i].get("iOS")});

						userInfoArr.push(allUserInfoArr[allUserCnt]);
						if(allUserCnt < userShowPerPage)
						{
							$scope.searchInfo.push(userInfoArr[allUserCnt]);
						}
						allUserCnt++;

						lessThan = objects[i].updatedAt;
					}
					
					if(objects.length == 0)
					{
						SetPage();
						$scope.isSearch = true;
						$scope.$apply();
						$log.log("searchInfo = " + allUserInfoArr.length);
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

	$scope.ExportData = function()
	{
		alasql("SELECT * INTO CSV('AllUser.csv') FROM ?",[allUserInfoArr]);
	}

	function SetPage()
	{

		$scope.userdataPageNum = new Array();
		if(allUserInfoArr.length >= userShowPerPage)
		{
			$scope.needMorePage = true;
			topMaxPage = parseInt((allUserInfoArr.length/userShowPerPage) +1);
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
					userInfoArr = new Array();
					$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						var createdtime = objects[i].createdAt;
						var createdtimeStr = createdtime.getDate() + "/" + 
						                     (createdtime.getMonth()+1) + "/" + 
						                     createdtime.getFullYear() +" " + 
						                     SetIntToString(createdtime.getHours()) + ":" + 
						                     SetIntToString(createdtime.getMinutes()) + ":" + 
						                     SetIntToString(createdtime.getSeconds());
						var updatetime = objects[i].updatedAt;
						var updatetimeStr = updatetime.getDate() + "/" + 
						                     (updatetime.getMonth()+1) + "/" + 
						                     updatetime.getFullYear() +" " + 
						                     SetIntToString(updatetime.getHours()) + ":" + 
						                     SetIntToString(updatetime.getMinutes()) + ":" + 
						                     SetIntToString(updatetime.getSeconds());
						userInfoArr.push({firstname:objects[i].get("first_name"), 
						lastname:objects[i].get("last_name"), 
						email:objects[i].get("email"), 
						createdAt:createdtimeStr,
						highscore: objects[i].get("highscore"),
						score: objects[i].get("score"),
						count: objects[i].get("count"),
						android: objects[i].get("Android"),
						ios: objects[i].get("iOS")});
						if(i < userShowPerPage)
						{
							$scope.searchInfo.push({firstname:objects[i].get("first_name"), 
							lastname:objects[i].get("last_name"), 
							email:objects[i].get("email"), createdAt:createdtimeStr});
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
	
	//--------------- Find All Words -----------------
	var currentMaxLevel = 0;
	var currentLevelArr;
	var wordClassStr;
	var lvOneArr = new Array();
	var lvTwoArr = new Array();
	var lvThreeArr = new Array();
	var lvFourArr = new Array();
	var lvFiveArr = new Array();
	var lvSixArr = new Array();
	var wCnt = 0;
	var maxLvOneWords = 3000;
	var maxLvTwoWords = 2500;
	var maxLvThreeWords = 2000;
	var maxLvFourWords = 1000;
	var maxLvFiveWords = 1000;
	var maxLvSixWords = 500;
	var currentLvPageArr = new Array();
	var currentWord;
	var wordParseObjArr;
	
	function FindAllWords()
	{
		$log.log("FindAllWords class: " + wordClassStr);
		 var query = new Parse.Query(wordClassStr);
		 query.descending("updatedAt");
		 if(lessThan != null)
		 	query.lessThan("updatedAt", lessThan);
		 query.limit(1000);
		 
		 var maxLv = 0;
		 var arr = new Array();
		 var subArr = new Array();
		 if(wordClassStr == "LevelOne")
		 {
			 arr = lvOneArr;
			 maxLv = maxLvOneWords;
		 }
		 else if(wordClassStr == "LevelTwo")
		 {
			 arr = lvTwoArr;
			 maxLv = maxLvTwoWords;
		 }
		 else if(wordClassStr == "LevelThree")
		 {
			 arr = lvThreeArr;
			 maxLv = maxLvThreeWords;
		 }
		 else if(wordClassStr == "LevelFour")
		 {
			 arr = lvFourArr;
			 maxLv = maxLvFourWords;
		 }
		 else if(wordClassStr == "LevelFive")
		 {
			 arr = lvFiveArr;
			 maxLv = maxLvFiveWords;
		 }
		 else if(wordClassStr == "LevelSix")
		 {
			 arr = lvSixArr;
			 maxLv = maxLvSixWords;
		 }
		 else
		 {
			console.log("NoArray");
		 }
		 
		 if(arr.length > 0)
		 {
			 subArr = arr[arr.length-1];
		 }
		 else
		 {
			 arr.push(subArr);
		 }
		 
		 query.find({
				  success: function(objects) {
					//$log.log("object = " + objects.length);
					for(var i = 0; i < objects.length; i++)
					{
						if(subArr.length == 10)
						{
							subArr = new Array();
							arr.push(subArr);
							
						}
						wordParseObjArr.push(objects[i]);
						//console.log("Words: " +  objects[i].get("words"));
						subArr.push({word:objects[i].get("words"),
									 id:objects[i].id,
									 wClass: wordClassStr,
									 index:wCnt});
						//console.log("SubArrWord: " + subArr[subArr.length-1]);
						lessThan = objects[i].updatedAt;
						wCnt++;
					}
					
					SetArray(arr);
					
					if(objects.length == 0)
					{
						lessThan = null;
						//console.log(wordClassStr + " arrLength: " + arr.length + " maxLv: " + (maxLv/10))
						if(arr.length < maxLv/10)
						{
							//console.log(wordClassStr + " Before: " + arr.length);
							for(var i = wCnt-1; i < maxLv-10; i++)
							{
								if(subArr.length == 10)
								{
									subArr = new Array();
									arr.push(subArr);
								}
								var WordParse = Parse.Object.extend( wordClassStr );
								var	_parseObject = new WordParse();
								wordParseObjArr.push(_parseObject);
								subArr.push({word:"-",
									 id:"null",
									 wClass: wordClassStr,
									 index:wCnt});
									 
								wCnt++;
								//console.log(arr[arr.length-1]);
							}
							//console.log(wordClassStr + " After: " + arr.length);
						}
						wCnt = 0;
						SetArray(arr);
						if(wordClassStr == "LevelSix")
						{
							
							SetShowByLevel();
							$scope.isShow = true;
							$scope.$apply();
						}
						else
						{
							if(wordClassStr == "LevelOne")
							{
								wordClassStr = "LevelTwo";
							}
							else if(wordClassStr == "LevelTwo")
							{
								wordClassStr = "LevelThree";
							}
							else if(wordClassStr == "LevelThree")
							{
								wordClassStr = "LevelFour";
							}
							else if(wordClassStr == "LevelFour")
							{
								wordClassStr = "LevelFive";
							}
							else if(wordClassStr == "LevelFive")
							{
								wordClassStr = "LevelSix";
							}
							
							FindAllWords();
						}
						
					}else
					{
						FindAllWords();
					}
					
				  },
				  error: function(error) {
					$scope.message = "Can't search User.";
				  }
			  });
	}
	
	function SetArray(arr)
	{
		if(wordClassStr == "LevelOne")
		{
			lvOneArr = arr;
		}
		else if(wordClassStr == "LevelTwo")
		{
			lvTwoArr = arr;
		}
		else if(wordClassStr == "LevelThree")
		{
			lvThreeArr = arr;
		}
		else if(wordClassStr == "LevelFour")
		{
			lvFourArr = arr;
		}
		else if(wordClassStr == "LevelFive")
		{
			lvFiveArr = arr;
		}
	}
	
	function SetShowByLevel ()
	{
		currentLvPageArr = new Array();
		for(var i = 0; i<6; i++)
		{
			currentLvPageArr.push(1);
		}
		for(var i = 1; i <= 6; i++)
		{
			if(i == 1)
			{
				currentLevelArr = lvOneArr;
				currentMaxLevel = maxLvOneWords;
			}
			else if(i == 2)
			{
				currentLevelArr = lvTwoArr;
				currentMaxLevel = maxLvTwoWords;
			}
			else if(i == 3)
			{
				currentLevelArr = lvThreeArr;
				currentMaxLevel = maxLvThreeWords;
			}
			else if(i == 4)
			{
				currentLevelArr = lvFourArr;
				currentMaxLevel = maxLvFourWords;
			}
			else if(i == 5)
			{
				currentLevelArr = lvFiveArr;
				currentMaxLevel = maxLvFiveWords;
			}
			else if(i == 6)
			{
				currentLevelArr = lvSixArr;
				currentMaxLevel = maxLvSixWords;
			}
			
			ShowWordByLevel(currentLevelArr, i);
			SetWordsPageArray(i);
		}
		$scope.$apply();
	}
	
	function ShowWordByLevel(arr, _lv)
	{
		console.log("Words Length: " + arr.length); 
		console.log("PageLength: " + currentLvPageArr.length);
		var _wordsArr = new Array();
		console.log("Level: " + _lv + " CurrentPage: " + currentLvPageArr[_lv-1]);
		console.log("Level: " + _lv + " From: " + (10*(currentLvPageArr[_lv-1]-1)) + " To: " + (10*(currentLvPageArr[_lv-1])));
		for(var i = 10*(currentLvPageArr[_lv-1]-1); i < 10*(currentLvPageArr[_lv-1]); i++)
		{
			_wordsArr.push(arr[i]);
			//console.log(arr[i]);
		}
		console.log("WordLength: " + _wordsArr.length);
		if(_lv == 1)
		{
			$scope.wordsLvOne = _wordsArr;
		}
		else if(_lv == 2)
		{
			$scope.wordsLvTwo = _wordsArr;
		}
		else if(_lv == 3)
		{
			$scope.wordsLvThree = _wordsArr;
		}
		else if(_lv == 4)
		{
			$scope.wordsLvFour = _wordsArr;
		}
		else if(_lv == 5)
		{
			$scope.wordsLvFive = _wordsArr;
		}
		else if(_lv == 6)
		{
			$scope.wordsLvSix = _wordsArr;
		}
		//console.log("Apply");
		//if (!$scope.$$phase) $scope.$apply()
		//$scope.$apply();
	}
	
	function SetWordsPageArray(_lv)
	{
		var _cnt = 0;
		if(_lv == 1)
		{
			$scope.lvOneBT = new Array();
			_cnt = lvOneArr.length/10;
			for(var i = 1; i <= _cnt; i++)
			{
				$scope.lvOneBT.push(i);
			}
		}
		else if(_lv == 2)
		{
			$scope.lvTwoBT = new Array();
			_cnt = lvTwoArr.length/10;
			for(var i = 1; i <= _cnt; i++)
			{
				$scope.lvTwoBT.push(i);
			}
		}
		else if(_lv == 3)
		{
			$scope.lvThreeBT = new Array();
			_cnt = lvThreeArr.length/10;
			for(var i = 1; i <= _cnt; i++)
			{
				$scope.lvThreeBT.push(i);
			}
		}
		else if(_lv == 4)
		{
			$scope.lvFourBT = new Array();
			_cnt = lvFourArr.length/10;
			for(var i = 1; i <= _cnt; i++)
			{
				$scope.lvFourBT.push(i);
			}
		}
		else if(_lv == 5)
		{
			$scope.lvFiveBT = new Array();
			_cnt = lvFiveArr.length/10;
			for(var i = 1; i <= _cnt; i++)
			{
				$scope.lvFiveBT.push(i);
			}
		}
		else if(_lv == 6)
		{
			$scope.lvSixBT = new Array();
			_cnt = lvSixArr.length/10;
			for(var i = 1; i <= _cnt; i++)
			{
				$scope.lvSixBT.push(i);
			}
		}
	}
	
	$scope.gotoWordsLvPage = function(_p, _lv)
	{
		console.log("Page: " + _p + " Level: " + _lv);
		currentLvPageArr[_lv-1] = _p;
		if(_lv == 1)
		{
			currentLevelArr = lvOneArr;
		}
		else if(_lv == 2)
		{
			currentLevelArr = lvTwoArr;
		}
		else if(_lv == 3)
		{
			currentLevelArr = lvThreeArr;
		}
		else if(_lv == 4)
		{
			currentLevelArr = lvFourArr;
		}
		else if(_lv == 5)
		{
			currentLevelArr = lvFiveArr;
		}
		else if(_lv == 6)
		{
			currentLevelArr = lvSixArr;
		}
		ShowWordByLevel(currentLevelArr, _lv);
	}
	
	$scope.selectWord = function(_word)
	{
		if(_word == null)
		{
			currentWord = null;
			document.getElementById("changeWord").value = "";
			return;
		}
		console.log("Word: " + _word["word"]);
		currentWord = _word;
		$scope.textsearch = _word["word"];
		document.getElementById("changeWord").value = $scope.textsearch;
		$scope.isSelected = true;
		//$scope.$apply();
	}
	
	$scope.SaveWord = function()
	{
		if(currentWord == null)
		{
			return;
		}
		$scope.isLoading = true;
		var WordParse = Parse.Object.extend( currentWord["wClass"] );
		var	_parseObject = new WordParse();
		_parseObject = wordParseObjArr[ currentWord["index"] ];
		
		if(_parseObject == undefined)
		{
			_parseObject = new WordParse();
		}
		
		currentWord["word"] = $scope.textsearch;
		console.log($scope.textsearch);
		_parseObject.set("words", $scope.textsearch);
		_parseObject.save().then(function(newsObj) {	
					$scope.isLoading = false;
					$scope.finishShow = "บันทึกคำว่า " + $scope.textsearch + " แล้ว";
					$scope.$apply();
					//alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
		            //location.reload();
				  }, function(error) {
				  		$log.log("error: " + error);
		});
	}
	
	$scope.searchWordOnLv = function(_lv)
	{
		$scope.searchResult = "กำลังค้นหา";
		var arr = new Array();
		if(_lv == 1)
		{
			arr = lvOneArr;
		}
		else if(_lv == 2)
		{
			arr = lvTwoArr;
		}
		else if(_lv == 3)
		{
			arr = lvThreeArr;
		}
		else if(_lv == 4)
		{
			arr = lvFourArr;
		}
		else if(_lv == 5)
		{
			arr = lvFiveArr;
		}
		else if(_lv == 6)
		{
			arr = lvSixArr;
		}
		for(var i = 0; i < arr.length; i++)
		{
			for(var j = 0; j < arr[i].length; j++)
			{
				if(arr[i][j]["word"] == $scope.wordsearch)
				{
					$scope.selectWord(arr[i][j]);
					$scope.searchResult = "";
					return;
				}
			}
		}
		
		$scope.searchResult = "ไม่มีคำว่า " + $scope.wordsearch;
		$scope.selectWord(null);
		$scope.isSelected = false;
	}
	
	//--------------------------

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
					//if(i > 4)
					//	break;
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
			phMaxPage = parseInt((phArr.length/phShowPerPage) +1);
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