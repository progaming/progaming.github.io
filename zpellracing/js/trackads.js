(function(){
	var app = angular.module('trackads', []);
	app.controller("trackadsController", function($scope){
		var adsCtrl = this;
		var adsObjects = new Array();
		var cnt = 0;
		$scope.buttonSaveDisabled = false;
		/*$scope.rowOneArr = new Array();
		$scope.rowTwoArr = new Array();
		$scope.rowThreeArr = new Array();*/
		var trackCount = 1;
		loadads(trackCount);
		
		function loadads(tCnt) {
			console.log("loadads");
			var columArr = new Array();
			var rowArr = new Array();
			var query;// = new Parse.Query("CarAds");
			if(tCnt == 1)
			{
				query = new Parse.Query("TrackOneAds");
			}
			else if(tCnt == 2)
			{
				query = new Parse.Query("TrackTwoAds");
			}
			else if(tCnt == 3)
			{
				query = new Parse.Query("TrackThreeAds");
			}
				  query.find({
					  success: function(objects) {
					  	for(var i = 0; i < objects.length; i++)
					  	{
							adsObjects.push(objects[i]);
							var imgobj = angular.fromJson(objects[i].get("image"));
							columArr.push({imgurl:imgobj._url, count:cnt});
							if(columArr.length == 3)
							{
								rowArr.push({columArr: columArr});
								columArr = new Array();
								
							}
							cnt++;
						}
						if(columArr.length > 0)
						{
							rowArr.push({columArr: columArr});
						}
						if(tCnt == 1)
						{
							$scope.rowOneArr = rowArr;
						}
						else if(tCnt == 2)
						{
							$scope.rowTwoArr = rowArr;
						}
						else if(tCnt == 3)
						{
							$scope.rowThreeArr = rowArr;
						}
						
						if(trackCount == 3)
						{
							console.log("loadfinish"); 
							$scope.$apply()
						}
						else
						{
							loadads(++trackCount);
						}
						
					  },
					  error: function(error) {
						$scope.message = "Can't Load News";
					  }
			});

		}
	
	var currentSelectfile = null;
	$scope.click = function (y) {
		currentSelectfile = y;
		console.log("click " + y);
	}
	
	 $scope.uploadImage = function (_data) {
	 	console.log("Changed " + _data);
		currentSelectfile.file = _data.files[0];
		currentSelectfile.chooseFileBT = _data;
		console.log("file: " + currentSelectfile.file);
	 }
	 
	 this.uploadbutton = function (y) {
		$scope.buttonSaveDisabled = true;
		console.log("dataObjects.length = " + adsObjects.length)
		SaveNewsData(y);
    }

    function SaveNewsData(y)
    {
    	if(y.file == null)
		{
			alert("กรุณาเลือกภาพก่อนกดบันทึก");
		    $scope.message = "Finished Update Alldata";
		    $scope.buttonSaveDisabled = false;
		}
		else
		{
				console.log("files name: " + y.file.name);
				var parseFile = new Parse.File(y.file.name, y.file);
				console.log("before save : " + parseFile);
				parseFile.save().then(function() {
				  // The file has been saved to Parse.
				  console.log("File has been saved to Parse");
				  $scope.message = "File has been saved to Parse";
				  adsObjects[y.count].set("title", y.title);
				  adsObjects[y.count].set("url", y.url);
				  adsObjects[y.count].set("active", y.active);
				  adsObjects[y.count].set("image", parseFile);
				  console.log("Before Save News");
				  adsObjects[y.count].save().then(function(newObj) {	
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
				  		console.log("error: " + error);
						$scope.meesage = "NewsObject could not be saved to parse";
				  });
				}, function(error) {
					$scope.meesage = "File could not be saved to parse";
				  // The file either could not be read, or could not be saved to Parse.
				});
		}
		
		
    	
    }
		
	});//end controller
	

})();//end function