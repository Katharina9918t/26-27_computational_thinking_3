1. Wer Lust hat, kann noch die Orte in der Liste filtern, die sich nicht im aktuellen Ausschnitt (bei Zoom) befinden.

der Prompt:

diese funktion berechnet einen ausschnitt in einer karte(in projektion.js):

export function zoomeAusschnitt(ausschnitt, punkt, faktor) {
  return {
    west: punkt.lon - (punkt.lon - ausschnitt.west) / faktor,
    ost: punkt.lon + (ausschnitt.ost - punkt.lon) / faktor,
    nord: punkt.lat + (ausschnitt.nord - punkt.lat) / faktor,
    sued: punkt.lat - (punkt.lat - ausschnitt.sued) / faktor,
  };
}

so wird in zeichnen( ) in karte.js die Liste unter der Karte gemacht:

const ausschnitt = zoomeAusschnitt(AUSSCHNITT, ZOOMPUNKT, faktor);
const radius = Number(sliderRadius.value);
const imUmkreis = orteImUmkreis(orte, ZOOMPUNKT, radius);
const orteNachEntfernung = nachEntfernung(imUmkreis, ZOOMPUNKT);

let listenElemente = "";
for (const ort of orteNachEntfernung) {
  listenElemente += `<li>${ort.name} – ${ort.km.toFixed(1)} km</li>`;
}
liste.innerHTML = listenElemente;



in der liste sollen nur noch die orte stehen, die man auch im ausschnitt sieht. schreib mir dafür eine funktion

------ die Funktion und wo sie dann in die Karte rein kommmt, kam von der Antwort

2. Aufgabe

Prompt: 

ich hab in einer alten version von meinem projekt einen zoom gebaut.
da bleibt schwäbisch gmünd beim zoomen immer an der gleichen stelle,
70% von links und 20% von oben. das ist die alte datei:

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




jetzt ist mein projekt in module aufgeteilt und da ist ein anderer
zoom (zoomeAusschnitt). ich will aber meinen alten zoom mit ausschnittBerechnen
haben. die funktion rechnet ja nur, deswegen soll sie in projektion.js mit export.
das ist meine projektion.js:

// T5, Schritt 1 — die Projektion als eigenes Modul.
// Nur reine Funktionen: Sie rechnen mit ihren Parametern und ändern nichts.
// Darum läuft dieses Modul auch in Node, ohne Browser.

export function lonZuX(lon, breite, ausschnitt) {
  return ((lon - ausschnitt.west) / (ausschnitt.ost - ausschnitt.west)) * breite;
}

// nord - lat, weil y auf dem Bildschirm nach unten wächst.
export function latZuY(lat, hoehe, ausschnitt) {
  return ((ausschnitt.nord - lat) / (ausschnitt.nord - ausschnitt.sued)) * hoehe;
}

// faktor > 1 zoomt hinein. Jeder Rand rückt um den Faktor an den Punkt heran,
// der Punkt selbst bleibt an seiner Stelle.
export function zoomeAusschnitt(ausschnitt, punkt, faktor) {
  return {
    west: punkt.lon - (punkt.lon - ausschnitt.west) / faktor,
    ost: punkt.lon + (ausschnitt.ost - punkt.lon) / faktor,
    nord: punkt.lat + (ausschnitt.nord - punkt.lat) / faktor,
    sued: punkt.lat - (punkt.lat - ausschnitt.sued) / faktor,
  };
}


export function orteImAusschnitt(orte, ausschnitt) {
  return orte.filter(
    (ort) =>
      ort.lon >= ausschnitt.west &&
      ort.lon <= ausschnitt.ost &&
      ort.lat >= ausschnitt.sued &&
      ort.lat <= ausschnitt.nord
  );
}


und das ist meine karte.js:

// T5, nach Aufgabe 2 — unter der Karte eine Liste, der nächste Ort zuerst.
// Neu: <ol id="liste"> in index.html. zeichnen() schreibt die Liste jedes Mal neu.

import { lonZuX, latZuY, zoomeAusschnitt, orteImAusschnitt } from "./projektion.js";

import { entfernung, orteImUmkreis, nachEntfernung } from "./entfernung.js";

const AUSSCHNITT = { west: -180, ost: 180, nord: 90, sued: -90 };
const ZOOMPUNKT = { lat: 48.8, lon: 9.79 }; // Schwäbisch Gmünd

// Prüffälle, Ergebnis vorher bekannt. Stehen lassen, sie kosten nichts.
const gmuend = { lat: 48.8, lon: 9.79 };
const stuttgart = { lat: 48.7758, lon: 9.1829 };
console.log("Gmünd → Stuttgart:", entfernung(gmuend, stuttgart).toFixed(1), "km, erwartet 44.6");

const response = await fetch("orte.json");
const orte = await response.json();

console.log("Radius 0:", orteImUmkreis(orte, ZOOMPUNKT, 0).map((ort) => ort.name), "erwartet nur Gmünd");
console.log("Radius 50:", orteImUmkreis(orte, ZOOMPUNKT, 50).map((ort) => ort.name), "erwartet Gmünd, Stuttgart");
console.log("Reihenfolge:", nachEntfernung(orte, ZOOMPUNKT).map((ort) => ort.id).join(", "));
console.log("orte unverändert:", orte.map((ort) => ort.id).join(", "));

const sliderBreite = document.querySelector("#breite");
const sliderZoom = document.querySelector("#zoom");
const sliderRadius = document.querySelector("#radius");
const radiusWert = document.querySelector("#radiusWert");
const karte = document.querySelector("#karte");
const liste = document.querySelector("#liste");

function zeichnen() {
  const breite = Number(sliderBreite.value);
  const hoehe = breite / 2;
  const faktor = 2 ** Number(sliderZoom.value); // 0 → 1×, 1 → 2×, 7 → 128×
  const ausschnitt = zoomeAusschnitt(AUSSCHNITT, ZOOMPUNKT, faktor);
  const radius = Number(sliderRadius.value);
  const imUmkreis = orteImUmkreis(orte, ZOOMPUNKT, radius);
  const sichtbar = orteImAusschnitt(imUmkreis, ausschnitt);
  const orteNachEntfernung = nachEntfernung(sichtbar, ZOOMPUNKT);

  console.log(orteNachEntfernung);

  radiusWert.textContent = radius + " km";

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
  <rect width="${breite}" height="${hoehe}" fill="#f4f1ea" stroke="#222"/>`;

  for (const ort of imUmkreis) {
    const x = lonZuX(ort.lon, breite, ausschnitt);
    const y = latZuY(ort.lat, hoehe, ausschnitt);
    svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="${ort.farbe}"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
  }

  svg += `
</svg>`;

  karte.innerHTML = svg;

  // Wie beim SVG: Text sammeln, dann einmal ins DOM schreiben.
  let listenElemente = "";
  for (const ort of orteNachEntfernung) {
    listenElemente += `<li>${ort.name} – ${ort.km.toFixed(1)} km</li>`;
  }

  liste.innerHTML = listenElemente;
}

sliderBreite.addEventListener("input", zeichnen);
sliderZoom.addEventListener("input", zeichnen);
sliderRadius.addEventListener("input", zeichnen);

zeichnen();


ausschnittBerechnen so umbauen dass es in projektion.js passt
und was muss ich in karte.js ändern? den slider mach ich selbst,
der soll wieder von 1 bis 50 gehne

