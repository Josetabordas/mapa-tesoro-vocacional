# El Mapa del Tesoro Vocacional

Página web interactiva basada en la idea: el tesoro no es una carrera específica, sino el descubrimiento de tus talentos e intereses.

## Estructura del proyecto

```
mapa-tesoro/
├── index.html   → estructura y contenido
├── styles.css   → estilos (paleta "mapa antiguo", tipografía, layout)
└── script.js    → interactividad (excavar coordenadas, abrir el cofre)
```

## Cómo funciona

La página presenta 4 "estaciones" con las preguntas:
- ¿Qué te apasiona?
- ¿Qué haces bien?
- ¿Qué te gustaría aprender?
- ¿Qué problema del mundo te gustaría ayudar a resolver?

Al hacer clic en "Excavar aquí" en cada estación se revela una coordenada. Al encontrar las 4, el cofre del tesoro se abre y aparece el mensaje final.


## Personalización

- Cambia las preguntas o coordenadas directamente en `index.html` dentro de cada `<section class="station">`.
- Cambia colores en las variables `:root` al inicio de `styles.css`.
- No requiere ningún framework ni paso de build: es HTML/CSS/JS puro.
