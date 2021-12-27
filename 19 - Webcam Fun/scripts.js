const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let colorEffect;

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
    })
    .catch(err => console.error(err));
}

function setEffect(effect) {
  colorEffect = effect;
}

function paintToCanvas() {
  //Set canvas to same dimensions as video
  const { videoWidth: width, videoHeight: height } = video;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    if (colorEffect) {
      let pixels = ctx.getImageData(0, 0, width, height);
      switch (colorEffect) {
        case 'green_screen':
          pixels = greenScreen(pixels);
          break;
        case 'red':
          pixels = redEffect(pixels);
          break;
        case 'split':
          pixels = rgbSplit(pixels);
          break;
        default:
          break;
      }
      ctx.putImageData(pixels, 0, 0);
    }
  }, 16);
}

function takePhoto() {
  //Play sound
  snap.currentTime = 0;
  snap.play();

  //Transform canvas data into a base64 representation of the result of the last drawImage
  const imgUrl = canvas.toDataURL('image/jpeg');

  const link = document.createElement('a');
  link.href = imgUrl;
  link.setAttribute('download', 'photo');
  link.innerHTML = `<img src="${imgUrl}" alt="Picture from Photo Booth" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = 255; // RED - max red pixel value 255
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

//Use video event listeners to play video and paint it to canvas
video.addEventListener('canplay', () => video.play());
video.addEventListener('playing', paintToCanvas);

getVideo();
