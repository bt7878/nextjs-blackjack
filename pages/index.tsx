import { Card, Suit, Value } from "@/components/Card";
import { useCallback, useEffect, useMemo, useState } from "react";

import { GameDoneBox } from "@/components/GameDoneBox";
import { GetStaticProps } from "next";

type CardType = { value: Value; suit: Suit };
type HomeProps = { allCards: CardType[] };

enum GameState {
  PlayerDrawing = 0,
  DealerDrawing,
  WaitingForDealer,
  Done,
}

function draw(deck: CardType[]): [CardType, CardType[]] {
  const i = Math.floor(deck.length * Math.random());
  const drawn = deck[i];
  const cardsLeft = deck.filter((card) => card !== drawn);
  return [drawn, cardsLeft];
}

function checkBlackJack(card1: CardType, card2: CardType): boolean {
  return calcHandValue([card1, card2]) === 21;
}

function calcHandValue(
  cards: CardType[],
  start?: number,
  tally?: number
): number {
  start = start ?? 0;
  tally = tally ?? 0;
  if (start === cards.length) {
    return tally;
  }
  switch (cards[start].value) {
    case Value.Ace:
      const as1 = calcHandValue(cards, start + 1, tally + 1);
      const as11 = calcHandValue(cards, start + 1, tally + 11);
      if (as1 <= 21 && as11 <= 21) return Math.max(as1, as11);
      else return Math.min(as1, as11);
    case Value.Two:
      return calcHandValue(cards, start + 1, tally + 2);
    case Value.Three:
      return calcHandValue(cards, start + 1, tally + 3);
    case Value.Four:
      return calcHandValue(cards, start + 1, tally + 4);
    case Value.Five:
      return calcHandValue(cards, start + 1, tally + 5);
    case Value.Six:
      return calcHandValue(cards, start + 1, tally + 6);
    case Value.Seven:
      return calcHandValue(cards, start + 1, tally + 7);
    case Value.Eight:
      return calcHandValue(cards, start + 1, tally + 8);
    case Value.Nine:
      return calcHandValue(cards, start + 1, tally + 9);
    default:
      return calcHandValue(cards, start + 1, tally + 10);
  }
}

export default function Home(props: HomeProps) {
  const [gameState, setGameState] = useState<GameState>(
    GameState.PlayerDrawing
  );

  const [playerCards, setPlayerCards] = useState<CardType[]>([]);
  const [dealerCards, setDealerCards] = useState<CardType[]>([]);
  const [availableCards, setAvailableCards] = useState<CardType[]>([]);

  const playerHandValue = useMemo(
    () => calcHandValue(playerCards),
    [playerCards]
  );
  const dealerHandValue = useMemo(
    () => calcHandValue(dealerCards),
    [dealerCards]
  );

  const drawPlayerCard = () => {
    if (availableCards.length !== 0 && gameState === GameState.PlayerDrawing) {
      const [drawn, cardsLeft] = draw(availableCards);
      setPlayerCards([...playerCards, drawn]);
      setAvailableCards(cardsLeft);
    }
  };

  const startDealerDraw = () => {
    if (gameState === GameState.PlayerDrawing)
      setGameState(GameState.DealerDrawing);
  };

  const resetCards = useCallback(() => {
    setGameState(GameState.PlayerDrawing);
    const [drawn1, cardsLeft1] = draw(props.allCards);
    const [drawn2, cardsLeft2] = draw(cardsLeft1);
    const [drawnDealer1, cardsLeft3] = draw(cardsLeft2);
    const [drawnDealer2, cardsLeft] = draw(cardsLeft3);
    setPlayerCards([drawn1, drawn2]);
    setDealerCards([drawnDealer1, drawnDealer2]);
    setAvailableCards(cardsLeft);
    if (
      checkBlackJack(drawn1, drawn2) ||
      checkBlackJack(drawnDealer1, drawnDealer2)
    )
      setGameState(GameState.Done);
  }, [props.allCards]);

  useEffect(() => {
    resetCards();
  }, [resetCards]);

  useEffect(() => {
    if (gameState === GameState.PlayerDrawing) {
      if (playerHandValue > 21) {
        setGameState(GameState.Done);
      } else if (playerHandValue === 21) {
        setGameState(GameState.DealerDrawing);
      }
    } else if (gameState === GameState.DealerDrawing) {
      if (availableCards.length !== 0 && dealerHandValue < 17) {
        setTimeout(() => {
          const [drawn, cardsLeft] = draw(availableCards);
          setDealerCards([...dealerCards, drawn]);
          setAvailableCards(cardsLeft);
          setGameState(GameState.DealerDrawing);
        }, 1000);
        setGameState(GameState.WaitingForDealer);
      } else {
        setGameState(GameState.Done);
      }
    }
  }, [
    gameState,
    dealerCards,
    availableCards,
    playerHandValue,
    dealerHandValue,
  ]);

  return (
    <main className="flex h-screen">
      <div className="relative m-auto flex flex-col gap-20 items-center ">
        <div className="flex flex-row gap-5">
          {dealerCards.map((card, i) => (
            <Card
              key={i}
              value={
                gameState !== GameState.PlayerDrawing || i === 0
                  ? card.value
                  : undefined
              }
              suit={
                gameState !== GameState.PlayerDrawing || i === 0
                  ? card.suit
                  : undefined
              }
              flipped={true}
              onClick={startDealerDraw}
            />
          ))}
        </div>
        <div className="flex flex-row gap-5">
          {playerCards.map((card, i) => (
            <Card
              key={i}
              value={card.value}
              suit={card.suit}
              flipped={false}
              onClick={drawPlayerCard}
            />
          ))}
        </div>
        {gameState === GameState.Done && (
          <GameDoneBox
            playerHandValue={playerHandValue}
            dealerHandValue={dealerHandValue}
            onClick={resetCards}
          />
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const values = Object.values(Value);
  const suits = Object.values(Suit);
  return {
    props: {
      allCards: values.flatMap((v) =>
        suits.map((s) => {
          return { value: v, suit: s };
        })
      ),
    },
  };
};
