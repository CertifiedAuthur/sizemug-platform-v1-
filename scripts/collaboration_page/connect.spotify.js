const connectSpotifyServer = document.getElementById("connectSpotifyServer");
const spotifyConnect = document.getElementById("spotifyConnect");
const spotifyConnected = document.getElementById("spotifyConnected");

connectSpotifyServer.addEventListener("click", () => {
  spotifyConnect.classList.add(HIDDEN);
  spotifyConnected.classList.remove(HIDDEN);
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

const sportifyPlay = document.getElementById("sportifyPlay");
const sportifyPrev = document.getElementById("sportifyPrev");
const sportifyNext = document.getElementById("sportifyNext");
const sportifySongName = document.getElementById("sportifySongName");
const spotifyConnectedImage = document.getElementById("spotifyConnectedImage");

let currentSportifyMusic = null;
let musicCount = 0;
const musicFiles = ["Davido_feat_someone.mp3", "Asake_-_MMS_feat_Wizkid__Vistanaij.mp3", "Wizkid_-_Piece_Of_My_Heart_feat_Brent_Faiyaz__Vistanaij.mp3", "Wizkid-Bad-Girl-feat-Asake.mp3", "Wizkid-Manya-feat-Mut4y.mp3"];
const TotalMusic = musicFiles.length;

function playMusic() {
  if (currentSportifyMusic) {
    currentSportifyMusic.pause();
    currentSportifyMusic.src = ""; // Release old resource
  }

  currentSportifyMusic = new Audio(`./music/${musicFiles[musicCount]}`);
  currentSportifyMusic.play();
  currentSportifyMusic.playbackRate = 1; // Set playback speed to 1x
  sportifySongName.textContent = musicFiles[musicCount];
  const musicNameArray = musicFiles[musicCount].split(".");
  console.log(musicNameArray);
  const slicedStr = musicNameArray.slice(0, musicNameArray.length - 1).join("");

  console.log(slicedStr);

  spotifyConnectedImage.src = `./images/${slicedStr}.jpg`;

  currentSportifyMusic.addEventListener("ended", () => {
    musicCount = (musicCount + 1) % TotalMusic;
    playMusic();
  });

  sportifyPlay.setAttribute("data-mode", "play");
}

sportifyPlay.addEventListener("click", function () {
  const mode = this.getAttribute("data-mode") ?? "idle";

  if (!currentSportifyMusic && mode === "idle") {
    playMusic();
    return;
  }

  if (currentSportifyMusic && mode === "play") {
    currentSportifyMusic.pause();
    this.setAttribute("data-mode", "pause");
    return;
  }

  if (currentSportifyMusic && mode === "pause") {
    currentSportifyMusic.play();
    this.setAttribute("data-mode", "play");
  }
});

sportifyNext.addEventListener("click", () => {
  if (!currentSportifyMusic) return;

  musicCount = (musicCount + 1) % TotalMusic;
  playMusic();
});

sportifyPrev.addEventListener("click", () => {
  if (!currentSportifyMusic) return;

  musicCount = (musicCount - 1 + TotalMusic) % TotalMusic;
  playMusic();
});
