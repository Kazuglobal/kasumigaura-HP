type Props = {
  en: string
  jp: string
  id?: string
  white?: boolean
  className?: string
}

/** Common section heading: .enTitle (Montserrat + bar) over .headStyle01. */
export function SectionHead({ en, jp, id, white = false, className }: Props) {
  const cls = ['sectionHead', className ?? ''].filter(Boolean).join(' ')
  return (
    <div className={cls}>
      <p className={white ? 'enTitle isWhite' : 'enTitle'}>{en}</p>
      <h2 id={id} className="headStyle01">
        {jp}
      </h2>
    </div>
  )
}
