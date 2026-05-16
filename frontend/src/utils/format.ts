export const formatPrice = (amount: number, language: string) => {
  return new Intl.NumberFormat(
    language === 'hi' ? 'hi-IN' : 'en-IN',
    { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }
  ).format(amount)
}
