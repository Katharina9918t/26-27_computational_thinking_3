const fs = require("fs"); // ganz oben

const BREITE_SVG = 720;
const HOEHE_SVG = 360;

function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}

const radiusMax = 30;
const faktorR = radiusMax / 60;

function tempZuRadius(temp) {
  return (temp + 20) * faktorR;
}

// ich hab mich dafür entschieden, weil es der selbe aufbau ist wie bei aufgabe 1. also plus 20 damit wir keine negative temperatur haben. dann mal faktor temp damit die größe
// vom kreis aussagt wie warm es an dem ort ist. 

const orte = JSON.parse(fs.readFileSync("orte-json.js"));

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  console.log(ort.name, "→ x:", x, "y:", y);
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE_SVG}" height="${HOEHE_SVG}">
  <rect width="${BREITE_SVG}" height="${HOEHE_SVG}" fill="#f4f1ea" stroke="#222"/>`;

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  const r = tempZuRadius(ort.temperatur);
  svg += `
  <circle cx="${x}" cy="${y}" r="${r}" fill="#c0392b"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
}

// hier hab ich den radius/ also die kreise mit der temperatur verknüpft 
// r="${r}" setzt den berechneten radius ein, statt eine feste zahl zu nehmen 

svg += `
</svg>`;

fs.writeFileSync("karte.svg", svg);