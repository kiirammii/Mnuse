import * as User from "../models/modelUsers.js"
import * as Challenges from "../models/modelChallenges.js"

// BACK BUTTON
let btnBackSideInfo = document.getElementById("btnBackSideInfo");

let remainingTime = 300
function updateTimer() {
  if (remainingTime > 0) {
    const countdownClock = document.getElementById("countdownClock")
    countdownClock.innerHTML = `<img src="../../assets/imgs/clock.png"><div id="countdown"></div>`
    const minutes  = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds
    document.getElementById("countdown").innerHTML = `0${minutes}:${secondsDisplay}`
    remainingTime -= 1
  } else {
    let modal = document.getElementById("modalGameOver");
    modal.classList.add("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");
    document.getElementById("btnTryAgain").addEventListener("click", restartGame)
    clearInterval(timerInterval)
  }
}

const timerInterval = setInterval(updateTimer, 1000)

btnBackSideInfo.addEventListener("click", function(event){
    event.preventDefault();
    User.changeLevelLoad(1);
    window.location.href = "level.html";
})


// HELP BUTTON
let textsHelpBtn = document.getElementById("textsHelpBtn");
let challenge = Challenges.challengesList.find(chall => chall.challengeID === "videoBullying");

let line = `${challenge.helpCard}`;
textsHelpBtn.innerHTML += line;

function checkChallengeIs(id) {
    let user = User.getUserLogged();
    let challengeList = user.finishedChallenges;
    return challengeList.includes(id);
}

let wastedTime = 0

let btnSaveSideInfo = document.getElementById("btnSaveSideInfo");
btnSaveSideInfo.addEventListener("click", function() {
    // Save in local storage the challenge completed
    let user = User.getUserLogged();
    let challengeList = user.finishedChallenges;
    let usersList = JSON.parse(localStorage.getItem("users"));
    if (!checkChallengeIs(challenge.challengeID)) {
        challengeList.push(challenge.challengeID);
        const updatedUser = new User.Users(user.username, user.email, user.password, user.avatar, user.currentLevel, user.levelLoad, challengeList, user.badges, user.badgesDescription, user.words, user.code, user.isBlocked, user.timeChallenges, user.isFinished);
        const index = usersList.findIndex(u => u.username === user.username);
        usersList[index] = updatedUser;
        sessionStorage.setItem("loggedUser", JSON.stringify(updatedUser));
        localStorage.setItem("users", JSON.stringify(usersList));
    
        let modal = document.getElementById("challengeSucessfullyCompleted"); // modal saying the challenge is completed
        modal.classList.add("show");
        modal.style.display = "block";
        document.body.classList.add("modal-open");

        wastedTime = 300 - remainingTime
        clearInterval(timerInterval)
        User.getTime(wastedTime)
    } else if (checkChallengeIs(challenge.challengeID)){ // modal saying that the challenge 
        let modal = document.getElementById("challengeAlreadyCompleted");
        modal.classList.add("show");
        modal.style.display = "block";
        document.body.classList.add("modal-open");
        clearInterval(timerInterval)
    }
})

let btnCloseChallengeCompleted = document.getElementById("btnCloseChallengeCompleted")
btnCloseChallengeCompleted.addEventListener("click", function(){
    var modal = document.getElementById("challengeAlreadyCompleted");
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
})

let btnCloseChallengeSucessfull = document.getElementById("btnCloseChallengeSucessfull")
btnCloseChallengeSucessfull.addEventListener("click", function(){
    var modal = document.getElementById("challengeSucessfullyCompleted");
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
})

function restartGame() {
    window.location.reload();
}