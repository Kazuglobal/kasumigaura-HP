'use client'

import { useEffect } from 'react'
import { takeOpenedFromShelf } from './opened-from-shelf'

type Props = {
  readonly slug: string
  /** id of the heading to hand the focus to. */
  readonly target: string
}

/** Moves the focus to the article heading, but only when the shelf is what opened this article. */
export function OpenedFocus({ slug, target }: Props) {
  useEffect(() => {
    if (!takeOpenedFromShelf(slug)) return
    document.getElementById(target)?.focus()
  }, [slug, target])

  return null
}
