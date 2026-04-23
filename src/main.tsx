import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="p-32 font-sans text-set">
      <h1 className="text-24 font-bold leading-30">SiteGiant Design System</h1>
      <p className="text-14 leading-17 text-set-lighter">Run <code className="bg-space-light px-8 py-4 rounded-4 text-12">npm run storybook</code> to view components.</p>
    </div>
  </StrictMode>,
)
