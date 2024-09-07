app.service('messageService', function($http) {
    this.getAllMessages = function() {
        return $http.get('http://localhost:3000/api/messages');
    };

    this.addMessage = function(newMessage) {
        return $http.post('http://localhost:3000/api/messages', newMessage);
    };

    this.changeMessage = function(id, updatedMessage) {
        return $http.put('http://localhost:3000/api/messages/' + id, updatedMessage);
    };
});