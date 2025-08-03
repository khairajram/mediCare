interface buttonProps  {
  varient : string,
  size : string,
  value : string,
}

export default function Button({props} : {
  props : buttonProps
}){
  return
    <button className={`bg-${props.varient}`} >{props.value}</button>
}