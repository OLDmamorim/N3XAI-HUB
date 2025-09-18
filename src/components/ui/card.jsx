export function Card({ className='', ...props }) {
  return <div className={'rounded-xl border bg-white/70 dark:bg-neutral-900/70 ' + className} {...props} />
}
export function CardHeader({ className='', ...props }) {
  return <div className={'p-4 ' + className} {...props} />
}
export function CardTitle({ className='', ...props }) {
  return <h3 className={'font-semibold ' + className} {...props} />
}
export function CardContent({ className='', ...props }) {
  return <div className={'px-4 pb-4 ' + className} {...props} />
}
export function CardFooter({ className='', ...props }) {
  return <div className={'px-4 pb-4 ' + className} {...props} />
}
