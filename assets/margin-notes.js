/**
 * Dynamic margin note positioning
 * Prevents overlapping by adjusting vertical positions
 */

(function() {
  function positionMarginNotes() {
    // Only run on desktop where margin notes are positioned absolutely
    if (window.innerWidth < 1200) return;

    const notes = document.querySelectorAll('.margin-note');
    let lastNoteBottom = 0;
    const minSpacing = 20; // Minimum space between notes in pixels

    notes.forEach((note, index) => {
      // Get the trigger element for this note
      const trigger = note.previousElementSibling;
      if (!trigger || !trigger.classList.contains('margin-trigger')) return;

      // Get trigger position
      const triggerRect = trigger.getBoundingClientRect();
      const triggerTop = triggerRect.top + window.scrollY;

      // Calculate desired position (aligned with trigger)
      let desiredTop = triggerTop;

      // Check for overlap with previous note
      if (lastNoteBottom > 0 && desiredTop < lastNoteBottom + minSpacing) {
        desiredTop = lastNoteBottom + minSpacing;
      }

      // Apply positioning
      note.classList.add('positioned');
      note.style.top = desiredTop + 'px';

      // Update last note bottom position
      const noteHeight = note.offsetHeight;
      lastNoteBottom = desiredTop + noteHeight;
    });
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', positionMarginNotes);
  } else {
    positionMarginNotes();
  }

  // Re-position on window resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(positionMarginNotes, 250);
  });

  // Re-position on content changes (for dynamic content)
  window.addEventListener('load', positionMarginNotes);
})();