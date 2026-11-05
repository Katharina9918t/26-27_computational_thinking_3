const fs = require("fs"); // ganz oben

const orte = JSON.parse(fs.readFileSync("orte.json", "utf8"));

// ---------- Entfernung ----------

const ERDRADIUS_KM = 6371;

function gradZuRad(grad) {
  return grad * Math.PI / 180;
}

// findet einen Ort über seinen Namen ("Stuttgart") oder seine ID (4)
function findeOrt(nameOderId) {
  const ort = orte.find(o => o.name === nameOderId || o.ID === nameOderId);
  if (!ort) throw new Error(`Ort "${nameOderId}" nicht in orte.json gefunden`);
  return ort;
}

function entfernung(nameA, nameB) {
  const a = findeOrt(nameA);
  const b = findeOrt(nameB);

  const dLat = gradZuRad(b.lat - a.lat);
  const dLon = gradZuRad(b.lon - a.lon);
  const lat1 = gradZuRad(a.lat);
  const lat2 = gradZuRad(b.lat);

  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const winkel = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return winkel * ERDRADIUS_KM; // Winkel × Erdradius = km
}

console.log("Gmünd → Stuttgart:", entfernung("Schwäbisch Gmünd", "Stuttgart").toFixed(1), "km");
console.log("Fornsbach → Gmünd:", entfernung(9, 3).toFixed(1), "km"); // über die IDs
console.log("Nullinsel → Prüfpunkt Ost:", entfernung("Nullinsel", "Prüfpunkt Ost").toFixed(1), "km");
console.log("Spitzbergen → Prüfpunkt Nord:", entfernung("Spitzbergen", "Prüfpunkt Nord").toFixed(1), "km");

// ---------- Karte ----------

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

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  console.log(ort.name, "→ x:", x, "y:", y);
}

//  beschriftungen ohne überlappung ----------

const ABSTAND = 10;   
const SCHRIFT = 11;   

function textBreite(text) {
  return text.length * SCHRIFT * 0.6;
}

// Kreise mit Position und Radius vorberechnen
const kreise = orte.map(ort => ({
  ort,
  x: lonZuX(ort.lon, BREITE_SVG),
  y: latZuY(ort.lat, HOEHE_SVG),
  r: tempZuRadius(ort.temperatur) // hier hab ich den radius/ also die kreise mit der temperatur verknüpft
}));

// rechteckezunah= sind sie zu nah? aber diese rechnung versteh ich nicht
function rechteckeZuNah(a, b) {
  return a.x < b.x + b.w + ABSTAND && b.x < a.x + a.w + ABSTAND &&
         a.y < b.y + b.h + ABSTAND && b.y < a.y + a.h + ABSTAND;
}


function rechteckKreisZuNah(box, k) {
  const nx = Math.max(box.x, Math.min(k.x, box.x + box.w));
  const ny = Math.max(box.y, Math.min(k.y, box.y + box.h));
  return Math.hypot(k.x - nx, k.y - ny) < k.r + ABSTAND;
}


function imBild(box) {
  return box.x >= ABSTAND && box.y >= ABSTAND &&
         box.x + box.w <= BREITE_SVG - ABSTAND &&
         box.y + box.h <= HOEHE_SVG - ABSTAND;
}

const platzierte = []; // bereits gesetzte Beschriftungen

// Probiert rund um den Kreis immer weiter entfernte Positionen,
// ich verstehe, dass jetzt die position der beschriftungen kommt, aber wie dieser teil funktioniert, 
// verstehe ich nicht. Also auch was cos und sin in der funktion machen.
function platziereBeschriftung(k) {
  const w = textBreite(k.ort.name);
  const h = SCHRIFT;
  const richtungen = [0, 180, -90, 90, -45, 45, -135, 135, -22.5, 22.5, -157.5, 157.5, -67.5, 67.5, -112.5, 112.5];

  for (let weg = 0; weg <= 300; weg += 4) {
    for (const grad of richtungen) {
      const cos = Math.cos(gradZuRad(grad));
      const sin = Math.sin(gradZuRad(grad));
      const px = k.x + cos * (k.r + ABSTAND + weg);
      const py = k.y + sin * (k.r + ABSTAND + weg);
      const box = {
        x: px - w / 2 + cos * w / 2,
        y: py - h / 2 + sin * h / 2,
        w, h
      };
      const frei = imBild(box) &&
        platzierte.every(b => !rechteckeZuNah(box, b)) &&
        kreise.every(andererKreis => !rechteckKreisZuNah(box, andererKreis));
      if (frei) {
        platzierte.push(box);
        return { box, weg };
      }
    }
  }
  throw new Error(`Kein freier Platz für "${k.ort.name}" gefunden`);
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE_SVG}" height="${HOEHE_SVG}">
  <rect width="${BREITE_SVG}" height="${HOEHE_SVG}" fill="#f4f1ea" stroke="#222"/>`;

// erst alle Kreise zeichnen
// r="${k.r}" setzt den berechneten radius ein, statt eine feste zahl zu nehmen
for (const k of kreise) {
  svg += `
  <circle cx="${k.x}" cy="${k.y}" r="${k.r}" fill="#c0392b"/>`;
}


// das hier hat claude einfach selbst hinzugefügt, also dass man eine verbindungslinie braucht
for (const k of kreise) {
  const { box, weg } = platziereBeschriftung(k);

  if (weg > 0) {
    const nx = Math.max(box.x, Math.min(k.x, box.x + box.w));
    const ny = Math.max(box.y, Math.min(k.y, box.y + box.h));
    const winkel = Math.atan2(ny - k.y, nx - k.x);
    const sx = k.x + Math.cos(winkel) * k.r;
    const sy = k.y + Math.sin(winkel) * k.r;
    svg += `
  <line x1="${sx}" y1="${sy}" x2="${nx}" y2="${ny}" stroke="#888" stroke-width="0.75"/>`;
  }

  // y der Beschriftung ist die Grundlinie, daher etwas unter der Oberkante
  svg += `
  <text x="${box.x}" y="${box.y + SCHRIFT * 0.85}" font-family="sans-serif" font-size="${SCHRIFT}">${k.ort.name}</text>`;
}

svg += `
</svg>`;

fs.writeFileSync("karte.svg", svg);