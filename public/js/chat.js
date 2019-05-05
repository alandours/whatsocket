import { formatTime } from './helpers.js';

let userInfo;
let server;

if(location.hostname === 'localhost' || location.hostname === '127.0.0.1'){
    server = 'localhost:4000'
}else{
    server = 'https://whatsocket.herokuapp.com';
}

fetch('/getUserInfo', {
    method: 'get'
})
.then(response => {
        response.json()
        .then(response => {
            userInfo = response.data;
        });
    }
);

const socket = io.connect(server, {
  transports: ['websocket'], 
  upgrade: false
});

const pathName = window.location.pathname;
const chatId = pathName.substr(pathName.lastIndexOf('/') + 1);

const time = document.getElementsByClassName('time')[0];
const message = document.getElementsByClassName('message')[0];
const sendBtn = document.getElementsByClassName('send-msg')[0];
const displayName = document.getElementsByClassName('display-name')[0];
const chatWindow = document.getElementsByClassName('chat-window')[0];
const status = document.getElementsByClassName('status')[0];

let typingTimeout, msgContent;

const removeBubbles = (type) => {
    
    const bubbles = document.getElementsByClassName(type);

    for(let i = (bubbles.length - 1); i >= 0; i--){
        bubbles[i].parentNode.removeChild(bubbles[i]);
    }

}

const typingStopped = () => { 
    socket.emit('typing', false);
}

const sendMessage = () => {

    if(message.value.trim().length === 0) return;

    socket.emit('send message', {
        room: chatId,
        message: message.value,
        username: localStorage.getItem('myUsername')
    });

    message.value = '';
    status.innerHTML = userInfo.online;

}

socket.emit('join room', chatId);

time.innerHTML = formatTime(new Date());

/* Send message (send button) */
sendBtn.addEventListener('click', sendMessage);

/* Send message (enter) */
message.addEventListener('keydown', (e) => {
    if(e.keyCode === 13){
        e.preventDefault();
        sendMessage();
    }
});

/* Send 'typing' event */
message.addEventListener('keyup', () => {
    socket.emit('typing', {
        username: localStorage.getItem('myUsername')
    });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(typingStopped, 1000);
});

/* Listen for new messages */
socket.on('chat', function(data){

    msgContent = document.createElement('div');
    msgContent.classList.add('output');

    if(data.username === localStorage.getItem('myUsername')){

        msgContent.classList.add('msg-green');

        msgContent.innerHTML = `<div class="msg">
                                    <p class="msg-content">${data.message}</p>
                                    <span class="msg-time">${formatTime(new Date())}<img class="ticks" src="/img/ticks.png"></span>
                                    <img class="bubble-green" src="/img/bubble-green.svg">
                                </div>`;

        removeBubbles('bubble-green');

    }else{

        displayName.innerHTML = data.username ? data.username : userInfo.unknown;

        msgContent.classList.add('msg-white');

        msgContent.innerHTML = `<div class="msg">
                                    <p class="msg-content">${data.message}</p>
                                    <span class="msg-time">${formatTime(new Date())}</span>
                                    <img class="bubble-white" src="/img/bubble-white.svg">
                                </div>`;
        
        removeBubbles('bubble-white');

    }

    chatWindow.appendChild(msgContent);

});

/* Listen for 'typing' event */
socket.on('typing', function(data){
    if(data){
        displayName.classList.add('status-online');
        status.innerHTML = userInfo.typing;
    }else{
        displayName.classList.add('status-online');
        status.innerHTML = userInfo.online;
    }
});

/* Listen for 'connected' event */
socket.on('connected', function(){
    displayName.classList.add('status-online');
    status.innerHTML = userInfo.online;
});

/* Listen for 'disconnected' event */
socket.on('disconnect', function(data){
    displayName.classList.remove('status-online');
    status.innerHTML = '';
});