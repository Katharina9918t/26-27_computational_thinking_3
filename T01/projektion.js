const canvasBreite = 720
const canvasHoehe = 360 //canvas maße 

const faktorX = canvasBreite / 360
const faktorY = canvasHoehe / 180 
//faktor wie die breitengrade umgrechnet werden, Abhängigkeit zur Größe

function lontoX (lon,) {    
return (lon + 180) * faktorX
}
//breite 

function latoY (lat) {
return (90 - lat) * faktorY
}
//höhe

function ortZuPixel(lon, lat) {
    return { x: lontoX(lon), y: latoY(lat) };
}
// fasst die beiden Funktionen zusammen und gibt Objekt zurück, das die x- und y-Koordinaten hat

console.log(ortZuPixel(0, 0));  

// beides in der mitte, kann beliebig verschoben werden 