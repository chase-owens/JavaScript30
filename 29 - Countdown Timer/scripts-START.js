const display = document.querySelector('.display');
const form = document.getElementById('custom');
const timerButtons = document.querySelectorAll('.timer__button');
const alarm = document.querySelector('audio');

let timer;

function displayEndTime(secondsFromNow) {
  const endDateTime = new Date(Date.now() + secondsFromNow * 1000);
  const endHour = endDateTime.getHours();
  const endHour12 = endHour > 12 ? endHour - 12 : endHour;
  let endMinutes = String(endDateTime.getMinutes());
  const meridiemSide = endHour > endHour12 ? 'PM' : 'AM';

  display.querySelector(
    'p'
  ).textContent = `Be back at ${endHour12}:${addStarting0(
    endMinutes
  )} ${meridiemSide}`;
}

function displayTimeRemaining(secondsLeft) {
  const minutesRemaining = Math.floor(secondsLeft / 60);
  let secondsRemaining = secondsLeft % 60;

  const timeRemaining = `${minutesRemaining}:${addStarting0(secondsRemaining)}`;

  display.querySelector('h1').textContent = timeRemaining;
  document.title = timeRemaining;
}

function displayWelcomeBackMessage() {
  endDateTime = null;
  secondsLeft = null;

  display.querySelector('h1').textContent = ``;
  display.querySelector('p').textContent = `Welcome back`;
}

function addStarting0(number) {
  return number < 10 ? `0${number}` : number;
}

function handleCountdown(secondsLeft) {
  // Clear timer if counting down
  clearInterval(timer);

  return (timer = setInterval(() => {
    if (secondsLeft > 1) {
      secondsLeft = secondsLeft - 1;
      displayTimeRemaining(secondsLeft);
    } else {
      alarm.play();
      clearInterval(timer);
      displayWelcomeBackMessage();
      return;
    }
  }, 1000));
}

function handleFormSubmit(event) {
  event.preventDefault();
  const minutes = parseInt(this.querySelector('[name=minutes]').value);
  const seconds = minutes * 60;
  startCountdown(seconds);
  this.reset();
}

function handleTimeClick() {
  const seconds = parseInt(this.dataset.time);
  startCountdown(seconds);
}

function startCountdown(seconds) {
  displayEndTime(seconds);
  displayTimeRemaining(seconds);
  timer = handleCountdown(seconds);
}

timerButtons.forEach(timeButton =>
  timeButton.addEventListener('click', handleTimeClick)
);
form.addEventListener('submit', handleFormSubmit);
