var testloginsite = angular.module('testloginsite', ['ui.bootstrap']);
var isLoadNews = false;
function mainController($scope, $http, $log) {
	$scope.message = "start";
	
	Parse.initialize("m2Hck3879q2A2lNrZ29FJnU58ZKmmrty6vBpufCy", "JYVANGxwt2gb4dxr01VtPXeB1iv5N3LCYo484CAi");

	
	
	if(Parse.User.current()){
		$scope.message = "logged in";
		$scope.isLoggedIn = true;
		$scope.buttonSaveDisabled = false;
		$log.log("PathName: " + location.pathname);
		if(location.pathname.indexOf("index.html") != -1 || location.pathname == "/mobipier/zoobadaboo/")
		{
			location.replace("news.html");
		}
		$log.log("buttonSaveDisabled = " + $scope.buttonSaveDisabled);
	}else{
		$log.log("fanot logged inil");
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
	
	
	var dataObjects;
	var dataArray;
	
	$scope.login = function(form) {
		$scope.message = "Logging In...";
		Parse.User.logIn(form.username, form.password, {
			success: function(user) {
			  $log.log = "logged in successfully";
			  $scope.isLoggedIn = true;
			  location.replace("news.html");
			},
			error: function(user, error) {
				$log.log = "fail " + error.toString();
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
		$scope.rowArr = new Array();
		var columArr = new Array();
		dataObjects = new Array();
		dataArray = new Array();
		var cnt = 0;
		var query = new Parse.Query("Gallery");
			  query.find({
				  success: function(objects) {
				  	for(var i = 0; i < objects.length; i++)
				  	{
						dataObjects.push(objects[i]);
						var _title = objects[i].get("title");
						var _url = objects[i].get("url");
						var imgobj = angular.fromJson(objects[i].get("image"));
						var imgurl = "";
						if(imgobj != undefined)
						{
							imgurl = imgobj._url;
						}
						
						var active = objects[i].get("active");
						columArr.push({ count: cnt,
										title:_title,
										url:_url,
										imgurl:imgurl,
										active:active,
										file: null,
										dataobject: objects[i]});
						if(columArr.length == 3)
						{
							$scope.rowArr.push({columArr: columArr});
							columArr = new Array();
						}
						cnt++;
					}
					
					if(columArr.length > 0)
					{
						$scope.rowArr.push({columArr: columArr});
					}
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
	
	var currentSelectfile = null;
	$scope.click = function (y) {
		currentSelectfile = y;
		$log.log("click " + y);
	}
	
	 $scope.uploadImage = function (_data) {
	 	console.log("Changed " + _data);
		currentSelectfile.file = _data.files[0];
		currentSelectfile.chooseFileBT = _data;
		console.log("file: " + currentSelectfile.file);
	 }
	
	// Set an event listener on the Choose File field.
 /*    $('#fileselect').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      $log.log(_files[0]);
      files[0] = _files[0];
	  currentSelectfile.file =  _files[0];
	  $log.log(currentSelectfile.file);
    });*/
	
    $scope.uploadbutton = function(y) {
		$scope.buttonSaveDisabled = true;
		$log.log("dataObjects.length = " + dataObjects.length)
		SaveNewsData(y);
		
    }

    function SaveNewsData(y)
    {
    	if(y.file == null)
		{
				dataObjects[y.count].set("title", y.title);
				dataObjects[y.count].set("url", y.url);
				dataObjects[y.count].set("active", y.active);
				dataObjects[y.count].save().then(function(newsObj) {
					alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
		            $scope.message = "Finished Update Alldata";
		            $scope.buttonSaveDisabled = false;
					$scope.$apply();
					// location.reload();					
				}, function(error) {
					$scope.meesage = "NewsObject could not be saved to parse";
				});
			}
			else
			{
				$log.log("files name: " + y.file.name);
				var parseFile = new Parse.File(y.file.name, y.file);
				$log.log("before save : " + parseFile);
				parseFile.save().then(function() {
				  // The file has been saved to Parse.
				  $log.log("File has been saved to Parse");
				  $scope.message = "File has been saved to Parse";
				  dataObjects[y.count].set("title", y.title);
				  dataObjects[y.count].set("url", y.url);
				  dataObjects[y.count].set("active", y.active);
				  dataObjects[y.count].set("image", parseFile);
				  $log.log("Before Save News");
				  dataObjects[y.count].save().then(function(newObj) {	
						alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
		           		$scope.message = "Finished Update Alldata";
		            	$scope.buttonSaveDisabled = false;
						y.file = null;
						var imgobj = angular.fromJson(newObj.get("image"));
						var imgurl = imgobj._url;
						y.imgurl = imgurl;
						currentSelectfile.chooseFileBT = null;
						$scope.$apply();	
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


	$scope.gotoNews = function()
	{
		location.replace("news.html");
	}
	
	$scope.addnewcolum = function() {
		var lastColumArr = $scope.rowArr[$scope.rowArr.length-1].columArr;
		var cnt = lastColumArr[lastColumArr.length-1].count + 1;
		var Gallery = Parse.Object.extend("Gallery");
		var galleryObj = new Gallery();
		dataObjects.push(galleryObj);
		if(lastColumArr.length == 3)
		{
			lastColumArr = new Array();
			lastColumArr.push({ count: cnt,
										title:"title",
										url:"",
										imgurl:"",
										active:false,
										file: null,
										dataobject: galleryObj});
			$scope.rowArr.push({columArr: lastColumArr});
		}
		else
		{
			lastColumArr.push({ count: cnt,
										title:"title",
										url:"",
										imgurl:"",
										active:false,
										file: null,
										dataobject: galleryObj});
		}
		$scope.uploadbutton(lastColumArr[lastColumArr.length-1]);
		//location.reload();
	}
	
	$scope.removecolumn = function (y) {
		var r = confirm("คุณต้องการจะลบคอลัมน์นี้จริงหรือไม่");
	    if (r == true) {
			$scope.buttonSaveDisabled = true;
	        y.dataobject.destroy({
			  success: function(myObject) {
				alert("ข้อมูลถูกลบเรียบร้อยแล้ว");
				$scope.buttonSaveDisabled = false;
				location.reload();
			  },
			  error: function(myObject, error) {
				  alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
			  }
			});
	    }
	}
	
	
}

