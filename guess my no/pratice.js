"use strict";

let secretNum = Math.trunc(Math.random()*20)+1;
let highscore = 0;
let score = 20;

const displayMessage = function(message){
  document.querySelector('.message').textContent = message;

}


document.querySelector('.check').addEventListener('click',function(){
    const guess = Number(document.querySelector('.guess').value);
    console.log(guess);
  
    if(!guess){
      // document.querySelector('.message').textContent = 'No Number!';
      displayMessage('No Number');
    }

    else if(secretNum === guess){
      // document.querySelector('.message').textContent = 'Guess Is Right';
      displayMessage('Guess is Right');
      document.querySelector('body').style.backgroundColor = 'green';
      document.querySelector('.number').style.width = '30rem';
      document.querySelector('.number').textContent = secretNum;

      if(score > highscore){
        highscore = score;
        document.querySelector('.highscore').textContent =  highscore;
        
      }
    }

    else if(guess != secretNum){
      if(score > 1){
        // document.querySelector('.message').textContent = guess > secretNum ? 'Too High':'Too Low';
        displayMessage(guess > secretNum ? 'Too High':'Too Low');
        score--;
        document.querySelector('.score').textContent = score;
      }
      else{
        document.querySelector('.message').textContent = 'YOU lOST THE GAME!';
        document.querySelector('.score').textContent = 0;
      }
    }

    /*
    else if(guess > secretNum){
      if(score > 1){
          document.querySelector('.message').textContent = 'Too high!';
          score--;
          document.querySelector('.score').textContent = score;
      }
      else{
          document.querySelector('.message').textContent = 'YOU lOST THE GAME!';
          document.querySelector('.score').textContent = 0;
        }
    }
    else if (guess<secretNum ){
      if(score > 1){
          document.querySelector('.message').textContent = 'Too Low!';
          score--;
          document.querySelector('.score').textContent = score;
        } 
        else{
          document.querySelector('.message').textContent = 'U lost The Game';
          document.querySelector('.score').textContent = 0;
        } 
    }
    */
});

document.querySelector('.again').addEventListener('click',function(){
  secretNum = Math.trunc(Math.random()*20)+1;
  score = 20;
  document.querySelector('.message').textContent = "Start Guessing";
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';


});