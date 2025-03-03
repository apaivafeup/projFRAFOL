import CardView from "./Card.view";

interface CardProps {
    title: string;
    hero: string;
    label?: string;
  }


function Card( {title, hero, label}: CardProps) {
  return (
    <CardView title={title} hero={hero} label={label} / >
  )
}

export default Card