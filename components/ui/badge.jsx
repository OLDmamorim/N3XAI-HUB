export function Badge({ variant='default', className='', children, ...props }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-md text-xs';
  const styles = {
    default: 'bg-black text-white',
    secondary: 'bg-gray-200 text-gray-900',
    outline: 'border border-gray-400 text-gray-800'
  }
  return <span className={[base, styles[variant] || styles.default, className].join(' ')} {...props}>{children}</span>
}
