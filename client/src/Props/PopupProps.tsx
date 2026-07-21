export type PopupProps = {
    onClose: () => void
    onSelect: (type: string | null) => void
    value: string | null
  }