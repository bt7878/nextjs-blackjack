import Image from "next/image";

export type CardProps = {
  value?: Value;
  suit?: Suit;
  flipped: boolean;
  onClick: () => void;
};

export enum Value {
  Ace = "A",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "T",
  Jack = "J",
  Queen = "Q",
  King = "K",
}

export enum Suit {
  C = "C",
  D = "D",
  H = "H",
  S = "S",
}

export function Card(props: CardProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    props.onClick();
  };

  return (
    <div
      className="w-40 h-60 shadow-md rounded-xl border border-gray-200 bg-white hover:ring-2 ring-blue-300"
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full ${
          props.flipped ? "rotate-180" : ""
        }`}
      >
        {props.value !== undefined && props.suit !== undefined ? (
          <Image
            src={props.value + props.suit + ".svg"}
            alt={props.value + props.suit}
            fill={true}
          />
        ) : (
          <Image src="1B.svg" alt="1B" fill={true} />
        )}
      </div>
    </div>
  );
}
