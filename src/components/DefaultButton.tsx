import React from 'react'

interface DefaultButtonProps {
  onClick?: () => void
  children: React.ReactNode
  color?: 'success' | 'danger' | 'default'
  className?: string
}

const DefaultButton: React.FC<DefaultButtonProps> = ({
  onClick,
  children,
  color = 'gray',
}) => {
  const getButtonColorClass = () => {
    switch (color) {
      case 'success':
        return 'flex items-center justify-center border border-green text-green hover:bg-purple hover:text-foreground rounded-lg py-2 px-4 mb-4'
      case 'danger':
        return 'flex items-center justify-center border border-red text-red hover:bg-red hover:text-foreground rounded-lg py-2 px-4 mb-4'
      default:
        return 'flex items-center justify-center border border-purple text-purple hover:bg-purple hover:text-foreground rounded-lg py-2 px-4 mb-4'
    }
  }

  const style = getButtonColorClass()

  return (
    <button className={style} onClick={onClick}>
      {children}
    </button>
  )
}

export default DefaultButton
