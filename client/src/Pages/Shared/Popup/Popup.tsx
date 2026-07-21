import './Popup.css'
import type { PopupProps } from '../../../Props/PopupProps'

const Popup = ({ onClose, onSelect, value }: PopupProps) => {

  const handleSelect = (type: string | null) => {
    onSelect(type)
    onClose()
  }

  return (
    <div className="popup-overlay" onClick={onClose}>

      <div
        className="popup-container border"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="center bold">
          Filter by transaction type
        </div>

        <br />

        <div className="ml-2">

          <div className="span mr-2" onClick={() => handleSelect(null)}>
            <div className={`option-btn ${value === null ? "selected" : ""}`}></div>
            <span>All</span>
          </div>

          <div className="span mr-2" onClick={() => handleSelect("Income")}>
            <div className={`option-btn ${value === "Income" ? "selected" : ""}`}></div>
            <span>Income</span>
          </div>

          <div className="span mr-2" onClick={() => handleSelect("Expense")}>
            <div className={`option-btn ${value === "Expense" ? "selected" : ""}`}></div>
            <span>Expense</span>
          </div>

          <div className="span mr-2" onClick={() => handleSelect("Transfer")}>
            <div className={`option-btn ${value === "Transfer" ? "selected" : ""}`}></div>
            <span>Transfer</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Popup