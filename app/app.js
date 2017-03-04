'use strict';

angular.module('username_generator', ['ngRoute', 'duScroll', 'random-words'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'index.html',
    controller: 'UsernameGeneratorCtrl'
  });
}])

.controller('UsernameGeneratorCtrl', ['$scope', '$http', 'RandomWords', function($scope, $http, RandomWords) {

	$scope.name_length = 0;

	$scope.num_subs = {
		'O': 0,
		'l': 1,
		'e': 3,
		's': 5,
		'h': 4
	}

	$scope.symbol_subs = {
		'i': '!',
		'a': '@',
		's': '$',
	}

	$scope.modifiers = {
		min_length: 6,
		max_length: 20
	}

	$scope.createUsername = function() {
		$scope.name_length = 0;
		var generator = $scope.generator;
		var min_length = ($scope.generator.min_length) ? $scope.generator.min_length : $scope.modifiers.min_length;
		var max_length = ($scope.generator.max_length) ? $scope.generator.max_length : $scope.modifiers.max_length;
		var usernameArray = [];
		var before = (Math.random() > 0.5) ? true : false;

		if (before && generator.use_numbers) {
			$scope.createRandomNumber(usernameArray);
		}
		$scope.getWords(usernameArray, min_length, max_length);
		if (!before && generator.use_numbers) {
			$scope.createRandomNumber(usernameArray);
		}

		var username = (generator.use_underscores) ? usernameArray.join('_') : usernameArray.join('');	
		if (generator.use_numbers_as_letters) {
			username = $scope.substituteLetters(username);
		}
		$scope.presentUsername(username);
	}

	$scope.createRandomNumber = function(usernameArray) {
		var threshold = Math.random();
		if (threshold < 0.33) {
			var num = Math.floor(Math.random() * 10);
			usernameArray.push(num);
		} else if (threshold < 0.66) {
			var num = Math.floor(Math.random() * 100);
			usernameArray.push(num);
		} else {
			var num = Math.floor(Math.random() * 1000);
			usernameArray.push(num);
		}
		$scope.name_length += num.toString().length;
		return usernameArray;
	}

	$scope.substituteLetters = function(username) {
		var change_count = 0;
		for (var i = 0; i < username.length; i++) {
			var rand_val = Math.random();
			if (change_count < 1) {
				if (change_count < username.length && Math.random()) {
					if ($scope.num_subs[username.charAt(i)]) {
						username = username.replace(username[i], $scope.num_subs[username.charAt(i)]);
						change_count++;
					}
				}
			} else {
				return username;
			}
		}
		return username;
	}

	$scope.getWords = function(usernameArray, min_length, max_length) {
		while($scope.name_length < min_length) {
			$scope.addWord(usernameArray, max_length);
		}
	}

	$scope.addWord = function(usernameArray, max_length) {
		var word = RandomWords.randomWord();
		var length = word.length + $scope.name_length + (usernameArray.length - 1);
		if (length < max_length) {
			usernameArray.push(word);
			$scope.name_length += word.length;
		}
	}

	$scope.presentUsername = function(username) {
		$("#username-completed").show();
		$scope.username = username;
	}

}]);