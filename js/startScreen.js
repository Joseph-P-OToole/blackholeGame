
function setupTypewriter(t) {
let HTML = t.innerHTML;

t.innerHTML = "";

let cursorPosition = 0,
    tag = "",
    writingTag = false,
    tagOpen = false,
    typeSpeed = 100,
    tempTypeSpeed = 0;

let type = function() {

    if(!startGame){
        if (writingTag === true) {
            tag += HTML[cursorPosition];
        }

        if (HTML[cursorPosition] === "<") {
            tempTypeSpeed = 0;
            if (tagOpen) {
                tagOpen = false;
                writingTag = true;
            } else {
                tag = "";
                tagOpen = true;
                writingTag = true;
                tag += HTML[cursorPosition];
            }
        }
        if (!writingTag && tagOpen) {
            tag.innerHTML += HTML[cursorPosition];
            //soundEffect.src = './assets/effects/typing1.wav';
            //soundEffect.play();
        }
        if (!writingTag && !tagOpen) {
            if (HTML[cursorPosition] === " ") {
                tempTypeSpeed = 0;
            }
            else {
                tempTypeSpeed = (Math.random() * typeSpeed) + 50;
            }
            //soundEffect.src = './assets/effects/typing1.wav';
            //soundEffect.play();
            t.innerHTML += HTML[cursorPosition];
        }
        if (writingTag === true && HTML[cursorPosition] === ">") {
            tempTypeSpeed = (Math.random() * typeSpeed) + 50;
            writingTag = false;
            if (tagOpen) {
                let newSpan = document.createElement("span");
                t.appendChild(newSpan);
                newSpan.innerHTML = tag;
                tag = newSpan.firstChild;
                //soundEffect.src = './assets/effects/typing2.wav';
                //soundEffect.play();
            }
        }

        cursorPosition += 1;
        if (cursorPosition < HTML.length - 1) {
            setTimeout(type, tempTypeSpeed);
        }
    };
}

return {
    type: type
};
}

let typer = document.getElementById('backStory');

let soundEffect = document.querySelector('#soundEffect');

typer.setAttribute('style','color: #181');

backStory = setupTypewriter(backStory);

backStory.type();