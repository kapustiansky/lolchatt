(function () {
    'use strict';
   
    //Первичная проверка

    firstSetup();

    function firstSetup() {

        if (localStorage.getItem('_user')) {
            //getLenqth();
            //itemsReload();
            showChatBody();
            refreshPage();
        } else {
            showAuthForm();
            //test
            //history.pushState(null, null, '/login');
            //let stateObj = { foo: "login" };
	        //history.pushState(stateObj, "page 2", "login");
        }
    }

    //Группа входа

    let signInform = document.querySelector('.login-form');
    let signUpform = document.querySelector('.register-form');

    function signUp() {

        let data = {
            name: signUpform.querySelector('.r-username').value,
            email: signUpform.querySelector('.email').value,
            password: signUpform.querySelector('.r-password').value
        };

        return fetch('https://lolchatt.herokuapp.com/registration',  {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then( response => {
            if( response.status !== 201) {
                console.log(response.status);
                //alert('error');
            } else {
                document.getElementById('login-button').click();
                //test
                //history.pushState(null, null, '/login');
                //let stateObj = { foo: "login" };
	            //history.pushState(stateObj, "page 2", "login");
            }
        })           
        
    }

    function signIn() {

        let data = {
            email: signInform.querySelector('.l-email').value,
            password: signInform.querySelector('.l-password').value
        };

        return fetch('https://lolchatt.herokuapp.com/login',  {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then( response => {
            if (response.status == 200) {
                //getLenqth();
                //itemsReload();
                refreshPage();
                showChatBody();
                
                signInform.reset();
                data = null;
                
                let userData = response.json();
                userData.then( function (data) {

                    let userSave = {
                        userName: data.user.name,
                        userId: data.user._id,
                        token: data.token
                    }

                    localStorage.setItem('_user', JSON.stringify(userSave))
                 })
                .then(location.reload())
                
                         
            } else {
                    console.log(response.status)
                    showAuthForm();
                    shovSubError();
              }
        })
    }

    signUpform.onsubmit = event => {
        event.preventDefault();
        signUp();
    }

    signInform.onsubmit = event => {
        event.preventDefault();
        signIn();
    }

    //Пост на сервер
    

    document.querySelectorAll('.js-comments-form').forEach(commentForm => {
        commentForm.addEventListener('submit', function (event) {
            event.preventDefault();

            //let getUserData = JSON.parse(localStorage.getItem('_user'));
            this.userId = locStor.userId;
            this.userName = locStor.userName;


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
                .then(//getLenqth()
                itemsReload())
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

    //var namb = 20;

    window.oldScrollY = window.scrollY;
    document.onscroll = event => {
        let res = window.oldScrollY > window.scrollY ? 1 : 2;
        window.oldScrollY = window.scrollY;

        if (res == 2 && window.scrollY > 1000) {
            //namb++;
            //getLenqth();
            document.getElementById('topBtn').style.display = 'block';
        } else document.getElementById('topBtn').style.display = 'none';
    }

    document.getElementById('topBtn').onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // function getLenqth() {
    //     return fetch('http://localhost:3000/comments')
    //        // .then(history.pushState(null, null, '/comments'))
    //         .then(response => response.json())
    //         .then(data => {

    //             let startMess = data.length - namb;
    //             let limit = data.length;

    //             if (startMess < 0) {
    //                 startMess = 0;
    //             }

    //             itemsReload(startMess,limit);
    //         });
    // }

    // function itemsReload(lastPage, limitNam) {
    //     return fetch(`http://localhost:3000/comments?_start=${lastPage}&_limit=${limitNam}`)
    //         .then(response => response.json())
    //         .then(render);
    // }

    function itemsReload() {
        return fetch(`https://lolchatt.herokuapp.com/comments`)
            .then(response => response.json())
            .then(render);
    }

    let commentList = document.querySelector('#comment-list');

    function render(items) {
        commentList.innerHTML = '';
        //console.log(items);

        items.forEach(com => {

            let regexImg = /image/;
            let regexHref = /^(ftp|http|https):\/\/[^ "]+$/;

            if (regexHref.test(com.body)) { commentList.insertAdjacentHTML('afterbegin', `
                    <div class="toast-container">
                    <div class="toast">
                        <div class="toast-header">       
                        <div class="autor">${com.username}</div>        
                        <div class="date">${com.date}</div>
                        <div class="closeBtn">
                        <span class="spnDel${com.user_Id}" id="${com._id}">X</span>
                        </div>
                        </div>
                        <div class="toast-body"><a href="${com.body}" target="_blank">${com.body}</a></div>
                    </div>
                    </div>
                    `);
            } else if (regexImg.test(com.body)) { commentList.insertAdjacentHTML('afterbegin', `
                <div class="toast-container">
                    <div class="toast">
                        <div class="toast-header">       
                        <div class="autor">${com.username}</div>        
                        <div class="date">${com.date}</div>
                        <div class="closeBtn">
                        <span class="spnDel${com.user_Id}" id="${com._id}">X</span>
                        </div>
                        </div>
                        <div class="toast-body"><img src="${com.body}" height="150" width="125"/></div>
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
                        <span class="spnDel${com.user_Id}" id="${com._id}">X</span>
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
        spanNone();
    }

    function spanNone() {
        //let user = JSON.parse(localStorage.getItem('_user'));
        document.querySelectorAll(`.spnDel${locStor.userId}`).forEach(span => {
            span.style.display = 'block';
           });
    }
    

    //удаление на странице

    function delCom() {
        document.querySelector('.comment-list').addEventListener('click', event => {
            if (event.target.matches('span[class*="spnDel"]')) {
                event.target.closest('div.toast-container').remove();

                let id = event.target.getAttribute('id');
                //или return fetch('http://localhost:3000/comments/'+id, {
                // method: 'DELETE',
                // })
                itemsDelite(id);
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
        return fetch('https://lolchatt.herokuapp.com/users/me/logout', {
            method: 'POST',
            headers: {
                Authorization: `${locStor.token}`}
        })
        .then(logOut())  
    }

    function logOut() {
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
            //getLenqth();
            itemsReload();
            reloadPage = setTimeout(tick, 6000);
        }, 0);
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


    //dd test 0.1

    
    var state = 0;

    document.querySelector('.add-files').addEventListener('click', function(event) {

        if (state == 0) {
        document.querySelector('.text').style.display = 'none';
        document.querySelector('.upload-container').style.display = 'block';
        state = 1; } else {
            document.querySelector('.text').style.display = 'block';
            document.querySelector('.upload-container').style.display = 'none';
            state = 0;
        }
        
       // return;
    });

	var dropZone = $('.upload-container');

	dropZone.on('drag dragstart dragend dragover dragenter dragleave drop', function () {
		return false;
	});

	dropZone.on('dragover dragenter', function () {
		dropZone.addClass('dragover');
	});

	dropZone.on('dragleave', function (e) {
		let dx = e.pageX - dropZone.offset().left;
		let dy = e.pageY - dropZone.offset().top;
		if ((dx < 0) || (dx > dropZone.width()) || (dy < 0) || (dy > dropZone.height())) {
			dropZone.removeClass('dragover');
		}
	});

	dropZone.on('drop', function (e) {
		dropZone.removeClass('dragover');
		let files = e.originalEvent.dataTransfer.files;
		sendFiles(files);
	});

	$('#file-input').change(function () {
		let files = this.files;
		sendFiles(files);
	});

	function sendFiles(files) {
		let maxFileSize = 5242880;
		let reader = new FileReader();
		$(files).each(function (index, file) {
			if ((file.size <= maxFileSize) && ((file.type == 'image/png') || (file.type == 'image/jpeg'))) {

				reader.onload = function (event) {


					 var data = event.target.result;
					 this.data = data;


                     let getUserData = JSON.parse(localStorage.getItem('_user'));
                     this.userId = getUserData.userId;
         
                     this.userName = getUserData.userName;
		
					let today = new Date();
					let dd = String(today.getDate()).padStart(2, '0');
					let mm = String(today.getMonth() + 1).padStart(2, '0');
					let yyyy = today.getFullYear();
					let h = today.getHours();
					let min = ('0' + today.getMinutes()).slice(-2);
		
					today = `${dd}/${mm}/${yyyy}  ${h}:${min}`;
					this.today = today;
		
					add({
							date: this.today,
							body: this.data,
                            username: this.userName,
                            user_Id: this.userId
						});

					function add(data) {
						return fetch('https://lolchatt.herokuapp.com/comments', {
							method: 'POST',
							body: JSON.stringify(data),
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
						});
					}
                    //getLenqth();
                    itemsReload();
                    document.querySelector('.add-files').click();
				}
			}
			reader.readAsDataURL(file);
		});

    }

    let locStor = JSON.parse(localStorage.getItem('_user'));
    
})();