export function Switch({ id, checked=false, onCheckedChange=()=>{} }) {
  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer">
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={e=>onCheckedChange(e.target.checked)} />
      <span className={"h-5 w-9 rounded-full transition " + (checked ? "bg-black" : "bg-gray-300")}>
        <span className={"block h-5 w-5 bg-white rounded-full shadow transform transition " + (checked ? "translate-x-4" : "")}></span>
      </span>
    </label>
  )
}
