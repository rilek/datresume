import { createFileRoute, Outlet } from '@tanstack/react-router'
import Menu from '../../components/menu';
import { createPortal } from 'react-dom';

export const Route = createFileRoute('/(app)/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='min-h-screen'>
    <div className='fixed top-2 left-2 print:hidden'>
      <h1 className='font-serif font-bold transition-opacity opacity-25 hover:opacity-100'>Datresume</h1></div>
    <Outlet />

    {createPortal(<Menu />, document.getElementById('actions')!)}
  </div>
}
