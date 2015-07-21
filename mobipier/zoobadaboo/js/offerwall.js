(function(){
	var app = angular.module('offerwall', []);
	app.controller("offerwallController", function mainController($scope, $http) {
		var offerwallCtrl = this;
		var dataObjects;
		var dataArray;
		
		loadOfferwall();
		
		function loadOfferwall() {
			console.log("loadOfferwall");
			$scope.imgurls = new Array();
			$scope.isOn = new Array();
			$scope.priority = new Array();
			$scope.newstext = new Array();
			$scope.rowArr = new Array();
			var columArr = new Array();
			dataObjects = new Array();
			dataArray = new Array();
			var cnt = 0;
			var query = new Parse.Query("Offerwall");
				  query.find({
					  success: function(objects) {
					  	for(var i = 0; i < objects.length; i++)
					  	{
							dataObjects.push(objects[i]);
							var _title = objects[i].get("title");
							var _url = objects[i].get("url");
							var _credit = objects[i].get("credit");
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
											credit: _credit,
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
						console.log("loadfinish");
						$scope.$apply()
					  },
					  error: function(error) {
						$scope.message = "Can't Load Offerwall";
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
		
	    $scope.uploadbutton = function(y) {
			$scope.buttonSaveDisabled = true;
			console.log("dataObjects.length = " + dataObjects.length)
			SaveOfferwallData(y);
			
	    }
	
	    function SaveOfferwallData(y)
	    {
	    	if(y.file == null)
			{
					dataObjects[y.count].set("title", y.title);
					dataObjects[y.count].set("url", y.url);
					dataObjects[y.count].set("active", y.active);
					dataObjects[y.count].set("credit", y.credit);
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
					console.log("files name: " + y.file.name);
					var parseFile = new Parse.File(y.file.name, y.file);
					console.log("before save : " + parseFile);
					parseFile.save().then(function() {
					  // The file has been saved to Parse.
					  console.log("File has been saved to Parse");
					  $scope.message = "File has been saved to Parse";
					  dataObjects[y.count].set("title", y.title);
					  dataObjects[y.count].set("url", y.url);
					  dataObjects[y.count].set("active", y.active);
					  dataObjects[y.count].set("image", parseFile);
					  dataObjects[y.count].set("credit", y.credit);
					  console.log("Before Save News");
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
					  		console.log("error: " + error);
							$scope.meesage = "NewsObject could not be saved to parse";
					  });
					}, function(error) {
						$scope.meesage = "File could not be saved to parse";
					  // The file either could not be read, or could not be saved to Parse.
					});
				}
	    	
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
		}
		
		
	});
})();