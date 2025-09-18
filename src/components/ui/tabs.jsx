import React, { createContext, useContext, useState } from 'react'
const Ctx = createContext()

export function Tabs({ value, onValueChange, children }) {
  const [internal, setInternal] = useState(value || '')
  const v = value ?? internal
  const set = onValueChange || setInternal
  return <Ctx.Provider value={{value:v, set}}>{children}</Ctx.Provider>
}
export function TabsList({ className='', ...props }) {
  return <div className={'inline-grid gap-1 rounded-md border p-1 ' + className} {...props} />
}
export function TabsTrigger({ value, className='', children }) {
  const ctx = useContext(Ctx)
  const active = ctx?.value === value
  return (
    <button
      onClick={() => ctx?.set(value)}
      className={'px-3 py-1 text-sm rounded ' + (active ? 'bg-black text-white' : 'bg-transparent') + ' ' + className}
    >
      {children}
    </button>
  )
}
export function TabsContent({ value, children }) {
  const ctx = useContext(Ctx)
  if (ctx?.value !== value) return null
  return <div className="mt-2">{children}</div>
}
