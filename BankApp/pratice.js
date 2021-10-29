'use strict';



const account1 = {
  owner: 'Abhishek Sankpal',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2011-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-06-20T17:01:17.194Z',
    '2021-06-24T23:36:17.929Z',
    '2021-06-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Will Smith',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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



// functions
// 1.Date
function displayDate(now,locale){

  const calDayPassed = (date1,date2) => Math.round(Math.abs(date2-date1)/(1000*60*60*24));
  const daysPassed = calDayPassed(new Date(),now);
  	
  if(daysPassed === 0)return 'Today';
  if(daysPassed === 1)return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} day ago`
  else{
    // const day = date.getDay();
    // const month = date.getMonth();
    // const year = date.getFullYear();
    // return `${day}/${month+1}/${year}`;
    return new Intl.DateTimeFormat(locale).format(now);
  }  
}


//2 formatter
function formatCurr(value,local,currency){
  return   new Intl.NumberFormat(local,{
    style:'currency',
    currency:currency
  }).format(value);
}


// 3.Display
function displayMovements(acc){
  containerMovements.innerHTML = '';
  acc.movements.forEach(function(mov,i){
    
    const type = mov > 0 ? 'deposit':'withdrawal';

    // date
    const date = new Date(acc.movementsDates[i]);
    const now = displayDate(date,acc.locale)
    // console.log(date)

    // formatted Movements
    const formattedMov =  formatCurr(mov,acc.locale,acc.currency)


    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date">${now}</div>
      <div class="movements__value">${formattedMov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin",html);
  });
}


// 4.Total Balance
 function displayTotalBalance(acc){
  const bal = acc.movements.reduce((acc,mov)=> acc + mov , 0);
  acc.totalbalance = bal;
  const formattedbal =  formatCurr(acc.totalbalance,acc.locale,acc.currency)
  labelBalance.textContent =  formattedbal;
}



// 5.Summary
 function calcDisplaySummary (acc){

  // Balance In
  const inBalance  = acc.movements.filter(mov=>mov>0).reduce((acc,mov)=> acc+mov,0);
  // fn formatt
  const moneyIn =  formatCurr(inBalance,acc.locale,acc.currency);
  labelSumIn.textContent = moneyIn;

  // Balance Out
  const outBalance = acc.movements.filter(mov => mov < 0).reduce((acc,mov)=> acc+mov , 0);
  const moneyOut =  formatCurr(outBalance,acc.locale,acc.currency);
  labelSumOut.textContent = moneyOut;

  // Intersect
  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) / 100)
  .filter((int, i, arr) => {
    return int >= 1;
  }).reduce((acc, int) => acc + int, 0);

  // fn formatt
  const moneyInt =  formatCurr(interest,acc.locale,acc.currency);
  labelSumInterest.textContent = moneyInt;  
}



// 6.creating USerName
 function createUserName(accArr){
  accArr.forEach(function(acc){
    acc.userName = acc.owner.toLowerCase().split(' ').map((name)=> name[0]).join('')
  }); 
}
createUserName(accounts);




// 7.upadte UI function
function updateUI(acc1){
  displayMovements(acc1);
  displayTotalBalance(acc1);
  calcDisplaySummary(acc1);
} 

// 8.logout
function startLogOut(){
  // set time to 5 min
  function tick(){
    {
    
      const min = String(Math.trunc(time/60)).padStart(2,0);
      const sec = String(time%60).padStart(2,0);
  
      // In each call print remaining time to UI
      labelTimer.textContent = `${min}:${sec}`;
      
      // when 0 seconds , stop timer and log out
      if(time === 0){
        clearInterval(timer);
        labelWelcome.textContent = 'Log In to get Started';
        containerApp.style.opacity = 0;
      }
      time--;
  
    }
  }
  let time = 120;

  // call timer every second
  tick();
  const timer = setInterval(tick,1000)
  return timer;
 
}



// Event Handlers
// login
let currentUser , timer;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  
  currentUser = accounts.find(function(acc){
    return acc.userName === inputLoginUsername.value;
  });
  // name
  labelWelcome.textContent = `Welcome Back ${currentUser.owner.split(' ')[0]}`

  // date
  const now = new Date(); 
  const options = {
    hours:'numeric',
    mintue:'numeric',
    day:'numeric',
    month:'numeric',
    year:'numeric',
    // weekday:'numeric'
  }
  // const local = navigator.language;
  // console.log(local)
  labelDate.textContent = new Intl.DateTimeFormat(currentUser.locale,options).format(now);


  // const date = new Date();
  // const day = date.getDay();
  // const month = date.getMonth();
  // const year = date.getFullYear();
  // labelDate.textContent = `${day}/${month+1}/${year}`
 

  if(currentUser.pin === Number(inputLoginPin.value)){
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    
    // logout
    if(timer) clearInterval(timer);
    timer =  startLogOut();

    // updating UI
    updateUI(currentUser);
  }
});

// Transfer
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const transferAmt = Number(inputTransferAmount.value);

  const transfer = accounts.find((acc)=> acc.userName === inputTransferTo.value);
  
  if(transferAmt <= currentUser.totalbalance && transfer.userName != currentUser.userName){
    transfer.movements.push(transferAmt);
    currentUser.movements.push(-transferAmt);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();

  // date
  currentUser.movementsDates.push(new Date().toISOString());
  transfer.movementsDates.push(new Date().toISOString());

  updateUI(currentUser);

  // timer
  clearInterval(timer);
  timer = startLogOut();

});


// Loan
btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  if(loanAmount > 0 && currentUser.movements.some( mov => mov >= loanAmount * 0.1)){
    currentUser.movements.push(loanAmount);
  }

  // date
  currentUser.movementsDates.push(new Date().toISOString());

  updateUI(currentUser);
  inputLoanAmount.value = '';


  // timer
  clearInterval(timer);
  timer = startLogOut();

});

// close Account
btnClose.addEventListener('click',function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentUser.userName && Number(inputClosePin.value) === currentUser.pin){
    const index = accounts.findIndex((acc)=> acc.userName === currentUser.userName);
    // console.log(index);
    accounts.splice(index,1);
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    containerApp.style.opacity = 0;
  }
});

