(function(){
	var app = angular.module('setting', []);
	app.controller("settingController", function($scope){
		//------- Setting --------
		var appObject;
		loadShowBTVIP();
		
		function loadShowBTVIP() {
			console.log("loadShowBTVIP");
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
					  		console.log("error: " + error);
							$scope.meesage = "UpdateBTVIP could not be saved to parse";
					  });
		}
	
		//-----------------------------
	});
})();