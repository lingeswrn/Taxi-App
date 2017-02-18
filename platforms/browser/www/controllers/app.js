var app = 	angular.module('BlankApp', ['ngMaterial','ngAnimate','ngAria','ngMessages','ngAutocomplete']);

/* CONSTANTS */
app.service( 'Constants', function(){
	this.apiUrl = function(){
		return "http://budjet.000webhostapp.com/API/";
		//return "http://localhost/taxi_api/API/";
	};
});

/*GOOGLE TAB DIRECTIVE */
app.directive('disableTap', function($timeout) {
  return {
    link: function() {
      $timeout(function() {
        // Find google places div
        _.findIndex(angular.element(document.querySelectorAll('.pac-container')), function(container) {
          // disable ionic data tab
          container.setAttribute('data-tap-disabled', 'true');
          // leave input field if google-address-entry is selected
          container.onclick = function( e ) {
			  console.log(e)
			  console.log(e.srcElement.parentNode.textContent)
            document.getElementById('autocomplete').blur();
			
          };
        });
      },500);
    }
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
app.controller( 'loginCtrl' , function( $scope, $log, $http, $mdToast, Constants, Toast ){
	var API_URL = Constants.apiUrl();
	
	$scope.loginFormsubmit = function( login ){		
		$http.post( API_URL + 'login.php',{ data: login} ).success( function( response ){
			if( response.code == 400 ){
				Toast.common( response.message, 'error' );
			}else if( response.code == 200 ){
				sessionStorage.setItem( 'userData',  JSON.stringify(response.data) );
				location.href = "booking.html";
				console.log( sessionStorage.getItem('userData') )
			}
		});
	};
});

/* REGISTRATION CONTROLLER */
app.controller( 'registrationCtrl' , function( $scope, $log, $http, $mdToast, Constants, Toast ){
	var API_URL = Constants.apiUrl();
	
	$scope.registrationFormSubmit = function( registration ){		
		$http.post( API_URL + 'registration.php',{ data: registration} ).success( function( response ){
			if( response.code == 400 ){
				Toast.common( response.message, 'error' );
			}else if( response.code == 200 ){
				Toast.common( response.message, 'success' );
			}
		});
	};
});

/* BOOKING CONTROLLER */
app.controller( 'bookingCtrl' , function( $scope, $log, $http, $mdToast, Constants, Toast ){
	/* var placeSearch, autocomplete;
      var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      };

      function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')),{types: ['geocode']});
        //autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocompleteTo')),{types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);
      }

      function fillInAddress() {
        
      }

      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      } */
	  
	  function initAutocomplete() {
  const googleComponents = [
    { googleComponent: 'sublocality_level_1', id: 'city-address-field' },
    { googleComponent: 'locality', id: 'city-address-field' },
    { googleComponent: 'administrative_area_level_1', id: 'state-address-field' },
    { googleComponent: 'postal_code', id: 'postal-code-address-field' },
  ];
  const autocompleteFormField = document.getElementById('autocomplete');
  const autocomplete = new google.maps.places.Autocomplete((autocompleteFormField), {
    types: ['address'],
    componentRestrictions: ['in'],
  });
  google.maps.event.clearInstanceListeners(autocompleteFormField);
  google.maps.event.addListener(autocomplete, 'place_changed', function(){
    const place = autocomplete.getPlace();
	console.log(place)
    /* autocompleteFormField.value = place.name;
    for (const component in googleComponents) {
      const addressComponents = place.address_components;
      addressComponents.forEach( addressComponent => populateFormElements(addressComponent, googleComponents[component]));
    } */
  });
}

	 initAutocomplete(); 
});