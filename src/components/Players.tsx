import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { PlayerType } from '../store/PlayersStore'

type PlayerProps = {
  player: PlayerType
  remove: () => void
  set: (value: PlayerType) => void
}

const Player: React.FC<PlayerProps> = observer(({ player, remove, set }) => {

  const onChangeHandler  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    set(event.target.value as PlayerType)
  }

  return (
    <div>
      <select value={player} onChange={onChangeHandler}>
        {Object.values(PlayerType).map(player => <option value={player}>{player}</option>)}
      </select>
      <button onClick={remove}>X</button>
    </div>
  )
})

const Players: React.FC = () => {
  const { players, add, remove, set } = useStore().playersStore

  return (
    <div className="Players">
      {players.map((player, i) => (
        <Player 
          key={i}
          player={player}
          remove={() => remove(i)}
          set={(player: PlayerType) => set(i, player)}
        />
      ))}
      <div>
        <button onClick={add} >+</button>
      </div>
    </div>
  )
}

export default observer(Players)
