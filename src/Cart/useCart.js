import React from 'react'
const CartContext = React.createContext()

export default CartContext

export function useCart() {
    const context = React.useContext(CartContext);
    if (context === undefined) {
      throw new Error('useCartContext must be used within an AppProvider');
    }
    return context;
  }
