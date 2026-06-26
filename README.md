# 🕷️ Interactive Portal — Multi-Page Animation Experience

A three-page interactive web experience featuring spider cursor animations, 3D galaxy visualization, and a blood-red clock. Navigate between pages using the **down arrow key** (press 3 times to advance).

---

## 📁 File Structure

```
project/
├── index.html              # Page 1: Spider Cursor Animation
├── page2.html              # Page 2: THREE.js Galaxy
├── page3.html              # Page 3: Spider Clock (Blood Red + Vantablack)
├── style.css               # Shared styles for all pages
├── nav.js                  # Navigation logic (all pages)
├── script.js               # Page 1: Spider animation
├── page2-galaxy.js         # Page 2: Galaxy/particles
└── page3-clock.js          # Page 3: Spider clock with time display
```

---

## 🎮 How to Use

### Quick Start
1. **Save all files in the same folder**
2. **Open `index.html` in your browser**
3. **Press the down arrow (↓) key 3 times** to go to Page 2
4. **Press down arrow 3 more times** to go to Page 3
5. **Click the 👤 icon** in the top-right corner to see profile bio on any page

### Keyboard Controls
| Key | Action |
|---|---|
| **↓** (Down Arrow) | Advance counter (3 times = next page) |
| **👤** (Profile Icon) | View bio and social links |

### Navigation Flow
```
Page 1 (Spider)
    ↓ ↓ ↓ (3 down arrows)
Page 2 (Galaxy)
    ↓ ↓ ↓ (3 down arrows)
Page 3 (Blood Clock)
    ↓ ↓ ↓ (3 down arrows)
Back to Page 1
```

---

## 📄 Page Descriptions

### **Page 1: Spider Cursor Animation** (`index.html` + `script.js`)
- **Theme:** Classic white spider webs on black background
- **Interaction:** Move your mouse — spiders follow and paint webs
- **Technical:** Canvas 2D, procedural web generation with Perlin noise
- **Features:**
  - 2 independent spiders
  - Smooth web animation
  - Cursor following with inertia
  - Responsive to window resize

### **Page 2: Galaxy/Particles** (`page2.html` + `page2-galaxy.js`)
- **Theme:** 3D galaxy made of 1000+ particles
- **Interaction:** Watch the galaxy auto-rotate
- **Technical:** THREE.js, BufferGeometry, PointsMaterial, WebGL
- **Features:**
  - Spiral galaxy pattern
  - GPU-accelerated rendering
  - Smooth rotation
  - Responsive camera
  - Memory-efficient particle management

### **Page 3: Spider Clock** (`page3.html` + `page3-clock.js`)
- **Theme:** Blood-red spider webs on vantablack background
- **Interaction:** Spider webs + digital clock showing real time
- **Technical:** Canvas 2D (same as Page 1, different colors)
- **Features:**
  - Blood red (#8B0000) spider webs
  - Vantablack (#0a0a0a) background
  - Live time display (HH:MM:SS)
  - Ominous aesthetic

---

## 🎨 Styling & Theming

### Shared Styles (`style.css`)
All pages use this file for:
- Profile icon styling (fixed top-right corner)
- Down arrow counter (fixed bottom center)
- Modal popup styling
- Responsive design (mobile optimizations)
- Global resets and defaults

### Page-Specific Overrides
- **Page 1:** White on black (default)
- **Page 2:** No overrides (same dark background)
- **Page 3:** Vantablack + blood red (inline `<style>` in page3.html)

---

## 🔧 Key Features & How They Work

### 1. **Profile Icon** (Top-Right Corner)
- **File:** `nav.js` (lines 80+)
- **Function:** `closeProfileModal()`
- **How it works:**
  - Click icon → modal opens (`.show` class added)
  - Click outside or × button → modal closes
  - Same on all pages
- **Can Improve:**
  - Add dropdown menu with links
  - Add profile picture
  - Add notification badge

### 2. **Down Arrow Navigation**
- **File:** `nav.js` (lines 30-50)
- **Function:** `document.addEventListener('keydown')`
- **How it works:**
  1. User presses down arrow
  2. Counter increments (0 → 1 → 2 → 3)
  3. Counter resets, page transitions
  4. Animation: fade-out → load new page → fade-in
- **Can Improve:**
  - Add sound effects
  - Add visual feedback (screen flash)
  - Add swipe gesture for mobile
  - Store progress in localStorage

### 3. **Spider Animation** (Page 1 & 3)
- **Files:** `script.js` and `page3-clock.js`
- **Core Function:** `spawn()`
- **How it works:**
  1. Create 333 web points (random positions)
  2. Create 9 body points (spider shape)
  3. Each frame: calculate distance to each web point
  4. If close to cursor, animate the web line
  5. Draw smooth lines with Perlin-like noise
- **Can Improve:**
  - Add more spider types (different colors, sizes)
  - Add particle trails
  - Add sound effects (web creation, prey caught)
  - Add performance counter (FPS)

### 4. **Galaxy Animation** (Page 2)
- **File:** `page2-galaxy.js`
- **Core Function:** `createGalaxy()`
- **How it works:**
  1. Create BufferGeometry (efficient 3D storage)
  2. Generate 1000 particle positions in spiral pattern
  3. Use PointsMaterial to render as dots
  4. Rotate slowly on Y-axis
  5. Render with WebGLRenderer
- **Can Improve:**
  - Add mouse drag to rotate
  - Add scroll to zoom
  - Add real star data (Hipparcos catalog)
  - Add nebula colors (purple, blue, cyan)

### 5. **Clock Display** (Page 3)
- **File:** `page3-clock.js` (lines 110+)
- **Function:** `updateClock()`
- **How it works:**
  1. Get current time using `new Date()`
  2. Format as HH:MM:SS
  3. Update clock display every 100ms
  4. Display in center of screen with blood-red glow
- **Can Improve:**
  - Add animated analog clock hands
  - Add seconds counter in different color
  - Sync spider animation to heartbeat rhythm

---

## 🚀 How to Extend

### Add a New Page
1. Create `page4.html` (copy page2.html as template)
2. Create `page4-animation.js` (your animation logic)
3. Update `nav.js`:
   - Add to `pages` array: `'page4.html'`
   - Increment page count checks
4. Link the files in your new HTML

### Change Colors
**Page 1:**
- Edit `script.js` line ~110:
  - `ctx.fillStyle = ctx.strokeStyle = "#fff";` → change color

**Page 3:**
- Edit `page3-clock.js` line ~98:
  - `ctx.fillStyle = ctx.strokeStyle = "#8B0000";` → change to your color
- Edit `page3.html` in `<style>`:
  - `background-color: #0a0a0a;` → your color

**All Pages:**
- Edit `style.css` for modal, button, and background colors

### Add Mouse Controls
**Galaxy (Page 2):**
- Uncomment lines 146-149 in `page2-galaxy.js`
- Uncomment line 148 to enable mouse-controlled rotation

**Spider (Page 1):**
- Modify `script.js` line ~75 `addEventListener("pointermove")`
- Add additional logic for click detection or pressure

### Add Sound Effects
1. Add `<audio>` tags to HTML
2. In `nav.js`, trigger sounds on key events:
   ```javascript
   document.getElementById('soundEffect').play();
   ```

### Store Progress
Use `localStorage` to remember which page user was on:
```javascript
// In nav.js, add:
localStorage.setItem('currentPage', currentPage);
window.addEventListener('load', () => {
    const saved = localStorage.getItem('currentPage');
    if (saved) currentPage = saved;
});
```

---

## 📊 Performance Tips

### Optimize Page Load
- **Minify CSS/JS** using online tools
- **Lazy load images** if you add images later
- **Preload THREE.js** on page 1 so page 2 loads instantly

### Improve Animation Performance
- **Reduce particle count** in galaxy (line 40 of page2-galaxy.js): `1000` → `500`
- **Simplify noise function** in spider animation
- **Use `requestAnimationFrame`** (already done)
- **Monitor FPS** by adding counter

### Mobile Optimization
- Already included: responsive canvas, mobile CSS breakpoints
- Can add: touch gesture support for navigation
- Can add: performance degradation on low-end devices

---

## 🎯 CAN IMPROVE — Feature Ideas

### High Priority
- [ ] Add mobile touch/swipe support for navigation
- [ ] Add smooth page transition animations
- [ ] Add sound effects (footsteps, web creation, transitions)
- [ ] Add keyboard shortcuts (P for profile, R for restart)

### Medium Priority
- [ ] Store navigation progress in localStorage
- [ ] Add performance monitor (FPS counter)
- [ ] Add cursor visual feedback
- [ ] Add fullscreen mode
- [ ] Add mobile portrait orientation support

### Advanced
- [ ] Add WebGL filters to spider pages (bloom, motion blur)
- [ ] Integrate real star data into galaxy (NASA API)
- [ ] Add AI spider behavior (collision avoidance, hunting)
- [ ] Add multiplayer (multiple cursors on same page)
- [ ] Add VR support (if using THREE.js)

---

## 📝 File Descriptions & Edit Locations

| File | Purpose | Edit Here For... |
|---|---|---|
| `index.html` | Page 1 structure | Profile icon, modal content, canvas size |
| `page2.html` | Page 2 structure | Galaxy info text, modal content |
| `page3.html` | Page 3 structure | Clock styling, modal, page info |
| `style.css` | Shared styling | Colors, layout, responsive breakpoints |
| `nav.js` | Navigation logic | Page URLs, arrow key behavior, modal control |
| `script.js` | Page 1 animation | Spider count, web density, colors, speeds |
| `page2-galaxy.js` | Galaxy animation | Particle count, rotation speed, colors |
| `page3-clock.js` | Page 3 animation | Blood red color, clock update frequency |

---

## 🔗 Dependencies

- **THREE.js** — For 3D galaxy (loaded via CDN in page2.html)
  - No installation needed
  - Loaded from: `cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`

- **HTML5 Canvas API** — For spider animations
  - Built-in to all modern browsers
  - No installation needed

---

## 🐛 Troubleshooting

### Galaxy not showing on Page 2?
- Check browser console (F12) for errors
- Ensure THREE.js CDN link is working
- Verify WebGL is supported: right-click → Inspect → Console

### Spider animation lag?
- Reduce particle count in `script.js`
- Simplify noise function
- Disable background animations on slow devices

### Profile modal not opening?
- Check `nav.js` lines 90-100
- Verify `id="profileBtn"` exists in HTML
- Check browser console for JavaScript errors

### Down arrow not working?
- Check `nav.js` event listener (line ~35)
- Verify canvas element is in focus (click page first)
- Try using Firefox if it works better

---

## 📞 Support & Feedback

For improvements or bug reports:
1. Check the "CAN IMPROVE" section in each file
2. Review the troubleshooting guide above
3. Test in different browsers (Chrome, Firefox, Safari)
4. Check console (F12 → Console tab) for error messages

---

## 🎓 Learning Resources

- **Canvas 2D:** MDN Web Docs - Canvas API
- **THREE.js:** Official docs at threejs.org
- **Web Performance:** web.dev
- **JavaScript:** MDN Web Docs

---

## 📄 License & Credits

Created as an interactive experience showcase.
Inspired by creative coding and generative art.

Enjoy the portal! 🕷️✨
