class ChatEngine {
    constructor(chatBoxId, userEmail, userName) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        this.socket = io.connect('http://localhost:5000');

        if(this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        this.socket.on('connect', function() {
            console.log('connection established using sockets...');
        });

        self.socket.emit('join_room',  {
            user_email: self.userEmail,
            chatroom: 'codeial'
        });

        self.socket.on('user_joined', function(data) {
            console.log('a user joined', data);
        });
        
        $('#send-message').click(function() {
            let msg = $('#chat-message-input').val();

            if(msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    chatroom: 'codeial'
                });
                $('#chat-message-input').val('');
            }
        });

        self.socket.on('receive_message', function(data) {
            console.log('message received', data);

            let newMessage = $('<li>');
            
            var messageType = 'other-message';

            if(data.user_email == self.userEmail) {
                messageType = 'self-message';
            }

            newMessage.append($('<sub>', {
                'html': data.user_name
            }));

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            $('#chat-messages-list').scrollTop($('#chat-messages-list')[0].scrollHeight);
        });
    }
}