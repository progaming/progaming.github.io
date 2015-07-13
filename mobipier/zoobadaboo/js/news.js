(function(){
	var app = angular.module('news', []);
	app.controller("newsController", function($scope){
		var newsCtrl = this;
		this.newsData = new Array();
		var newsObjects;
		var newsImg;
		var files = [null, null, null, null];
		$scope.isOn = [false, false, false, false];
		$scope.priority = [0, 0, 0, 0];
		loadnews();
		
		function loadnews() {
			console.log("loadnews");
			$scope.imgurls = new Array();
			$scope.isOn = new Array();
			$scope.priority = new Array();
			$scope.newstext = new Array();
			newsObjects = new Array();
			this.newsData = new Array();;
			var query = new Parse.Query("News");
				  query.find({
					  success: function(objects) {
					  	for(var i = 0; i < objects.length; i++)
					  	{
							//-- news --
							/*var _data = {};
							_data.object = objects[i];
							_data.newstext = objects[i].get("text");
							var imgobj = angular.fromJson(objects[i].get("image"));
							_data.imgurl = imgobj._url;
							_data.isOn = objects[i].get("on");
							_data.priority = objects[i].get("priority");
							_data.sdt = objects[i].get("startDay");
							_data.edt = objects[i].get("endDay");*/
							
							
							newsObjects.push(objects[i]);
							$scope.newstext.push(objects[i].get("text"));
							var imgobj = angular.fromJson(objects[i].get("image"));
							$scope.imgurls.push(imgobj._url);
							$scope.isOn.push(objects[i].get("on"));
							if(document.getElementById("checkbox" + (i+1)) != null)
							{
								document.getElementById("checkbox" + (i+1)).checked = objects[i].get("on");
								$scope.isOn[i] = objects[i].get("on");
								$scope.priority[i] = objects[i].get("priority");
								document.getElementById("priority" + (i+1)).value = objects[i].get("priority");
								globalDatepickerData['sdt'+ (i+1)] = objects[i].get("startDay");
								globalDatepickerData['edt' + (i+1)] = objects[i].get("endDay");
							}
						}
						console.log("loadfinish");
						$scope.$broadcast('setDatepicker');
						$scope.$apply()
					  },
					  error: function(error) {
						$scope.message = "Can't Load News";
					  }
			});

		}
		
		// Set an event listener on the Choose File field.
    $('#fileselect').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      console.log(_files[0]);
      files[0] = _files[0];
    });

    $('#fileselect2').bind("change", function(e) {
      var _files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
       console.log(_files[0]);
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
		console.log("newsObjects.length = " + newsObjects.length)
		SaveNewsData(0);
		
    }

	    function SaveNewsData(_index)
	    {
	    	console.log("SaveNewsData: " + _index);
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
	    		console.log("files: " + files[_index]);
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
					console.log("files name: " + files[_index].name);
					var parseFile = new Parse.File(files[_index].name, files[_index]);
					console.log("before save : " + parseFile);
					parseFile.save().then(function() {
					  // The file has been saved to Parse.
					  console.log("File has been saved to Parse");
					  $scope.message = "File has been saved to Parse";
					  var _textNews = document.getElementById("textNewsArea" + _index).value;
					  newsObjects[_index].set("text", _textNews);
					  newsObjects[_index].set("image", parseFile);
					  console.log("globalDatepickerData" + globalDatepickerData['sdt' + (_index+1)]);
					  newsObjects[_index].set("startDay", globalDatepickerData['sdt' + (_index+1)]);
					  newsObjects[_index].set("endDay", globalDatepickerData['edt' + (_index+1)]);
					  newsObjects[_index].set("on", $scope.isOn[_index]);
					  newsObjects[_index].set("priority", $scope.priority[_index]);
					  console.log("Before Save News");
					  newsObjects[_index].save().then(function(newsObj) {	
							SaveNewsData(++_index);		
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
	    	
	    }
	
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
	
		
	});//end controller
	

})();//end function