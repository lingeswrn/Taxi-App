var app = 	angular.module('BlankApp', ['ngMessages','toastr','ngAnimate','google.places']);

/* CONSTANTS */
app.service( 'Constants', function(){
	this.apiUrl = function(){
		return "http://budjet.000webhostapp.com/API/";
		//return "http://localhost/taxi/PHP/API/";
	};
	
	this.userId = function(){
		return angular.fromJson(sessionStorage.getItem( 'userData' )).id;
	};
});


app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

app.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: true,
    containerId: 'toast-container',
    maxOpened: 0,    
    newestOnTop: true,
    positionClass: 'toast-top-center',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body'
  });
});

/* LOGIN CONTROLLER */
app.controller( 'loginCtrl' , function( $scope, $log, $http, Constants, toastr){
	var API_URL = Constants.apiUrl();
	$scope.loginFormsubmit = function( login ){		
		$http.post( API_URL + 'login.php',{ data: login} ).success( function( response ){
			if( response.code == 400 ){
				toastr.error( response.message );
			}else if( response.code == 200 ){
				sessionStorage.setItem( 'userData',  JSON.stringify(response.data) );
				location.href = "booking.html";
			}
		});
	};
});

/* REGISTRATION CONTROLLER */
app.controller( 'registrationCtrl' , function( $scope, $log, $http, Constants, toastr ){
	var API_URL = Constants.apiUrl();
	
	$scope.registrationFormSubmit = function( registration ){		
		$http.post( API_URL + 'registration.php',{ data: registration} ).success( function( response ){
			if( response.code == 400 ){
				toastr.error( response.message );
			}else if( response.code == 200 ){
				//Toast.common( response.message, 'success' );
			}
		});
	};
});

/* BOOKING CONTROLLER */
app.controller( 'bookingCtrl' , function( $scope, $log, $http, Constants ){
	$scope.places = null;
	$scope.bookingData = {};
	var API_URL = Constants.apiUrl();
	var USER_ID = Constants.userId();
	
	$("#basic_example_1").datetimepicker({format: 'dd-mm-yyyy hh:ii', autoclose: true, startDate:new Date()});
	
	$scope.autocompleteOptions = {
		componentRestrictions: { country: 'in' },
		types: ['geocode']
	}
	
	$scope.bookingFormsubmit = function( bookings ){
		
		//*********DISTANCE AND DURATION**********************//
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix({
			origins: [bookings.from.formatted_address],
			destinations: [bookings.to.formatted_address],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, function (response, status) {
			if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
				var distance = response.rows[0].elements[0].distance.value / 1000;
				var duration = response.rows[0].elements[0].duration.text;
				$scope.booking.distance = distance.toFixed(1);
				$scope.booking.duration = duration;				
				$scope.booking.date = $("#basic_example_1").val();				
				$("#confirm-popup").modal();
				$scope.$apply();
			} else {
				alert("Unable to find the distance via road.");
			}
		});	
	}
	
	$scope.confirmRide = function(){
		$scope.bookingData.userId = USER_ID;
		$scope.bookingData.from = $scope.booking.from.formatted_address;
		$scope.bookingData.to = $scope.booking.to.formatted_address;
		$scope.bookingData.kms = $scope.booking.distance;
		$scope.bookingData.date = $scope.booking.date;
		
		$http.post( API_URL + 'booking.php',{ data: $scope.bookingData }).success( function( response ){
			if( response.code == 200 ){				
				$("#confirm-popup").modal('hide');
				$("#success-popup").modal();
				$(".form-success").addClass('hide');
				$scope.rideStatus();
			}
		});
	}
	
	$scope.rideStatus = function(){
		$scope.bookingData.userId = USER_ID;
		$http.post( API_URL + 'rideStatus.php',{ data: $scope.bookingData }).success( function( response ){
			if( response.code == 400 ){
				$("#pending-popup").modal();
				$(".form-pending").removeClass('hide');
			}else if( response.code == 200 ){
				$(".form-success").removeClass('hide');
			}
		});
	}
	
	$scope.rideStatus();
});

/* PROFILE CONTROLLER */
app.controller( 'profileCtrl', function( $scope, $log, $http, Constants, toastr ){
	var API_URL = Constants.apiUrl();
	var USER_ID = Constants.userId();
	
	$scope.getProfile = function(){
		$http.post( API_URL + 'profile.php',{ data: USER_ID}).success( function( response ){
			$scope.profile = response.data;
		});
	}
	
	$scope.profileFormsubmit = function( profile ){
		profile.userId = USER_ID;
		$log.log( profile );
		$http.post( API_URL + 'updateProfile.php',{ data: profile}).success( function( response ){
			if( response.code == 200 ){
				toastr.success( "Successfully updated!" );
				$scope.getProfile();
			}else{
				toastr.error( "Something went wrong!" );
			}
		});
	}
	
	$scope.getProfile();
});

/* RIDES CONTROLLER */
app.controller( 'ridesCtrl', function( $scope, $log, $http, Constants, toastr ){
	var API_URL = Constants.apiUrl();
	var USER_ID = Constants.userId();
	
	$scope.getRides = function(){
		$http.post( API_URL + 'getRides.php',{ data: USER_ID}).success( function( response ){
			$scope.ridesList = response.data;
		});
	}
	
	$scope.getRides();
});