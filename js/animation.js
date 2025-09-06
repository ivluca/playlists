const stage = document.getElementById('stage');

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

function spawn(type) {
    const el = document.createElement('div');
    el.className = type;

    if (type === "bubble") {
        const size = rand(
            parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bubble-min')),
            parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bubble-max'))
        );
        el.style.width = size + "px";
        el.style.height = size + "px";
    } else {
        const size = rand(
            parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--octopus-min-size')),
            parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--octopus-max-size'))
        );
        el.style.width = size + "px";
        el.style.height = size + "px";
    }

    const animations = ["rise-up", "fall-down"];
    const anim = animations[Math.floor(Math.random() * animations.length)];

    if (anim === "rise-up") {
        el.style.left = rand(0, window.innerWidth - parseInt(el.style.width)) + "px";
        el.style.top = window.innerHeight + "px";
    } else if (anim === "fall-down") {
        el.style.left = rand(0, window.innerWidth - parseInt(el.style.width)) + "px";
        el.style.top = "-" + parseInt(el.style.height) + "px";
    }

    const dur = rand(
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rise-min')) || 4.0,
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rise-max')) || 10.0
    );
    el.style.setProperty('--dur', dur + "s");

    const scaleMin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale-min')) || 0.8;
    const scaleMax = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale-max')) || 1.2;
    el.style.setProperty('--scale', rand(scaleMin, scaleMax).toFixed(2));

    if (type === "octopus") {
        el.style.setProperty('--octopus-rotation', 'rotate(0deg)');
    }

    el.style.animation = `${anim} var(--dur) linear forwards`;
    el.addEventListener("animationend", () => el.remove());
    stage.appendChild(el);
}

function spawnBurst() {
    const countB = randInt(
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--burst-min')),
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--burst-max'))
    );

    const spawnDelayMax = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spawn-delay-max')) || 500;

    for (let i = 0; i < countB; i++) {
        setTimeout(() => spawn("bubble"), rand(0, spawnDelayMax));
    }

    const countO = randInt(
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--octopus-min')),
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--octopus-max'))
    );
    for (let i = 0; i < countO; i++) {
        setTimeout(() => spawn("octopus"), rand(0, spawnDelayMax));
    }
}

function loop() {
    spawnBurst();
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--burst-gap')) || 4000;
    setTimeout(loop, gap);
}

loop();
