export function numberFormatter(num) {
    return Intl.NumberFormat('en-IN').format(num)
}
    
export function takaFormatter(num) {
    return '৳ ' + numberFormatter(num)
}