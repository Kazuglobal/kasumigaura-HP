// Prompt catalogue for the "卒業生紹介" (alumni stories) feature, consumed by scripts/gen-images.mjs
// through scripts/image-prompts.mjs.
//
// Two families:
//   story-cover-XX  … book jacket art. NO text, NO faces, NO white border. A rectangle of each
//                     jacket is fully covered by the portrait at composite time, so the prompt tells
//                     the model that area is hidden and the design must work OUTSIDE it.
//   story-photo-XX  … the portrait itself. Placeholder people; real alumni photos replace these.
//
// Each cover gets its own time of day, colour temperature and medium so the six do not read as one
// series in different colours.

const COVER = 'portrait 1024x1536'
const PORTRAIT = 'portrait 1024x1280'

const jacket = (hidden, text) =>
  [
    'Book jacket artwork for a Japanese hardcover book, printed on uncoated paper, visible paper grain.',
    `${hidden} A photograph is pasted over that area at print time, so whatever is painted there is completely hidden — do not try to keep it empty, and do not build the composition around it.`,
    'The design must stand on its own OUTSIDE that area.',
    text,
    'Colours must sit well beside navy blue #005099 and warm beige #F5F3EC.',
    'Absolutely no text, no letters, no numbers, no logos, no signatures, no watermark.',
    'No people, no faces, not even distant silhouettes.',
    'No white border, no frame, no matting — the artwork bleeds to all four edges.',
    'Not flat vector art and not a line drawing.',
  ].join(' ')

const person = (text) =>
  [
    'Photorealistic editorial portrait of a Japanese adult, waist up, looking towards the camera,',
    'natural available light, shallow depth of field, calm neutral expression, plain uncluttered background,',
    'colours harmonizing with navy blue and warm beige.',
    text,
    'Head placed in the upper third of the frame with room above. No text, no logos, no watermark.',
  ].join(' ')

export const STORY_ASSETS = [
  // ---- jackets ---------------------------------------------------------
  {
    name: 'story-cover-01',
    size: COVER,
    prompt: jacket(
      'The top 55% of the canvas is hidden.',
      'Cold blue dawn over a shallow lake seen from the shore: watercolour on rough paper, wet washes bleeding into each other, reed stems and ripple lines drawn with a fine brush, a glass sampling bottle lying in the grass at the lower edge.',
    ),
  },
  {
    name: 'story-cover-02',
    size: COVER,
    prompt: jacket(
      'The bottom 58% of the canvas is hidden.',
      'Warm amber evening inside a small bakery workshop: oil painting with thick visible brush strokes, copper bowls, a wooden peel and a dusting of flour catching low tungsten light against a deep brown wall.',
    ),
  },
  {
    name: 'story-cover-03',
    size: COVER,
    prompt: jacket(
      'The right 60% of the canvas, full height, is hidden.',
      'Bright neutral morning in a school music room: coloured pencil and gouache, pale green walls, a music stand, a brass bell curve catching daylight, a window casting long clean rectangles of light on the floor.',
    ),
  },
  {
    name: 'story-cover-04',
    size: COVER,
    prompt: jacket(
      'A large square in the middle of the canvas, from 14% to 86% across and 18% to 74% down, is hidden.',
      'Hard midday sun on a boatyard by the water: photorealistic close texture of heavy cream sailcloth, hand stitching, brass eyelets and a coil of rope, strong shadows, salt-bleached blue-grey timber at the edges.',
    ),
  },
  {
    name: 'story-cover-05',
    size: COVER,
    prompt: jacket(
      'A circular area in the upper middle of the canvas, centred at 50% across and 36% down with a radius of about 32% of the width, is hidden.',
      'Indigo pre-dawn over a lotus field: Japanese woodblock print feeling, flat layered indigo and teal, broad lotus leaves in silhouette, a thin band of pale gold at the horizon, mist between the stems.',
    ),
  },
  {
    name: 'story-cover-06',
    size: COVER,
    prompt: jacket(
      'The right 70% of the canvas, from 10% to 78% down, is hidden.',
      'Late night studio abstraction: airbrushed deep charcoal and violet gradients with fine horizontal bands of light suggesting a sound waveform, small cool cyan highlights, grainy risograph-like texture.',
    ),
  },
  // ---- portraits (placeholders) ---------------------------------------
  {
    name: 'story-photo-01',
    size: PORTRAIT,
    prompt: person(
      'Woman in her early thirties, short hair, thin-framed glasses, navy field jacket over a grey shirt, standing outdoors by a lake in soft morning light.',
    ),
  },
  {
    name: 'story-photo-02',
    size: PORTRAIT,
    prompt: person(
      'Man in his late thirties, cropped hair, white baker jacket with sleeves rolled up, standing in a warm dim workshop, low tungsten light from the side.',
    ),
  },
  {
    name: 'story-photo-03',
    size: PORTRAIT,
    prompt: person(
      'Woman in her late twenties, hair tied back, beige cardigan over a white blouse, standing in a bright classroom by a window, soft daylight.',
    ),
  },
  {
    name: 'story-photo-04',
    size: PORTRAIT,
    prompt: person(
      'Man in his fifties, weathered face, short grey hair, indigo work shirt, standing in a boatyard under strong midday sun.',
    ),
  },
  {
    name: 'story-photo-05',
    size: PORTRAIT,
    prompt: person(
      'Woman in her forties, shoulder-length hair, pale blue medical scrubs, standing in a quiet corridor at dawn, cool even light.',
    ),
  },
  {
    name: 'story-photo-06',
    size: PORTRAIT,
    prompt: person(
      'Man in his early twenties, longer hair, black hoodie over a dark tee, seated at a desk in a dim studio, cool blue key light from one side.',
    ),
  },
]
