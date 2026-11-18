// Neu: lonZuX und latZuY rechnen mit einem Ausschnitt statt immer mit der
// ganzen Welt.

const AUSSCHNITT = { west: -180, ost: 180, nord: 90, sued: -90 };

// Schwäbisch Gmünd
const ZOOMPUNKT = { lat: 48.8, lon: 9.8 };

// Wo Gmünd auf der Karte bleiben soll (Anteil von links / von oben)
const ZOOMPOSITION = { x: 0.7, y: 0.2 };

// Berechnet den Ausschnitt für einen Zoomwert
function ausschnittBerechnen(zoom) {
  const breiteGrad = (AUSSCHNITT.ost - AUSSCHNITT.west) / zoom;
  const hoeheGrad = (AUSSCHNITT.nord - AUSSCHNITT.sued) / zoom;

  const west = ZOOMPUNKT.lon - ZOOMPOSITION.x * breiteGrad;
  const nord = ZOOMPUNKT.lat + ZOOMPOSITION.y * hoeheGrad;

  return {
    west: west,
    ost: west + breiteGrad,
    nord: nord,
    sued: nord - hoeheGrad,
  };
}

function lonZuX(lon, breite, ausschnitt = AUSSCHNITT) {
  return ((lon - ausschnitt.west) / (ausschnitt.ost - ausschnitt.west)) * breite;
}

// nord - lat, weil y auf dem Bildschirm nach unten wächst.
function latZuY(lat, hoehe, ausschnitt = AUSSCHNITT) {
  return ((ausschnitt.nord - lat) / (ausschnitt.nord - ausschnitt.sued)) * hoehe;
}

const response = await fetch("orte.json");
const orte = await response.json();

const sliderBreite = document.querySelector("#breite");
const karte = document.querySelector("#karte");

const sliderZoom = document.querySelector("#zoom");


function zeichnen() {
  const breite = Number(sliderBreite.value);
  const hoehe = breite / 2;
  const ausschnitt = ausschnittBerechnen(Number(sliderZoom.value));   

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
  <rect width="${breite}" height="${hoehe}" fill="#f4f1ea" stroke="#222"/>`;

  for (const ort of orte) {
    const x = lonZuX(ort.lon, breite, ausschnitt);   // AUSSCHNITT → ausschnitt
    const y = latZuY(ort.lat, hoehe, ausschnitt);    // AUSSCHNITT → ausschnitt
    svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="${ort.farbe}"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
  }

  svg += `
</svg>`;

  karte.innerHTML = svg;
}

sliderBreite.addEventListener("input", zeichnen);
sliderZoom.addEventListener("input", zeichnen);

zeichnen();