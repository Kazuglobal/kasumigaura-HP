import { events, eventsSection } from '@/data/events'
import { FlowVox } from '@/components/motion/flow-vox'
import styles from './history.module.css'

/** #events: annual event list under History (headStyle02). Dates are [要確認]. */
export function EventsList() {
  return (
    <div id={eventsSection.id} className={`${styles.events} containerL`}>
      <FlowVox>
        <h3 className="headStyle02">{eventsSection.title}</h3>
        <p className={styles.eventsLead}>{eventsSection.lead}</p>
        <ul className={styles.eventList}>
          {events.map((e) => (
            <li key={e.id} className={styles.eventItem}>
              <span className={styles.eventDate}>{e.date}</span>
              <span className={styles.eventLabel}>{e.label}</span>
              <span className={styles.eventNote}>{e.note}</span>
            </li>
          ))}
        </ul>
      </FlowVox>
    </div>
  )
}
