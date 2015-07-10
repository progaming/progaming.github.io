var app = angular.module('gift', []);

app.service('giftService', function($http){
    this.sendGift = function(receiver, payload, success, fail){
		console.log("Sending");
		var Gift = Parse.Object.extend("Gift");
		var gift = new Gift();

		gift.set("first_name", "Rep");
		gift.set("last_name", "ProGaming");
		gift.set("network", "Facebook");
		gift.set("sender", "1434531473524512");
		gift.set("accept_status", "N");
		gift.set("receiver", receiver);
		gift.set("payload", payload);

		gift.save(null, {
			success: function(result) {
				// Execute any logic that should take place after the object is saved.
				alert('New object created with objectId: ' + result.id);
				if(success)
				{
					success();
				}
			},
			error: function(result, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and message.
				alert('Failed to create new object, with error code: ' + error.message);
				if(fail)
				{
					fail();
				}
			}
		});
    }
});

app.controller('sendGiftController', function($scope, giftService){
	var sendGiftCtrl = this;
	this.sendGiftData = {};
	this.sending = false;
	this.message = "";
	
	this.sendGift = function()
	 {
		console.log("SendGift uid: " + this.sendGiftData.uid +" payload: " + this.sendGiftData.payload); 
		this.sending = true;
		//return;
		giftService.sendGift(this.sendGiftData.uid, this.sendGiftData.payload, this.successGift, this.failGift);
	 };
	 
	 this.successGift = function()
	 {
		 console.log("Success");
		 sendGiftCtrl.message = "Success";
		 sendGiftCtrl.sending = false;
		 sendGiftCtrl.sendGiftData = {};
		 $scope.$apply();
	 };
	 
	 this.failGift = function()
	 {
		  console.log("Fail"); 
		 sendGiftCtrl.message = "Fail";
		 sendGiftCtrl.sending = false;
		 sendGiftCtrl.sendGiftData = {};
		  $scope.$apply();
	 };
});