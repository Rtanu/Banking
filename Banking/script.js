'use strict';

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: 'Almost Lion King',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-ZA',
};

const account2 = {
  owner: 'Edgy Boy',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Explosive Guy',
  movements: [4300, 1234, 120, -860, -3000, -1010, 9100, -15],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Testing

const instructions = document.querySelector('.testing-instructions');
const overlay = document.querySelector('.overlay');
const btnCloseInstructions = document.querySelector('.close-instructions');
const btnsShowInstructions = document.querySelectorAll('.btn--instructions');

const openInstructions = function () {
  instructions.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeInstructions = function () {
  instructions.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsShowInstructions.length; i++)
  btnsShowInstructions[i].addEventListener('click', openInstructions);

btnCloseInstructions.addEventListener('click', closeInstructions);
overlay.addEventListener('click', closeInstructions);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !instructions.classList.contains('hidden'))
    closeInstructions();
});

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Displaying the transactions (aka movements)(deposit/withdrawal)
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // sorting functionality
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // for date next to the transaction
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    // the html part
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type} €">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)} €</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Displaying the balance on the right
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
};

// Showing the summaries in the bottom
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);

  labelSumOut.textContent = `${out.toFixed(2)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// Usernames with initials
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUsernames(accounts);

// Refreshing the UI
const updateUI = function (account) {
  // Display movements (transactions)
  displayMovements(account);

  // Calculate + Display balance
  calcDisplayBalance(account);

  // Calculate + Display summary
  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started `;
      containerApp.style.opacity = 0;
    }

    // Decrease 1 sec
    time--;
  };

  // Set time to x minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

//////////////////////
// Implementing Date
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
// day/month/year

//////////////////////
// Implementing Login

btnLogin.addEventListener('click', function (e) {
  // Prevent the refresh
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear login and password fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    // to lose the focus from password
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

//////////////////////
// Implementing Transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // console.log(amount, receiverAcc);

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Transfering
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//////////////////////
// Implementing Taking a Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

//////////////////////
// Implementing Close Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => currentAccount.username === acc.username
    );

    // Delete the account
    accounts.splice(index, 1);
    // Resetting the opacity
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

/// Sort button

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

///////////////////////////////////////
// Dark/Light Mode Buttons
const html = document.querySelector('html');

// Choosing the correct theme to start with
if (localStorage.getItem('theme') == `theme-light`) {
  html.dataset.theme = `theme-light`;
  handleTheme();
} else if (localStorage.getItem('theme') == `theme-dark`) {
  html.dataset.theme = `theme-dark`;
  document.getElementById('theme-btn').innerHTML = 'Theme: ☀️';
  handleTheme();
} else {
  html.dataset.theme = `theme-light`;
  handleTheme();
}

function handleTheme() {
  if (html.dataset.theme == 'theme-dark') {
    const images = document.querySelectorAll('img');
    images.forEach(image => {
      // changing the image opacity to darker for dark theme
      image.style.transition = 'filter 0.5s';
      image.style.opacity = 0.87;
    });
    // changing to the light logo style
    document.getElementById('logo').src = 'icon.png';
  } else if (html.dataset.theme == 'theme-light') {
    // changing to the dark logo style
    document.getElementById('logo').src = 'logo.png';
  }
}

function switchTheme() {
  if (html.dataset.theme == `theme-dark`) {
    html.dataset.theme = `theme-light`;
    document.getElementById('theme-btn').innerHTML = 'Theme: 🌙';

    // Handling saving user's prefered theme in local storage
    localStorage.setItem('theme', html.dataset.theme);
  } else if (html.dataset.theme == `theme-light`) {
    html.dataset.theme = `theme-dark`;
    document.getElementById('theme-btn').innerHTML = 'Theme: ☀️';

    // Handling saving user's prefered theme in local storage
    localStorage.setItem('theme', html.dataset.theme);
  }
  handleTheme();
}
