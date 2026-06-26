/* ════════════════════════════════════════════════════════════════════════════
   NAV.JS — Navigation logic for multi-page portal
   ════════════════════════════════════════════════════════════════════════════
   
   FILE PURPOSE:
   Handles navigation between pages using the down arrow key.
   • Tracks arrow key clicks (needs 3 to advance)
   • Manages page transitions
   • Controls profile modal (visible on all pages)
   
   PAGES:
   Page 1: index.html — Spider cursor animation (white on black)
   Page 2: page2.html — THREE.js Galaxy/particles (after 3 down arrows)
   Page 3: page3.html — Spider clock (blood red + vantablack, after 3 more)
   
   HOW IT WORKS:
   1. Listen for down arrow key press (e.key === "ArrowDown")
   2. Increment counter
   3. When counter reaches 3, transition to next page
   4. Reset counter to 0
   5. Update the display
   
   CAN IMPROVE:
     • Add smooth page transition animation
     • Add transition sound effects
     • Add keyboard shortcuts for all navigation
     • Persist page progress in localStorage
     • Add mobile swipe gesture support
════════════════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════
   [JS 1]  NAVIGATION STATE — Track current page and arrow clicks
   ────────────────────────────────────────────────────────────────
   WHY: Keep track of which page we're on and how many arrows clicked.
   HOW:
        • currentPage = the page URL we're on
        • arrowClicks = counter for down arrow presses
        • totalPages = how many pages exist in this portal
   CAN IMPROVE:
     • Store in localStorage to persist across page refreshes
     • Add page transition history tracking
════════════════════════════════════════════════════════════════ */
let arrowClicks = 0;
let currentPage = 0; // Default to index 0 (index.html)

/* Dynamically detect which index of the sequence we are currently on */
const currentPath = window.location.pathname;
if (currentPath.includes('page1.html')) {
    currentPage = 1;
} else if (currentPath.includes('page2.html')) {
    currentPage = 2;
} else if (currentPath.includes('page3.html')) {
    currentPage = 3;
}

const pageSequence = [
    "index.html",         // Index 0
    "page1.html",         // Index 1
    "page2.html",         // Index 2
    "page3.html"          // Index 3
];


/* ════════════════════════════════════════════════════════════════
   [JS 2]  KEYBOARD EVENT LISTENER — Listen for down arrow key
   ────────────────────────────────────────────────────────────────
   WHY: The down arrow is the main interaction method for navigation.
        User presses ↓ three times to advance to the next page.
   HOW:
        • keydown event fires when user presses any key
        • e.key === "ArrowDown" checks if it was the down arrow
        • Increment counter and check if we should advance
   CAN IMPROVE:
     • Add sound effect on each arrow press
     • Add visual feedback (screen flash, particle burst)
     • Add other keys as shortcuts (Space, Enter, etc.)
================================================== ============ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();  /* Prevent page scroll */
        
        if (e.key === 'ArrowDown') {
            arrowClicks++;
            updateArrowCounter();

            /* When counter reaches 3, advance to next page */
            if (arrowClicks >= 3) {
                advancePage();
            }
        }
    }
});


/* ════════════════════════════════════════════════════════════════
   [JS 3]  UPDATE ARROW COUNTER — Display shows progress
   ────────────────────────────────────────────────────────────────
   WHY: Visual feedback showing how many more clicks until next page.
   HOW:
        • Find the #arrowCount element
        • Update its text to show current count (e.g. "↓ 1/3")
   CAN IMPROVE:
     • Add color change as counter increases (gradient from blue to red)
     • Add scale animation on each click
     • Add sound effect
════════════════════════════════════════════════════════════════ */
function updateArrowCounter() {
    const counter = document.getElementById('arrowCount');
    if (counter) {
        if (currentPage === 3) {
            counter.textContent = `🕷️ ${arrowClicks}/3 🕷️`;
        } else {
            counter.textContent = `↓ ${arrowClicks}/3`;
        }
    }
}


/* ════════════════════════════════════════════════════════════════
   [JS 4]  ADVANCE PAGE — Transition to next page
   ────────────────────────────────────────────────────────────────
   WHY: When user reaches 3 arrow clicks, move to the next page.
   HOW:
        • Check if there's a next page available
        • Calculate next page URL from pages array
        • Reset arrow clicks to 0
        • Navigate to new page using window.location.href
   CAN IMPROVE:
     • Add fade-out animation before transition
     • Add loader screen during page load
     • Add smooth scroll to top on new page
     • Add history tracking for back button support
================================ ============================ */
function advancePage() {
    /* Check if there's a next page */
    if (currentPage < pageSequence.length) { 
        const nextPageUrl = pageSequence[currentPage];
        
        /* Reset counter for new page */
        arrowClicks = 0;
        currentPage++;
        
        /* Add fade-out effect before transition */
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';
        
        /* Navigate after fade completes */
        setTimeout(() => {
            window.location.href = nextPageUrl;
        }, 500);
    } else {
        /* Already on final page — loop back to start */
        alert('🕷️ You have completed the portal! Returning to start...');
        window.location.href = pageSequence[0]; 
    }
}

/* ════════════════════════════════════════════════════════════════
   [JS 5]  PROFILE MODAL TOGGLE — Show/hide on icon click
   ────────────────────────────────────────────────────────────────
   WHY: Profile icon is visible on all pages. Clicking it opens
        a modal with bio and social links.
   CAN IMPROVE:
     • Add keyboard shortcut (e.g. 'P' key)
     • Add animation on open/close
     • Remember if user had modal open across pages
════════════════════════════════════════════════════════════════ */
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');

if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        if (profileModal) {
            profileModal.classList.add('show');
        }
    });
}


/* ════════════════════════════════════════════════════════════════
   [JS 6]  CLOSE PROFILE MODAL — Click outside or on close button
   ────────────────────────────────────────────────────────────────
   WHY: Two ways to close the modal:
        1. Click the × button
        2. Click the dark backdrop outside the modal
   CAN IMPROVE:
     • Add Escape key to close
     • Add smooth animation on close
     • Track modal state in analytics
════════════════════════════════════════════════════════════════ */
function closeProfileModal() {
    if (profileModal) {
        profileModal.classList.remove('show');
    }
}

/* Close modal when clicking outside the content */
if (profileModal) {
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            closeProfileModal();
        }
    });
}


/* ════════════════════════════════════════════════════════════════
   [JS 7]  INITIALIZE ON PAGE LOAD
   ────────────────────────────────────────────────────────────────
   WHY: Set up the counter and page info on initial load.
   CAN IMPROVE:
     • Add loading animation
     • Add "Ready?" message on first page
════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
    updateArrowCounter();
    /* Fade in the page after load */
    document.body.style.opacity = '1';
});
