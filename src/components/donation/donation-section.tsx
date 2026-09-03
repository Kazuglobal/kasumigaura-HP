import { SectionHead } from '@/components/sections/section-head'
import { FlowVox } from '@/components/motion/flow-vox'
import { donationData } from '@/data/donation'
import { DonationForm } from './donation-form'
import styles from './donation.module.css'

export function DonationSection() {
  const d = donationData
  return (
    <section className={styles.pageWrapper} aria-labelledby="donation-heading">
      <div className="containerS">
        <FlowVox>
          <SectionHead
            en={d.heading.en}
            jp={d.heading.jp}
            id="donation-heading"
          />

          {/* 趣意文 */}
          <div className={styles.introCard}>
            <h3 className={styles.introTitle}>
              母校の未来と、挑戦し続ける後輩たちへ
            </h3>
            {d.lead.map((paragraph) => (
              <p key={paragraph} className={styles.introText}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* 使途の4本の柱 */}
          <div className={styles.purposesSection}>
            <h3 className={styles.sectionTitle}>寄付金の主な使途</h3>
            <div className={styles.purposeGrid}>
              {d.purposes.map((p) => (
                <div key={p.id} className={styles.purposeCard}>
                  <div className={styles.purposeHeader}>
                    <div className={styles.purposeIconWrap} aria-hidden="true">
                      {p.icon === 'trophy' && (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                          <path d="M4 22h16" />
                          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
                          <path d="M6 2h12v7a6 6 0 0 1-12 0V2z" />
                        </svg>
                      )}
                      {p.icon === 'school' && (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      )}
                      {p.icon === 'award' && (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      )}
                      {p.icon === 'users' && (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className={styles.purposeCardTitle}>{p.title}</h4>
                    </div>
                  </div>
                  <p className={styles.purposeSubtitle}>{p.subtitle}</p>
                  <p className={styles.purposeDesc}>{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 募集要項と銀行振込のご案内 */}
          <div className={styles.infoBlocks}>
            {/* 要項 */}
            <div className={styles.infoCard}>
              <h4 className={styles.cardHead}>募集要項・一口の目安</h4>
              <div className={styles.guidelineItem}>
                <p className={styles.guidelineLabel}>{d.guidelines.individual.title}</p>
                <p className={styles.guidelineAmount}>{d.guidelines.individual.amountText}</p>
                <p className={styles.guidelineNote}>{d.guidelines.individual.note}</p>
              </div>
              <div className={styles.guidelineItem}>
                <p className={styles.guidelineLabel}>{d.guidelines.corporate.title}</p>
                <p className={styles.guidelineAmount}>{d.guidelines.corporate.amountText}</p>
                <p className={styles.guidelineNote}>{d.guidelines.corporate.note}</p>
              </div>
            </div>

            {/* 口座情報 */}
            <div className={styles.infoCard}>
              <h4 className={styles.cardHead}>直接お振込みいただく場合</h4>
              <div className={styles.bankList}>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>金融機関</span>
                  <span className={styles.bankVal}>{d.bankAccount.bankName}</span>
                </div>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>支店名</span>
                  <span className={styles.bankVal}>{d.bankAccount.branchName}</span>
                </div>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>口座種別</span>
                  <span className={styles.bankVal}>{d.bankAccount.accountType}</span>
                </div>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>口座番号</span>
                  <span className={styles.bankVal}>{d.bankAccount.accountNumber}</span>
                </div>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>口座名義</span>
                  <span className={styles.bankVal}>{d.bankAccount.accountHolder}</span>
                </div>
              </div>
              <p className={styles.bankNote}>{d.bankAccount.note}</p>
            </div>
          </div>

          {/* Webお申し込みフォーム */}
          <h3 className={styles.sectionTitle} id="form">
            Webからのお申し込みフォーム
          </h3>
          <p style={{ textAlign: 'center', fontSize: '1.4rem', color: '#666', marginTop: '-12px', marginBottom: '30px' }}>
            下記フォームよりお申し込みいただけます。内容確認後、事務局より確認メールをお送りいたします。
          </p>
          <DonationForm />
        </FlowVox>
      </div>
    </section>
  )
}
