/**
 * Direct margin note positioning - Simple and precise
 * Aligns margin notes exactly with their trigger text
 */

(function() {
  function positionMarginNotes() {
    // Only run on desktop
    if (window.innerWidth < 1200) return;

    const notes = document.querySelectorAll('.margin-note');
    const container = document.querySelector('.e-content.post') || document.querySelector('article.post');

    if (!container) return;

    // Ensure container is the positioning reference
    container.style.position = 'relative';

    notes.forEach((note) => {
      // Find the trigger element
      let trigger = note.previousElementSibling;

      // Skip text nodes to find the actual trigger element
      while (trigger && trigger.nodeType === 3) {
        trigger = trigger.previousElementSibling;
      }

      if (!trigger || !trigger.classList || !trigger.classList.contains('margin-trigger')) {
        console.warn('No trigger found for margin note');
        return;
      }

      // Get the exact position of the trigger relative to its offsetParent
      // This is the key - we need the trigger's position within the positioned container
      const triggerTop = trigger.offsetTop;

      // Small adjustment to align with text baseline (not below it)
      // Negative value moves the note up to align with the text line
      const adjustment = -2; // pixels

      // Apply positioning directly - no complex calculations
      note.style.position = 'absolute';
      note.style.top = (triggerTop + adjustment) + 'px';
      note.style.right = '-280px';
      note.style.width = '250px';
      note.style.textAlign = 'right';
      note.style.margin = '0';
      note.style.padding = '0';
      note.style.fontSize = '0.8rem';
      note.style.lineHeight = '1.4';
      note.style.color = '#667';

      note.classList.add('positioned');
    });
  }

  // Initialize
  function init() {
    // Run immediately
    positionMarginNotes();

    // Run after content loads
    if (document.readyState !== 'complete') {
      window.addEventListener('load', positionMarginNotes);
    }

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(positionMarginNotes, 250);
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();