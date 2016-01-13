(function(){
	var app = angular.module('carads', []);
	app.controller("caradsController", function($scope, $sce){
		var adsCtrl = this;
		var adsObjects;
		$scope.buttonSaveDisabled = false;
        $scope.carImgSrc = "./image/c01.jpg";
        var carImgIndex = 1;
        var carImgMax = 18;
        setUrlCarImg();
		loadads();
		
		function loadads() {
			console.log("loadads");
			adsObjects = new Array();
			var columArr = new Array();
			$scope.rowArr = new Array();
			var cnt = 0;
			var query = new Parse.Query("CarAds");
				  query.find({
					  success: function(objects) {
					  	for(var i = 0; i < objects.length; i++)
					  	{
							adsObjects.push(objects[i]);
							var imgobj = angular.fromJson(objects[i].get("image"));
                            var imgurl = "";
                            if(imgobj != null) { imgurl = imgobj._url; }
							columArr.push({imgurl:imgurl, count:cnt});
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
    
    this.nextCarImg = function(){
        carImgIndex++;
        if(carImgIndex > carImgMax){carImgIndex = 1;}
       setUrlCarImg();
    }
    
    this.prevCarImg = function(){
        carImgIndex--;
        if(carImgIndex < 1){ carImgIndex = carImgMax; }
        setUrlCarImg();
    }
    
    function setUrlCarImg()
    {
        var imgName = "c";
        if(carImgIndex <= 9)
        {
            imgName += "0";
        }
        imgName += carImgIndex;
        imgName = './image/' + imgName + '.jpg';
        $scope.carImgSrc = $sce.trustAsResourceUrl(imgName);
    }
		
	});//end controller
	

})();//end function