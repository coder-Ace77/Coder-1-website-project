const loginbutton = document.querySelector('#loginbutton');
const modal = document.querySelector('.modal-box');
const close = document.querySelector('.cancelModal');

loginbutton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

close.addEventListener('click', (e) => {
    modal.style.display = 'none';
});