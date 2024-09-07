app.controller('messagesController', function($scope, $filter, messageService) {
    $scope.isAddForm = true;
    $scope.messages = [];
    $scope.filteredMessages = [];
    // variables for form elements 
    $scope.searchType = 'all';
    $scope.startDate = '';
    $scope.endDate = '';
    $scope.searchName = '';
    $scope.nameValue = '';
    $scope.messageValue = '';
    $scope.dateValue = '';

    // get all messages
    $scope.showMessages = function() {
        messageService.getAllMessages().then(function(response) {
            if(response) {
                $scope.messages = response.data;
                filterMessages();
            }
        }).catch(function(error) {
            console.error('Error receiving messages:', error);
        });
    };

    // filter messages
    function filterMessages() {
        switch ($scope.searchType) {
            case "name":
                filterMessagesByName();
                break;
            case "date":
                filterMessagesByDate();
                break;
            default:
                $scope.filteredMessages = $scope.messages;
        }
    }

    // filter messages by name
    function filterMessagesByName() {
        $scope.filteredMessages = $scope.searchName ? $scope.messages.filter(message => message.name.startsWith($scope.searchName)) : $scope.messages;
    }
    
    // filter messages by date
    function filterMessagesByDate() {
        if ($scope.startDate && $scope.endDate) {
            $scope.filteredMessages = $scope.messages.filter(message => 
                new Date(message.date) >= $scope.startDate && new Date(message.date) <= $scope.endDate
            );
        } else if ($scope.startDate) {
            $scope.filteredMessages = $scope.messages.filter(message => new Date(message.date) >= $scope.startDate);
        } else if ($scope.endDate) {
            $scope.filteredMessages = $scope.messages.filter(message => new Date(message.date) <= $scope.endDate);
        } else {
            $scope.filteredMessages = $scope.messages;
        }
    }

    // format the date to the desired format
    $scope.formatDateTime = function(date) {
        return $filter('date')(date, 'HH:mm:ss, dd.MM.yyyy');
    };

    // open modal 
    $scope.openEditModal = function(message) {
        $scope.isAddForm = !message;
        $scope.filteredMessages = [];

        if(message) {
            $scope.nameValue = message.name;
            $scope.messageValue = message.message;
            $scope.dateValue = new Date(message.date);
            $scope.userId = message['_id'];
        }
        var modal = document.getElementById('modal');
        modal.style.display = 'block';
    };

    // clearing the list of users when changing the value of the radio button
    $scope.$watch('searchType', function(newVal, oldVal) {
        $scope.filteredMessages = [];
        resetInputValues();
    });

    // reset input values when we change the value of radio button
    function resetInputValues() {
        $scope.searchName = '';
        $scope.startDate = '';
        $scope.endDate = '';
    }
    
    // close modal
    $scope.closeModal = function() {
        resetInputModalValues();
        var modal = document.getElementById('modal');
        modal.style.display = 'none';
    };

    // reset input values when we close modal
    function resetInputModalValues() {
        $scope.nameValue = '';
        $scope.messageValue = '';
        $scope.dateValue = '';
    }

    // get modal title
    $scope.getTitleModalName = function() {
        return $scope.isAddForm ? "Add message" : "Edit message";
    };

    // save modal values
    $scope.saveChanges = function() {
        var newMessage = {
            name: $scope.nameValue,
            message: $scope.messageValue,
            date: $scope.dateValue
        };

        var promise;
        if (!$scope.isAddForm) {
            promise = messageService.changeMessage($scope.userId, newMessage);
        } else {
            promise = messageService.addMessage(newMessage);
        }

        promise.then(function(response) {
            $scope.closeModal();
        }).catch(function(error) {
            if (!$scope.isAddForm) {
                console.error('Error editing message:', error);
            } else {
                console.error('Error adding message:', error);
            }
        });
    };
});