/**
 * 卒業生事業・店舗紹介 — 掲載写真の切り替え
 *
 * HP-test（奥南会）の public/assets/js/business-shots.js の移植。
 * カードの主画像の下に小さな写真を並べ、押されたものを主画像へ差し替える。
 *
 * 横スワイプは使わない。カードの上での指の横移動は本のめくりに割り当てられて
 * いる（directory.js の initBusinessBookTouch と .business-book の
 * touch-action: pan-y）。ここで横スワイプを取ると、写真を送ろうとした指が紙を
 * めくってしまい、どちらの操作も当てにならなくなる。押して選ぶ形にする。
 *
 * JS が動かない環境では、小さな写真がそのまま並んだ状態になる。押しても主画像は
 * 変わらないが、掲載されている写真は全部見える——枚数が減らないことを優先する。
 */

/**
 * 写真の切り替えを取り付ける。返り値は後片付け。
 *
 * @param {HTMLElement | null} root 事業紹介の根（`[data-directory-root]`）
 */
export function initShots(root) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return function () {}
  }

  var lists = Array.prototype.slice.call(root.querySelectorAll('[data-card-shots]'))
  var bound = []

  lists.forEach(function (list) {
    var card = list.closest ? list.closest('.business-card') : null
    var photo = card ? card.querySelector('[data-card-photo]') : null
    if (!photo) return

    // 押せるようになったことを見た目にも伝える。JS が無い場合は
    // ただ並んでいるだけなので、押せる印を付けない。
    list.setAttribute('data-card-shots-ready', 'true')

    var onClick = function (event) {
      var button =
        event.target && event.target.closest ? event.target.closest('[data-card-shot]') : null
      if (!button || !list.contains(button)) return

      var src = button.getAttribute('data-shot-src')
      if (!src || photo.getAttribute('src') === src) return

      photo.setAttribute('src', src)
      photo.setAttribute('alt', button.getAttribute('data-shot-alt') || '')
      // 差し替えた1枚だけは待たせない。lazy のままだと押してから
      // 読み込みが始まり、一拍おいて絵が変わる。
      photo.setAttribute('loading', 'eager')

      Array.prototype.forEach.call(list.querySelectorAll('[data-card-shot]'), function (other) {
        if (other === button) {
          other.setAttribute('aria-current', 'true')
        } else {
          other.removeAttribute('aria-current')
        }
      })
    }

    list.addEventListener('click', onClick)
    bound.push({ list: list, onClick: onClick })
  })

  return function () {
    bound.forEach(function (entry) {
      entry.list.removeEventListener('click', entry.onClick)
      entry.list.removeAttribute('data-card-shots-ready')
    })
  }
}
