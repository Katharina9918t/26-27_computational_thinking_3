1. Wie funktionieren Ausschnitt und Zoom?

Ausschnitt legt fest, welchen Bereich man auf der Karte sieht. 
Dabei wird die Koordinate in dem Anteil des Ausschnitts (also Wert zw. 0-1)
mit Breite/Höhe in PX multipliziert.

Zoom verkleinert den Ausschnitt, bei 2 nur halb so viel Grad, bei Zoom 10 ein Zehntel.

Zoompunkt sorgt dafür dass Schwäbisch Gmünd immer an der selben Stelle ist,
indem der Ausschnitt immer verschoben wird (also 70 % von links und 20% von oben)
so bleibt Schwäbisch Gmünd immer stehen und die anderen Orte bewegen sich weg.

2. Welche Stolpersteine gab es bei der Umsetzung?

ich fand das Einbauen bei Ausschnitt schwierig bei meinem alten Code, deswegen hab
ich die Vorlage genommen, die war kürzer und einfacher zu verstehen. 
Beim Slider war ich am Anfang verwirrt, wie HTML und JS zusammenhängen. Aber ich
hab den Zoom Slider so eingebaut. zuerst HTML, dann mit querySelector in JS holen und durch
addEventListener zeichnen () aufrufen und so die Karte verändern. 
danach hat sich aber nichts verändert, das lagt dran, dass zeichnen den Zoom-Wert nicht
verwendet hat

3. Was ist dir unklar geblieben?

die Umrechnung von 0-1 hab hab ich verstanden( ja das selbe wie bei Aufgabe 1). Den Unterschied zu Ausschnitt hab ich erst verstanden, als KI mir das erklärt hat. Es ist die selbe Rechnung aber auf einen kleineren Bereich bezogen. 