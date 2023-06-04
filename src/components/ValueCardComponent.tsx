import React from 'react';

interface FinalValueCardProps {
  value: number;
  backgroundColor?: string;
  title: string;
}

const ValueCard: React.FC<FinalValueCardProps> = ({
  value,
  backgroundColor,
  title,
}) => {
  return (
    <div
      style={{
        border: '1px solid',
        background: backgroundColor || 'gray',
        borderRadius: '10px',
        padding: '1vh 2vh 1vh 2vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span>{title}</span>
      <span style={{ fontSize: '3vh' }}>
        {value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    </div>
  );
};

export default ValueCard;
