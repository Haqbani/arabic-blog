/**
 * Simple and effective margin note positioning
 * Focuses on precise horizontal alignment for RTL Arabic text
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
      // Find the trigger - it should be the previous element
      let trigger = note.previousElementSibling;

      // Search for the trigger element
      while (trigger && (!trigger.classList || !trigger.classList.contains('margin-trigger'))) {
        trigger = trigger.previousElementSibling;
      }

      if (!trigger || !trigger.classList.contains('margin-trigger')) {
        console.warn('No margin-trigger found for note:', index);
        return;
      }

      // Get the bounding rectangles
      const containerRect = container.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();

      // Calculate the position relative to the container
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = containerRect.top + scrollTop;
      const triggerTop = triggerRect.top + scrollTop;
      const relativeTop = triggerTop - containerTop;

      // Apply styles directly
      note.style.position = 'absolute';
      note.style.width = '250px';
      note.style.right = '-280px';
      note.style.top = relativeTop + 'px';
      note.style.textAlign = 'right';
      note.style.margin = '0';
      note.style.padding = '0';
      note.style.lineHeight = '1.4';
      note.style.fontSize = '0.8rem';
      note.style.color = '#667';
      note.style.opacity = '1';
      note.style.visibility = 'visible';
      note.style.zIndex = '1';
      note.style.fontFamily = "'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

      // Use a small transform to fine-tune the vertical alignment
      // This moves the note slightly up to align with the text baseline
      note.style.transform = 'translateY(-0.2em)';

      // Add positioned class
      note.classList.add('positioned');

      console.log(`Positioned note ${index}:`, {
        triggerTop: triggerRect.top,
        containerTop: containerRect.top,
        relativeTop: relativeTop,
        finalTop: relativeTop
      });
    });
  }

  // Utility function to reset positioning
  function resetNotes() {
    document.querySelectorAll('.margin-note.positioned').forEach(note => {
      note.classList.remove('positioned');
      note.style.cssText = '';
    });
  }

  // Initialize positioning
  function init() {
    const runPositioning = () => {
      resetNotes();
      setTimeout(positionMarginNotes, 50);
    };

    // Multiple attempts for reliability
    runPositioning(); // Immediate

    // After DOM is fully ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runPositioning);
    }

    // After all resources load
    window.addEventListener('load', () => {
      setTimeout(runPositioning, 100);
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1200) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(runPositioning, 200);
      } else {
        resetNotes();
      }
    });

    // Fallback after a delay
    setTimeout(runPositioning, 1000);
  }

  // Start initialization
  init();

  // Debug helper
  window.debugMarginNotesSimple = function() {
    console.log('=== Margin Notes Debug ===');
    const notes = document.querySelectorAll('.margin-note');
    const triggers = document.querySelectorAll('.margin-trigger');

    console.log(`Found ${notes.length} notes and ${triggers.length} triggers`);

    notes.forEach((note, i) => {
      const trigger = note.previousElementSibling;
      console.log(`Note ${i}:`, {
        note: note,
        trigger: trigger,
        triggerHasClass: trigger?.classList?.contains('margin-trigger'),
        positioned: note.classList.contains('positioned'),
        styles: {
          position: note.style.position,
          top: note.style.top,
          right: note.style.right,
          opacity: note.style.opacity
        }
      });
    });
  };
})();