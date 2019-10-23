var mic;
var rec;
var speech;

var inc = 1;
var ellipseArea;
var windowArea;

var txt1 = 'Click to change background color.';
var txt2 = 'Choose a color first';
var txt3 = 'Ok, now inflate it';
var txt4 = 'Keep going and S top it over the area';
var txtErr = 'Right command, but keep inflating!';
var txtSuc = 'There you go. Background changed succesfully';
var txtReinflate = [];
txtReinflate[1] = 'Catch your breath.';
txtReinflate[2] = 'Dai, dai dai!';
txtReinflate[3] = 'Your head spinning already?';
txtReinflate[4] = 'What about quitting smoking?';
txtReinflate[5] = 'What about working out once in a while?';
txtReinflate[6] = 'Dont worry champ, try again.';
txtReinflate[7] = 'Come on, like a dragon!';
txtReinflate[8] = 'Fill your lungs with positive energy.';

var rndInflate;
var lockInflate = false;

var flagClick = true;
var flagColor = false;
var flagStop = false;
var flagFilled = false;
var flagInflate = false;
var flagReinflate = false;

var bgColor;
var mouseCounter = 0;
var finalInc = 0;






function setup() {
  createCanvas(windowWidth, windowHeight);

  // mic input
  mic = new p5.AudioIn();
  mic.start();

  // speech recognition
  rec = new p5.SpeechRec();
  rec.continuous = true;
  rec.start();
  rec.onResult = colorCheck; // if a word is recognized then call recResult function
}



function draw() {
  background('black');

// STEP 1 -  Click to change background
  if (flagClick) {
    push();
    textSize(16);
    textAlign(CENTER);
    fill(255, 255, 255,frameCount*4);
    text(txt1, mouseX, mouseY - 20);
    pop();
  }

// STEP 2 -  Choose the color
  else {

    // get color choice from voice recognition
    var tmpCol = colorCheck();

    if (tmpCol === 'Red' || tmpCol === 'rosso' && !flagColor) {
      bgColor = color(255, 0, 0);
      flagColor = true;
    }
    else if (tmpCol === 'Blue' || tmpCol === 'blu' && !flagColor) {
      bgColor = color(0, 0, 255);
      flagColor = true;
    }
    else if (tmpCol === 'Yellow' || tmpCol === 'giallo' && !flagColor) {
      bgColor = color(255, 255, 0);
      flagColor = true;
    }

    // spawn the 3 coloured ellipses
    if (!flagColor) {                           // multitude of flags to manage text order of spawning

      push();
      fill('red')
      ellipse(width / 2 - 75, height / 2, 50);
      pop();

      push();
      fill('blue')
      ellipse(width / 2, height / 2, 50);
      pop();

      push();
      fill('yellow')
      ellipse(width / 2 + 75, height / 2, 50);
      pop();

      push();
      textSize(16);
      textAlign(CENTER);
      fill(255, 255, 255);
      text(txt2, mouseX, mouseY - 20);
      pop();

      if (mouseCounter > 3){
        push();
        textSize(9);
        textAlign(CENTER);
        fill(255, 255, 255);
        text('Are you doing it right?', mouseX, mouseY - 45);
        pop();
      }
    }

// STEP 3 - Inflate
    else {

      // if stop button is pressed and width of ellipse is big enough then flagStop = YES
      if (lockInflate && inc > width - 500) {
        flagStop = true;
      }

      // if flagStop = NO! then get volume from mic and inflate the ellipse
      if (!flagStop) {

        // get volume from mic
        var vol = mic.getLevel();
        var volMap = map(vol, 0, 1, 1, 100); // volume gets 50 max, anyway

        // shape increments if vol is beyond threshold
        if (volMap > 8) {
          inc += 20 * volMap/500;
          flagInflate = true;
          flagReinflate = false;
          rndInflate = Math.round(random(1,8));
        }
        // shape decrements if vol isn't enuf
        else if (inc > 50) {
          inc -= 2 * inc / 20;

        }
        else if (inc < 50) {
          inc = 50;
          flagReinflate = true;
        }

        // shape inflates
        push();
        fill(bgColor);
        ellipse(width / 2, height / 2, inc);
        pop();

        // if it isnt expanding then invite the user to do it
        if (!flagInflate) {
          push();
          textSize(16);
          textAlign(CENTER);
          fill(255, 255, 255);
          text(txt3, mouseX, mouseY - 40);
          pop();
        }
        // if it just deflated then show a message of encouragement
        else if (flagReinflate && !lockInflate) {
          push();
          textSize(16);
          textAlign(CENTER);
          fill(255, 255, 255);
          text(txtReinflate[rndInflate], mouseX, mouseY - 40);
          pop();
        }

        // if it's expanding good then tell the user what to do next
        else if (inc > windowWidth / 3) {

          // tell the user to press the Stop button after the threshold area
          if (!lockInflate) {
          push();
          textSize(10+inc/90);
          textAlign(CENTER);
          fill(0, 0, 0, .2 * inc);
          text(txt4, width / 2, height / 2);
          pop();
          }

          // show the threshold area
          push();
          noFill();
          stroke(bgColor, inc);
          strokeWeight(1);
          ellipse(width / 2, height / 2, width - 500);
          pop();
        }

        // if the user presses the Stop button before the threshold area then show an error message
        if (lockInflate && inc > width / 3) {
          push();
          textSize(10+inc/90);
          textAlign(CENTER);
          fill(0, 0, 0, .2 * inc);
          text(txtErr, width / 2, height / 2);
          pop();
        }
      }

// STEP 4 - Background changed
    else {
      finalInc += 25;

      // if ellipse is bigger than the threshold area and button Stop is pressed then give the ellipse a final acceleration
      push();
      fill(bgColor);
      ellipse(width / 2, height / 2, inc + finalInc);
      pop();

      // show success message
      push();
      textSize(18);
      textAlign(CENTER);
      fill(0, 0, 0);
      text(txtSuc, width / 2, height / 2);
      pop();
    }
  }
  }

}

// check mouse click
function mouseClicked() {
  flagClick = false;
  mouseCounter += 1;
}

// check speech recogniton string
function colorCheck(){
  var result = rec.resultString;
  return result;
}

// key control for the Stop button
function keyPressed(){
  if (key == 's' || key == 'S') {
    lockInflate = true;
  }
}

function keyReleased(){
    if (key == 's' || key == 'S') {
      lockInflate = false;
    }
}
