/* ════════════════════════════════════════════════════════════════════════════
   PAGE3-CLOCK.JS — Spider Clock Animation (Blood Red + Vantablack)
   ════════════════════════════════════════════════════════════════════════════
   
   FILE PURPOSE:
   Modified spider cursor animation for page 3.
   Main changes from page 1:
   • Vantablack background (#0a0a0a) — almost no light reflection
   • Blood red spider webs (#8B0000) instead of white
   • Clock display in center showing real time
   • Darker, more ominous aesthetic
   
   SAME CORE FUNCTIONALITY AS SCRIPT.JS:
   • Multiple spiders follow cursor
   • Web generation with noise
   • Smooth animation
   
   CAN IMPROVE:
     • Add blood drip animation from web points
     • Add pulsing glow effect synchronized with heartbeat
     • Add animated clock hands (not just digital time)
     • Add spider bite sound effects
════════════════════════════════════════════════════════════════════════════ */


let w, h;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const { sin, cos, PI, hypot, min, max } = Math;


/* ════════════════════════════════════════════════════════════════
   [JS 1]  SPAWN SPIDER FUNCTION — Same as page 1
   ────────────────────────────────────────────────────────────────
   WHY: Creates a spider object with position, movement, and web.
        Same logic as page 1, only rendering color changes.
════════════════════════════════════════════════════════════════ */
function spawn() {

    const pts = many(333, () => {
        return {
            x: rnd(innerWidth),
            y: rnd(innerHeight),
            len: 0,
            r: 0
        };
    });

    const pts2 = many(9, (i) => {
        return {
            x: cos((i / 9) * PI * 2),
            y: sin((i / 9) * PI * 2)
        };
    });

    let seed = rnd(100);
    let tx = rnd(innerWidth);
    let ty = rnd(innerHeight);
    let x = rnd(innerWidth);
    let y = rnd(innerHeight);
    let kx = rnd(0.5, 0.5);
    let ky = rnd(0.5, 0.5);
    let walkRadius = pt(rnd(50, 50), rnd(50, 50));
    let r = innerWidth / rnd(100, 150);

    function paintPt(pt) {
        pts2.forEach((pt2) => {
            if (!pt.len) return;
            drawLine(
                lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
                lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
                x + pt2.x * r,
                y + pt2.y * r
            );
        });
        drawCircle(pt.x, pt.y, pt.r);
    }

    return {
        follow(x, y) {
            tx = x;
            ty = y;
        },

        tick(t) {

            const selfMoveX = cos(t * kx + seed) * walkRadius.x;
            const selfMoveY = sin(t * ky + seed) * walkRadius.y;
            let fx = tx + selfMoveX;
            let fy = ty + selfMoveY;

            x += min(innerWidth / 100, (fx - x) / 10);
            y += min(innerWidth / 100, (fy - y) / 10);

            let i = 0;
            pts.forEach((pt) => {
                const dx = pt.x - x;
                const dy = pt.y - y;
                const len = hypot(dx, dy);
                let r = min(2, innerWidth / len / 5);
                pt.t = 0;
                const increasing = len < innerWidth / 10 && (i++) < 8;
                let dir = increasing ? 0.1 : -0.1;
                if (increasing) {
                    r *= 1.5;
                }
                pt.r = r;
                pt.len = max(0, min(pt.len + dir, 1));
                paintPt(pt);
            });
        }
    };
}


const spiders = many(2, spawn);

addEventListener("pointermove", (e) => {
    spiders.forEach(spider => {
        spider.follow(e.clientX, e.clientY);
    });
});


/* ════════════════════════════════════════════════════════════════
   [JS 2]  ANIMATION LOOP — Modified for blood red color
   ────────────────────────────────────────────────────────────────
   WHY: Same animation as page 1, but with different colors:
        • Background: Vantablack (#0a0a0a)
        • Web/spider: Blood red (#8B0000)
   CAN IMPROVE:
     • Add pulsing opacity for blood effect
     • Add gradient from dark red to bright red
════════════════════════════════════════════════════════════════ */
requestAnimationFrame(function anim(t) {
    if (w !== innerWidth) w = canvas.width = innerWidth;
    if (h !== innerHeight) h = canvas.height = innerHeight;

    /* ── VANTABLACK BACKGROUND ──
       #0a0a0a is as close to vantablack as CSS allows
    ──────────────────────────── */
    ctx.fillStyle = "#0a0a0a";
    drawCircle(0, 0, w * 10);

    /* ── BLOOD RED COLOR ──
       All spider webs and points drawn in blood red
       #8B0000 is "dark red" in web colors
    ────────────────────────── */
    ctx.fillStyle = ctx.strokeStyle = "#8B0000";
    t /= 1000;
    spiders.forEach(spider => spider.tick(t));
    requestAnimationFrame(anim);
});


/* ════════════════════════════════════════════════════════════════
   [JS 3]  CLOCK UPDATE — Display real time in center
   ────────────────────────────────────────────────────────────────
   WHY: Show the current time as a blood-red digital clock.
        Updates every 100ms so time changes smoothly.
   CAN IMPROVE:
     • Add animated clock hands overlaid on the digital time
     • Add seconds in a different color
     • Add AM/PM indicator
     • Sync spider animation to clock seconds
════════════════════════════════════════════════════════════════ */
function updateClock() {
    const clockDisplay = document.getElementById('clockDisplay');
    if (!clockDisplay) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

/* Update clock immediately and then every 100ms */
updateClock();
setInterval(updateClock, 100);


/* ════════════════════════════════════════════════════════════════
   [JS 4]  HELPER FUNCTIONS — Same as page 1
   ────────────────────────────────────────────────────────────────
   WHY: Reused utility functions for drawing and math.
════════════════════════════════════════════════════════════════ */

function rnd(x = 1, dx = 0) {
    return Math.random() * x + dx;
}

function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
    ctx.fill();
}

function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);

    many(100, (i) => {
        i = (i + 1) / 100;
        let x = lerp(x0, x1, i);
        let y = lerp(y0, y1, i);
        let k = noise(x / 5 + x0, y / 5 + y0) * 2;
        ctx.lineTo(x + k, y + k);
    });

    ctx.stroke();
}

function many(n, f) {
    return [...Array(n)].map((_, i) => f(i));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function noise(x, y, t = 101) {
    let w0 = sin(0.3 * x + 1.4 * t + 2.0 +
        2.5 * sin(0.4 * y + -1.3 * t + 1.0));
    let w1 = sin(0.2 * y + 1.5 * t + 2.8 +
        2.3 * sin(0.5 * x + -1.2 * t + 0.5));
    return w0 + w1;
}

function pt(x, y) {
    return { x, y };
}
