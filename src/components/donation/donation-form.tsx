'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DONATION_PRESETS } from '@/data/donation'
import styles from './donation.module.css'

export type DonationFormData = {
  donorType: 'individual' | 'corporate'
  name: string
  kana: string
  companyName: string
  departmentName: string
  gradYear: string
  zipCode: string
  prefecture: string
  cityAddress: string
  phone: string
  email: string
  amount: string
  customAmount: string
  purpose: string
  publishName: 'yes' | 'anonymous'
  message: string
  agreed: boolean
}

const INITIAL_FORM: DonationFormData = {
  donorType: 'individual',
  name: '',
  kana: '',
  companyName: '',
  departmentName: '',
  gradYear: '',
  zipCode: '',
  prefecture: '',
  cityAddress: '',
  phone: '',
  email: '',
  amount: '10000',
  customAmount: '',
  purpose: 'all',
  publishName: 'yes',
  message: '',
  agreed: false,
}

const PREFECTURES = [
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
]

export function DonationForm() {
  const [step, setStep] = useState<'input' | 'confirm' | 'complete'>('input')
  const [formData, setFormData] = useState<DonationFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof DonationFormData, string>>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }))

    if (errors[name as keyof DonationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleAmountPreset = (val: number) => {
    setFormData((prev) => ({
      ...prev,
      amount: String(val),
      customAmount: '',
    }))
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }))
    }
  }

  const handleCustomAmountClick = () => {
    setFormData((prev) => ({
      ...prev,
      amount: 'custom',
    }))
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof DonationFormData, string>> = {}

    if (!formData.name.trim()) errs.name = 'お名前を入力してください。'
    if (!formData.kana.trim()) errs.kana = 'フリガナを入力してください。'

    if (formData.donorType === 'corporate') {
      if (!formData.companyName.trim()) errs.companyName = '法人・団体名を入力してください。'
    }

    if (formData.amount === 'custom') {
      const num = parseInt(formData.customAmount.replace(/,/g, ''), 10)
      if (!num || num <= 0) {
        errs.amount = '寄付金額を半角数字で正しく入力してください。'
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errs.email = 'メールアドレスを入力してください。'
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = '有効なメールアドレスを入力してください。'
    }

    const cleanPhone = formData.phone.replace(/[^0-9-]/g, '')
    if (!cleanPhone) {
      errs.phone = '日中ご連絡可能な電話番号を入力してください。'
    }

    if (!formData.agreed) {
      errs.agreed = '個人情報の取り扱いに同意いただく必要があります。'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleToConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setStep('confirm')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToInput = () => {
    setStep('input')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('complete')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const displayAmount =
    formData.amount === 'custom'
      ? `${Number(formData.customAmount || 0).toLocaleString()}円`
      : `${Number(formData.amount).toLocaleString()}円`

  const getPurposeLabel = (p: string) => {
    switch (p) {
      case 'sports': return '部活動・全国大会出場支援'
      case 'education': return '教育環境・施設ICT整備'
      case 'scholarship': return '奨学・就学支援基金'
      case 'anniversary': return '同窓会・周年記念事業'
      default: return '同窓会に一任する（最重点活動へ充当）'
    }
  }

  return (
    <div className={styles.formSection}>
      {/* Step Progress Bar */}
      <div className={styles.stepBar}>
        <div className={`${styles.stepItem} ${step === 'input' ? styles.active : step === 'confirm' || step === 'complete' ? styles.completed : ''}`}>
          <span className={styles.stepNumber}>1</span>
          <span>お申し込み入力</span>
        </div>
        <div className={styles.stepDivider} />
        <div className={`${styles.stepItem} ${step === 'confirm' ? styles.active : step === 'complete' ? styles.completed : ''}`}>
          <span className={styles.stepNumber}>2</span>
          <span>ご確認</span>
        </div>
        <div className={styles.stepDivider} />
        <div className={`${styles.stepItem} ${step === 'complete' ? styles.active : ''}`}>
          <span className={styles.stepNumber}>3</span>
          <span>お申し込み完了</span>
        </div>
      </div>

      {/* 1. INPUT STEP */}
      {step === 'input' && (
        <form className={styles.formCard} onSubmit={handleToConfirm} noValidate>
          {/* 区分切り替え */}
          <div className={styles.donorTypeWrap}>
            <button
              type="button"
              className={`${styles.donorTypeBtn} ${formData.donorType === 'individual' ? styles.active : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, donorType: 'individual' }))}
            >
              個人でのご寄付（卒業生・保護者・一般）
            </button>
            <button
              type="button"
              className={`${styles.donorTypeBtn} ${formData.donorType === 'corporate' ? styles.active : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, donorType: 'corporate' }))}
            >
              法人・企業・団体でのご協賛
            </button>
          </div>

          {/* 金額の選択 */}
          <section className={styles.sectionBlock}>
            <h3 className={styles.blockTitle}>ご寄付・ご協賛金額の指定</h3>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>
                ご寄付金額
                <span className={styles.badgeRequired}>必須</span>
              </span>
              <div className={styles.fieldInputArea}>
                <div className={styles.presetChips}>
                  {DONATION_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`${styles.chipBtn} ${formData.amount === String(p.value) ? styles.selected : ''}`}
                      onClick={() => handleAmountPreset(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`${styles.chipBtn} ${formData.amount === 'custom' ? styles.selected : ''}`}
                    onClick={handleCustomAmountClick}
                  >
                    その他（自由入力）
                  </button>
                </div>

                {formData.amount === 'custom' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <input
                      id="customAmount"
                      name="customAmount"
                      type="number"
                      min="1000"
                      step="1000"
                      className={`${styles.input} ${styles.inputSmall} ${errors.amount ? styles.hasError : ''}`}
                      placeholder="例: 20000"
                      value={formData.customAmount}
                      onChange={handleChange}
                    />
                    <span style={{ fontSize: '1.4rem', fontWeight: 600 }}>円</span>
                  </div>
                )}
                {errors.amount && <p className={styles.errorText}>{errors.amount}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="purpose">
                ご希望の使途
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <select
                  id="purpose"
                  name="purpose"
                  className={`${styles.select} ${styles.inputMedium}`}
                  value={formData.purpose}
                  onChange={handleChange}
                >
                  <option value="all">同窓会に一任する（最重点の活動へ充当）</option>
                  <option value="sports">部活動・全国大会出場支援</option>
                  <option value="education">教育環境・施設ICT設備充実</option>
                  <option value="scholarship">奨学・就学支援基金</option>
                  <option value="anniversary">同窓会・周年記念事業</option>
                </select>
                <span className={styles.hint}>※特定分野への充当をご希望の場合はご選択ください。</span>
              </div>
            </div>
          </section>

          {/* 寄付者情報 */}
          <section className={styles.sectionBlock}>
            <h3 className={styles.blockTitle}>
              {formData.donorType === 'corporate' ? '企業・ご担当者様情報' : 'ご寄付者様情報'}
            </h3>

            {formData.donorType === 'corporate' && (
              <>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel} htmlFor="companyName">
                    法人・企業・団体名
                    <span className={styles.badgeRequired}>必須</span>
                  </label>
                  <div className={styles.fieldInputArea}>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      className={`${styles.input} ${errors.companyName ? styles.hasError : ''}`}
                      placeholder="例: 株式会社○○○○"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                    {errors.companyName && <p className={styles.errorText}>{errors.companyName}</p>}
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel} htmlFor="departmentName">
                    ご部署・お役職
                    <span className={styles.badgeOptional}>任意</span>
                  </label>
                  <div className={styles.fieldInputArea}>
                    <input
                      id="departmentName"
                      name="departmentName"
                      type="text"
                      className={`${styles.input} ${styles.inputMedium}`}
                      placeholder="例: 総務部 部長"
                      value={formData.departmentName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="name">
                {formData.donorType === 'corporate' ? 'ご担当者様氏名' : 'お名前（漢字）'}
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`${styles.input} ${styles.inputMedium} ${errors.name ? styles.hasError : ''}`}
                  placeholder="例: 霞ヶ浦 太郎"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="kana">
                フリガナ
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="kana"
                  name="kana"
                  type="text"
                  className={`${styles.input} ${styles.inputMedium} ${errors.kana ? styles.hasError : ''}`}
                  placeholder="例: カスミガウラ タロウ"
                  value={formData.kana}
                  onChange={handleChange}
                  required
                />
                {errors.kana && <p className={styles.errorText}>{errors.kana}</p>}
              </div>
            </div>

            {formData.donorType === 'individual' && (
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel} htmlFor="gradYear">
                  卒業期 または 卒業年
                  <span className={styles.badgeOptional}>任意</span>
                </label>
                <div className={styles.fieldInputArea}>
                  <input
                    id="gradYear"
                    name="gradYear"
                    type="text"
                    className={`${styles.input} ${styles.inputMedium}`}
                    placeholder="例: 第45期 / 2005年卒 / 一般有志"
                    value={formData.gradYear}
                    onChange={handleChange}
                  />
                  <span className={styles.hint}>※卒業生の方は期数または卒業年をご記入ください（一般・保護者の方は空欄可）。</span>
                </div>
              </div>
            )}

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="phone">
                お電話番号
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`${styles.input} ${styles.inputMedium} ${errors.phone ? styles.hasError : ''}`}
                  placeholder="例: 090-1234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="email">
                メールアドレス
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.hasError : ''}`}
                  placeholder="例: donor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <span className={styles.hint}>※振込案内および受付確認メールをお送りいたします。</span>
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="prefecture">
                ご住所（都道府県）
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <select
                  id="prefecture"
                  name="prefecture"
                  className={`${styles.select} ${styles.inputMedium}`}
                  value={formData.prefecture}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="cityAddress">
                市区町村・番地・建物名
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="cityAddress"
                  name="cityAddress"
                  type="text"
                  className={styles.input}
                  placeholder="例: 稲敷郡阿見町阿見4417"
                  value={formData.cityAddress}
                  onChange={handleChange}
                />
                <span className={styles.hint}>※受領書や記念品のお届けをご希望の場合はご記入ください。</span>
              </div>
            </div>
          </section>

          {/* 芳名録・メッセージ */}
          <section className={styles.sectionBlock}>
            <h3 className={styles.blockTitle}>ご芳名の掲載および応援メッセージ</h3>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>
                芳名録への掲載
                <span className={styles.badgeRequired}>必須</span>
              </span>
              <div className={styles.fieldInputArea}>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="publishName"
                      value="yes"
                      checked={formData.publishName === 'yes'}
                      onChange={handleChange}
                      className={styles.radio}
                    />
                    <span>会報・Webサイトへのご芳名（社名）の掲載に同意する</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="publishName"
                      value="anonymous"
                      checked={formData.publishName === 'anonymous'}
                      onChange={handleChange}
                      className={styles.radio}
                    />
                    <span>匿名での寄付を希望する（掲載を行いません）</span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="message">
                応援メッセージ
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <textarea
                  id="message"
                  name="message"
                  className={styles.textarea}
                  placeholder="母校や生徒たち、部活動への温かい応援メッセージがございましたらご記入ください。"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* 同意チェック */}
          <div className={styles.agreementBox}>
            <h4 className={styles.agreementTitle}>個人情報の取り扱いについて</h4>
            <p className={styles.agreementText}>
              ご提供いただいた個人情報は、霞ヶ浦高等学校同窓会の寄付金管理、受付確認メールの送信、会報発送および芳名録掲載（希望者のみ）の目的にのみ適切に使用・管理いたします。
            </p>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span>個人情報の取り扱いに同意する</span>
            </label>
            {errors.agreed && <p className={styles.errorText} style={{ marginTop: '8px' }}>{errors.agreed}</p>}
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitBtn}>
              お申し込み内容を確認する →
            </button>
          </div>
        </form>
      )}

      {/* 2. CONFIRM STEP */}
      {step === 'confirm' && (
        <div className={styles.formCard}>
          <table className={styles.confirmTable}>
            <tbody>
              <tr>
                <th className={styles.confirmTh}>ご寄付区分</th>
                <td className={styles.confirmTd}>
                  {formData.donorType === 'corporate' ? '法人・企業・団体協賛' : '個人ご寄付'}
                </td>
              </tr>
              <tr>
                <th className={styles.confirmTh}>ご寄付金額</th>
                <td className={styles.confirmTd} style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--c-primary)' }}>
                  {displayAmount}
                </td>
              </tr>
              <tr>
                <th className={styles.confirmTh}>ご希望の使途</th>
                <td className={styles.confirmTd}>{getPurposeLabel(formData.purpose)}</td>
              </tr>
              {formData.donorType === 'corporate' && (
                <>
                  <tr>
                    <th className={styles.confirmTh}>法人・団体名</th>
                    <td className={styles.confirmTd}>{formData.companyName}</td>
                  </tr>
                  {formData.departmentName && (
                    <tr>
                      <th className={styles.confirmTh}>ご部署・お役職</th>
                      <td className={styles.confirmTd}>{formData.departmentName}</td>
                    </tr>
                  )}
                </>
              )}
              <tr>
                <th className={styles.confirmTh}>
                  {formData.donorType === 'corporate' ? 'ご担当者様氏名' : 'お名前（漢字）'}
                </th>
                <td className={styles.confirmTd}>{formData.name}</td>
              </tr>
              <tr>
                <th className={styles.confirmTh}>フリガナ</th>
                <td className={styles.confirmTd}>{formData.kana}</td>
              </tr>
              {formData.gradYear && (
                <tr>
                  <th className={styles.confirmTh}>卒業期 / 卒業年</th>
                  <td className={styles.confirmTd}>{formData.gradYear}</td>
                </tr>
              )}
              <tr>
                <th className={styles.confirmTh}>お電話番号</th>
                <td className={styles.confirmTd}>{formData.phone}</td>
              </tr>
              <tr>
                <th className={styles.confirmTh}>メールアドレス</th>
                <td className={styles.confirmTd}>{formData.email}</td>
              </tr>
              {(formData.prefecture || formData.cityAddress) && (
                <tr>
                  <th className={styles.confirmTh}>ご住所</th>
                  <td className={styles.confirmTd}>
                    {formData.prefecture} {formData.cityAddress}
                  </td>
                </tr>
              )}
              <tr>
                <th className={styles.confirmTh}>芳名録への掲載</th>
                <td className={styles.confirmTd}>
                  {formData.publishName === 'yes' ? '掲載に同意する' : '匿名を希望する'}
                </td>
              </tr>
              {formData.message && (
                <tr>
                  <th className={styles.confirmTh}>応援メッセージ</th>
                  <td className={styles.confirmTd} style={{ whiteSpace: 'pre-wrap' }}>
                    {formData.message}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.backBtn} onClick={handleBackToInput}>
              ← 入力画面に戻る
            </button>
            <button type="button" className={styles.submitBtn} onClick={handleSubmit}>
              この内容でお申し込みを送信する
            </button>
          </div>
        </div>
      )}

      {/* 3. COMPLETE STEP */}
      {step === 'complete' && (
        <div className={`${styles.formCard} ${styles.completeCard}`}>
          <div className={styles.completeIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className={styles.completeTitle}>ご寄付・ご協賛のお申し込みを受け付けました</h3>
          <p className={styles.completeText}>
            温かいご支援のお申し込み、誠にありがとうございます。
            <br />
            ご入力いただいたメールアドレス宛に、受付確認メールおよびお振込先のご案内をお送りいたしました。
            <br />
            母校の生徒たち・後輩たちの教育活動支援のために大切に役立たせていただきます。
          </p>

          <div className={styles.buttonGroup}>
            <Link href="/" className={styles.submitBtn}>
              トップページに戻る
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
