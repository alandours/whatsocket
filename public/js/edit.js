import { formatTime } from './helpers.js';

document.addEventListener('DOMContentLoaded', () => {
    const userName = document.getElementsByClassName('edit-name')[0];
    const userInfo = document.getElementsByClassName('edit-info')[0];

    userName.value = localStorage.getItem('myUsername') ? localStorage.getItem('myUsername') : '';
    userInfo.value = localStorage.getItem('myInfo') ? localStorage.getItem('myInfo') : '';

    userName.addEventListener('blur', () => {
        localStorage.setItem('myUsername', userName.value);
    });

    userInfo.addEventListener('blur', () => {
        localStorage.setItem('myInfo', userInfo.value);
    });

    const time = document.getElementsByClassName('time')[0];
    time.innerHTML = formatTime(new Date());
});