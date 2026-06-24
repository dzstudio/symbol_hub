/**
 * 8 category definitions with subcategories
 * icon: key into categoryIcons map (Lucide SVG)
 * subs[].nameKey: i18n key for subcategory display name
 */
export const categories = [
  {
    id: 'common',
    icon: 'common',
    subs: [
      { id: 'digits', nameKey: 'sub.digits' },
      { id: 'punctuation', nameKey: 'sub.punctuation' }
    ]
  },
  {
    id: 'math',
    icon: 'math',
    subs: [
      { id: 'basicOp', nameKey: 'sub.basicOp' },
      { id: 'compare', nameKey: 'sub.compare' },
      { id: 'setLogic', nameKey: 'sub.setLogic' },
      { id: 'calculus', nameKey: 'sub.calculus' },
      { id: 'geometry', nameKey: 'sub.geometry' }
    ]
  },
  {
    id: 'graphics',
    icon: 'graphics',
    subs: [
      { id: 'arrows', nameKey: 'sub.arrows' },
      { id: 'stars', nameKey: 'sub.stars' },
      { id: 'shapes', nameKey: 'sub.shapes' },
      { id: 'lines', nameKey: 'sub.lines' },
      { id: 'borders', nameKey: 'sub.borders' }
    ]
  },
  {
    id: 'typography',
    icon: 'typography',
    subs: [
      { id: 'circled', nameKey: 'sub.circled' },
      { id: 'supSub', nameKey: 'sub.supSub' },
      { id: 'fancy', nameKey: 'sub.fancy' }
    ]
  },
  {
    id: 'units',
    icon: 'units',
    subs: [
      { id: 'currency', nameKey: 'sub.currency' },
      { id: 'music', nameKey: 'sub.music' },
      { id: 'chess', nameKey: 'sub.chess' },
      { id: 'tech', nameKey: 'sub.tech' }
    ]
  },
  {
    id: 'popular',
    icon: 'popular',
    subs: [
      { id: 'nickname', nameKey: 'sub.nickname' },
      { id: 'hearts', nameKey: 'sub.hearts' },
      { id: 'emojiAll', nameKey: 'sub.emojiAll' }
    ]
  },
  {
    id: 'emoji',
    icon: 'emoji',
    subs: [
      { id: 'faces', nameKey: 'sub.faces' },
      { id: 'gestures', nameKey: 'sub.gestures' },
      { id: 'animals', nameKey: 'sub.animals' },
      { id: 'food', nameKey: 'sub.food' },
      { id: 'weather', nameKey: 'sub.weather' }
    ]
  },
  {
    id: 'world',
    icon: 'world',
    subs: [
      { id: 'greek', nameKey: 'sub.greek' },
      { id: 'japanese', nameKey: 'sub.japanese' },
      { id: 'korean', nameKey: 'sub.korean' },
      { id: 'braille', nameKey: 'sub.braille' }
    ]
  }
]
