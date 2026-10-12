'use strict';

const startingBalance = 10000;
let iniBal = startingBalance;
let currentAction = 'menu';
let inputBox = null;

const balanceBtn = document.getElementById('balance');
const depositBtn = document.getElementById('deposit');
const withdrawBtn = document.getElementById('withdraw');
const backBtn = document.getElementById('back');
const resetBtn = document.getElementById('resetBtn');

const m1 = document.querySelector('.menu-1');
const m2 = document.querySelector('.menu-2');
const m3 = document.querySelector('.menu-3');
const m4 = document.querySelector('.menu-4');

const keypad = document.getElementById('keypad');
const delBtn = document.getElementById('delBtn');
const checkBtn = document.getElementById('chckBtn');
const transactionBtns = [balanceBtn, depositBtn, withdrawBtn];
const arrow = '<i class="fa-solid fa-arrow-left-long" aria-hidden="true"></i>';
const item = (text) => `${arrow} ${text}`;

function updateButtons() {
  const inMenu = currentAction === 'menu';
  transactionBtns.forEach((btn) => { btn.disabled = !inMenu; });
  backBtn.disabled = currentAction === 'menu'
}
function clearScreen() {
  m1.textContent = '';
  m2.textContent = '';
  m3.textContent = '';
  inputBox = null;
  updateButtons();
}

function showMainMenu() {
  currentAction = 'menu';
  clearScreen();
  m1.innerHTML = item('Check Your Balance');
  m2.innerHTML = item('Deposit');
  m3.innerHTML = item('Withdraw');
  m4.innerHTML = item('Back');
}

function showBalance() {
  currentAction = 'result';
  clearScreen();
  m1.textContent = `Your current balance is: ₱${iniBal.toLocaleString('en-PH')}`;
}

function showAmountEntry(action) {
  currentAction = action;
  clearScreen();
  const label = action === 'deposit' ? 'Enter the amount to deposit...' : 'Enter the amount to withdraw...';
  m1.innerHTML = `<input type="text" id="inputBox" placeholder="${label}" aria-label="${label}" readonly inputmode="none">`;
  m2.textContent = action === 'deposit' ? 'Enter deposit amount, then press OK.' : 'Enter withdrawal amount, then press OK.';
  inputBox = document.getElementById('inputBox');
}

function processAmount() {
  if (!inputBox || !['deposit', 'withdraw'].includes(currentAction)) return;

  const rawAmount = inputBox.value.trim();
  const amount = Number(rawAmount);

  if (!rawAmount || !Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(amount)) {
    m3.textContent = 'Enter a valid positive whole-number amount.';
    return;
  }

  if (currentAction === 'deposit') {
    iniBal += amount;
    m1.textContent = 'Deposit successful!';
    m2.textContent = `Deposited: ₱${amount.toLocaleString('en-PH')}`;
    m3.textContent = `New balance: ₱${iniBal.toLocaleString('en-PH')}`;
  } else {
    if (amount > iniBal) {
      m3.textContent = `Insufficient balance. Current balance: ₱${iniBal.toLocaleString('en-PH')}`;
      return;
    }
    iniBal -= amount;
    m1.textContent = 'Withdrawal successful!';
    m2.textContent = `Withdrawn: ₱${amount.toLocaleString('en-PH')}`;
    m3.textContent = `Remaining balance: ₱${iniBal.toLocaleString('en-PH')}`;
  }

  currentAction = 'result';
  inputBox = null;
}

function resetATM() {
  iniBal = startingBalance;
  showMainMenu();
}

keypad.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || !keypad.contains(button)) return;

  if (button.id === 'delBtn') {
    if (inputBox && ['deposit', 'withdraw'].includes(currentAction)) {
      inputBox.value = inputBox.value.slice(0, -1);
      m3.textContent = '';
    }
    return;
  }

  if (button.id === 'chckBtn') {
    processAmount();
    return;
  }

  if (!button.classList.contains('keypad-btn')) return;
  if (!inputBox || !['deposit', 'withdraw'].includes(currentAction)) return;

  const value = button.dataset.value;
  if (value) {
    inputBox.value += value;
    m3.textContent = '';
  }
});

balanceBtn.addEventListener('click', showBalance);
depositBtn.addEventListener('click', () => showAmountEntry('deposit'));
withdrawBtn.addEventListener('click', () => showAmountEntry('withdraw'));
backBtn.addEventListener('click', showMainMenu);
resetBtn.addEventListener('click', resetATM);

showMainMenu();
