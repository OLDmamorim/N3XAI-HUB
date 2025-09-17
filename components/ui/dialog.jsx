import React, { useState } from 'react'

export function Dialog({ children }) { return <div>{children}</div> }
export function DialogTrigger({ asChild=false, children, ...props }) {
  // no-op placeholder
  return asChild ? children : <button {...props}>{children}</button>
}
export function DialogContent({ className='', children }) {
  // simple inline panel
  return <div className={'fixed inset-0 z-40 flex items-center justify-center p-4'}>
    <div className="absolute inset-0 bg-black/40" />
    <div className={'relative z-10 w-full max-w-lg rounded-xl border bg-white p-4 ' + className}>{children}</div>
  </div>
}
export function DialogHeader({ className='', ...props }) {
  return <div className={'mb-2 ' + className} {...props} />
}
export function DialogTitle({ className='', ...props }) {
  return <h3 className={'text-lg font-semibold ' + className} {...props} />
}
