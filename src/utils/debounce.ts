
export function debounce<F extends (...params: any[]) => void>(func: F, timeout = 100) {
  let timer: number
  return function (this: any, ...args: any) {
    clearTimeout(timer)
    timer = window.setTimeout(() => func.apply(this, args), timeout)
  } as F
}
