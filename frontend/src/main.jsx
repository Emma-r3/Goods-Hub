import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/home.css'
import './styles/products.css'
import './styles/detail.css'
import './styles/cart.css'
import './styles/checkout.css'
import './styles/orders.css'
import './styles/auth.css'
import App from './App.jsx'
import LanguageProvider from './context/LanguageProvider.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import CartProvider from './context/CartProvider.jsx'
import OrderProvider from './context/OrderProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
