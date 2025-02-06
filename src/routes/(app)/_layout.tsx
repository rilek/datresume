import { createFileRoute, Outlet } from '@tanstack/react-router'
// import Menu from '../../components/menu';
// import { createPortal } from 'react-dom';

export const Route = createFileRoute('/(app)/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='min-h-screen'>
    {/* {createPortal(<Menu />, document.getElementById('actions')!)} */}

    <Outlet />

    <footer className='print:hidden'>
      <div className='max-w-[52.5rem] mx-auto px-4 py-8'>
        <p className='text-center text-xs text-slate-500'>
          &copy; {new Date().getFullYear()} Datresume | Made with ❤️
        </p>
      </div>
    </footer>
  </div>
}
