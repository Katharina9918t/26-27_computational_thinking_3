Wohin hast du deine Erweiterungen aus T4 gelegt, in ein Modul oder in karte.js, und warum?

ausschnittBerechnen ist in projektion.js weil es nur rechnet (Zahlen rein und Ausschnitt Ergebnis)
zoom-slider in karte.js ist geblieben, weiler die Seite braucht.

Warum stehen lonZuX und latZuY nicht mehr in karte.js?

lonZuX und latZuY rechnen auch nur, deswegen sind sie jetzt in projektion.js, mit export werden sie freigegeben und karte.js holt sie mit import.

Was ist dir unklar geblieben?

ich musste am Anfang der Aufgabe mir viel erklären lassen, weil ich durch die Folien allein nicht verstanden habe, was letzte Woche gemacht wurde (ich war krank). aber ich glaube, dass ich den neuen Aufbau/ die Logik jetzt verstanden habe. zuerst dachte ich, dass bei export das Ergebnis der Funktion übermittelt wird, jetzt versteh ich, dass es nur freigegeben wird.