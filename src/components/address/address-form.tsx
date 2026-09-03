'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './address.module.css'

export type AddressFormData = {
  name: string
  kana: string
  maidenName: string
  gradYear: string
  clubActivity: string
  birthDate: string
  zipCode: string
  prefecture: string
  cityAddress: string
  building: string
  phone: string
  email: string
  emailConfirm: string
  oldAddress: string
  oldPhone: string
  remarks: string
  agreed: boolean
}

const INITIAL_FORM: AddressFormData = {
  name: '',
  kana: '',
  maidenName: '',
  gradYear: '',
  clubActivity: '',
  birthDate: '',
  zipCode: '',
  prefecture: '',
  cityAddress: '',
  building: '',
  phone: '',
  email: '',
  emailConfirm: '',
  oldAddress: '',
  oldPhone: '',
  remarks: '',
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

export function AddressForm() {
  const [step, setStep] = useState<'input' | 'confirm' | 'complete'>('input')
  const [formData, setFormData] = useState<AddressFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})
  const [isSearchingZip, setIsSearchingZip] = useState(false)
  const [zipMessage, setZipMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }))

    // エラー解除
    if (errors[name as keyof AddressFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // 郵便番号から住所を自動検索 (zipcloud API)
  const handleZipSearch = async () => {
    const cleanZip = formData.zipCode.replace(/[^0-9]/g, '')
    if (cleanZip.length !== 7) {
      setZipMessage('7桁の郵便番号を入力してください（例: 3000331）')
      return
    }

    setIsSearchingZip(true)
    setZipMessage(null)

    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`)
      const data = await res.json()
      if (data.results && data.results.length > 0) {
        const item = data.results[0]
        setFormData((prev) => ({
          ...prev,
          prefecture: item.address1,
          cityAddress: `${item.address2}${item.address3}`,
        }))
        setZipMessage('住所が自動入力されました。')
      } else {
        setZipMessage('該当する住所が見つかりませんでした。手動でご入力ください。')
      }
    } catch {
      setZipMessage('住所検索サービスに接続できませんでした。手動でご入力ください。')
    } finally {
      setIsSearchingZip(false)
    }
  }

  // 入力チェックバリデーション
  const validate = (): boolean => {
    const errs: Partial<Record<keyof AddressFormData, string>> = {}

    if (!formData.name.trim()) errs.name = 'お名前を入力してください。'
    if (!formData.kana.trim()) errs.kana = 'フリガナを入力してください。'
    if (!formData.gradYear.trim()) errs.gradYear = '卒業期または卒業年度を入力してください。'

    const cleanZip = formData.zipCode.replace(/[^0-9]/g, '')
    if (!cleanZip) {
      errs.zipCode = '郵便番号を入力してください。'
    } else if (cleanZip.length !== 7) {
      errs.zipCode = '郵便番号は7桁の数字で入力してください。'
    }

    if (!formData.prefecture) errs.prefecture = '都道府県を選択してください。'
    if (!formData.cityAddress.trim()) errs.cityAddress = '市区町村・番地を入力してください。'

    const cleanPhone = formData.phone.replace(/[^0-9-]/g, '')
    if (!cleanPhone) {
      errs.phone = '日中ご連絡可能な電話番号を入力してください。'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errs.email = 'メールアドレスを入力してください。'
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = '有効なメールアドレスを入力してください。'
    }

    if (!formData.emailConfirm.trim()) {
      errs.emailConfirm = '確認用メールアドレスを入力してください。'
    } else if (formData.email.trim() !== formData.emailConfirm.trim()) {
      errs.emailConfirm = 'メールアドレスが一致しません。'
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
    // 送信完了画面へ移行
    setStep('complete')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.formContainer}>
      {/* Step Progress Bar */}
      <div className={styles.stepBar}>
        <div className={`${styles.stepItem} ${step === 'input' ? styles.active : step === 'confirm' || step === 'complete' ? styles.completed : ''}`}>
          <span className={styles.stepNumber}>1</span>
          <span>ご入力</span>
        </div>
        <div className={styles.stepDivider} />
        <div className={`${styles.stepItem} ${step === 'confirm' ? styles.active : step === 'complete' ? styles.completed : ''}`}>
          <span className={styles.stepNumber}>2</span>
          <span>ご確認</span>
        </div>
        <div className={styles.stepDivider} />
        <div className={`${styles.stepItem} ${step === 'complete' ? styles.active : ''}`}>
          <span className={styles.stepNumber}>3</span>
          <span>完了</span>
        </div>
      </div>

      {/* 1. INPUT STEP */}
      {step === 'input' && (
        <form className={styles.formCard} onSubmit={handleToConfirm} noValidate>
          {/* Section 1: 卒業生情報 */}
          <section className={styles.sectionBlock}>
            <h3 className={styles.blockTitle}>卒業生ご本人情報</h3>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="name">
                お名前（漢字）
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
                お名前（フリガナ）
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

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="maidenName">
                旧姓（在学時の姓）
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="maidenName"
                  name="maidenName"
                  type="text"
                  className={`${styles.input} ${styles.inputMedium}`}
                  placeholder="改姓された方のみご記入ください"
                  value={formData.maidenName}
                  onChange={handleChange}
                />
                <span className={styles.hint}>※ご結婚等で在学時とお名前が変わられた方はご記入ください。</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="gradYear">
                卒業回期 または 卒業年
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="gradYear"
                  name="gradYear"
                  type="text"
                  className={`${styles.input} ${styles.inputMedium} ${errors.gradYear ? styles.hasError : ''}`}
                  placeholder="例: 第45期 / 2005年3月卒 / 平成17年卒"
                  value={formData.gradYear}
                  onChange={handleChange}
                  required
                />
                <span className={styles.hint}>※期数がご不明な場合は卒業した西暦または和暦をご記入ください。</span>
                {errors.gradYear && <p className={styles.errorText}>{errors.gradYear}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="clubActivity">
                在学時の部活動・学科
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="clubActivity"
                  name="clubActivity"
                  type="text"
                  className={`${styles.input} ${styles.inputMedium}`}
                  placeholder="例: 野球部 / レスリング部 / 普通科"
                  value={formData.clubActivity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="birthDate">
                生年月日
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  className={`${styles.input} ${styles.inputSmall}`}
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                <span className={styles.hint}>※同姓同名の方の照合確認のためにご活用します。</span>
              </div>
            </div>
          </section>

          {/* Section 2: 新しいご連絡先 */}
          <section className={styles.sectionBlock}>
            <h3 className={styles.blockTitle}>新しいご連絡先（変更後のお届け先）</h3>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="zipCode">
                郵便番号
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <div className={styles.inputGroup}>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    className={`${styles.input} ${styles.inputSmall} ${errors.zipCode ? styles.hasError : ''}`}
                    placeholder="例: 3000331"
                    maxLength={8}
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.zipSearchBtn}
                    onClick={handleZipSearch}
                    disabled={isSearchingZip}
                  >
                    {isSearchingZip ? '検索中...' : '郵便番号から住所を検索'}
                  </button>
                </div>
                {zipMessage && <p className={styles.hint}>{zipMessage}</p>}
                {errors.zipCode && <p className={styles.errorText}>{errors.zipCode}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="prefecture">
                都道府県
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <select
                  id="prefecture"
                  name="prefecture"
                  className={`${styles.select} ${styles.inputMedium} ${errors.prefecture ? styles.hasError : ''}`}
                  value={formData.prefecture}
                  onChange={handleChange}
                  required
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.prefecture && <p className={styles.errorText}>{errors.prefecture}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="cityAddress">
                市区町村・番地
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="cityAddress"
                  name="cityAddress"
                  type="text"
                  className={`${styles.input} ${errors.cityAddress ? styles.hasError : ''}`}
                  placeholder="例: 稲敷郡阿見町阿見4417"
                  value={formData.cityAddress}
                  onChange={handleChange}
                  required
                />
                {errors.cityAddress && <p className={styles.errorText}>{errors.cityAddress}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="building">
                建物名・部屋番号
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="building"
                  name="building"
                  type="text"
                  className={styles.input}
                  placeholder="例: ○○マンション 201号室"
                  value={formData.building}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="phone">
                ご連絡先電話番号
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
                <span className={styles.hint}>※日中ご連絡の取れる携帯電話または固定電話番号</span>
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
                  placeholder="例: name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <span className={styles.hint}>※お手続き完了の確認メールをお送りいたします。</span>
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="emailConfirm">
                メールアドレス（確認）
                <span className={styles.badgeRequired}>必須</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="emailConfirm"
                  name="emailConfirm"
                  type="email"
                  className={`${styles.input} ${errors.emailConfirm ? styles.hasError : ''}`}
                  placeholder="もう一度メールアドレスを入力してください"
                  value={formData.emailConfirm}
                  onChange={handleChange}
                  required
                />
                {errors.emailConfirm && <p className={styles.errorText}>{errors.emailConfirm}</p>}
              </div>
            </div>
          </section>

          {/* Section 3: 以前のご連絡先（照合用） */}
          <section className={styles.sectionBlock}>
            <h3 className={styles.blockTitle}>以前のご連絡先（ご変更前・照合用）</h3>
            <p className={styles.introNote} style={{ marginBottom: '16px' }}>
              ※同窓会名簿の照合のため、覚えている範囲で以前の住所・電話番号をご記入ください。
            </p>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="oldAddress">
                旧住所
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="oldAddress"
                  name="oldAddress"
                  type="text"
                  className={styles.input}
                  placeholder="例: 茨城県土浦市○○ 1-2-3"
                  value={formData.oldAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="oldPhone">
                旧電話番号
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <input
                  id="oldPhone"
                  name="oldPhone"
                  type="tel"
                  className={`${styles.input} ${styles.inputMedium}`}
                  placeholder="例: 029-xxx-xxxx"
                  value={formData.oldPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Section 4: 備考・近況 */}
          <section className={styles.sectionBlock}>
            <h3 className={styles.blockTitle}>近況報告・事務局へのメッセージ</h3>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel} htmlFor="remarks">
                備考・近況
                <span className={styles.badgeOptional}>任意</span>
              </label>
              <div className={styles.fieldInputArea}>
                <textarea
                  id="remarks"
                  name="remarks"
                  className={styles.textarea}
                  placeholder="近況や母校・同窓会へのメッセージがございましたらご自由にご記入ください。"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* 個人情報の取り扱い同意 */}
          <div className={styles.agreementBox}>
            <h4 className={styles.agreementTitle}>個人情報の取り扱いについて</h4>
            <p className={styles.agreementText}>
              ご提供いただいた個人情報は、霞ヶ浦高等学校同窓会の会報発送、総会・行事のご案内、および同窓会名簿の管理運営の目的にのみ使用し、適切かつ厳重に管理いたします。法令に基づく場合を除き、第三者への開示・提供は行いません。
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
              入力内容を確認する →
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
                <th className={styles.confirmTh}>お名前（漢字）</th>
                <td className={styles.confirmTd}>{formData.name}</td>
              </tr>
              <tr>
                <th className={styles.confirmTh}>お名前（フリガナ）</th>
                <td className={styles.confirmTd}>{formData.kana}</td>
              </tr>
              {formData.maidenName && (
                <tr>
                  <th className={styles.confirmTh}>旧姓（在学時の姓）</th>
                  <td className={styles.confirmTd}>{formData.maidenName}</td>
                </tr>
              )}
              <tr>
                <th className={styles.confirmTh}>卒業回期 / 卒業年</th>
                <td className={styles.confirmTd}>{formData.gradYear}</td>
              </tr>
              {formData.clubActivity && (
                <tr>
                  <th className={styles.confirmTh}>在学時部活動・学科</th>
                  <td className={styles.confirmTd}>{formData.clubActivity}</td>
                </tr>
              )}
              {formData.birthDate && (
                <tr>
                  <th className={styles.confirmTh}>生年月日</th>
                  <td className={styles.confirmTd}>{formData.birthDate}</td>
                </tr>
              )}
              <tr>
                <th className={styles.confirmTh}>新住所（郵便番号）</th>
                <td className={styles.confirmTd}>〒{formData.zipCode}</td>
              </tr>
              <tr>
                <th className={styles.confirmTh}>新住所</th>
                <td className={styles.confirmTd}>
                  {formData.prefecture} {formData.cityAddress} {formData.building}
                </td>
              </tr>
              <tr>
                <th className={styles.confirmTh}>電話番号</th>
                <td className={styles.confirmTd}>{formData.phone}</td>
              </tr>
              <tr>
                <th className={styles.confirmTh}>メールアドレス</th>
                <td className={styles.confirmTd}>{formData.email}</td>
              </tr>
              {formData.oldAddress && (
                <tr>
                  <th className={styles.confirmTh}>旧住所</th>
                  <td className={styles.confirmTd}>{formData.oldAddress}</td>
                </tr>
              )}
              {formData.oldPhone && (
                <tr>
                  <th className={styles.confirmTh}>旧電話番号</th>
                  <td className={styles.confirmTd}>{formData.oldPhone}</td>
                </tr>
              )}
              {formData.remarks && (
                <tr>
                  <th className={styles.confirmTh}>近況・備考</th>
                  <td className={styles.confirmTd} style={{ whiteSpace: 'pre-wrap' }}>
                    {formData.remarks}
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
              この内容で送信する
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
          <h3 className={styles.completeTitle}>住所変更のお届けを受け付けました</h3>
          <p className={styles.completeText}>
            ご登録内容の送信が完了いたしました。
            <br />
            ご入力いただいたメールアドレス宛に、受付確認メールをお送りしております。
            <br />
            事務局にて登録名簿情報の更新手続きを行わせていただきます。
            <br />
            今後とも霞ヶ浦高等学校同窓会への温かいご支援・ご協力をよろしくお願い申し上げます。
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
