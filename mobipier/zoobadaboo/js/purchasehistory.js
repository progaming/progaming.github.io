(function(){
	var app = angular.module('purchasehistory', []);
	app.controller("purchasehistoryController", function($scope){
		//--------- PurchasedHistory

		var phCurrentPage = 1;
		var phMaxPage = 1;
		var phShowPerPage = 100;
		var phGreaterThen = null;
		var phUserCnt = 0;
		var phArr = new Array();
		
		$scope.isShowPurchasedInfo = false;
		phCurrentPage = 0;
		phGreaterThen = null;
		phUserCnt = 0;
		phArr = new Array();
		$scope.purchasedHistoryInfo = new Array();
		LoadPurchasedHistory();
		
	  	function LoadPurchasedHistory()
		{
			var query = new Parse.Query("PurchasedHistory");
			query.limit(1000);
			query.descending("createdAt");
			if(phGreaterThen != null)
			 	query.lessThan("createdAt", phGreaterThen);
			query.find({
				success: function(objects) {
					
					console.log("object = " + objects.length);
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
	});
})();