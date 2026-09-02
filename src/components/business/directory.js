/*
 * 卒業生事業・店舗紹介の絞り込みと、本のめくり。
 *
 * HP-test（奥南会）の public/assets/js/page-directory.js をほぼそのまま移植した。
 * 紙のしなりは、紙面を6コマに分けて入れ子に回し、コマごとに窓と紙面をずらして
 * 曲面を作っている（buildBookLeafSegments）。この寸法合わせは実機で詰めたもので、
 * React 風に書き直すと手ざわりが変わるため、命令的なまま据え置いている。
 *
 * React 側（business-directory.tsx）は初期 DOM を描くだけで、以後の
 * hidden / data-book-active / 件数の書き換えはこのモジュールが受け持つ。
 * コンポーネントが再描画しないので、両者が同じノードを取り合うことはない。
 *
 * 契約（HP-test の .claude/skills/alumni-business/references/contracts.md）:
 *  - 突き合わせは data-filter-key と data-* の完全一致。「飲食」と「飲食業」は別物
 *  - data-book-active="true" は常に1枚だけ。送りは円環で、隠れたカードは輪から外れる
 *  - BOOK_TURN_DURATION は src/styles/business.css の 900ms と同じ値。片方だけ変えない
 */

const global = typeof window !== 'undefined' ? window : globalThis

// 紙をめくる尺。src/styles/business.css の .business-page-turn__leaf の transition と
// 陰り・落ち影の animation がすべてこの値で動くので、片方だけ変えない。
var BOOK_TURN_DURATION = 900;

function toArray(value) {
  return Array.prototype.slice.call(value || []);
}

function readFilterValue(filter) {
  if (!filter) {
    return "";
  }

  return typeof filter.value === "string" ? filter.value.trim() : "";
}

function normalizeValue(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function readSearchValue(input) {
  return normalizeValue(input && typeof input.value === "string" ? input.value : "");
}

function cardMatchesFilters(card, filters) {
  for (var i = 0; i < filters.length; i += 1) {
    var filter = filters[i];
    var key = filter && typeof filter.getAttribute === "function"
      ? filter.getAttribute("data-filter-key")
      : null;
    var expected = readFilterValue(filter);

    if (!key || !expected) {
      continue;
    }

    var actual = typeof card.getAttribute === "function"
      ? card.getAttribute("data-" + key)
      : null;

    if (actual !== expected) {
      return false;
    }
  }

  return true;
}

function cardMatchesSearch(card, searchValue) {
  if (!searchValue) {
    return true;
  }

  var haystack = typeof card.getAttribute === "function"
    ? normalizeValue(card.getAttribute("data-search"))
    : "";

  return haystack.indexOf(searchValue) !== -1;
}

function syncDetailVisibility(root, card, isVisible) {
  if (!root || !card || typeof root.querySelector !== "function") {
    return;
  }

  var targetId = typeof card.getAttribute === "function"
    ? card.getAttribute("data-detail-target")
    : null;

  if (!targetId) {
    return;
  }

  var detail = root.querySelector("#" + targetId);
  if (detail && typeof detail.hidden === "boolean") {
    detail.hidden = !isVisible;
  }
}

function readCardText(card, selector) {
  if (!card || typeof card.querySelector !== "function") {
    return "";
  }

  var node = card.querySelector(selector);
  return node && typeof node.textContent === "string" ? node.textContent.trim() : "";
}

function setNodeText(root, selector, value) {
  if (!root || typeof root.querySelector !== "function") {
    return;
  }

  var node = root.querySelector(selector);
  if (node) {
    node.textContent = String(value);
  }
}

function setCardActive(card, isActive) {
  if (!card || typeof card.setAttribute !== "function") {
    return;
  }

  if (isActive) {
    card.setAttribute("data-book-active", "true");
  } else if (typeof card.removeAttribute === "function") {
    card.removeAttribute("data-book-active");
  }

  if (!isActive && typeof card.removeAttribute === "function") {
    // めくって着地した印は、その紙が下がるときに落とす。表示中に外すと
    // business-page-in が動き出し、着地した直後の紙がもう一度浮き上がる。
    card.removeAttribute("data-book-turned");
  }

  if (!isActive && typeof card.querySelectorAll === "function") {
    var details = toArray(card.querySelectorAll("details[open]"));
    for (var i = 0; i < details.length; i += 1) {
      details[i].open = false;
    }
  }
}

function isCardActive(card) {
  return Boolean(
    card &&
    typeof card.getAttribute === "function" &&
    card.getAttribute("data-book-active") === "true"
  );
}

function readCardNumber(card, fallback) {
  var value = readCardText(card, ".business-card__folio span");
  return value || String(fallback).padStart(2, "0");
}

function syncBookControls(root, hasCards) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return;
  }

  var controls = toArray(root.querySelectorAll("[data-business-prev], [data-business-next]"));
  for (var i = 0; i < controls.length; i += 1) {
    controls[i].disabled = !hasCards || Boolean(root.__businessBookTurning);
  }
}

function syncBusinessBook(root) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return;
  }

  var cards = toArray(root.querySelectorAll("[data-directory-card]"));
  var visibleCards = cards.filter(function (card) {
    return !card.hidden;
  });
  var activeCard = null;

  for (var i = 0; i < visibleCards.length; i += 1) {
    if (isCardActive(visibleCards[i])) {
      activeCard = visibleCards[i];
      break;
    }
  }

  if (!activeCard && visibleCards.length > 0) {
    activeCard = visibleCards[0];
  }

  for (var j = 0; j < cards.length; j += 1) {
    setCardActive(cards[j], cards[j] === activeCard);
  }

  syncBookControls(root, Boolean(activeCard));
  setNodeText(root, "[data-business-total]", visibleCards.length);

  if (!activeCard) {
    setNodeText(root, "[data-business-position]", 0);
    return;
  }

  var activeIndex = visibleCards.indexOf(activeCard);
  var previousIndex = (activeIndex - 1 + visibleCards.length) % visibleCards.length;
  var nextIndex = (activeIndex + 1) % visibleCards.length;
  var previousCard = visibleCards[previousIndex];
  var nextCard = visibleCards[nextIndex];

  setNodeText(root, "[data-business-position]", activeIndex + 1);
  setNodeText(root, "[data-business-prev-number]", readCardNumber(previousCard, previousIndex + 1));
  setNodeText(root, "[data-business-next-number]", readCardNumber(nextCard, nextIndex + 1));
  setNodeText(root, "[data-business-prev-name]", readCardText(previousCard, ".business-card__name"));
  setNodeText(root, "[data-business-next-name]", readCardText(nextCard, ".business-card__name"));
}

function moveBusinessBook(root, direction) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return;
  }

  var visibleCards = toArray(root.querySelectorAll("[data-directory-card]")).filter(function (card) {
    return !card.hidden;
  });

  if (visibleCards.length === 0) {
    return;
  }

  var activeIndex = visibleCards.findIndex(isCardActive);
  if (activeIndex < 0) {
    activeIndex = 0;
  }

  var nextIndex = (activeIndex + direction + visibleCards.length) % visibleCards.length;
  for (var i = 0; i < visibleCards.length; i += 1) {
    setCardActive(visibleCards[i], i === nextIndex);
  }

  syncBusinessBook(root);
}

function getBusinessBookMove(root, direction) {
  var visibleCards = toArray(root.querySelectorAll("[data-directory-card]")).filter(function (card) {
    return !card.hidden;
  });

  if (visibleCards.length < 2) {
    return null;
  }

  var activeIndex = visibleCards.findIndex(isCardActive);
  if (activeIndex < 0) {
    activeIndex = 0;
  }

  var nextIndex = (activeIndex + direction + visibleCards.length) % visibleCards.length;
  return {
    visibleCards: visibleCards,
    currentCard: visibleCards[activeIndex],
    nextCard: visibleCards[nextIndex]
  };
}

function prepareBookClone(node, className) {
  if (!node || typeof node.cloneNode !== "function") {
    return null;
  }

  var clone = node.cloneNode(true);
  if (className) {
    clone.classList.add(className);
  }

  if (typeof clone.removeAttribute === "function") {
    clone.removeAttribute("id");
    clone.removeAttribute("data-book-active");
    clone.removeAttribute("data-directory-card");
    clone.removeAttribute("aria-live");
  }

  if (typeof clone.setAttribute === "function") {
    clone.setAttribute("aria-hidden", "true");
  }

  if ("inert" in clone) {
    clone.inert = true;
  }

  if (typeof clone.querySelectorAll === "function") {
    var nested = toArray(clone.querySelectorAll("[id], [aria-controls], a, button, input, select, textarea, summary"));
    for (var i = 0; i < nested.length; i += 1) {
      nested[i].removeAttribute("id");
      nested[i].removeAttribute("aria-controls");
      nested[i].setAttribute("tabindex", "-1");
    }
  }

  return clone;
}

// どの紙を開いた状態にするかを決める。指で戻したときは currentCard を渡して
// 元に戻す。data-book-turned は、着地した紙が business-page-in で改めて
// 浮き上がらないようにするための印。
function commitBusinessBookMove(root, move, card) {
  var target = card || move.nextCard;

  for (var i = 0; i < move.visibleCards.length; i += 1) {
    setCardActive(move.visibleCards[i], move.visibleCards[i] === target);
  }

  if (target && typeof target.setAttribute === "function") {
    target.setAttribute("data-book-turned", "true");
  }

  syncBusinessBook(root);
}

// 表裏それぞれにかぶせる陰り。濃度は CSS のキーフレームが持つ。
function createLeafShade(documentRef) {
  var shade = documentRef.createElement("span");
  shade.className = "business-page-turn__shade";
  return shade;
}

// 紙を縦に割るこまの数。増やすほど曲面はなめらかになるが、紙面の複製も
// こま数 × 表裏だけ増える。6 で継ぎ目は目に留まらない。
var BOOK_LEAF_SEGMENTS = 6;

// こま1枚分の窓と、その中に置く紙面。紙面は紙の全幅を持ち、こまの位置に
// 合わせて左右へずらす。窓が刻み、紙面が絵を持つ。
function buildLeafSlice(documentRef, side, template, offsetSteps) {
  var clone = template && typeof template.cloneNode === "function" ? template.cloneNode(true) : null;
  if (!clone) {
    return null;
  }

  var face = documentRef.createElement("div");
  var sheet = documentRef.createElement("div");
  var curl = documentRef.createElement("span");

  face.className = "business-page-turn__face business-page-turn__face--" + side;
  sheet.className = "business-page-turn__sheet";
  sheet.style.width = (BOOK_LEAF_SEGMENTS * 100) + "%";
  sheet.style.left = (offsetSteps * 100) + "%";
  curl.className = "business-page-turn__curl";

  sheet.appendChild(clone);
  sheet.appendChild(curl);
  sheet.appendChild(createLeafShade(documentRef));
  face.appendChild(sheet);
  return face;
}

// こまを根元から順に入れ子にする。各こまは親からの相対回転だけを持ち、
// 紙全体のしなりは重なった回転として現れる。
function buildBookLeafSegments(documentRef, options) {
  var root = null;
  var parent = null;
  var total = BOOK_LEAF_SEGMENTS;
  // 紙面の掃除（id 剥がし・フォーカス外し）は一度で済ませ、こまへは掃除済みの
  // 複製を配る。こまごとに掃除し直すと、めくり始めに一拍の引っかかりが出る。
  var frontTemplate = prepareBookClone(options.frontSource, options.cloneClass);
  var backTemplate = prepareBookClone(options.backSource, options.cloneClass);

  if (!frontTemplate || !backTemplate) {
    return null;
  }

  for (var index = 1; index <= total; index += 1) {
    var segment = documentRef.createElement("div");
    segment.className = "business-page-turn__seg";

    // 綴じ側から数えて何番目の帯かで、紙面のずらし幅が決まる。裏面は
    // 鏡になるので、表とは逆の端から数える。
    var frontSteps = options.hingeLeft ? -(index - 1) : -(total - index);
    var backSteps = options.hingeLeft ? -(total - index) : -(index - 1);
    var front = buildLeafSlice(documentRef, "front", frontTemplate, frontSteps);
    var back = buildLeafSlice(documentRef, "back", backTemplate, backSteps);

    if (!front || !back) {
      return null;
    }

    if (index === 1) {
      segment.classList.add("business-page-turn__seg--root");
      segment.style.width = (100 / total) + "%";
      root = segment;
    } else {
      segment.style.setProperty("--biz-seg", String((index - 1) * options.bendSign));
      parent.appendChild(segment);
    }

    segment.appendChild(front);
    segment.appendChild(back);
    parent = segment;
  }

  return root;
}

function clearBusinessBookTurn(root) {
  if (!root) {
    return;
  }

  if (root.__businessBookTurnFinishTimer) {
    global.clearTimeout(root.__businessBookTurnFinishTimer);
    root.__businessBookTurnFinishTimer = null;
  }

  cancelBookSettle(root);

  if (root.__businessBookTurnPage && typeof root.__businessBookTurnPage.remove === "function") {
    root.__businessBookTurnPage.remove();
  }

  root.__businessBookTurnPage = null;
  root.__businessBookTurn = null;
  root.__businessBookTurning = false;
  if (typeof root.removeAttribute === "function") {
    root.removeAttribute("data-book-turning");
    root.removeAttribute("data-book-dragging");
    root.removeAttribute("aria-busy");
  }
}

function cancelBookSettle(root) {
  if (!root) {
    return;
  }

  if (root.__businessBookSettleFrame && typeof global.cancelAnimationFrame === "function") {
    global.cancelAnimationFrame(root.__businessBookSettleFrame);
  }

  if (root.__businessBookSettleTimer) {
    global.clearTimeout(root.__businessBookSettleTimer);
  }

  root.__businessBookSettleFrame = null;
  root.__businessBookSettleTimer = null;
}

// めくりを構成する遷移とアニメーションを全部つかまえて、時間を手で送れる
// 状態にする。CSS 側の陰り・落ち影の設計をそのまま使えるので、指で動かす分の
// 濃度計算を JS に写し取らなくて済む。
function holdBookTurnAnimations(turn) {
  var page = turn && turn.turningPage;
  if (!page || typeof page.getAnimations !== "function") {
    return false;
  }

  var animations;
  try {
    animations = page.getAnimations({ subtree: true });
  } catch {
    return false;
  }

  if (!animations || animations.length === 0) {
    return false;
  }

  for (var i = 0; i < animations.length; i += 1) {
    animations[i].pause();
    animations[i].currentTime = 0;
  }

  turn.animations = animations;
  turn.progress = 0;
  return true;
}

function scrubBookTurn(turn, progress) {
  if (!turn || !turn.animations) {
    return;
  }

  var next = progress < 0 ? 0 : (progress > 1 ? 1 : progress);
  turn.progress = next;

  for (var i = 0; i < turn.animations.length; i += 1) {
    turn.animations[i].currentTime = next * BOOK_TURN_DURATION;
  }
}

// 指を放したあと、残りを自分で送りきる。CSS の再生に任せて巻き戻すと、
// 遷移が終わった瞬間に最終値へ跳ねてしまうので、時間だけを動かす。
function settleBookTurn(root, turn, complete) {
  var from = turn.progress;
  var to = complete ? 1 : 0;
  var span = Math.abs(to - from);
  var duration = Math.max(160, Math.round(BOOK_TURN_DURATION * span * 0.85));
  var startedAt = null;

  cancelBookSettle(root);

  var done = function () {
    cancelBookSettle(root);
    finishBookTurn(root, turn, complete);
  };

  if (typeof global.requestAnimationFrame !== "function") {
    scrubBookTurn(turn, to);
    done();
    return;
  }

  var step = function (now) {
    if (startedAt === null) {
      startedAt = now;
    }

    var elapsed = Math.min(1, (now - startedAt) / duration);
    // easeOutQuad。指を放したあとの紙は、勢いを保ったまま静かに収まる。
    scrubBookTurn(turn, from + (to - from) * elapsed * (2 - elapsed));

    if (elapsed < 1) {
      root.__businessBookSettleFrame = global.requestAnimationFrame(step);
      return;
    }

    done();
  };

  root.__businessBookSettleFrame = global.requestAnimationFrame(step);
  // 裏に回るなどして描画が止まると rAF は来ない。本が開いたまま固まらない
  // よう、時間でも必ず終わらせる。
  root.__businessBookSettleTimer = global.setTimeout(function () {
    scrubBookTurn(turn, to);
    done();
  }, duration + 320);
}

function prefersReducedMotion() {
  return typeof global.matchMedia === "function" &&
    global.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isBookSinglePage() {
  return typeof global.matchMedia === "function" &&
    global.matchMedia("(max-width: 767px)").matches;
}

// めくる紙一式を組み立てて本に差し込む。ボタン送りも指のドラッグも、
// ここで出来た同じ紙を動かす。作れなければ null を返す。
function buildBookTurn(root, direction) {
  if (!root || typeof root.querySelectorAll !== "function" || root.__businessBookTurning) {
    return null;
  }

  var move = getBusinessBookMove(root, direction);
  var grid = typeof root.querySelector === "function"
    ? root.querySelector(".business-directory__grid")
    : null;

  if (!move || !grid || !grid.ownerDocument) {
    return null;
  }

  var documentRef = grid.ownerDocument;
  var isMobile = isBookSinglePage();
  // 綴じは左。一面表示で「戻る」ときだけ、左に伏せていた紙が起き上がって
  // 戻ってくるので、表裏と回転の向きが入れ替わる。
  var isRewind = isMobile && direction < 0;
  var frontSource = isMobile
    ? (isRewind ? move.nextCard : move.currentCard)
    : move.currentCard.querySelector(direction > 0 ? ".business-card__body" : ".business-card__figure");
  var backSource = isMobile
    ? (isRewind ? move.currentCard : move.nextCard)
    : move.nextCard.querySelector(direction > 0 ? ".business-card__figure" : ".business-card__body");
  // 紙が持ち上がった下から現れるのは、行き先の見開きの「めくらない側」。
  // 見開きごと差し替えると、まだ紙に覆われていない部分まで途中で入れ替わり、
  // 半分だけ絵が飛ぶ。先にこの面を敷いておけば、最初の1コマから正しい。
  var revealSource = isMobile
    ? null
    : move.nextCard.querySelector(direction > 0 ? ".business-card__body" : ".business-card__figure");
  // 綴じ（回転の軸）が左に来るのは、送るときと、一面表示で戻すとき。
  var hingeLeft = direction > 0 || isRewind;
  var leafSegments = frontSource && backSource
    ? buildBookLeafSegments(documentRef, {
      frontSource: frontSource,
      backSource: backSource,
      cloneClass: isMobile ? "business-page-turn__card" : "",
      hingeLeft: hingeLeft,
      // しなりは動く向きへ先行する。送りは負、戻しは正の回転なので符号が逆。
      bendSign: direction > 0 ? -1 : 1
    })
    : null;
  var revealClone = revealSource ? prepareBookClone(revealSource, "") : null;

  if (!leafSegments || typeof documentRef.createElement !== "function") {
    return null;
  }

  var turningPage = documentRef.createElement("div");
  var castShadow = documentRef.createElement("span");
  var leaf = documentRef.createElement("div");
  turningPage.className = "business-page-turn business-page-turn--" +
    (direction > 0 ? "next" : "previous") +
    (isMobile ? " business-page-turn--mobile" : "") +
    (isRewind ? " business-page-turn--rewind" : "");
  turningPage.setAttribute("aria-hidden", "true");
  // こまが進む向き。綴じが右にある見開きの「戻る」だけ、左へ並べる。
  turningPage.style.setProperty("--biz-dir", hingeLeft ? "1" : "-1");
  // 落ち影は回る葉の兄弟に置く。葉と一緒に回してしまうと、受け側のページに
  // 影が落ちず、紙が一枚だけ宙に浮いて見える。
  castShadow.className = "business-page-turn__cast";
  leaf.className = "business-page-turn__leaf";
  leaf.appendChild(leafSegments);
  if (revealClone) {
    var reveal = documentRef.createElement("div");
    reveal.className = "business-page-turn__reveal";
    reveal.appendChild(revealClone);
    turningPage.appendChild(reveal);
  }
  turningPage.appendChild(castShadow);
  turningPage.appendChild(leaf);
  grid.appendChild(turningPage);

  root.__businessBookTurning = true;
  root.__businessBookTurnPage = turningPage;
  if (typeof root.setAttribute === "function") {
    root.setAttribute("data-book-turning", "true");
    root.setAttribute("aria-busy", "true");
  }
  syncBookControls(root, true);

  // 挿入直後の要素は、まだ一度もスタイルを計算されていない。そのまま
  // is-turning を付けると、ブラウザは最終値（180度）しか見ないので遷移が
  // 起きず、紙が一瞬で裏返る。offsetWidth を読んでレイアウトを流し、
  // 0度の状態を確定させてから倒し始める。
  // requestAnimationFrame は挟まない。フレームが遅れると倒し始めだけが後ろに
  // ずれ、下の setTimeout（差し替え・後片付け）に追い越されて、めくっている
  // 途中の紙が消える。
  void turningPage.offsetWidth;
  turningPage.classList.add("is-turning");

  var turn = {
    move: move,
    turningPage: turningPage,
    isMobile: isMobile,
    // 一面めくりでは、紙をどけた下に見えるのが行き先の紙そのもの。先に
    // 差し替えないと、持ち上げた下から今と同じ紙が出てくる。見開きでは逆に、
    // 裏返った紙が反対のページを覆い切るまで待つ。
    commitsAtStart: isMobile,
    committed: false,
    progress: 0
  };
  root.__businessBookTurn = turn;

  if (turn.commitsAtStart) {
    commitBusinessBookMove(root, move, move.nextCard);
    turn.committed = true;
  }

  return turn;
}

function animateBusinessBook(root, direction) {
  if (!root || typeof root.querySelectorAll !== "function" || root.__businessBookTurning) {
    return;
  }

  if (prefersReducedMotion()) {
    moveBusinessBook(root, direction);
    return;
  }

  var turn = buildBookTurn(root, direction);
  if (!turn) {
    moveBusinessBook(root, direction);
    return;
  }

  root.__businessBookTurnFinishTimer = global.setTimeout(function () {
    finishBookTurn(root, turn, true);
  }, BOOK_TURN_DURATION + 40);
}

// めくりを終える。complete が false なら、指を放して元に戻した場合。
function finishBookTurn(root, turn, complete) {
  if (!turn || turn.finished) {
    return;
  }

  turn.finished = true;

  if (complete && !turn.committed) {
    commitBusinessBookMove(root, turn.move, turn.move.nextCard);
  } else if (!complete && turn.committed) {
    // 途中でやめた分を巻き戻す。開いていた紙に戻す。
    commitBusinessBookMove(root, turn.move, turn.move.currentCard);
  }

  clearBusinessBookTurn(root);
  syncBusinessBook(root);
  keepBookInView(root);
}

/**
 * 送ったあと、開いた紙が画面から外れていたら本を上へ寄せる。
 *
 * 1件が1画面に収まる寸法にしてあるので、ここを合わせておけば、送るたびに
 * 読む位置を探し直さずに済む。すでに収まっているときは動かさない——
 * 読んでいる最中に画面が動くほうが煩わしい。
 *
 * /alumni/ は同じスクリプトを使うが .business-book-stage を持たないので
 * 素通りする。狭い画面に限るのも、共有スクリプトの影響範囲を広げないため。
 */
function keepBookInView(root) {
  if (typeof window === "undefined" || !root || typeof root.querySelector !== "function") {
    return;
  }
  var stage = root.querySelector(".business-book-stage");
  if (!stage || typeof stage.getBoundingClientRect !== "function" || typeof stage.scrollIntoView !== "function") {
    return;
  }
  // 指で紙をつまんでいる最中は動かさない。読んでいる場所が飛ぶ。
  if (typeof root.getAttribute === "function" && root.getAttribute("data-book-dragging") === "true") {
    return;
  }
  var narrow = typeof window.matchMedia === "function" && window.matchMedia("(max-width: 767px)").matches;
  if (!narrow) {
    return;
  }

  var viewport = window.innerHeight || 0;
  var stageRect = stage.getBoundingClientRect();
  if (!viewport || stageRect.height <= 0) {
    return;
  }

  // 読める帯は画面いっぱいではない。上はサイトのヘッダー、下はクイックナビが
  // 固定で乗っている。scrollIntoView の block:"start" は上端しか見ないので、
  // それだけだと送りの操作部が下のナビに潜り込む（実測で24px隠れた）。
  // 紙と送りをひとつの塊として、帯の中へ入れる。
  var band = readableBand(root, viewport);
  var nav = root.querySelector(".business-book-nav");
  var navRect = nav && typeof nav.getBoundingClientRect === "function" ? nav.getBoundingClientRect() : null;
  var groupTop = stageRect.top;
  var groupBottom = navRect ? navRect.bottom : stageRect.bottom;

  if (groupTop >= band.top && groupBottom <= band.bottom) {
    return;
  }

  var delta = groupTop - band.top;
  if (!delta) {
    return;
  }

  var reduced = typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    window.scrollBy({ top: delta, behavior: reduced ? "auto" : "smooth" });
  } catch {
    // オブジェクト引数を解さない実装向け。
    window.scrollBy(0, delta);
  }
}

/** 固定表示に隠されていない、実際に読める縦の帯。 */
function readableBand(root, viewport) {
  var top = 0;
  var bottom = viewport;
  var header = typeof document !== "undefined" && typeof document.querySelector === "function"
    ? document.querySelector("#siteHeader")
    : null;
  if (header && typeof header.getBoundingClientRect === "function") {
    var headerRect = header.getBoundingClientRect();
    // ヘッダーは固定なので、上端からの高さがそのまま隠れる量になる。
    if (headerRect.height > 0 && headerRect.top < viewport) {
      top = Math.max(top, headerRect.bottom + 6);
    }
  }
  var quicknav = typeof document !== "undefined" && typeof document.querySelector === "function"
    ? document.querySelector("[data-business-quicknav]")
    : null;
  if (quicknav && typeof quicknav.getBoundingClientRect === "function") {
    var quicknavRect = quicknav.getBoundingClientRect();
    if (quicknavRect.height > 0 && quicknavRect.top > 0) {
      bottom = Math.min(bottom, quicknavRect.top);
    }
  }
  return { top: top, bottom: bottom };
}

// 指で紙をめくる。動かした分だけ紙が起き、放したところで送るか戻すかが決まる。
function initBusinessBookTouch(root) {
  var book = typeof root.querySelector === "function" ? root.querySelector(".business-book") : null;
  if (!book || typeof book.addEventListener !== "function" || book.__businessBookTouchBound) {
    return;
  }

  book.__businessBookTouchBound = true;

  // 指を動かし始めた向きが決まるまでの遊び。ここを取らないと、縦に
  // スクロールしたいだけの指でも紙が動く。
  var START_SLOP = 14;
  var press = null;

  var endPress = function () {
    press = null;
    if (typeof root.removeAttribute === "function") {
      root.removeAttribute("data-book-dragging");
    }
  };

  var release = function (event) {
    if (!press || !event || event.pointerId !== press.id) {
      return;
    }

    var current = press;
    var dx = event.clientX - current.x;
    endPress();

    if (!current.turn) {
      // 紙をつかむ前に放した指。長さが足りていれば、ボタンと同じ送りにする。
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(event.clientY - current.y)) {
        animateBusinessBook(root, dx < 0 ? 1 : -1);
      }
      return;
    }

    var travelled = Math.abs(dx) - START_SLOP;
    var elapsed = Math.max(1, event.timeStamp - current.movedAt);
    var speed = Math.abs(event.clientX - current.movedX) / elapsed;
    // 3分の1ほど起こしてあれば送る。そこまで行かなくても、指を払っていれば送る。
    // 指が止まってから放したときは speed がほぼ 0 になり、そのまま戻る。
    var complete = current.turn.progress > 0.34 || (speed > 0.3 && travelled > 0);
    settleBookTurn(root, current.turn, complete);
  };

  book.addEventListener("pointerdown", function (event) {
    if (!event || event.pointerType !== "touch" || root.__businessBookTurning) {
      return;
    }

    // 詳細やリンクを押した指からは紙を奪わない。
    if (event.target && typeof event.target.closest === "function" &&
      event.target.closest("summary, a, button, input, select, textarea")) {
      return;
    }

    press = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      movedX: event.clientX,
      movedAt: event.timeStamp,
      turn: null
    };
  }, { passive: true });

  book.addEventListener("pointermove", function (event) {
    if (!press || event.pointerId !== press.id || press.blocked) {
      return;
    }

    var dx = event.clientX - press.x;
    var dy = event.clientY - press.y;

    if (!press.turn) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > START_SLOP) {
        // 縦に動かしている指。スクロールに返す。
        endPress();
        return;
      }

      if (Math.abs(dx) < START_SLOP) {
        return;
      }

      if (prefersReducedMotion()) {
        // 動きを抑える設定では紙を追わせない。放したときにまとめて送る。
        press.blocked = true;
        return;
      }

      var turn = buildBookTurn(root, dx < 0 ? 1 : -1);
      if (!turn || !holdBookTurnAnimations(turn)) {
        // 時間を手で送れないブラウザ。紙は片づけて、放したときの送りに任せる。
        if (turn) {
          finishBookTurn(root, turn, false);
        }
        press.blocked = true;
        return;
      }

      press.turn = turn;
      // 紙の幅に対して指を動かした割合をそのまま角度にする。一面めくりは紙が
      // 画面いっぱい、見開きは半分なので、追従の手ざわりが同じになるよう分ける。
      press.span = Math.max(120, book.getBoundingClientRect().width * (turn.isMobile ? 0.72 : 0.42));
      if (typeof root.setAttribute === "function") {
        root.setAttribute("data-book-dragging", "true");
      }
      if (typeof book.setPointerCapture === "function") {
        try {
          book.setPointerCapture(event.pointerId);
        } catch {
          // 捕捉できなくても、指が本の上にある間は動く。
        }
      }
    }

    if (press.turn) {
      scrubBookTurn(press.turn, (Math.abs(dx) - START_SLOP) / press.span);
      press.movedX = event.clientX;
      press.movedAt = event.timeStamp;
    }
  }, { passive: true });

  // 放す側は文書で受ける。指が本の外まで滑って離れても、紙が起きたまま
  // 残らないようにする（pointer capture を取れなかった場合の保険）。
  var documentRef = book.ownerDocument;
  if (documentRef && typeof documentRef.addEventListener === "function") {
    documentRef.addEventListener("pointerup", release);
    documentRef.addEventListener("pointercancel", function (event) {
      if (!press || (event && event.pointerId !== press.id)) {
        return;
      }

      if (press.turn) {
        settleBookTurn(root, press.turn, false);
      }

      endPress();
    });
  }
}

function initBusinessBookNavigation(root) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return;
  }

  var previousControls = toArray(root.querySelectorAll("[data-business-prev]"));
  var nextControls = toArray(root.querySelectorAll("[data-business-next]"));

  for (var i = 0; i < previousControls.length; i += 1) {
    if (!previousControls[i].__businessBookBound) {
      previousControls[i].__businessBookBound = true;
      previousControls[i].addEventListener("click", animateBusinessBook.bind(null, root, -1));
    }
  }

  for (var j = 0; j < nextControls.length; j += 1) {
    if (!nextControls[j].__businessBookBound) {
      nextControls[j].__businessBookBound = true;
      nextControls[j].addEventListener("click", animateBusinessBook.bind(null, root, 1));
    }
  }

  if (typeof root.addEventListener === "function" && !root.__businessBookKeyboardBound) {
    root.__businessBookKeyboardBound = true;
    root.addEventListener("keydown", function (event) {
      if (!event || event.defaultPrevented) {
        return;
      }

      var tagName = event.target && event.target.tagName
        ? String(event.target.tagName).toLowerCase()
        : "";
      if (tagName === "select" || tagName === "input" || tagName === "textarea") {
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        animateBusinessBook(root, event.key === "ArrowLeft" ? -1 : 1);
      }
    });
  }
}

function applyDirectoryFilters(root) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return;
  }

  clearBusinessBookTurn(root);

  var filters = toArray(root.querySelectorAll("[data-filter-key]"));
  var cards = toArray(root.querySelectorAll("[data-directory-card]"));
  var searchInput = typeof root.querySelector === "function"
    ? root.querySelector("[data-directory-search]")
    : null;
  var countNode = typeof root.querySelector === "function"
    ? root.querySelector("[data-directory-count]")
    : null;
  var emptyNode = typeof root.querySelector === "function"
    ? root.querySelector("[data-directory-empty]")
    : null;
  var searchValue = readSearchValue(searchInput);
  var visibleCount = 0;

  for (var i = 0; i < cards.length; i += 1) {
    var card = cards[i];
    var isVisible = cardMatchesFilters(card, filters) && cardMatchesSearch(card, searchValue);
    card.hidden = !isVisible;
    syncDetailVisibility(root, card, isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  }

  if (countNode) {
    countNode.textContent = String(visibleCount);
  }

  if (emptyNode) {
    emptyNode.hidden = visibleCount !== 0;
  }

  syncBusinessBook(root);
}

function initDirectoryReset(root) {
  if (!root || typeof root.querySelector !== "function") {
    return;
  }

  var reset = root.querySelector("[data-directory-reset]");
  if (!reset || typeof reset.addEventListener !== "function" || reset.__directoryResetBound) {
    return;
  }

  reset.__directoryResetBound = true;
  reset.addEventListener("click", function () {
    var filters = toArray(root.querySelectorAll("[data-filter-key]"));
    for (var i = 0; i < filters.length; i += 1) {
      filters[i].value = "";
    }

    var searchInput = root.querySelector("[data-directory-search]");
    if (searchInput) {
      searchInput.value = "";
    }

    applyDirectoryFilters(root);
  });
}

function syncDetailsToggle(toggle, details) {
  if (!toggle || !details || typeof toggle.setAttribute !== "function") {
    return;
  }

  var isExpanded = !details.hidden;
  toggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
}

function initDirectoryDetailsToggle(root) {
  if (!root || typeof root.querySelector !== "function") {
    return;
  }

  var toggle = root.querySelector("[data-directory-toggle-details]");
  var details = root.querySelector("[data-directory-detail-filters]");

  if (
    !toggle ||
    !details ||
    typeof toggle.addEventListener !== "function" ||
    typeof details.hidden !== "boolean"
  ) {
    return;
  }

  details.hidden = true;
  syncDetailsToggle(toggle, details);

  if (toggle.__directoryToggleBound) {
    return;
  }

  toggle.__directoryToggleBound = true;
  toggle.addEventListener("click", function () {
    details.hidden = !details.hidden;
    syncDetailsToggle(toggle, details);
  });
}

function initDirectoryFilters(root) {
  var scope = root || global.document;
  if (!scope || typeof scope.querySelectorAll !== "function") {
    return;
  }

  var roots = scope.querySelectorAll("[data-directory-root]");
  if (!roots || roots.length === 0) {
    if (scope !== global.document) {
      roots = [scope];
    } else {
      return;
    }
  }

  for (var i = 0; i < roots.length; i += 1) {
    var directoryRoot = roots[i];
    var filters = toArray(directoryRoot.querySelectorAll("[data-filter-key]"));
    var searchInput = typeof directoryRoot.querySelector === "function"
      ? directoryRoot.querySelector("[data-directory-search]")
      : null;

    for (var j = 0; j < filters.length; j += 1) {
      if (filters[j].__directoryFilterBound) {
        continue;
      }

      filters[j].__directoryFilterBound = true;
      filters[j].addEventListener("change", applyDirectoryFilters.bind(null, directoryRoot));
    }

    if (
      searchInput &&
      typeof searchInput.addEventListener === "function" &&
      !searchInput.__directoryFilterBound
    ) {
      searchInput.__directoryFilterBound = true;
      searchInput.addEventListener("input", applyDirectoryFilters.bind(null, directoryRoot));
    }

    initDirectoryDetailsToggle(directoryRoot);
    initDirectoryReset(directoryRoot);
    initBusinessBookNavigation(directoryRoot);
    initBusinessBookTouch(directoryRoot);
    applyDirectoryFilters(directoryRoot);
  }
}

/**
 * 事業紹介の DOM に絞り込みとめくりを取り付ける。返り値は後片付け。
 *
 * 取り付けは冪等（要素側の __*Bound で二度づけを防ぐ）なので、React の
 * StrictMode が effect を二度走らせても listener は増えない。
 */
export function initDirectory(root) {
  if (!root) {
    return function () {}
  }

  initDirectoryFilters(root)

  return function () {
    clearBusinessBookTurn(root)
  }
}
