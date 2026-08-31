/**
 * A book opening is a client-side navigation, and Next leaves the focus on <body> after one: a
 * reader on the keyboard would land on the article with the focus nowhere. The shelf leaves a note
 * here before it navigates, and the article picks it up and moves the focus to its heading.
 *
 * A note, not a query string: the URL of an article should not carry how the reader got there, and
 * a plain page load (a shared link, a reload) must not steal the focus.
 */
const KEY = 'kasumigaura:stories:opened'

export const markOpenedFromShelf = (slug: string): void => {
  try {
    sessionStorage.setItem(KEY, slug)
  } catch {
    // Private modes can refuse storage. The navigation still works; only the focus hand-off is lost.
  }
}

/** Returns true once for the slug the shelf opened, and forgets it. */
export const takeOpenedFromShelf = (slug: string): boolean => {
  try {
    if (sessionStorage.getItem(KEY) !== slug) return false
    sessionStorage.removeItem(KEY)
    return true
  } catch {
    return false
  }
}
