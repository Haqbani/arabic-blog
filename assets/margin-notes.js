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

      // Get the trigger's position
      const triggerRect = trigger.getBoundingClientRect();
      const container = document.querySelector('.e-content.post');
      const containerRect = container.getBoundingClientRect();

      // Calculate position relative to container
      // Subtract line height to align with text baseline
      const computedStyle = window.getComputedStyle(trigger);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
      const relativeTop = triggerRect.top - containerRect.top - (lineHeight * 0.15);

      // Set desired position aligned with trigger text line
      let desiredTop = relativeTop;

      // Check for overlap with previous note
      if (lastNoteBottom > 0 && desiredTop < lastNoteBottom + minSpacing) {
        desiredTop = lastNoteBottom + minSpacing;
      }

      // Apply positioning
      note.classList.add('positioned');
      note.style.position = 'absolute';
      note.style.width = '250px';
      note.style.right = '-280px';
      note.style.top = desiredTop + 'px';
      note.style.textAlign = 'right';

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