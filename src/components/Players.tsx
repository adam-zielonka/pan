import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { PlayerType } from '../store/PlayersStore'

const Player: React.FC<{
  player: PlayerType
  set: (value: PlayerType) => void
  availableHuman: boolean
}> = observer(({ player, set, availableHuman }) => {
  const onChangeHandler  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    set(event.target.value as PlayerType)
  }

  const players = Object.values(PlayerType).filter(playerType => availableHuman || playerType !== PlayerType.Human )  

  return (
    <div>
      <select value={player} onChange={onChangeHandler}>
        {players.map(player => <option key={player} value={player}>{player}</option>)}
      </select>
    </div>
  )
})

const Players: React.FC = () => {
  const { players, set } = useStore().playersStore

  return (
    <div className="Players">
      {players.map((player, i) => (
        <Player 
          key={i}
          player={player}
          set={(player: PlayerType) => set(i, player)}
          availableHuman={!i}
        />
      ))}
    </div>
  )
}

export default observer(Players)
