import React from 'react'

interface DefaultButtonProps {
  onClick?: () => void
  children: React.ReactNode
  color?: 'success' | 'danger'
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
        return 'flex items-center justify-center border border-green text-green hover:bg-green2 hover:text-white rounded-lg py-2 px-4 mb-4'
      case 'danger':
        return 'flex items-center justify-center border border-red text-red hover:bg-red hover:text-white rounded-lg py-2 px-4 mb-4'
      default:
        return 'flex items-center justify-center border border-gray text-gray hover:bg-gray hover:text-white rounded-lg py-2 px-4 mb-4'
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
