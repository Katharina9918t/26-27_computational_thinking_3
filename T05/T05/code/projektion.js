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
// zoom > 1 zoomt hinein. Der Punkt bleibt immer an derselben Stelle der Karte:
// position.x = Anteil von links, position.y = Anteil von oben.
export function ausschnittBerechnen(ausschnitt, punkt, position, zoom) {
  const breiteGrad = (ausschnitt.ost - ausschnitt.west) / zoom;
  const hoeheGrad = (ausschnitt.nord - ausschnitt.sued) / zoom;

  const west = punkt.lon - position.x * breiteGrad;
  const nord = punkt.lat + position.y * hoeheGrad;

  return {
    west: west,
    ost: west + breiteGrad,
    nord: nord,
    sued: nord - hoeheGrad,
  };
}