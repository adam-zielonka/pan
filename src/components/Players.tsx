import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { PlayerType } from '../store/PlayersStore'

const Player = ({ player, set, id }:{
  player: PlayerType
  set: (index:number, value: PlayerType) => void
  id: number
}) => {
  const onChangeHandler  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    set(id, event.target.value as PlayerType)
  }
  const isHuman = !id
  const players = Object.values(PlayerType).filter(playerType => 
    (!isHuman && playerType !== PlayerType.Human) || (isHuman && playerType !== PlayerType.None)
  )

  return (
    <div className='bp3-select'>
      <select value={player} onChange={onChangeHandler}>
        {players.map(player => <option key={player} value={player}>#{id + 1} {player}</option>)}
      </select>
    </div>
  )
}

const Players = () => {
  const { players, set } = useStore().players

  return <>{players.map((player, i) => <Player key={i} id={i} player={player} set={set}/>)}</>
}

export default observer(Players)
