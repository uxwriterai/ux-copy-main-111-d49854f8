import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from './integrations/supabase/client'

createRoot(document.getElementById("root")!).render(
  <SessionContextProvider 
    supabaseClient={supabase}
    initialSession={null}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SessionContextProvider>
);