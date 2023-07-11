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
  return (
    <div
      className={`border-2 ${
        backgroundColor ? 'bg-' + backgroundColor : 'bg-gray'
      } rounded-lg py-1vh px-2vh flex flex-col`}
    >
      <span>{title}</span>
      <span style={{ fontSize: '3vh' }}>
        {value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    </div>
  )
}

export default ValueCard
