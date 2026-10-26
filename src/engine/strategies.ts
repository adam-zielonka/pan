import { PlayerType } from './PlayerType'

export const strategies: Record<
  PlayerType,
  {
    name: string
    method: string
    description: string
    initials: string
    color: string
    information: string
  }
> = {
  [PlayerType.Human]: {
    name: 'Ty',
    method: 'Gracz',
    initials: 'TY',
    color: 'mint',
    information: 'Twoje karty',
    description: 'Twój fotel przy stole. Podświetlone karty możesz teraz zagrać.',
  },
  [PlayerType.None]: {
    name: 'Wolne miejsce',
    method: 'Bez gracza',
    initials: '—',
    color: 'gray',
    information: 'Nie gra',
    description: 'Wyłącz ten fotel. Do rozdania potrzeba co najmniej dwóch graczy.',
  },
  [PlayerType.Random]: {
    name: 'Felek',
    method: 'Losowy',
    initials: 'FE',
    color: 'rose',
    information: 'Bez podglądania',
    description:
      'Zdaje się na los: każdy dozwolony ruch ma taką samą szansę. Dobry punkt odniesienia.',
  },
  [PlayerType.Simple]: {
    name: 'Bolek',
    method: 'Zachłanny',
    initials: 'BO',
    color: 'amber',
    information: 'Bez podglądania',
    description:
      'Zagrywa najniższą dozwoloną kartę. Wysokie figury zachowuje na później.',
  },
  [PlayerType.MCTS]: {
    name: 'Monte',
    method: 'Drzewo Monte Carlo',
    initials: 'MO',
    color: 'blue',
    information: 'Losuje nieznane ręce',
    description:
      'Rozbudowuje drzewo ruchów metodą UCT. W 180 próbach losuje możliwe ręce rywali i symuluje dalszą grę.',
  },
  [PlayerType.AZ]: {
    name: 'Ada',
    method: 'MaxN · 4 ruchy',
    initials: 'AD',
    color: 'lilac',
    information: 'Zna wszystkie ręce',
    description:
      'Analizuje do 4 ruchów naprzód, zakładając, że każdy gra na swoją korzyść. Unika powtarzania ruchów. Wariant eksperymentalny z pełną wiedzą o kartach.',
  },
  [PlayerType.Tactical]: {
    name: 'Tosia',
    method: 'Taktyczna',
    initials: 'TO',
    color: 'mint',
    information: 'Bez podglądania',
    description:
      'Pozbywa się niskich kart, premiuje serie i dobiera kierunek po piku do liczby kart następnego gracza. Przy powtarzającym się układzie próbuje innego ruchu.',
  },
  [PlayerType.Rollout]: {
    name: 'Bruno',
    method: 'Symulacje Monte Carlo',
    initials: 'BR',
    color: 'orange',
    information: 'Losuje nieznane ręce',
    description:
      'Porównuje ruchy w 36 symulacjach na każdy ruch. Za każdym razem losuje możliwe karty przeciwników.',
  },
}
