import React from 'react'
import Numeral from 'numeral'

export default function Currencyfromat({amount}) {
  const FormattedAmount = Numeral(amount).format("$0,0.00");
  return (
    <div className="currency-amount">
      {FormattedAmount}
      <small>USD</small>
    </div>
  )
}