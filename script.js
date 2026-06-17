// El Mapa del Tesoro Vocacional — quiz interactivo
// Flujo: 4 estaciones, 3 preguntas cada una (2 de opción múltiple que
// suman puntos a categorías + 1 reflexión abierta). Al terminar las 4
// estaciones se calcula la categoría dominante y se muestra un perfil
// de talentos e intereses (no el nombre de una carrera).

(function () {

  // ---------- Definición de categorías y sus descripciones de cierre ----------
  const PROFILES = {
    arte: {
      label: 'Creador/a',
      text: 'Tu brújula apunta hacia la creación: te atrae imaginar, expresar y darle forma a ideas que antes no existían. Esa chispa vive en el diseño, la escritura, la música, el cine, la arquitectura y cualquier campo donde la imaginación se vuelve algo tangible.'
    },
    tecnologia: {
      label: 'Constructor/a de sistemas',
      text: 'Tu brújula apunta hacia entender y construir cómo funcionan las cosas: te atraen la lógica detrás de la tecnología, resolver problemas con herramientas y crear soluciones que la gente pueda usar. Eso vive en la programación, la ingeniería, el diseño de producto y la innovación digital.'
    },
    social: {
      label: 'Conector/a de personas',
      text: 'Tu brújula apunta hacia las personas: escuchar, organizar, mediar y ayudar a que otros se sientan comprendidos. Esa fuerza vive en la psicología, la educación, el trabajo social, la comunicación y cualquier rol donde el vínculo humano es el centro.'
    },
    ciencia: {
      label: 'Investigador/a curioso/a',
      text: 'Tu brújula apunta hacia entender el mundo a fondo: te mueve la curiosidad, hacer preguntas y buscar respuestas con evidencia. Esa curiosidad vive en la biología, la medicina, la física, la química y cualquier campo que avanza investigando.'
    },
    naturaleza: {
      label: 'Guardián/a de lo vivo',
      text: 'Tu brújula apunta hacia la naturaleza y el cuerpo en movimiento: te atrae el aire libre, los seres vivos y el equilibrio con el entorno. Esa fuerza vive en la biología ambiental, la veterinaria, la agronomía, el deporte y la sostenibilidad.'
    },
    logica: {
      label: 'Estratega y organizador/a',
      text: 'Tu brújula apunta hacia el orden y la estrategia: te atrae resolver problemas paso a paso, planear y que las cosas cuadren. Esa fuerza vive en las matemáticas, la ingeniería, la administración, la arquitectura de procesos y la toma de decisiones basada en datos.'
    },
    negocios: {
      label: 'Emprendedor/a',
      text: 'Tu brújula apunta hacia crear y dirigir: te atrae construir algo propio, liderar proyectos y ver una idea convertirse en realidad. Esa fuerza vive en el emprendimiento, la administración, el mercadeo y la economía.'
    }
  };

  const TOTAL_STATIONS = 4;

  // ---------- Estado ----------
  const scores = {}; // categoria -> puntos
  const reflections = {}; // numero estacion -> texto

  let currentStationIndex = 0; // 0-based

  // ---------- Elementos ----------
  const stations = Array.from(document.querySelectorAll('.station'));
  const routeNodes = Array.from(document.querySelectorAll('.route-node'));
  const progressFill = document.getElementById('progressFill');
  const progressCount = document.getElementById('progressCount');

  const chestSvg = document.getElementById('chestSvg');
  const chestStatus = document.getElementById('chestStatus');
  const treasureMessage = document.getElementById('treasureMessage');
  const profileTitle = document.getElementById('profileTitle');
  const profileText = document.getElementById('profileText');
  const profileBars = document.getElementById('profileBars');
  const reflectionsList = document.getElementById('reflectionsList');
  const restartBtn = document.getElementById('restartBtn');

  // ---------- Inicializar marcador de ruta ----------
  if (routeNodes[0]) routeNodes[0].classList.add('active');

  // ---------- Lógica por estación ----------
  stations.forEach((station, sIdx) => {
    const qBlocks = Array.from(station.querySelectorAll('.q-block'));

    qBlocks.forEach((block) => {
      const optButtons = block.querySelectorAll('.opt-btn');
      const nextBtn = block.querySelector('[data-next]');

      // Pregunta de opción múltiple: al elegir, suma puntos y avanza
      optButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (block.dataset.answered) return;
          block.dataset.answered = '1';

          const cat = btn.dataset.cat;
          scores[cat] = (scores[cat] || 0) + 1;

          optButtons.forEach((b) => (b.disabled = true));
          btn.classList.add('chosen');

          setTimeout(() => advanceWithinStation(station, block), 350);
        });
      });

      // Pregunta de reflexión: botón "Continuar"
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const textarea = block.querySelector('.reflect-input');
          const stationNum = station.dataset.station;
          reflections[stationNum] = (textarea.value || '').trim() || '(sin respuesta)';
          advanceWithinStation(station, block, true);
        });
      }
    });
  });

  function advanceWithinStation(station, currentBlock, isLastBlock) {
    const qBlocks = Array.from(station.querySelectorAll('.q-block'));
    const idx = qBlocks.indexOf(currentBlock);

    if (idx < qBlocks.length - 1) {
      currentBlock.hidden = true;
      qBlocks[idx + 1].hidden = false;
    } else {
      // terminó la estación
      finishStation();
    }
  }

  function finishStation() {
    const station = stations[currentStationIndex];
    station.hidden = true;

    currentStationIndex += 1;
    updateProgress();
    updateRouteNodes();

    if (currentStationIndex < stations.length) {
      stations[currentStationIndex].hidden = false;
      stations[currentStationIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      revealTreasure();
    }
  }

  function updateProgress() {
    const pct = Math.round((currentStationIndex / TOTAL_STATIONS) * 100);
    progressFill.style.width = pct + '%';
    progressCount.textContent = String(currentStationIndex);
  }

  function updateRouteNodes() {
    routeNodes.forEach((node, i) => {
      node.classList.remove('active');
      if (i < currentStationIndex) node.classList.add('done');
      if (i === currentStationIndex) node.classList.add('active');
    });
  }

  // ---------- Resultado final ----------
  function revealTreasure() {
    chestSvg.classList.add('open');
    chestStatus.textContent = 'El cofre se abre…';

    setTimeout(() => {
      chestStatus.hidden = true;
      buildProfile();
      treasureMessage.hidden = false;
      treasureMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
  }

  function buildProfile() {
    // categoría con más puntos
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      profileTitle.textContent = 'Tu mapa sigue en blanco';
      profileText.textContent = 'No se registraron suficientes respuestas. Inténtalo de nuevo y elige con calma en cada estación.';
      return;
    }

    const topCat = sorted[0][0];
    const profile = PROFILES[topCat] || PROFILES['logica'];

    profileTitle.textContent = profile.label;
    profileText.textContent = profile.text;

    // Si hay un segundo lugar muy cercano, lo mencionamos como un segundo rasgo
    if (sorted.length > 1 && sorted[1][1] >= sorted[0][1] - 1 && sorted[1][1] > 0) {
      const secondCat = sorted[1][0];
      const secondProfile = PROFILES[secondCat];
      if (secondProfile && secondCat !== topCat) {
        const extra = document.createElement('p');
        extra.className = 'profile-text profile-text-secondary';
        extra.textContent = 'También se asoma con fuerza tu lado de ' + secondProfile.label.toLowerCase() + ': ' + secondProfile.text;
        profileText.insertAdjacentElement('afterend', extra);
      }
    }

    // Barras de puntaje por categoría (visual, no exhaustivo)
    profileBars.innerHTML = '';
    const maxScore = sorted[0][1] || 1;
    sorted.forEach(([cat, val]) => {
      const profileCat = PROFILES[cat];
      if (!profileCat) return;
      const row = document.createElement('div');
      row.className = 'bar-row';

      const label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = profileCat.label;

      const track = document.createElement('div');
      track.className = 'bar-track';
      const fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.width = Math.round((val / maxScore) * 100) + '%';
      track.appendChild(fill);

      row.appendChild(label);
      row.appendChild(track);
      profileBars.appendChild(row);
    });

    // Reflexiones
    reflectionsList.innerHTML = '';
    const stationLabels = {
      1: 'Lo que enciende',
      2: 'Tu ventaja natural',
      3: 'El horizonte',
      4: 'El propósito'
    };
    Object.keys(reflections).forEach((key) => {
      const item = document.createElement('div');
      item.className = 'reflection-item';
      const h = document.createElement('p');
      h.className = 'reflection-station';
      h.textContent = 'Estación ' + key + ' — ' + (stationLabels[key] || '');
      const p = document.createElement('p');
      p.className = 'reflection-text';
      p.textContent = '“' + reflections[key] + '”';
      item.appendChild(h);
      item.appendChild(p);
      reflectionsList.appendChild(item);
    });
  }

  // ---------- Reiniciar ----------
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }

})();
