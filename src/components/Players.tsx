import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { PlayerType } from '../store/PlayersStore'

const Player: React.FC<{
  player: PlayerType
  set: (value: PlayerType) => void
  availableHuman: boolean
  id: number
}> = observer(({ player, set, availableHuman, id }) => {
  const onChangeHandler  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    set(event.target.value as PlayerType)
  }

  const players = Object.values(PlayerType).filter(playerType => availableHuman || playerType !== PlayerType.Human)
    .filter(playerType => !availableHuman || playerType !== PlayerType.None) 

  return (
    <div className='bp3-select'>
      <select value={player} onChange={onChangeHandler}>
        {players.map(player => <option key={player} value={player}>#{id + 1} {player}</option>)}
      </select>
    </div>
  )
})

const Players: React.FC = () => {
  const { players, set } = useStore().playersStore

  return (
    <>
      {players.map((player, i) => (
        <Player 
          key={i}
          id={i}
          player={player}
          set={(player: PlayerType) => set(i, player)}
          availableHuman={!i}
        />
      ))}
    </>
  )
}

export default observer(Players)
