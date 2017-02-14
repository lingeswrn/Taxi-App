var app = 	angular.module('BlankApp', ['ngMaterial','ngAnimate','ngAria','ngMessages']);

/* CONSTANTS */
app.service( 'Constants', function(){
	this.apiUrl = function(){
		return "http://budjet.000webhostapp.com/API/";
	};
});

/* LOGIN CONTROLLER */
app.controller( 'loginCtrl' , function( $scope, $log, $http ){
	
});

/* REGISTRATION CONTROLLER */
app.controller( 'registrationCtrl' , function( $scope, $log, $http, $mdToast, Constants ){
	var API_URL = Constants.apiUrl();
	$mdToast.show($mdToast.simple()
  .textContent('hello!')
  .parent(document.querySelectorAll('#toaster'))
  .position('top left')
  .hideDelay( 3000 )
  .action('x'));
	$scope.registrationFormSubmit = function( registration ){		
		$http.post( API_URL + 'registration.php',{ data: registration} ).success( function( response ){
			$log.log( response );
			$mdToast.show({
			  hideDelay   : 3000,
			  position    : 'top right'
			});
		});
	};
});