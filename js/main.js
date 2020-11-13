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
console.log(firebase);

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
const addPostElem = document.querySelector('.add-post')

// временная база данных пользователей
const listUsers = [{
    id: '01',
    email: 'ann@ya.ru',
    password: '12345',
    displayName: 'ann',
    photo: 'img/avatar.jpg',
  },
  {
    id: '02',
    email: 'oleg@ya.ru',
    password: '345',
    displayName: 'oleg',
    photo: 'img/avatar2.jpg',
  },
];
// работает с авторизацией
const setUsers = {
  user: null,
  // авторизуемся
  logIn(email, password, handler) {
    if (!regExpValidEmail.test(email)) return alert('email не валиден');
    const user = this.getUser(email);
    if (user && user.password === password) {
      this.authorisedUser(user);
      if (handler) {
        handler()
      }
    } else {
      alert('Пользователь с такими данными не найден')
    }
  },
  // выход
  logOut(handler) {
    this.user = null;
    if (handler) {
      handler()
    }
  },
  // регистрация
  signUp(email, password, handler) {
    if (!regExpValidEmail.test(email)) return alert('email не валиден');

    if (!email.trim() || !password.trim()) {
      alert('Введите данные');
      return;
    }
    if (!this.getUser(email)) {
      const user = {
        email,
        password,
        displayName: email.split('@')[0]
      }
      listUsers.push(user);
      this.authorisedUser(user);
      if (handler) {
        handler()
      }
    } else {
      alert('Пользователь с таким email уже зарегистрирован')
    }
  },
  // редактирование данных пользователя
  editUsers(userName, userPhoto, handler) {
    if (userName) {
      this.user.displayName = userName;
    }
    if (userPhoto) {
      this.user.photo = userPhoto;
    }
    if (handler) {
      handler()
    }
  },
  // получаем конкретного пользователя по его email
  getUser(email) {
    return listUsers.find(item => item.email === email)
  },
  authorisedUser(user) {
    this.user = user;
  }
};
// пост
const setPosts = {
  allPosts: [{
      title: 'Заголовлок поста',
      text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
      tags: [
        'свежее',
        'новое',
        'горячее',
        'мое',
        'случайность'
      ],
      author: {
        displayName: 'Ann',
        photo: 'img/avatar.jpg',
      },
      date: '11.11.2020, 20:54:00',
      like: 15,
      comments: 4
    },
    {
      title: 'Заголовлок поста2',
      text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты.  текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
      tags: [
        'свежее',
        'мое',
        'случайность'
      ],
      author: {
        displayName: 'Oleg',
        photo: 'img/avatar2.jpg',
      },
      date: '10.11.2020, 20:54:00',
      like: 45,
      comments: 12
    },
  ],

  addPost(title, text, tags, handler) {
    console.dir(this);
    this.allPosts.unshift({
      title,
      text,
      tags: tags.split(',').map(item => item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photo,
      },
      date: new Date().toLocaleString(),
      like: 0,
      comments: 0,
    })
    if (handler) {
      handler()
    }
  },

}
// переключает форму авторизации
const toggleAuthDom = () => {
  const user = setUsers.user;
  if (user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photo || userAvatarElem.src;
    buttonNewPost.classList.add('visible');
  } else {
    loginElem.style.dispay = '';
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
      setUsers.singUp(email, password, toggleAuthDom);
    } else {
      alert('Введите корректный email')
    };
    loginForm.reset();
  });

  exitElem.addEventListener('click', event => {
    event.preventDefault();
    setUsers.logOut(toggleAuthDom);
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

  showAllPosts();
  toggleAuthDom();
}

document.addEventListener('DOMContentLoaded', init);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
  } else {
    console.log(null);
  }
});