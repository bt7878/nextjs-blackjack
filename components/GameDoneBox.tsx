export type GameDoneBoxProps = {
  playerHandValue: number;
  dealerHandValue: number;
  onClick: () => void;
};

function getMessage(playerHandValue: number, dealerHandValue: number): string {
  if (
    playerHandValue > 21 ||
    (dealerHandValue <= 21 && dealerHandValue > playerHandValue)
  )
    return "You lose!";
  else if (dealerHandValue > 21 || playerHandValue > dealerHandValue)
    return "You win!";
  else return "It's a draw!";
}

export function GameDoneBox(props: GameDoneBoxProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.onClick();
  };

  return (
    <div className="absolute top-1/2 left-1/2 h-fit w-fit flex flex-col justify-center items-center bg-white rounded-xl border border-gray-200 -translate-y-1/2 -translate-x-1/2">
      <text className="mt-5 mx-5 font-semibold text-sm whitespace-nowrap text-center">
        {`Your card total: ${props.playerHandValue}, Dealer card total: ${props.dealerHandValue}`}
      </text>
      <text className="mx-5 mt-2 font-medium text-sm whitespace-nowrap text-center">{`Result: ${getMessage(
        props.playerHandValue,
        props.dealerHandValue
      )}`}</text>
      <button
        className="mx-5 mb-5 mt-3 py-2 px-3 w-fit h-fit rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 align-middle text-center"
        onClick={handleClick}
      >
        New Game
      </button>
    </div>
  );
}
