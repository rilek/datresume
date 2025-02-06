export default function PageFooter() {
  return (
    <footer className='print:hidden'>
      <div className='max-w-[52.5rem] mx-auto px-4 py-8'>
        <p className='text-center text-xs text-slate-500'>
          &copy; {new Date().getFullYear()} Datresume | Made with ❤️ | <a href='/privacy' className='text-sky-700'>Privacy</a>
        </p>
      </div>
    </footer>
  )
}