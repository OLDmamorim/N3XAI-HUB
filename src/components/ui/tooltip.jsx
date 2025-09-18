export function TooltipProvider({ children }) { return children }
export function Tooltip({ children }) { return children }
export function TooltipTrigger({ asChild=false, children, ...props }) {
  return asChild ? children : <span {...props}>{children}</span>
}
export function TooltipContent({ children }) {
  return <span className="ml-2 text-xs text-gray-600">{children}</span>
}
