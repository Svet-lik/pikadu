// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');
// отслеживаем клик по кнопке меню и запускаем функцию 
menuToggle.addEventListener('click', function (event) {
  // отменяем стандартное поведение ссылки
  event.preventDefault();
  // вешаем класс на меню, когда кликнули по кнопке меню 
  menu.classList.toggle('visible');
});

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form')
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');

// временная база данных пользователей
const listUsers = [{
    id: '01',
    email: 'ann@ya.ru',
    password: '12345',
    displayName: 'ann'
  },
  {
    id: '02',
    email: 'oleg@ya.ru',
    password: '345',
    displayName: 'oleg'
  },
];
// работает с авторизацией
const setUsers = {
  user: null,
  // авторизуемся
  logIn(email, password, handler) {
    const user = this.getUser(email);
    if (user && user.password === password) {
      this.authorisedUser(user);
      handler();
    } else {
      alert('Пользователь с такими данными не найден')
    }
  },
  // выход
  logOut() {

  },
  // регистрация
  signUp(email, password, handler) {
    if (!this.getUser(email)) {
      const user = {
        email,
        password,
        displayName: email.split('@')[0]
      }
      listUsers.push(user);
      this.authorisedUser(user);
      handler();
    } else {
      alert('Пользователь с таким email уже зарегистрирован')
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
// переключает форму авторизации
const toggleAuthDom = () => {
  const user = setUsers.user;
  console.log('user ', user);
  if (user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
  } else {
    loginElem.style.dispay = '';
    userElem.style.display = 'none';
  }
};
// обработчик события отправки данных формы
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);
});
// эобработчик нажатия на кнопку регистрации
loginSignup.addEventListener('click', event => {
  event.preventDefault();
  setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
});
// вызываем проверку авторизованности
toggleAuthDom();