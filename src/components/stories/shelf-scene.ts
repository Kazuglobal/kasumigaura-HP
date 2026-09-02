/**
 * The 3D shelf for 卒業生紹介: one book per graduate, flowing sideways, opening into the spread that
 * the article continues from.
 *
 * three.js is imported by the caller and handed in, so nothing here loads until the section is
 * actually near the viewport and the environment has been cleared (WebGL present, motion allowed).
 */
import type * as THREE_NS from 'three'
import type { Story } from '@/data/stories'
import {
  BOOK_D,
  BOOK_H,
  BOOK_W,
  CAMERA_Z,
  FOV,
  GAP,
  layoutFor,
} from './shelf-layout'

type THREE = typeof THREE_NS

export type BookArt = {
  readonly story: Story
  readonly cover: HTMLCanvasElement
  readonly spine: HTMLCanvasElement
  readonly leftPage: HTMLCanvasElement
  readonly rightPage: HTMLCanvasElement
}

export type ShelfHandle = {
  readonly dispose: () => void
  /** Move the focus one book along, by on-screen position rather than by index. */
  readonly step: (dir: 1 | -1) => void
  readonly openFocused: () => void
  readonly focused: () => Story | null
}

type Options = {
  readonly THREE: THREE
  readonly canvas: HTMLCanvasElement
  readonly container: HTMLElement
  readonly books: readonly BookArt[]
  readonly onFocus: (story: Story | null) => void
  readonly onOpened: (story: Story) => void
}

const FLOW_SPEED = 0.22
const HOVER_LIFT = 0.28
// Positive yaw turns the binding (-x) towards the camera. Negative shows the fore-edge instead,
// which is a blank paper slab — the spine is the whole point of a shelf.
const TILT = 0.34
const OPEN_MS = 900

const mod = (value: number, span: number): number => ((value % span) + span) % span

export const createShelf = ({
  THREE,
  canvas,
  container,
  books,
  onFocus,
  onOpened,
}: Options): ShelfHandle => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.set(0, 0, CAMERA_Z)

  scene.add(new THREE.AmbientLight(0xffffff, 2.1))
  const key = new THREE.DirectionalLight(0xffffff, 1.5)
  key.position.set(-2.5, 3, 4)
  scene.add(key)

  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item)
    return item
  }

  const textureOf = (source: HTMLCanvasElement) => {
    const texture = track(new THREE.CanvasTexture(source))
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    return texture
  }

  const paper = track(new THREE.MeshLambertMaterial({ color: 0xf3efe4 }))
  const boardBack = track(new THREE.MeshLambertMaterial({ color: 0xdad3c4 }))
  const bodyGeometry = track(new THREE.BoxGeometry(BOOK_W, BOOK_H, BOOK_D))
  const pageGeometry = track(new THREE.PlaneGeometry(BOOK_W, BOOK_H))

  type Book = {
    readonly story: Story
    readonly group: THREE_NS.Group
    readonly hinge: THREE_NS.Object3D
    readonly rightPage: THREE_NS.Mesh
    readonly slot: number
    x: number
  }

  const books3d: Book[] = books.map((art, index) => {
    const group = new THREE.Group()

    // BoxGeometry face order is +x, -x, +y, -y, +z, -z. The binding is on -x, so the spine art
    // goes there; the fore-edge and the head/tail are paper.
    const body = new THREE.Mesh(bodyGeometry, [
      paper,
      track(new THREE.MeshLambertMaterial({ map: textureOf(art.spine) })),
      paper,
      paper,
      paper,
      boardBack,
    ])
    group.add(body)

    // Front cover, hinged on the spine: the hinge sits at the binding and the panel is offset half
    // a width to the right, so rotating the hinge swings the cover open around the spine.
    const hinge = new THREE.Object3D()
    hinge.position.set(-BOOK_W / 2, 0, BOOK_D / 2 + 0.012)
    const front = new THREE.Mesh(
      pageGeometry,
      track(new THREE.MeshLambertMaterial({ map: textureOf(art.cover) })),
    )
    front.position.x = BOOK_W / 2
    hinge.add(front)
    // Back of the cover = the left page of the spread, facing the other way.
    const inside = new THREE.Mesh(
      pageGeometry,
      track(new THREE.MeshLambertMaterial({ map: textureOf(art.leftPage) })),
    )
    inside.position.set(BOOK_W / 2, 0, -0.008)
    inside.rotation.y = Math.PI
    hinge.add(inside)
    group.add(hinge)

    // Right page, carried deeper than the cover so the opening cover never clips through it.
    const rightPage = new THREE.Mesh(
      pageGeometry,
      track(
        new THREE.MeshLambertMaterial({ map: textureOf(art.rightPage), transparent: true, opacity: 0 }),
      ),
    )
    // In front of the board, not inside it: at BOOK_D/2 - x the box's own front face hides the page.
    rightPage.position.z = BOOK_D / 2 + 0.002
    rightPage.visible = false
    group.add(rightPage)

    group.rotation.y = TILT
    scene.add(group)
    return { story: art.story, group, hinge, rightPage, slot: index, x: 0 }
  })

  const lane = books3d.length * GAP
  const layout = { scale: 1, openZ: 1, openScale: 1 }
  const state = {
    flow: 0,
    speed: FLOW_SPEED,
    hover: null as Book | null,
    focus: null as Book | null,
    opening: null as Book | null,
    openStart: 0,
    done: false,
  }

  const fit = () => {
    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    const next = layoutFor(width, height, books3d.length)
    layout.scale = next.scale
    layout.openZ = next.openZ
    layout.openScale = next.openScale
  }

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  const bookAt = (event: PointerEvent | MouseEvent): Book | null => {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(books3d.map((book) => book.group), true)[0]
    if (!hit) return null
    return books3d.find((book) => {
      let node: THREE_NS.Object3D | null = hit.object
      while (node) {
        if (node === book.group) return true
        node = node.parent
      }
      return false
    }) ?? null
  }

  const setFocus = (book: Book | null) => {
    if (state.focus === book) return
    state.focus = book
    onFocus(book?.story ?? null)
  }

  const open = (book: Book | null) => {
    if (!book || state.opening) return
    state.opening = book
    state.openStart = performance.now()
    setFocus(book)
    book.rightPage.visible = true
  }

  const onPointerMove = (event: PointerEvent) => {
    const book = bookAt(event)
    state.hover = book
    setFocus(book ?? state.focus)
    canvas.style.cursor = book ? 'pointer' : 'default'
  }
  const onPointerLeave = () => {
    state.hover = null
    canvas.style.cursor = 'default'
  }
  // The hovered book is pushed towards the camera, so near its edge the ray can miss the book the
  // reader can see is lit. Fall back to the lit one instead of doing nothing.
  const onClick = (event: MouseEvent) => open(bookAt(event) ?? state.hover ?? state.focus)

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      step(event.key === 'ArrowRight' ? 1 : -1)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open(state.focus ?? books3d[0])
    }
  }

  // Ordered by where the books are right now, not by index: stepping through the array would move
  // the focus to a book that is off screen and look like nothing happened.
  const step = (dir: 1 | -1) => {
    if (state.opening) return
    const onScreen = [...books3d].sort((a, b) => a.x - b.x)
    const current = state.focus ?? onScreen[Math.floor(onScreen.length / 2)]
    const at = onScreen.indexOf(current)
    const next = onScreen[Math.min(onScreen.length - 1, Math.max(0, at + dir))]
    setFocus(next)
  }

  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('click', onClick)
  // Bound to the canvas, not the window: arrow keys must keep scrolling the page for everyone who
  // has not put focus on the shelf.
  canvas.addEventListener('keydown', onKeyDown)

  const resize = new ResizeObserver(fit)
  resize.observe(container)
  fit()

  let raf = 0
  let last = performance.now()

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now

    // Stop the flow while a book is under the pointer or holds focus: a moving target is hard to hit.
    const wanted = state.hover || state.focus || state.opening ? 0 : FLOW_SPEED
    state.speed += (wanted - state.speed) * Math.min(1, dt * 6)
    state.flow += state.speed * dt

    const opening = state.opening
    const progress = opening ? Math.min(1, (now - state.openStart) / OPEN_MS) : 0
    const eased = progress * progress * (3 - 2 * progress)

    for (const book of books3d) {
      const isOpening = book === opening
      book.x = mod(book.slot * GAP + state.flow + lane / 2, lane) - lane / 2
      const scale = layout.scale * (isOpening ? 1 + (layout.openScale - 1) * eased : 1)
      book.group.scale.setScalar(scale)

      const lift = book === state.hover || book === state.focus ? HOVER_LIFT : 0
      if (isOpening) {
        // Slide the spine to the middle of the screen: the spread grows to both sides of it.
        book.group.position.x = book.x * layout.scale * (1 - eased) + (BOOK_W / 2) * scale * eased
        book.group.position.z = layout.openZ * eased
        book.group.rotation.y = TILT * (1 - eased)
        book.hinge.rotation.y = -Math.PI * eased
        const material = book.rightPage.material as THREE_NS.MeshLambertMaterial
        material.opacity = eased
      } else {
        book.group.position.x = book.x * layout.scale
        book.group.position.z = lift * layout.scale
        book.group.rotation.y = TILT
      }
      book.group.visible = !opening || isOpening
    }

    renderer.render(scene, camera)

    if (opening && progress >= 1 && !state.done) {
      state.done = true
      onOpened(opening.story)
    }
  }
  raf = requestAnimationFrame(frame)

  return {
    step,
    openFocused: () => open(state.focus),
    focused: () => state.focus?.story ?? null,
    dispose: () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('keydown', onKeyDown)
      for (const item of disposables) item.dispose()
      renderer.dispose()
    },
  }
}
