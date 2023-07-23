console.log("fetcher.js loaded");
const openSocket = io();

openSocket.on('judged', data => {
    const status = document.querySelector('.status-box');
    status.innerHTML = data.status;
})