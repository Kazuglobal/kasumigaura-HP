import { contactSection } from '@/data/contact'
import { FlowVox } from '@/components/motion/flow-vox'
import { SectionHead } from './section-head'
import styles from './contact.module.css'

/** #contact: office card with [要確認] rows; no form on this page. */
export function ContactSection() {
  const s = contactSection
  return (
    <section id={s.id} className={styles.section} aria-labelledby="contact-title">
      <FlowVox className="containerS">
        <SectionHead en={s.en} jp={s.jp} id="contact-title" />
        <div className={styles.card}>
          <p className={styles.office}>{s.office}</p>
          <dl className={styles.rows}>
            {s.rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <dt className={styles.label}>{row.label}</dt>
                <dd className={styles.value}>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.hours}>{s.hours}</p>
          <p className={`btnStyle01 ${styles.btn}`}>
            <a href={s.buttonHref}>{s.button}</a>
          </p>
          <p className={styles.note}>{s.buttonNote}</p>
        </div>
      </FlowVox>
    </section>
  )
}
