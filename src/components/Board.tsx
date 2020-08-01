import React from 'react'
import { observer } from 'mobx-react-lite'
import { useGameStore } from '../store/store'
import { Card } from '../engine/card'
import { IPlayer } from '../engine/board'

const CardElement = ({ card, disabled }:{ 
  card: Card, disabled: boolean 
}) => {
  const { action } = useGameStore()

  return (
    <button 
      className='card' 
      style={{ color: card.getColorStyle() }} 
      disabled={disabled} 
      onClick={() => action(card)}
    >{card.toString()}</button>
  )
}

const PlayerID = observer(({ id }:{ id: number }) => {
  const { token } = useGameStore()

  return (
    <div className="bp3-dialog-header" style={{ backgroundColor: token === id ? 'lightgreen' : 'white' }}>
      <h4 className="bp3-heading">#{id + 1}</h4>
    </div>
  )
})

const PlayerElement = ({ player, isStackEmpty }:{ 
  player: IPlayer, isStackEmpty: boolean 
}) => {
  const { isActionAvailable, isComboActionAvailable, setComboMode } = useGameStore()
  
  return (
    <div className='cards bp3-card player1'>
      <PlayerID id={0} />     
      {player.cards.map(card => <CardElement 
        key={card.toString()} 
        card={card} 
        disabled={!isActionAvailable(card, player.id)}
      />)}
      {player.getFigureActions(isStackEmpty).map(figure => <button
        key={figure}
        className='card' 
        onClick={() => setComboMode(figure)} 
        disabled={!isComboActionAvailable(figure, player.id)}
      >{Card.numberToFigure(figure)}</button>)}
    </div>
  )
}

const OponentElement = ({ player }:{ player: IPlayer }) => {  
  return (
    <div className={'cards bp3-card player' + (player.id+1)}>
      <PlayerID id={player.id} /> 
      <button disabled={true} className='card'>{player.cards.length}</button>
    </div>
  )
}

const Stack = observer(() => {
  const { stack, token, getFromStack } = useGameStore()

  return (
    <div className='cards bp3-card stack'>
      <div className="bp3-dialog-header">
        <span className="bp3-icon-large bp3-icon-layers" style={{color: 'black'}}></span>
        <h4 className="bp3-heading">Stack</h4>
      </div>
      {stack.length > 3 && <button disabled={true} className='card'>...</button>}
      {stack.slice(Math.max(stack.length - 3, 0)).map(card => <CardElement 
        key={card.toString()} 
        card={card} 
        disabled={true} 
      />)}
      <button 
        className='card' 
        onClick={getFromStack} 
        disabled={stack.length > 1 && token === 0 ? false : true}
      >Get</button>
    </div>
  )
})

const Board = () => {
  const { stack, players } = useGameStore()

  return (
    <div className='board grid'>
      {players.filter((_, i) => i).map((player, i) => <OponentElement 
        key={i}
        player={player}
      />)}
      <Stack/>
      <PlayerElement
        player={players[0]} 
        isStackEmpty={stack.length ? true : false}
      />
    </div>
  )
}

export default observer(Board)
