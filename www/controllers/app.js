var app = 	angular.module('BlankApp', ['ngMaterial','ngAnimate','ngAria','ngMessages']);

/* CONSTANTS */
app.service( 'Constants', function(){
	this.apiUrl = function(){
		return "http://budjet.000webhostapp.com/API/";
	};
});

/* TOAST */
app.factory( 'Toast', function( $mdToast ){
	var toast = {};
	
	toast.common = function( msg, className){
		$mdToast.show($mdToast.simple()
			.textContent( msg )
			//.parent(document.querySelectorAll('#toaster'))
			.position('top left')
			.theme( className + '-toast' )
			.hideDelay( 4000 )
			.action('x'));
	};
	
	return toast;
});

/* LOGIN CONTROLLER */
app.controller( 'loginCtrl' , function( $scope, $log, $http ){
	
});

/* REGISTRATION CONTROLLER */
app.controller( 'registrationCtrl' , function( $scope, $log, $http, $mdToast, Constants, Toast ){
	var API_URL = Constants.apiUrl();
	
	$scope.registrationFormSubmit = function( registration ){		
		$http.post( API_URL + 'registration.php',{ data: registration} ).success( function( response ){
			if( response.code == 400 ){
				Toast.common( response.message, 'error' );
			}else if( response.code == 200 ){
				$scope.registration.name = "";
				Toast.common( response.message, 'success' );
			}
		});
	};
});