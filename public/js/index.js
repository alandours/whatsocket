import { formatTime } from './helpers.js';

document.addEventListener('DOMContentLoaded', () => {
    const userName = document.getElementsByClassName('user-name')[0];
    const userInfo = document.getElementsByClassName('user-info')[0];

    userName.innerHTML = localStorage.getItem('myUsername') ? localStorage.getItem('myUsername') : '';
    userInfo.innerHTML = localStorage.getItem('myInfo') ? localStorage.getItem('myInfo') : '';

    const time = document.getElementsByClassName('time')[0];
    time.innerHTML = formatTime(new Date());

});

