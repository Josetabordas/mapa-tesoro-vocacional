// El Mapa del Tesoro Vocacional — interactividad
// Cada "Excavar aquí" revela una coordenada. Al juntar las 4, se abre el cofre.

(function () {
  const digButtons = document.querySelectorAll('.dig-btn');
  const progressFill = document.getElementById('progressFill');
  const progressCount = document.getElementById('progressCount');
  const chestSvg = document.getElementById('chestSvg');
  const chestStatus = document.getElementById('chestStatus');
  const treasureMessage = document.getElementById('treasureMessage');

  const TOTAL = digButtons.length;
  let found = 0;

  digButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;

      const card = btn.closest('.station-card');
      const reveal = card.querySelector('.coord-reveal');

      btn.disabled = true;
      btn.textContent = 'Coordenada hallada ✓';
      reveal.hidden = false;

      found += 1;
      updateProgress();
    });
  });

  function updateProgress() {
    const pct = Math.round((found / TOTAL) * 100);
    progressFill.style.width = pct + '%';
    progressCount.textContent = String(found);

    if (found === TOTAL) {
      openChest();
    }
  }

  function openChest() {
    chestSvg.classList.add('open');
    chestStatus.textContent = 'El cofre se abre…';
    setTimeout(() => {
      chestStatus.hidden = true;
      treasureMessage.hidden = false;
      treasureMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
  }
})();
