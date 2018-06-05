export class Miejsce {
    sektor
    linia : number
    pozycja : number
}

class Rejestr {
    id_samochodu
    przyjazd
    odjazd?
}

export class Parking {
     _id
    miejsce : Miejsce
    dla_niepelnosprawnych : boolean
    rejestr : Rejestr[]
    remont? : boolean
}