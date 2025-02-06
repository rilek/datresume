import PageFooter from '@/components/layout/footer'
import PageHeader from '@/components/layout/header'
import { createFileRoute, Outlet } from '@tanstack/react-router'
// import Menu from '../../components/menu';
// import { createPortal } from 'react-dom';

export const Route = createFileRoute('/(app)/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='min-h-screen'>
    {/* {createPortal(<Menu />, document.getElementById('actions')!)} */}

    <PageHeader />
    <Outlet />
    <PageFooter />
  </div>
}
