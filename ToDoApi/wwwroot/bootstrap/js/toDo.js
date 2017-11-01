var app = angular.module('toDoApp', []);
app.controller('toDoCtrl', toDoController);

function InitializeData($scope, $http) {
    $scope.toDos = [];
    $scope.toDoName = "";
    $scope.toDoIsComplete = false;
    $scope.index = Number.MAX_SAFE_INTEGER;

    LoadData($scope, $http);
}

function toDoController($scope, $http) {

    $scope.Initialize = function () {
        InitializeData($scope, $http);
    };    

    $scope.sendData = function () {
        AddToDo($scope, $http);
    };

    $scope.editData = function (toDoId, toDoName, toDoIsComplete, index) {
        InitializeEditableData($scope, toDoId, toDoName, toDoIsComplete, index);
    }

    $scope.updateData = function () {
        UpdateToDo($scope, $http);
    };

    $scope.setIsCompleted = function (toDoId, toDoName, toDoIsComplete, index) {
        InitializeEditableData($scope, toDoId, toDoName, toDoIsComplete, index);
        UpdateToDo($scope, $http);
    };

    $scope.deleteData = function (toDoId,index) {
        DeleteToDo($scope, $http, toDoId,index);
    };
}

function LoadData($scope, $http) {
    $http.get("http://localhost:59338/api/todo")
        .then(function (response) {
            console.log("ToDo List Fetched is ")
            console.log(response.data);
            console.log(response);
            

            $scope.toDos = response.data;
            console.log($scope.toDos.length);
            
        }, function (rejection) {

            console.log("ERROR fetching Data " + rejection.data);
        });
}

function AddToDo($scope, $http) {
    console.log("Inside send data");
    var data = {
        "name": $scope.toDoName,
        "isComplete": false
    };

    console.log("Data To Be Submitted is ");
    console.log(data);

    $http.post('http://localhost:59338/api/todo', data)
        .then(function (response) {
            console.log("Data Inserted Successfully....");
            console.log(response.data);
            $scope.toDos.push(response.data);
            $scope.toDoName = "";
            $scope.toDoIsComplete = "false";

        }, function (rejection) {
            console.log("ERROR Inserting Data " + rejection.data);
        });
}

function InitializeEditableData($scope, id, name, isComplete, index) {
    $scope.toDoId = id;
    $scope.toDoName = name;
    $scope.toDoIsComplete = isComplete;
    $scope.index = index;
}

function UpdateToDo($scope, $http) {
    var baseUrl = 'http://localhost:59338/api/todo';
    var url = baseUrl + "/" + $scope.toDoId;

    var data = {
        "id": $scope.toDoId,
        "name": $scope.toDoName,
        "isComplete": $scope.toDoIsComplete
    };

    $http.put(url, data)
        .then(function (response) {
            console.log("Data updated successfully...");
            console.log($scope.toDos.length);
            console.log($scope.toDos[$scope.index]);
            console.log($scope.toDos[$scope.index].name);
            $scope.toDos[$scope.index].name = $scope.toDoName;
            $scope.toDos[$scope.index].isComplete = $scope.toDoIsComplete;
        }, function (rejection) {
            console.log("Error updating data " + rejection.data);
        });
}

function DeleteToDo($scope, $http, id, index) {
    var baseUrl = 'http://localhost:59338/api/todo';
    var url = baseUrl + "/" + id;

    $http.delete(url)
        .then(function (response) {
            console.log($scope.toDos[index]);
            $scope.toDos.splice(index, 1);
            console.log($scope.toDos);
        }, function (rejection) {
            console.log("Error deleting data " + rejection.data);
        });
}