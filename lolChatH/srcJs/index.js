(function () {
    'use strict';

    //Первичная проверка

    firstSetup();

    function firstSetup() {

        if (localStorage.getItem('_user')) {
            showChatBody();
            getLenqth();
            refreshPage();
        } else {
            showAuthForm();
        }
    }

    //Группа входа

    let user = JSON.parse(localStorage.getItem('_user')) || null;

    let signInform = document.querySelector('.login-form');
    let signUpform = document.querySelector('.register-form');

    function signUp() {

        let data = {
            username: signUpform.querySelector('.r-username').value,
            email: signUpform.querySelector('.email').value,
            password: signUpform.querySelector('.r-password').value
        };

        api.post('https://lolchatt.herokuapp.com/users', data, user => {
            signUpform.reset();
            data = null;
            localStorage.setItem('_user', JSON.stringify(user));
        });
    }

    function signIn() {

        let data = {
            email: signInform.querySelector('.l-email').value,
            password: signInform.querySelector('.l-password').value
        };

        api.get(`https://lolchatt.herokuapp.com/users?email=${data.email}&password=${data.password}`, response => {

            if (!response.length) {
                showAuthForm();
                shovSubError();
            } else {
                user = response[0];
                signInform.reset();
                data = null;
                localStorage.setItem('_user', JSON.stringify(user));
                showChatBody();
                refreshPage();
            }
        });
    }

    signUpform.onsubmit = event => {
        event.preventDefault();
        signUp();
        document.getElementById('login-button').click();
    }

    signInform.onsubmit = event => {
        event.preventDefault();
        signIn();
    }

    //Пост на сервер

    document.querySelectorAll('.js-comments-form').forEach(commentForm => {
        commentForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let getUserData = JSON.parse(localStorage.getItem('_user'));
            this.userId = getUserData.id;
            this.userName = getUserData.username;

            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            let h = today.getHours();
            let min = ('0' + today.getMinutes()).slice(-2); //добавляет 0 и выводит две цифры с права

            today = `${dd}/${mm}/${yyyy}  ${h}:${min}`;
            this.today = today;

            add({
                    date: this.today,
                    body: this.comment.value,
                    username: this.userName,
                    user_Id: this.userId
                })
                .then(() => commentForm.reset())
                .then(getLenqth)
        })
    });

    function add(comment) {
        return fetch('https://lolchatt.herokuapp.com/comments', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    //Отрисовка с сервера

    var namb = 20;

    window.oldScrollY = window.scrollY;
    document.onscroll = event => {
        let res = window.oldScrollY > window.scrollY ? 1 : 2;
        window.oldScrollY = window.scrollY;

        if (res == 2 && window.scrollY > 1000) {
            namb++;
            getLenqth();
            document.getElementById('topBtn').style.display = 'block';
        } else document.getElementById('topBtn').style.display = 'none';
    }

    document.getElementById('topBtn').onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function getLenqth() {
        return fetch('https://lolchatt.herokuapp.com/comments')
            .then(response => response.json())
            .then(data => {

                let startMess = data.length - namb;
                let limit = data.length;

                if (startMess < 0) {
                    startMess = 0;
                }

                itemsReload(startMess, limit);
            });
    }

    function itemsReload(lastPage, limitNam) {
        return fetch(`https://lolchatt.herokuapp.com/comments?_start=${lastPage}&_limit=${limitNam}`)
            .then(response => response.json())
            .then(render);
    }

    let commentList = document.querySelector('#comment-list');

    function render(items) {
        commentList.innerHTML = '';

        items.forEach(com => {

            let regex = /^(ftp|http|https):\/\/[^ "]+$/;

            if (regex.test(com.body)) { commentList.insertAdjacentHTML('afterbegin', `
                    <div class="toast-container">
                    <div class="toast">
                        <div class="toast-header">       
                        <div class="autor">${com.username}</div>        
                        <div class="date">${com.date}</div>
                        <div class="closeBtn">
                            <span class="spnDel" id="${com.id}">X</span>
                        </div>
                        </div>
                        <div class="toast-body"><a href="${com.body}" target="_blank">${com.body}</a>
                        
                        </div>
                    </div>
                    </div>
                    `);
            } else { commentList.insertAdjacentHTML('afterbegin', `
                    <div class="toast-container">
                    <div class="toast">
                        <div class="toast-header">       
                        <div class="autor">${com.username}</div>        
                        <div class="date">${com.date}</div>
                        <div class="closeBtn">
                            <span class="spnDel" id="${com.id}">X</span>
                        </div>
                        </div>
                        <div class="toast-body">
                        ${com.body}
                        </div>
                    </div>
                    </div>
                    `);
            }
        });
    }

    //удаление на странице

    function delCom() {
        document.querySelector('.comment-list').addEventListener('click', event => {
            if (event.target.matches('span.spnDel')) {
                event.target.closest('div.toast-container').remove();

                let id = event.target.getAttribute('id');
                //или return fetch('http://localhost:3000/comments/'+id, {
                // method: 'DELETE',
                // })
                itemsDelite(id);
                //getLenqth();
            }
        });
    }
    delCom();

    // удаление на сервере

    function itemsDelite(id) {
        return fetch('https://lolchatt.herokuapp.com/comments/' + id, {
            method: 'DELETE',
        });
    }

    //выход с аккаунта

    document.querySelector('.out').onclick = event => {
        logOut();
    }

    function logOut() {
        user = null;
        localStorage.removeItem('_user');
        showAuthForm();
        stop();
    }

    function showAuthForm() {
        document.querySelector('.display-auth').style.display = 'block';
        document.querySelector('.chatBodi').style.display = 'none';
    }

    function showChatBody() {
        document.querySelector('.display-auth').style.display = 'none';
        document.querySelector('.chatBodi').style.display = 'block';
    }

    // злой таймер

    var reloadPage;

    function refreshPage() {
        reloadPage = setTimeout(function tick() {
            getLenqth();
            reloadPage = setTimeout(tick, 6000);
        }, 4);
    }

    function stop() {
        clearTimeout(reloadPage);
    }

    // ошибка при входе

    function shovSubError() {
        document.querySelector('.valid-p').style.display = 'block';

        function clear() {
            document.querySelector('.valid-p').style.display = 'none';
        }
        setTimeout(clear, 8000);
    }
    
})();