export class Miejsce {
    sektor
    linia : number
    pozycja : number
}

export class Rejestr {
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

export class Pojazd {
    _id
    rejestracja
    marka
    model
    kolor
    drzwi : number
    pojemnosc : number
    rabat : boolean
}