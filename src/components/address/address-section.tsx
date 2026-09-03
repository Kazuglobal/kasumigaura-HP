import { SectionHead } from '@/components/sections/section-head'
import { FlowVox } from '@/components/motion/flow-vox'
import { AddressForm } from './address-form'
import styles from './address.module.css'

export function AddressSection() {
  return (
    <section className={styles.pageWrapper} aria-labelledby="address-heading">
      <div className="containerS">
        <FlowVox>
          <SectionHead
            en="Address Change"
            jp="住所変更のお届け"
            id="address-heading"
          />

          <div className={styles.introBox}>
            <p className={styles.introText}>
              霞ヶ浦高等学校同窓会員の皆さまへ
              <br />
              ご転居、ご結婚等による改姓、ご連絡先（お電話番号・メールアドレス）の変更がございましたら、本フォームよりお知らせください。
            </p>
            <p className={styles.introNote}>
              ※定期発行の「同窓会報」や「定期総会・同期会のご案内」等を確実にお届けするために、最新情報のご登録にご協力をお願いいたします。
              <br />
              ※卒業年度や期数がご不明な場合でも、生年月日やお名前等をもとに事務局にて照合確認いたしますのでご安心ください。
            </p>
          </div>

          <AddressForm />
        </FlowVox>
      </div>
    </section>
  )
}
