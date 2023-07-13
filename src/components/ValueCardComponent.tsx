import React from 'react'

interface FinalValueCardProps {
  value: number
  backgroundColor?: string
  title: string
}

const ValueCard: React.FC<FinalValueCardProps> = ({
  value,
  backgroundColor,
  title,
}) => {
  const getClass = () => {
    switch (backgroundColor) {
      case 'red':
        return 'border-2 bg-red rounded-lg py-1vh px-2vh flex flex-col pr-4 pt-2 pb-2 pl-4'
      case 'green':
        return 'border-2 bg-green rounded-lg py-1vh px-2vh flex flex-col pr-4 pt-2 pb-2 pl-4'
      default:
        return 'border-2 bg-blue rounded-lg py-1vh px-2vh flex flex-col pr-4 pt-2 pb-2 pl-4'
    }
  }

  return (
    <div className={getClass()}>
      <span>{title}</span>
      <span className="text-3xl">
        {value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    </div>
  )
}

export default ValueCard
