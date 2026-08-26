// Prompt catalogue for scripts/gen-images.mjs. One entry per asset referenced by src/data/*.ts.
// Style rules shared by every prompt: photorealistic unless noted, Japanese setting near Lake Kasumigaura
// (Ibaraki), soft natural light, colors that sit well with navy #005099 and beige #F5F3EC, no readable text,
// no identifiable faces (people seen from behind, at a distance, or out of focus).

const LANDSCAPE = 'landscape 1536x1024'
const SQUARE = 'square 1024x1024'

const scene = (text) =>
  `Photorealistic, editorial photography style, high detail, soft natural light, natural colors harmonizing with navy blue and warm beige. ${text}`

export const ASSETS = [
  // ---- hero ------------------------------------------------------------
  {
    name: 'hero-intro',
    size: LANDSCAPE,
    prompt: scene(
      'Wide view of Lake Kasumigaura at early morning: calm blue water with soft mist, far shore with low green hills and lotus fields, one or two tiny sailboats far away. On the right third, a modern Japanese public high school building with a small clock tower partly hidden behind zelkova trees. Keep the left third uncluttered (water and sky) so white headline text can be overlaid. No people.',
    ),
  },
  {
    name: 'hero-01',
    size: LANDSCAPE,
    prompt: scene(
      'Alumni reunion mood: a long wooden table set for a gathering in a bright school hall, paper name cards blank, warm afternoon light through tall windows, a few adults seen from behind chatting near the windows. No faces visible.',
    ),
  },
  {
    name: 'hero-02',
    size: LANDSCAPE,
    prompt: scene(
      'Annual events: a Japanese high school sports field on a festival day, colorful flags and tents, small distant figures of students and families, blue sky with soft clouds, lake glimpsed beyond the trees. Faces not identifiable.',
    ),
  },
  {
    name: 'hero-03',
    size: LANDSCAPE,
    prompt: scene(
      'Newsletter and news: a neatly stacked pile of printed booklets and envelopes on a wooden desk beside a window overlooking a lake, a pen and reading glasses, soft morning light. The booklet covers are plain navy and beige with no readable text.',
    ),
  },
  {
    name: 'hero-04',
    size: LANDSCAPE,
    prompt: scene(
      'Support and membership: close-up of many hands of different ages stacked together in a circle of encouragement, outdoors in front of a lakeside school, shallow depth of field, warm light. No faces.',
    ),
  },
  {
    name: 'hero-05',
    size: LANDSCAPE,
    prompt: scene(
      'The school today: a bright modern Japanese high school entrance with glass doors and a clock, cherry trees in fresh green leaf, a bicycle parking area, students walking away from the camera in uniform, morning light. No faces.',
    ),
  },
  {
    name: 'hero-06',
    size: LANDSCAPE,
    prompt: scene(
      'Contact: a calm school office reception counter with a landline telephone, a small potted plant and a notebook, sunlight from a window overlooking a lake, minimal and tidy. No people, no readable text.',
    ),
  },
  // ---- sections ------------------------------------------------------------
  {
    name: 'about',
    size: LANDSCAPE,
    prompt: scene(
      'A small group of Japanese adults of mixed ages (30s to 70s) walking together away from the camera along a school path lined with cherry trees in green leaf toward a school building, chatting warmly, casual smart clothing, gentle backlight. No faces visible.',
    ),
  },
  {
    name: 'history-01',
    size: SQUARE,
    prompt: scene(
      'A dignified older Japanese school building facade with a clock, seen through zelkova trees, soft golden hour light, nostalgic mood, slight film grain. No people.',
    ),
  },
  {
    name: 'history-02',
    size: SQUARE,
    prompt: scene(
      'Close-up of an old leather-bound photo album and a brass school badge on a wooden desk, warm side light, shallow depth of field. No readable text.',
    ),
  },
  {
    name: 'history-03',
    size: SQUARE,
    prompt: scene(
      'A rowing boat gliding on Lake Kasumigaura at dawn, rowers seen from far behind, mist over the water, low sun. No faces.',
    ),
  },
  {
    name: 'history-04',
    size: LANDSCAPE,
    prompt: scene(
      'Lakeside school campus in golden hour: school building, trees and the wide lake, a path along the shore, nostalgic warm tones. No people.',
    ),
  },
  {
    name: 'gallery',
    size: LANDSCAPE,
    prompt: scene(
      'Wide view of a Japanese high school campus beside a large lake: white school building, wide sports ground with tiny distant students in uniform, the lake and a bright blue sky with cumulus clouds beyond, late afternoon light. Keep the right 60% calm (sky and lake) so white text can be overlaid.',
    ),
  },
  {
    name: 'cta',
    size: LANDSCAPE,
    prompt: scene(
      'Abstract warm banner background: soft beige and sand gradient with gentle out-of-focus lake reflections and bokeh, calm and minimal, room for white text on the left. No objects, no people.',
    ),
  },
  // ---- gallery photos (modal grid) ----------------------------------------
  {
    name: 'photo-01',
    size: LANDSCAPE,
    prompt: scene('Japanese high school building exterior with a clock tower under a clear sky, cherry trees, no people.'),
  },
  {
    name: 'photo-02',
    size: LANDSCAPE,
    prompt: scene('School sports day: relay runners seen from behind on a red track, cheering crowd blurred in the distance, colorful flags. No faces.'),
  },
  {
    name: 'photo-03',
    size: LANDSCAPE,
    prompt: scene('School cultural festival: hallway decorated with paper garlands and lanterns, students from behind in uniform, warm afternoon light. No faces, no readable text.'),
  },
  {
    name: 'photo-04',
    size: LANDSCAPE,
    prompt: scene('Club activity: brass band instruments on chairs in a music room with sheet music stands, golden light through windows. No people.'),
  },
  {
    name: 'photo-05',
    size: LANDSCAPE,
    prompt: scene('Graduation day: rows of empty wooden chairs in a school gymnasium decorated with flowers and ribbons, morning light. No people, no readable text.'),
  },
  {
    name: 'photo-06',
    size: LANDSCAPE,
    prompt: scene('Alumni general meeting: a hotel banquet hall with round tables, white tablecloths and flower centerpieces, adults seen from behind mingling. No faces.'),
  },
  // ---- news cards (5 generated, reused cyclically for 10 cards) --------------
  {
    name: 'news-01',
    size: LANDSCAPE,
    prompt: scene('A freshly printed newsletter booklet with a plain navy cover lying on a beige desk beside a cup of tea, top-down view. No readable text.'),
  },
  {
    name: 'news-02',
    size: LANDSCAPE,
    prompt: scene('Banquet hall prepared for a general meeting: podium, rows of chairs, flowers, warm lighting. No people, no readable text.'),
  },
  {
    name: 'news-03',
    size: LANDSCAPE,
    prompt: scene('Reunion dinner table with glasses raised in a toast, hands only, warm restaurant lighting, shallow depth of field. No faces.'),
  },
  {
    name: 'news-04',
    size: LANDSCAPE,
    prompt: scene('A Japanese mailbox and a stack of change-of-address postcards on a wooden table, soft daylight. No readable text.'),
  },
  {
    name: 'news-05',
    size: LANDSCAPE,
    prompt: scene('Lake Kasumigaura shoreline path with cherry blossoms in full bloom and a school building far away, spring morning. No people.'),
  },
  // ---- lineup card illustrations (transparent, flat) ------------------------
  {
    name: 'card-01',
    size: SQUARE,
    prompt: 'Flat vector-style illustration on a fully transparent background: a school building with a clock tower, two-tone navy blue (#005099) and light blue, minimal, centered, generous margins. Icon style, no text.',
  },
  {
    name: 'card-02',
    size: SQUARE,
    prompt: 'Flat vector-style illustration on a fully transparent background: a calendar page with a small flag marker, two-tone navy blue (#005099) and light blue, minimal, centered, generous margins. Icon style, no text.',
  },
  {
    name: 'card-03',
    size: SQUARE,
    prompt: 'Flat vector-style illustration on a fully transparent background: a folded newsletter booklet with an envelope, two-tone navy blue (#005099) and light blue, minimal, centered, generous margins. Icon style, no text.',
  },
  {
    name: 'card-04',
    size: SQUARE,
    prompt: 'Flat vector-style illustration on a fully transparent background: two people figures side by side with a heart above them, two-tone navy blue (#005099) and light blue, minimal, centered, generous margins. Icon style, no text.',
  },
  {
    name: 'card-05',
    size: SQUARE,
    prompt: 'Flat vector-style illustration on a fully transparent background: a lakeside school with a small sailboat and a sun, two-tone navy blue (#005099) and light blue, minimal, centered, generous margins. Icon style, no text.',
  },
  {
    name: 'card-06',
    size: SQUARE,
    prompt: 'Flat vector-style illustration on a fully transparent background: an envelope with a speech bubble, two-tone navy blue (#005099) and light blue, minimal, centered, generous margins. Icon style, no text.',
  },
]
