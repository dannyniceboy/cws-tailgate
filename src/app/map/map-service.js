angular.module('cwsTailgate.map.service', ['mongolabResourceHttp'])
.constant('MONGOLAB_CONFIG', {
  API_KEY: 'rQxsZ4OjiJ_6cxUf40Heixvdm8oZg0dT',
  DB_NAME: 'cws-tail-gating'
}) 
.factory('cwsMapPoints', function($mongolabResourceHttp, $window, $q){
	var mongo = $mongolabResourceHttp('tailgates');

	var get = function() {
		return mongo.all();
	}
	
	var add = function(tailgate) {
		if(!!tailgate.useCurrentLocation){
			delete tailgate.useCurrentLocation;
		}
		
		var newTailGate = new mongo(tailgate);
		return newTailGate.$saveOrUpdate();
	}

	var currentLocation = function() {
		var deferred = $q.defer();

		
		if (!angular.isDefined($window.navigator.geolocation)){
			console.log("No geolocation");
			deferred.reject("No geolocation available");
		} else{

			$window.navigator.geolocation.getCurrentPosition(function(success){
				console.log('Got location -> ', success);
				deferred.resolve(success);
			}, function(err){
				deferred.reject(err);
			})
		}

		return deferred.promise;
	}

	return {
		get: get,
		add: add,
		currentLocation: currentLocation 
	};
});
