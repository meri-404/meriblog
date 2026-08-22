// desktop-bg.js
// Adds "set as background" buttons to album items and viewer,
// and persists the chosen background in localStorage.

(function () {
  function setBackgroundByFilename(filename) {
    if (!filename) return;
    const el = document.querySelector('.desktop') || document.body;
    el.style.backgroundImage = `url('assets/img/${filename}')`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
    localStorage.setItem('meriblog-desktop-bg', filename);
  }

  function loadSavedBackground() {
    const saved = localStorage.getItem('meriblog-desktop-bg');
    if (saved) setBackgroundByFilename(saved);
  }

  // When an album-item is clicked open viewer, track last opened photo id so viewer button can use it.
  let lastOpenedPhotoId = null;

  function attachSetButtons() {
    document.querySelectorAll('.album-item').forEach(item => {
      const photoId = item.getAttribute('data-show-photo');
      const hidden = document.getElementById(photoId);
      const filename = hidden && hidden.dataset && hidden.dataset.filename;

      // Create small overlay button
      const btn = document.createElement('button');
      btn.className = 'set-bg-btn';
      btn.type = 'button';
      btn.title = 'usar como papel de parede';
      btn.textContent = '🖼️';
      btn.addEventListener('click', e => {
        e.stopPropagation(); // don't trigger album open if that exists
        if (!filename) {
          alert('Arquivo não encontrado.');
          return;
        }
        setBackgroundByFilename(filename);
      });

      // Keep album item positioned to host the absolute button
      if (!item.style.position) item.style.position = 'relative';
      // Avoid adding multiple buttons if script runs more than once
      if (!item.querySelector('.set-bg-btn')) item.appendChild(btn);

      // Track last opened when user clicks the album item (so viewer button knows which file)
      item.addEventListener('click', () => {
        lastOpenedPhotoId = photoId;
      });
    });
  }

  function addViewerSetButton() {
    const viewerCaption = document.querySelector('#window-viewer .viewer-caption');
    if (!viewerCaption) return;

    // Avoid duplicate button
    if (viewerCaption.querySelector('#viewer-set-bg')) return;

    const viewerBtn = document.createElement('button');
    viewerBtn.id = 'viewer-set-bg';
    viewerBtn.className = 'btn btn-secondary viewer-set-bg';
    viewerBtn.type = 'button';
    viewerBtn.textContent = 'usar como papel de parede';
    viewerBtn.addEventListener('click', () => {
      if (!lastOpenedPhotoId) {
        alert('Abra uma foto primeiro.');
        return;
      }
      const hidden = document.getElementById(lastOpenedPhotoId);
      const filename = hidden && hidden.dataset && hidden.dataset.filename;
      if (!filename) {
        alert('Arquivo não encontrado.');
        return;
      }
      setBackgroundByFilename(filename);
    });

    viewerCaption.appendChild(viewerBtn);
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadSavedBackground();
    attachSetButtons();
    addViewerSetButton();

    // Observe album grid for dynamic changes and re-attach buttons if needed
    const obs = new MutationObserver(() => {
      attachSetButtons();
      addViewerSetButton();
    });
    const albumGrid = document.querySelector('.album-grid');
    if (albumGrid) obs.observe(albumGrid, {childList: true, subtree: true});
  });
})();
