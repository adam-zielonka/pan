import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { Card } from '../engine/card'
import { IPlayer } from '../engine/board'

const CardElement: React.FC<{ 
  card: Card, 
  disabled: boolean 
}> = ({ card, disabled }) => {
  const { action } = useStore().gameStore

  return (
    <button 
      className='card' 
      style={{ color: card.getColorStyle() }} 
      disabled={disabled} 
      onClick={() => action(card)}
    >{card.toString()}</button>
  )
}

const PlayerElement: React.FC<{ 
  player: IPlayer, 
  isStackEmpty: boolean 
}> = ({ player, isStackEmpty }) => {
  const { isActionAvailable, isComboActionAvailable, setComboMode } = useStore().gameStore
  
  return (
    <div className='cards bp3-card'>
      {player.getCards().map(card => <CardElement 
        key={card.toString()} 
        card={card} 
        disabled={!isActionAvailable(card, player.getID())}
      />)}
      {player.getFigureActions(isStackEmpty).map(figure => <button 
        className='card' 
        onClick={() => setComboMode(figure)} 
        disabled={!isComboActionAvailable(figure, player.getID())}
      >{Card.numberToFigure(figure)}</button>)}
    </div>
  )
}

const OponentElement: React.FC<{ 
  player: IPlayer
}> = ({ player }) => {  
  return (
    <div className='cards'>
      #{player.getID() + 1}
      <button disabled={true} className='card'>{player.getCards().length}</button>
    </div>
  )
}

const Board: React.FC = () => {
  const { stack, players, getFromStack } = useStore().gameStore

  return (
    <div className='board'>
      <div className='cards bp3-card'>
        {players.filter((_, i) => i).map((player, i) => <OponentElement 
          key={i}
          player={player}
        />)}
      </div>
      <div className='cards bp3-card'>
        {stack.length > 3 && <button disabled={true} className='card'>...</button>}
        {stack.slice(Math.max(stack.length - 3, 0)).map(card => <CardElement 
          key={card.toString()} 
          card={card} 
          disabled={true} 
        />)}
        <button 
          className='card' 
          onClick={getFromStack} 
          disabled={stack.length > 1 ? false : true}
        >Get</button>
      </div>
      <PlayerElement 
        player={players[0]} 
        isStackEmpty={stack.length ? true : false}
      />
    </div>
  )
}

export default observer(Board)
