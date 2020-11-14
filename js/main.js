// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc8Bo35YhxQ3Bax_4wLJtpWYMcaCKYvc8",
  authDomain: "pikadu-13112020.firebaseapp.com",
  databaseURL: "https://pikadu-13112020.firebaseio.com",
  projectId: "pikadu-13112020",
  storageBucket: "pikadu-13112020.appspot.com",
  messagingSenderId: "1019298924842",
  appId: "1:1019298924842:web:19adbc408d54ad6f9e7653",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');

const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form')
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');
const postsWrapper = document.querySelector('.posts');
const buttonNewPost = document.querySelector('.button-new-post');
const addPostElem = document.querySelector('.add-post');

const DEFAULT_PHOTO = userAvatarElem.src;

// работает с авторизацией
const setUsers = {
  user: null,
  // авторизуемся
  initUser(handler) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }; 
      if (handler) handler();
    })
  },
  logIn(email, password, handler) {
    if (!regExpValidEmail.test(email)) return alert('email не валиден');
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(err => {
      const errCode = err.code;
      const errMessege = err.message;
        if (errCode === 'auth/wrong-password') {
          alert('Неверный пароль')
        } else if (errCode === 'auth/user-not-found') {
          alert('Пользователь не найден')
        } else {
          alert(errMessege);
        }
        console.log(err);
    });
    // const user = this.getUser(email);
    // if (user && user.password === password) {
    //   this.authorisedUser(user);
    //   if (handler) {
    //     handler()
    //   }
    // } else {
    //   alert('Пользователь с такими данными не найден')
    // }
  },
  // выход
  logOut(handler) {
    firebase.auth().signOut();
  },
  // регистрация
  signUp(email, password, handler) {
    if (!regExpValidEmail.test(email)) return alert('email не валиден');

    if (!email.trim() || !password.trim()) {
      alert('Введите данные');
      return;
    }

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data=> {
        this.editUsers(email.substring(0, email.indexOf('@')), null, handler)
      })
      .catch(err=> {
        const errCode = err.code;
        const errMessage = err.message;
        if (errCode === 'auth/weak-password') {
          alert('Слабый пароль')
        } else if (errCode === 'auth/email-already-in-use') {
          alert('Этот email уже используется')
        } else {
          alert(errMessage);
        }
      });

    // if (!this.getUser(email)) {
    //   const user = {
    //     email,
    //     password,
    //     displayName: email.split('@')[0]
    //   }
    //   listUsers.push(user);
    //   this.authorisedUser(user);
    //   if (handler) {
    //     handler()
    //   }
    // } else {
    //   alert('Пользователь с таким email уже зарегистрирован')
    // }
  },
  // редактирование данных пользователя
  editUsers(displayName, photoURL, handler) {
    const user = firebase.auth().currentUser;

    if (displayName) {
      if (photoURL) {
        user.updateProfile({
          displayName,
          photoURL,
        }).then(handler)
      } else {
        user.updateProfile({
          displayName,
        }).then(handler)
      }
    }    
  },
  // получаем конкретного пользователя по его email
  // getUser(email) {
  //   return listUsers.find(item => item.email === email)
  // },
  // authorisedUser(user) {
  //   this.user = user;
  // }
  sendForget(email){
    firebase.auth().sendPasswordResetEmail(email)
    .then(()=>{
      alert('Письмо отправлено')
    })
    .catch(err => {
      console.log(err);
    })
  }
};
const loginForget = document.querySelector('.login-forget');
loginForget.addEventListener('click', event => {
  event.preventDefault();
  setUsers.sendForget(emailInput.value);
  emailInput.value = '';
})
// пост
const setPosts = {
  allPosts: [],

  addPost(title, text, tags, handler) {

    this.allPosts.unshift({
      id: `postID${(+new Date()).toString(16)}-${setUsers.user.uid}`,
      title,
      text,
      tags: tags.split(',').map(item => item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
      },
      date: new Date().toLocaleString(),
      like: 0,
      comments: 0,
    })
    firebase.database().ref('post').set(this.allPosts)
    .then(() => this.getPosts(handler))
  },
  getPosts(handler) {
    firebase.database().ref('post').on('value', snapshot => {
      this.allPosts = snapshot.val() || [];
      handler();
    })
  }
}
// переключает форму авторизации
const toggleAuthDom = () => {
  const user = setUsers.user;
  if (user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;
    buttonNewPost.classList.add('visible');
  } else {
    loginElem.style.display = '';
    userElem.style.display = 'none';
    buttonNewPost.classList.remove('visible');
    addPostElem.classList.remove('visible');
    postsWrapper.classList.add('visible');
  }
};

// проверка email
const emailValidate = (email) => {
  return regExpValidEmail.test(email)
}
const showAddPost = () => {
  addPostElem.classList.add('visible');
  postsWrapper.classList.remove('visible');
}

// выводит все посты
const showAllPosts = () => {
  addPostElem.classList.remove('visible');
  postsWrapper.classList.add('visible');

  let postHTML = '';

  setPosts.allPosts.forEach(({
    title,
    text,
    date,
    author,
    comments,
    like,
    tags
  }) => {
    postHTML += `
        <section class="post">
        <div class="post-body">
          <h2 class="post-title">${title}</h2>
          <p class="post-text">${text}</p>
          <div class="tags">
          ${tags.map(tag => `<a href="#${tag}" class="tag">#${tag}</a>`)}
          </div>
          <!-- /.tags -->
        </div>
        <!-- /.post-body -->
        <div class="post-footer">
          <div class="post-buttons">
            <button class="post-button likes">
              <svg width="19" height="20" class="icon icon-like">
                <use xlink:href="img/icons.svg#like"></use>
              </svg>
              <span class="likes-counter">${like}</span>
            </button>
            <button class="post-button comments">
              <svg width="21" height="21" class="icon icon-comment">
                <use xlink:href="img/icons.svg#comment"></use>
              </svg>
                <span class="comments-counter">${comments}</span>
            </button>
            <button class="post-button save">
              <svg width="19" height="19" class="icon icon-save">
                <use xlink:href="img/icons.svg#save"></use>
              </svg>
            </button>
            <button class="post-button share">
              <svg width="17" height="19" class="icon icon-share">
                <use xlink:href="img/icons.svg#share"></use>
              </svg>
            </button>
          </div>
          <!-- /.post-buttons -->
          <div class="post-author">
            <div class="author-about">
              <a href="#" class="author-username">${author.displayName}</a>
              <span class="post-time">${date}</span>
            </div>
            <a href="#" class="author-link"><img src=${author.photo || "https://ryleeandcru.jp/assets/images/dummy/avatar-staff.png"} alt="avatar" class="author-avatar"></a>
          </div>
          <!-- /.post-author -->
        </div>
        <!-- /.post-footer -->
      </section>
    `;
  })

  postsWrapper.innerHTML = postHTML;

};

const init = () => {
  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', function (event) {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  })

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value
    if (emailValidate(email)) {
      setUsers.logIn(email, password, toggleAuthDom);
      loginForm.reset();
    } else {
      alert('Введите корректный email')
    }
  });

  loginSignup.addEventListener('click', event => {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value
    if (emailValidate(email)) {
      setUsers.signUp(email, password, toggleAuthDom);
    } else {
      alert('Введите корректный email')
    };
    loginForm.reset();
  });

  exitElem.addEventListener('click', event => {
    event.preventDefault();
    setUsers.logOut();
  });

  editElem.addEventListener('click', event => {
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
  });

  editContainer.addEventListener('submit', event => {
    event.preventDefault();

    setUsers.editUsers(editUsername.value, editPhotoURL.value, toggleAuthDom)
    editContainer.classList.remove('visible');
  });

  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', function (event) {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  });

  buttonNewPost.addEventListener('click', event => {
    event.preventDefault();
    showAddPost();
  });

  addPostElem.addEventListener('submit', event => {
    event.preventDefault();
    const {
      title,
      text,
      tags
    } = addPostElem.elements;
    if (title.value.length < 6) {
      alert('Слишком короткий заголовок');
      return;
    };
    if (text.value.length < 50) {
      alert('Слишком короткий пост');
      return;
    };

    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
    addPostElem.classList.remove('visible');
    addPostElem.reset();

  });

  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);
}

document.addEventListener('DOMContentLoaded', init);