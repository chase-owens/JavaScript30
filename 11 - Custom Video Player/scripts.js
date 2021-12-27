const player = document.querySelector('.player');
const video = document.querySelector('.viewer');
const progressContainer = document.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const play = document.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const rangeControls = player.querySelectorAll('.player__slider');
const fullScreen = document.querySelector('.player__fullscreen');

const PLAY_PAUSE_ICONS = {
    pause: '❚ ❚',
    play: '►'
}

const handleTogglePlay = () => {
    const userAction = video.paused ? 'play' : 'pause';
    play.innerHTML = PLAY_PAUSE_ICONS[userAction === 'play' ? 'pause' : 'play'];
    video[userAction]();
}

const handleUpdateProgress = () => 
    progressBar.style.flexBasis = `${(video.currentTime / video.duration) * 100}%`;

const handleUpdateSkip = () => 
    video.currentTime += parseFloat(this.dataset.skip);

const handleUpdateRangeControl = (event) => {
    video[event.target.name] = event.target.value;
}

const handleScrubProgressControl = event => {
    const percentSelected = ( event.offsetX / event.target.offsetWidth ) * 100;
    video.currentTime = video.duration * percentSelected / 100;
}

const handleFullScreenToggle = () => {
    if (video.requestFullscreen) { /* Chrome */
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) { /* Safari */
        video.webkitRequestFullscreen();
    }
}

video.addEventListener('click', handleTogglePlay);
play.addEventListener('click', handleTogglePlay);
video.addEventListener('timeupdate', handleUpdateProgress);
skipButtons.forEach(button => {
    button.addEventListener('click', handleUpdateSkip);
});
rangeControls.forEach(rangeInput => {
    rangeInput.addEventListener('change', handleUpdateRangeControl);
    rangeInput.addEventListener('mousemove', handleUpdateRangeControl);
});
progressContainer.addEventListener('click', handleScrubProgressControl);
fullScreen.addEventListener('click', handleFullScreenToggle)