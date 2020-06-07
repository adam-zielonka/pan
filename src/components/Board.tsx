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
  id: number, 
  isStackEmpty: boolean 
}> = ({ player, id, isStackEmpty }) => {
  const { isActionAvailable, isComboActionAvailable, setComboMode } = useStore().gameStore
  
  return (
    <div>
      {id+1}.
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

const Board: React.FC = () => {
  const { token, stack, players, getFromStack } = useStore().gameStore

  return (
    <div className="board">
      Token: {token + 1}
      <div>
        Stack: {stack.map(card => <CardElement 
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
      {players.map((player, i) => <PlayerElement 
        key={i} 
        id={i} 
        player={player} 
        isStackEmpty={stack.length ? true : false}
      />)}
    </div>
  )
}

export default observer(Board)
