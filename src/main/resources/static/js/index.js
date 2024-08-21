'use strict';

//elements
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const connectingElement = document.querySelector('.connecting');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');


//variables
let stompClient = null;
let nickname = null;
let fullname = null;
let selectedUserId = null;


//event listeners
usernamePage.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);

logout.addEventListener('click', function(){
    stompClient.send("/app/user.disconnectUser",
        {},
        JSON.stringify({nickName: nickname, fullName: fullname, status: 'OFFLINE'})
    );
    window.location.reload();
});



//functions
function connect(event) {
    nickname = document.querySelector('#nickname').value.trim();
    fullname = document.querySelector('#fullname').value.trim();
    // console.log(nickname);
    // console.log(fullname);
    if(nickname && fullname) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        //socket connection
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);

    }
    event.preventDefault();
}


function onConnected() {
    // console.log('websocket connected');
    stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived);
    stompClient.subscribe(`/user/topic`, onMessageReceived);

    //register user
    stompClient.send(
        "/app/user.addUser",
        {},
        JSON.stringify({nickName: nickname, fullName: fullname})
    );

    document.querySelector("#connected-user-fullname").textContent = fullname;
    findAndDisplayConnectedUsers().then();

}


async function findAndDisplayConnectedUsers() {
    const connectedUsersResponse = await fetch('/users')
    let connectedUsers = await connectedUsersResponse.json();
    connectedUsers = connectedUsers.filter(user => user.nickName !== nickname);

    //get connected users list element
    const connectedUsersList = document.querySelector('#connectedUsers');
    connectedUsersList.innerHTML = '';

    connectedUsers.forEach(user => {
        appendUserElement(user, connectedUsersList);
        if(connectedUsers.indexOf(user) < connectedUsers.length-1){
            const separator = document.createElement('li');
            separator.classList.add('separator');
            connectedUsersList.appendChild(separator);
        }
    })

}


function appendUserElement(user, connectedUsersList){
    console.log(user);
    const listItem = document.createElement('li')
    listItem.classList.add('user-item');
    listItem.id = user.nickName

    const userImage = document.createElement('img');
    userImage.src = 'https://www.w3schools.com/howto/img_avatar.png';
    userImage.alt = user.fullName;

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = user.fullName;

    const receiveMsgSpan = document.createElement('span');
    receiveMsgSpan.textContent = '0';
    receiveMsgSpan.classList.add('nbr-msg', 'hidden');

    listItem.appendChild(userImage);
    listItem.appendChild(usernameSpan);
    listItem.appendChild(receiveMsgSpan);

    listItem.addEventListener('click', userItemClick)

    connectedUsersList.appendChild(listItem)
}


function userItemClick(event){
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
    });
    messageForm.classList.remove('hidden');

    const clickedUserLi = event.currentTarget;
    clickedUserLi.classList.add('active');

    selectedUserId = clickedUserLi.id;
    fetchAndDisplayUserChat().then();

    const nbrMsg = clickedUserLi.querySelector('.nbr-msg');
    nbrMsg.classList.add('hidden');
    nbrMsg.textContent = '0';

}


async function fetchAndDisplayUserChat(){
    const userChatResponse = await fetch(`/messages/${nickname}/${selectedUserId}`);
    const userChat = await userChatResponse.json();

    chatArea.innerHTML = '';
    userChat.forEach(chat => {
        displayMessage(chat.senderId, chat.content);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}

function displayMessage(senderId, content){
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    if(senderId === nickname){
        messageContainer.classList.add('sender');
    }else {
        messageContainer.classList.add('receiver');
    }
    const message = document.createElement('p');
    message.textContent = content;
    messageContainer.appendChild(message);
    chatArea.appendChild(messageContainer);
}


function onError(error) {
    alert('Could not connect to WebSocket server. Please refresh this page to try again!');
    console.log(error);
}

async function onMessageReceived(payload) {
    await findAndDisplayConnectedUsers();

    const message = JSON.parse(payload.body);
    if(selectedUserId && selectedUserId === message.senderId){
        displayMessage(message.senderId, message.content);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    if(selectedUserId){
        document.querySelector(`#${selectedUserId}`).classList.add('active');
    }{
        messageForm.classList.add('hidden');
    }

    const notifyUser = document.querySelector(`#${message.senderId}`);
    if(notifyUser && !notifyUser.classList.contains('active')){
        const nbrMsg = notifyUser.querySelector('.nbr-msg');
        nbrMsg.classList.remove('hidden');
        nbrMsg.textContent = 'i';
    }

}


function sendMessage(event){
    const messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        const chatMessage = {
            senderId: nickname,
            recipientId: selectedUserId,
            content: messageContent,
            timestamp: new Date()
        };
        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        displayMessage(nickname, messageContent);
        messageInput.value = '';
    }else{
        alert('Please enter a message to send');
        alert('please refresh the page and try again');
    }
    chatArea.scrollTop = chatArea.scrollHeight;
    event.preventDefault();
}

