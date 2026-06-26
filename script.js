/* ════════════════════════════════════════════════════════════════════════════
   SCRIPT.JS — Spider Cursor Animation (Page 1)
   ════════════════════════════════════════════════════════════════════════════
   
   FILE PURPOSE:
   Renders 2D spider cursor animation on canvas.
   Spiders follow the mouse and paint webs with smooth particle motion.
   
   CORE FEATURES:
   • Multiple spiders that follow cursor movement
   • Procedural web generation using Perlin-like noise
   • Smooth animation using requestAnimationFrame
   • Responsive to viewport changes
   
   CAN IMPROVE:
     • Add more spider types with different behaviors
     • Add particle trail effects
     • Add sound effects on web creation
     • Add performance monitor (FPS counter)
     • Add touch/mobile support
════════════════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════
   [JS 1]  CANVAS SETUP — Rendering context initialization
   ────────────────────────────────────────────────────────────────
   WHY: Get the 2D drawing context from the canvas element.
        This is what we use to draw lines, circles, etc.
   HOW:
        • canvas is automatically created in index.html
        • getContext("2d") gives us the 2D drawing API
        • Destructure Math functions for shorter code
   CAN IMPROVE:
     • Add WebGL context for better performance
     • Add pixel-ratio detection for retina displays
════════════════════════════════════════════════════════════════ */
let w, h;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const { sin, cos, PI, hypot, min, max } = Math;


/* ════════════════════════════════════════════════════════════════
   [JS 2]  SPAWN SPIDER FUNCTION — Create a single spider
   ────────────────────────────────────────────────────────────────
   WHY: Factory function that creates a spider object with its own
        state (position, movement, web points).
   RETURNS: An object with follow() and tick() methods:
        • follow(x, y) — update target position (mouse cursor)
        • tick(t) — update animation for each frame
   CAN IMPROVE:
     • Add spider color variation
     • Add different walk patterns (sine, circle, random)
     • Add web elasticity physics
     • Add prey detection (detect other spiders or particles)
════════════════════════════════════════════════════════════════ */
function spawn() {

    /* ── PT: Array of 333 points that form the web ──
       Each point has position (x, y) and rendering state (len, r)
       len = 0 to 1, how much of the web line is drawn
       r = radius of the point circle
    ────────────────────────────────────────────────── */
    const pts = many(333, () => {
        return {
            x: rnd(innerWidth),      /* Random horizontal position */
            y: rnd(innerHeight),     /* Random vertical position   */
            len: 0,                  /* Web visibility (0 = hidden, 1 = visible) */
            r: 0                     /* Point radius              */
        };
    });

    /* ── PTS2: Array of 9 points in a circle ──
       These form the spider's body shape (9-pointed star pattern)
       Each point is a unit vector pointing outward from the center
    ───────────────────────────────────────── */
    const pts2 = many(9, (i) => {
        return {
            x: cos((i / 9) * PI * 2),
            y: sin((i / 9) * PI * 2)
        };
    });

    /* ── SPIDER STATE VARIABLES ──
       seed = unique random value for this spider's behavior
       tx, ty = target position (where cursor is)
       x, y = actual position (follows target smoothly)
       kx, ky = speed of movement in X and Y
       walkRadius = range of small circular movement
       r = size of the spider
    ───────────────────────────────── */
    let seed = rnd(100);
    let tx = rnd(innerWidth);
    let ty = rnd(innerHeight);
    let x = rnd(innerWidth);
    let y = rnd(innerHeight);
    let kx = rnd(0.5, 0.5);
    let ky = rnd(0.5, 0.5);
    let walkRadius = pt(rnd(50, 50), rnd(50, 50));
    let r = innerWidth / rnd(100, 150);

    /* ── PAINT POINT FUNCTION ──
       Draws the web lines and circles for one point
       Connects spider center to web point with smooth lines
    ──────────────────────────── */
    function paintPt(pt) {
        pts2.forEach((pt2) => {
            if (!pt.len) return;  /* Don't draw if point is hidden */
            
            /* Draw line from spider body to web point */
            drawLine(
                lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
                lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
                x + pt2.x * r,
                y + pt2.y * r
            );
        });
        
        /* Draw the point circle */
        drawCircle(pt.x, pt.y, pt.r);
    }

    /* ── RETURN SPIDER OBJECT ──
       Public interface with follow() and tick() methods
    ──────────────────────────────── */
    return {
        follow(x, y) {
            tx = x;
            ty = y;
        },

        tick(t) {
            /* ── SPIDER MOVEMENT ──
               Add small circular motion on top of cursor following
               Creates the walk-around-cursor behavior
            ──────────────────── */
            const selfMoveX = cos(t * kx + seed) * walkRadius.x;
            const selfMoveY = sin(t * ky + seed) * walkRadius.y;
            let fx = tx + selfMoveX;
            let fy = ty + selfMoveY;

            /* ── SMOOTH FOLLOWING ──
               Spider doesn't jump directly to target
               Moves gradually for smooth animation
            ─────────────────────── */
            x += min(innerWidth / 100, (fx - x) / 10);
            y += min(innerWidth / 100, (fy - y) / 10);

            /* ── UPDATE EACH WEB POINT ──
               This is the main loop that creates the web animation
            ──────────────────────────────── */
            let i = 0;
            pts.forEach((pt) => {
                /* Calculate distance from spider to point */
                const dx = pt.x - x;
                const dy = pt.y - y;
                const len = hypot(dx, dy);
                
                /* Base radius based on distance */
                let r = min(2, innerWidth / len / 5);
                
                pt.t = 0;
                
                /* Check if point is close enough to animate */
                const increasing = len < innerWidth / 10 && (i++) < 8;
                let dir = increasing ? 0.1 : -0.1;
                
                if (increasing) {
                    r *= 1.5;  /* Make point larger when close */
                }
                
                pt.r = r;
                pt.len = max(0, min(pt.len + dir, 1));  /* Clamp 0-1 */
                paintPt(pt);
            });
        }
    };
}


/* ════════════════════════════════════════════════════════════════
   [JS 3]  CREATE SPIDERS — Instantiate multiple spider objects
   ────────────────────────────────────────────────────────────────
   WHY: Create 2 independent spiders that both follow the cursor.
        They have different sizes, speeds, and movements.
   HOW: Use the many() helper to call spawn() twice
   CAN IMPROVE:
     • Make number of spiders configurable
     • Add spider type selection (different colors, behaviors)
     • Add spawn animation when new spider created
════════════════════════════════════════════════════════════════ */
const spiders = many(2, spawn);


/* ════════════════════════════════════════════════════════════════
   [JS 4]  MOUSE TRACKING — Listen for pointer movement
   ────────────────────────────────────────────────────────────────
   WHY: Update all spiders to follow the cursor position.
   CAN IMPROVE:
     • Add touch support (pointermove works for both)
     • Add inertia so spiders lag behind cursor
     • Add click detection to spawn new spiders
════════════════════════════════════════════════════════════════ */
addEventListener("pointermove", (e) => {
    spiders.forEach(spider => {
        spider.follow(e.clientX, e.clientY);
    });
});


/* ════════════════════════════════════════════════════════════════
   [JS 5]  ANIMATION LOOP — requestAnimationFrame main loop
   ────────────────────────────────────────────────────────────────
   WHY: Continuously render the animation at 60 FPS.
        • Resize canvas if viewport changes
        • Clear canvas with black background
        • Update each spider
        • Request next frame
   CAN IMPROVE:
     • Add FPS counter
     • Add performance profiling
     • Add pause/resume control
════════════════════════════════════════════════════════════════ */
requestAnimationFrame(function anim(t) {
    /* ── RESPONSIVE CANVAS ──
       If window was resized, update canvas size
    ──────────────────────── */
    if (w !== innerWidth) w = canvas.width = innerWidth;
    if (h !== innerHeight) h = canvas.height = innerHeight;

    /* ── CLEAR WITH BLACK ──
       Draw a huge black circle to clear the canvas
    ─────────────────────── */
    ctx.fillStyle = "#000";
    drawCircle(0, 0, w * 10);

    /* ── SET DRAW COLOR TO WHITE ──
       All spider webs drawn in white
    ──────────────────────────────── */
    ctx.fillStyle = ctx.strokeStyle = "#fff";

    /* ── CONVERT TIME TO SECONDS ──
       Makes timing easier to reason about
    ─────────────────────────────── */
    t /= 1000;

    /* ── UPDATE ALL SPIDERS ──
       Each spider animates its web
    ─────────────────────────── */
    spiders.forEach(spider => spider.tick(t));

    /* ── REQUEST NEXT FRAME ──
       Recursive animation loop
    ────────────────────────── */
    requestAnimationFrame(anim);
});


/* ════════════════════════════════════════════════════════════════
   [JS 6]  HELPER FUNCTIONS — Utility functions used throughout
   ────────────────────────────────────────────────────────────────
   WHY: Small reusable functions keep the code cleaner.
   CAN IMPROVE:
     • Move to a separate utils.js file
     • Add JSDoc comments for each function
     • Add input validation
════════════════════════════════════════════════════════════════ */

/* Random number — rnd(max, offset) */
function rnd(x = 1, dx = 0) {
    return Math.random() * x + dx;
}

/* Draw a circle on canvas */
function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
    ctx.fill();
}

/* Draw a wavy line using Perlin-like noise */
function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);

    many(100, (i) => {
        i = (i + 1) / 100;
        let x = lerp(x0, x1, i);
        let y = lerp(y0, y1, i);
        /* Add noise-based offset for wavy effect */
        let k = noise(x / 5 + x0, y / 5 + y0) * 2;
        ctx.lineTo(x + k, y + k);
    });

    ctx.stroke();
}

/* Create array by calling function n times */
function many(n, f) {
    return [...Array(n)].map((_, i) => f(i));
}

/* Linear interpolation between a and b */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/* Perlin-like noise function */
function noise(x, y, t = 101) {
    let w0 = sin(0.3 * x + 1.4 * t + 2.0 +
        2.5 * sin(0.4 * y + -1.3 * t + 1.0));
    let w1 = sin(0.2 * y + 1.5 * t + 2.8 +
        2.3 * sin(0.5 * x + -1.2 * t + 0.5));
    return w0 + w1;
}

/* Create a point object */
function pt(x, y) {
    return { x, y };
}
