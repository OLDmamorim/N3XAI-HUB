import React from 'react'

export function Button({ asChild=false, className='', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition hover:opacity-90 focus-visible:outline-none';
  const cls = base + ' bg-black text-white border-black ' + (className || '');
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { className: (children.props.className||'') + ' ' + cls, ...props })
  }
  return <button className={cls} {...props}>{children}</button>
}
