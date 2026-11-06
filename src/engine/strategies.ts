import { PlayerType } from './PlayerType'

export const strategies: Record<
  PlayerType,
  {
    name: string
    method: string
    description: string
    color: string
    information: string
  }
> = {
  [PlayerType.Human]: {
    name: 'Ty',
    method: 'Gracz',
    color: 'mint',
    information: 'Twoje karty',
    description: 'Twój fotel przy stole. Podświetlone karty możesz teraz zagrać.',
  },
  [PlayerType.None]: {
    name: 'Wolne miejsce',
    method: 'Bez gracza',
    color: 'gray',
    information: 'Nie gra',
    description: 'Wyłącz ten fotel. Do rozdania potrzeba co najmniej dwóch graczy.',
  },
  [PlayerType.Random]: {
    name: 'Felek',
    method: 'Losowy',
    color: 'rose',
    information: 'Bez podglądania',
    description:
      'Zdaje się na los: każdy dozwolony ruch ma taką samą szansę. Dobry punkt odniesienia.',
  },
  [PlayerType.Simple]: {
    name: 'Bolek',
    method: 'Zachłanny',
    color: 'amber',
    information: 'Bez podglądania',
    description:
      'Zagrywa najniższą dozwoloną kartę. Wysokie figury zachowuje na później.',
  },
  [PlayerType.MCTS]: {
    name: 'Monte',
    method: 'Drzewo Monte Carlo',
    color: 'blue',
    information: 'Losuje nieznane ręce',
    description:
      'Rozbudowuje drzewo ruchów metodą UCT. W 180 próbach losuje możliwe ręce rywali i symuluje dalszą grę.',
  },
  [PlayerType.AZ]: {
    name: 'Ada',
    method: 'MaxN · 4 ruchy',
    color: 'lilac',
    information: 'Zna wszystkie ręce',
    description:
      'Analizuje do 4 ruchów naprzód, zakładając, że każdy gra na swoją korzyść. Unika powtarzania ruchów. Wariant eksperymentalny z pełną wiedzą o kartach.',
  },
  [PlayerType.Tactical]: {
    name: 'Tosia',
    method: 'Taktyczna',
    color: 'mint',
    information: 'Bez podglądania',
    description:
      'Pozbywa się niskich kart, premiuje serie i dobiera kierunek po piku do liczby kart następnego gracza. Przy powtarzającym się układzie próbuje innego ruchu.',
  },
  [PlayerType.Rollout]: {
    name: 'Bruno',
    method: 'Symulacje Monte Carlo',
    color: 'orange',
    information: 'Losuje nieznane ręce',
    description:
      'Porównuje ruchy w 36 symulacjach na każdy ruch. Za każdym razem losuje możliwe karty przeciwników.',
  },
}
