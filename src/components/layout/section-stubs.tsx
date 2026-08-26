import { sectionStubs } from '@/data/sections'
import { FlowVox } from '@/components/motion/flow-vox'

/** Anchor targets for the header nav. Real content arrives in T004. */
export function SectionStubs() {
  return (
    <>
      {sectionStubs.map((s) => (
        <section key={s.id} id={s.id} className="sectionStub" aria-labelledby={`${s.id}-title`}>
          <FlowVox>
            <p className="enTitle">{s.en}</p>
            <h2 id={`${s.id}-title`} className="headStyle01">
              {s.jp}
            </h2>
          </FlowVox>
        </section>
      ))}
    </>
  )
}
