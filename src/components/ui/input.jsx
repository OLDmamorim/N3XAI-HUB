export function Input(props) {
  const cls = 'w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';
  return <input className={cls} {...props} />
}
