/**
 * Enhanced margin note positioning with precise baseline alignment
 * Specifically designed for RTL Arabic text with perfect horizontal alignment
 */

(function() {
  function positionMarginNotes() {
    // Only run on desktop
    if (window.innerWidth < 1200) return;

    const notes = document.querySelectorAll('.margin-note');
    const container = document.querySelector('.e-content.post') || document.querySelector('article.post');
    if (!container) return;

    // Ensure container has positioning context
    container.style.position = 'relative';

    notes.forEach((note, index) => {
      // Find the trigger - look for the previous element with margin-trigger class
      let trigger = note.previousElementSibling;

      // Sometimes there might be whitespace text nodes, so search backwards
      while (trigger && (!trigger.classList || !trigger.classList.contains('margin-trigger'))) {
        trigger = trigger.previousElementSibling;
      }

      if (!trigger || !trigger.classList.contains('margin-trigger')) {
        console.warn('No margin-trigger found for note:', index);
        return;
      }

      // Use a more precise method to align text baselines
      // Create a measurement container within the same context as the trigger
      const measureContainer = document.createElement('div');
      measureContainer.style.cssText = `
        position: absolute;
        visibility: hidden;
        left: -9999px;
        top: 0;
        font-family: ${window.getComputedStyle(trigger).fontFamily};
        font-size: ${window.getComputedStyle(trigger).fontSize};
        line-height: ${window.getComputedStyle(trigger).lineHeight};
        direction: rtl;
      `;

      // Create trigger baseline reference
      const triggerMeasure = document.createElement('span');
      triggerMeasure.textContent = 'قج'; // Arabic characters with good baseline reference
      triggerMeasure.style.cssText = 'display: inline; margin: 0; padding: 0;';

      // Create note baseline reference
      const noteMeasure = document.createElement('span');
      noteMeasure.textContent = 'قج';
      noteMeasure.style.cssText = `
        display: inline;
        margin: 0;
        padding: 0;
        font-size: 0.8rem;
        line-height: 1.4;
        font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      measureContainer.appendChild(triggerMeasure);
      measureContainer.appendChild(noteMeasure);
      container.appendChild(measureContainer);

      // Get precise positioning measurements
      const containerRect = container.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const triggerMeasureRect = triggerMeasure.getBoundingClientRect();
      const noteMeasureRect = noteMeasure.getBoundingClientRect();

      // Calculate relative positions
      const containerScrollTop = container.scrollTop || 0;
      const triggerTop = triggerRect.top - containerRect.top + containerScrollTop;

      // Calculate baseline difference between trigger and note text
      const baselineDifference = noteMeasureRect.bottom - triggerMeasureRect.bottom;

      // Clean up measurement elements
      container.removeChild(measureContainer);

      // Calculate final position with baseline alignment
      const finalTop = triggerTop - baselineDifference;

      // Position the note with perfect baseline alignment
      note.style.cssText = `
        position: absolute;
        width: 250px;
        right: -280px;
        top: ${finalTop}px;
        text-align: right;
        margin: 0;
        padding: 0;
        line-height: 1.4;
        font-size: 0.8rem;
        color: #667;
        opacity: 1;
        visibility: visible;
        z-index: 1;
        font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      `;

      // Add positioned class for CSS targeting
      note.classList.add('positioned');
    });
  }

  // Utility function to reset all positioned notes
  function resetPositionedNotes() {
    document.querySelectorAll('.margin-note.positioned').forEach(note => {
      note.classList.remove('positioned');
      note.style.cssText = '';
    });
  }

  // Main initialization function
  function init() {
    // Multiple positioning attempts for reliability
    const runPositioning = () => {
      resetPositionedNotes();
      setTimeout(positionMarginNotes, 10);
    };

    // Wait for fonts to load (modern browsers)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(runPositioning);
    }

    // Initial positioning
    runPositioning();

    // Re-run after full page load
    window.addEventListener('load', () => {
      setTimeout(runPositioning, 150);
    });

    // Handle window resize with proper debouncing
    let resizeTimer;
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1200) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(runPositioning, 300);
      } else {
        resetPositionedNotes();
      }
    });

    // Additional safety nets
    setTimeout(runPositioning, 1000); // Fallback after 1 second

    // Re-run if images load and change layout
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          setTimeout(runPositioning, 50);
        });
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Debug function (remove in production)
  window.debugMarginNotes = function() {
    console.log('Margin notes debug:');
    const notes = document.querySelectorAll('.margin-note');
    notes.forEach((note, i) => {
      const trigger = note.previousElementSibling;
      console.log(`Note ${i}:`, {
        note: note,
        trigger: trigger,
        triggerClass: trigger?.classList?.contains('margin-trigger'),
        positioned: note.classList.contains('positioned')
      });
    });
  };
})();