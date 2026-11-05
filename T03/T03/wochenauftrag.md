# Wochenauftrag T3 → T4

## Bis nächste Woche

**Diese Woche setzt ihr eine kleine Verbesserung um, mit eime Claude-Modell im AI-Hub.**

Ihr könnt über den AI-Hub, wie ihr sicherlich wisst, auch ein Opus oder Sonnet als Modell auswählen.

### 1 — Eine Verbesserung an eurem Werkzeug

Sucht euch **eine** Sache im aktuellen Projekt (`projektion.js`) aus, die euch stört oder fehlt.
Zum Beispiel: Die Beschriftungen der Orte überlappen manchmal.

Dann, in dieser Reihenfolge:

1. **Schreibt auf, was rauskommen soll.** 

Die Beschriftungen der Orte überlappen sich. Zwischen den Elementen auf der Karte sollen immer mindestens 10 px Abstand sein, wenn eine Beschriftung verschoben wird, soll man trotzdem erkennen, wo die dazu gehört.
2. **Überlegt euch, woran ihr prüft, ob es stimmt.** 
ich hab mir die Karte angeschaut, und man gut erkennen, welche Beschriftung zu welchem Ort gehört. Ich denke im nächsten Schritt müsste man die Orte Stuttgart, Schäwbisch Gmünd und Fornsbach entzerren, weil die zu nah bei einander sind und sich deswegen die Kreise überlappen
3. **Schreibt den Prompt.** Ein Prompt, eine Änderung. Speichert ihn in einer
   `PROMPT.md`.
4. **Schickt ihn bei Copilot ab,** in einem neuen Chat.
5. **Lest, was zurückkommt, baut es ein und prüft es** mit dem, was ihr in
   Schritt 2 aufgeschrieben habt. *(Regel 3: Lesen und testen, was rauskam)*
6. **Was ihr im neuen Code nicht versteht,** markiert ihr als Kommentar:

ich hab manche kommentare von claude drin gelassen, wenn ich sehen kann, was da gemacht wird ist es leichter den ganzen ablauf zu verstehen. aber vorallem 111-137 versteh ich gar nicht, ich finde die formeln zu kompliziert, weil zu viel da zu viele elemente sind

### 2 — `ENTSCHEIDUNGEN.md`

Diese Woche nicht die fünf
Sätze, sondern zwei Fragen:

1. Welche Verbesserung habt ihr gewählt, und warum diese?

ich finde die Beschriftungen machen einen größen unterschied, weil man so klarer erkennen kann, welche orte man eigentlich sieht. 
2. Woran habt ihr geprüft, ob sie stimmt? Hat es gestimmt?
am svg konnte ich sehen, dass nur die beschriftungen geändert wurden und nichts an den kreisen.

Den Prompt nicht noch mal reinkopieren, der steht schon in `PROMPT.md`.

### 3 — Abgabe

Pushen, so wie heute in der Sitzung. Der letzte Commit auf `main` ist die
Abgabe.