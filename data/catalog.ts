import type { Movie } from '@/types'

export const CATALOG: Movie[] = [
  // ── ROMANTIC ──────────────────────────────────────────────
  {
    title: "To All the Boys I've Loved Before",
    score: 8.4, desc: "A shy teen's secret love letters get mailed out, forcing her to confront feelings she never planned to share.",
    duration: 99, tags: ['Netflix Original', 'Teen Romance'],
    reason: 'Warm, soft-paced, and charming — great for a cozy evening.', category: 'romantic',
  },
  {
    title: 'Set It Up', score: 8.1,
    desc: 'Two exhausted assistants team up to set their bosses up, only to find unexpected sparks of their own.',
    duration: 105, tags: ['Romcom', 'Netflix Original'],
    reason: 'Witty dialogue and genuine chemistry — a modern romcom done right.', category: 'romantic',
  },
  {
    title: 'The Proposal', score: 8.2,
    desc: 'A Canadian executive forces her assistant to marry her to avoid deportation, then heads home to meet his family.',
    duration: 108, tags: ['Classic Romcom', 'Sandra Bullock'],
    reason: 'A timeless feel-good formula with effortless charisma.', category: 'romantic',
  },
  {
    title: 'Always Be My Maybe', score: 8.0,
    desc: 'Childhood sweethearts reconnect as adults after years of drifting apart — with a hilarious cameo midway.',
    duration: 101, tags: ['Netflix Original', 'Romcom'],
    reason: 'Sweet, funny, and endearingly real.', category: 'romantic',
  },
  {
    title: 'Palm Springs', score: 8.6,
    desc: 'Two strangers get stuck in an infinite time loop at a desert wedding — with refreshingly honest results.',
    duration: 90, tags: ['Romcom', 'Sci-Fi Lite'],
    reason: 'Smart, sweet, and funnier than it has any right to be.', category: 'romantic',
  },
  {
    title: 'Bridgerton S1', score: 8.7,
    desc: 'In Regency-era London, the eldest Bridgerton daughter enters the marriage season searching for love.',
    duration: 450, tags: ['Series', 'Period Drama'],
    reason: 'Lush and romantic — perfect for a long cozy night in.', category: 'romantic',
  },

  // ── THRILLER ──────────────────────────────────────────────
  {
    title: 'Knives Out', score: 9.1,
    desc: "When a renowned mystery novelist turns up dead, a sharp detective unravels a web of family secrets.",
    duration: 130, tags: ['Whodunit', 'Mystery'],
    reason: 'Perfectly layered — every scene recontextualizes the last.', category: 'thriller',
  },
  {
    title: 'Parasite', score: 9.5,
    desc: 'A poor family infiltrates the lives of a wealthy household with increasingly high-stakes consequences.',
    duration: 132, tags: ['Award Winner', 'Dark'],
    reason: "Masterfully tense — you won't see the turns coming.", category: 'thriller',
  },
  {
    title: 'Gone Girl', score: 8.7,
    desc: "On their 5th anniversary, Nick Dunne's wife disappears, and the investigation reveals shocking secrets.",
    duration: 149, tags: ['Psychological', 'David Fincher'],
    reason: 'Cold, slick, and deeply unsettling in the best way.', category: 'thriller',
  },
  {
    title: 'Searching', score: 8.3,
    desc: "A father's daughter goes missing and he investigates by rifling through her online life — told entirely through screens.",
    duration: 101, tags: ['Unique Format', 'Mystery'],
    reason: 'Gripping and cleverly told — a genuinely fresh take.', category: 'thriller',
  },
  {
    title: 'The Invisible Man', score: 8.2,
    desc: "After her abusive ex apparently dies, a woman suspects his 'death' is part of something far more sinister.",
    duration: 124, tags: ['Modern Horror-Thriller'],
    reason: 'Paranoid and relentlessly tense.', category: 'thriller',
  },
  {
    title: 'Ozark S1', score: 9.0,
    desc: 'A financial adviser is forced to launder money for a Mexican cartel, relocating his family to the Ozarks.',
    duration: 540, tags: ['Series', 'Crime Drama'],
    reason: 'Unrelentingly tense with meticulous plotting.', category: 'thriller',
  },

  // ── COMEDY ──────────────────────────────────────────────
  {
    title: 'The Grand Budapest Hotel', score: 8.9,
    desc: "A legendary hotel concierge becomes embroiled in the theft of a priceless painting — told with Wes Anderson's signature wit.",
    duration: 99, tags: ['Wes Anderson', 'Quirky'],
    reason: 'Visually delightful and endlessly quotable.', category: 'funny',
  },
  {
    title: 'Game Night', score: 8.3,
    desc: "A group of friends' game night turns unexpectedly real when a mystery game involves an actual kidnapping.",
    duration: 100, tags: ['Comedy Thriller', 'Crowd-Pleaser'],
    reason: 'Genuinely funny with a sharper edge than expected.', category: 'funny',
  },
  {
    title: 'What We Do in the Shadows', score: 8.9,
    desc: 'A documentary crew follows a flat of vampire flatmates trying to navigate modern life in New Zealand.',
    duration: 86, tags: ['Mockumentary', 'Cult Classic'],
    reason: 'Endlessly funny and surprisingly warm.', category: 'funny',
  },
  {
    title: 'Murder Mystery', score: 7.5,
    desc: 'A New York cop takes his wife on a delayed honeymoon where a murder puts them in the middle of a case.',
    duration: 97, tags: ['Netflix', 'Easy Watch'],
    reason: 'Breezy and fun — exactly what it promises to be.', category: 'funny',
  },
  {
    title: 'Brooklyn Nine-Nine S1', score: 8.8,
    desc: 'A lovable but unorthodox detective joins a new commanding officer at a New York police precinct.',
    duration: 240, tags: ['Series', 'Feel-Good'],
    reason: 'Warm ensemble comedy with zero bad episodes.', category: 'funny',
  },

  // ── ACTION ──────────────────────────────────────────────
  {
    title: "Mad Max: Fury Road", score: 9.2,
    desc: 'In a post-apocalyptic wasteland, a woman rebels against a tyrant while two fugitives travel together.',
    duration: 120, tags: ['Visual Spectacle', 'Award Winner'],
    reason: 'Two hours of pure kinetic energy — unmissable.', category: 'action',
  },
  {
    title: 'John Wick', score: 8.8,
    desc: 'A retired hitman seeks vengeance after thieves kill his dog and steal his car.',
    duration: 101, tags: ['Action Masterclass'],
    reason: 'Immaculate choreography, relentless pace.', category: 'action',
  },
  {
    title: 'The Old Guard', score: 7.9,
    desc: 'A covert team of immortal mercenaries discover someone knows their secret and fight to protect their new recruit.',
    duration: 125, tags: ['Netflix', 'Action-Fantasy'],
    reason: 'Fun, grounded, and anchored by a great cast.', category: 'action',
  },
  {
    title: 'Extraction', score: 7.7,
    desc: 'A black-market mercenary is hired to rescue the kidnapped son of an international crime lord in Bangladesh.',
    duration: 116, tags: ['Netflix Original', 'Action'],
    reason: 'Kinetic and well-shot with a standout long-take sequence.', category: 'action',
  },

  // ── HORROR ──────────────────────────────────────────────
  {
    title: 'Get Out', score: 9.1,
    desc: "A young Black man visits his white girlfriend's family estate and discovers deeply disturbing secrets.",
    duration: 104, tags: ['Social Horror', 'Award Winner'],
    reason: 'Smart, layered, and genuinely frightening in the best way.', category: 'horror',
  },
  {
    title: 'Hereditary', score: 8.8,
    desc: "After a family's matriarch dies, disturbing secrets about the family's ancestry are unearthed.",
    duration: 127, tags: ['Slow Burn', 'A24'],
    reason: 'Devastating and deeply unsettling — horror at its most serious.', category: 'horror',
  },
  {
    title: 'A Quiet Place', score: 8.5,
    desc: 'A family tries to survive in a world inhabited by blind monsters with an extremely acute sense of hearing.',
    duration: 90, tags: ['Tense', 'Crowd-Pleaser'],
    reason: 'Brilliantly crafted suspense with real emotional stakes.', category: 'horror',
  },
  {
    title: 'Midsommar', score: 8.6,
    desc: 'A grieving woman and her friends travel to a Swedish midsummer festival that reveals a dark cult.',
    duration: 148, tags: ['Folk Horror', 'Ari Aster'],
    reason: 'Unsettling in broad daylight — a true original.', category: 'horror',
  },
  {
    title: 'The Haunting of Hill House', score: 9.0,
    desc: 'A family confronts haunting memories of the strange house that changed their lives — told across two timelines.',
    duration: 600, tags: ['Series', 'Netflix'],
    reason: 'Emotionally devastating as much as it is scary.', category: 'horror',
  },

  // ── DRAMA ──────────────────────────────────────────────
  {
    title: 'The Shawshank Redemption', score: 9.7,
    desc: 'Two imprisoned men bond over years finding solace and redemption through acts of common decency.',
    duration: 142, tags: ['All-Time Classic', 'Feel-Good Drama'],
    reason: "Timeless. One of cinema's most uplifting stories.", category: 'drama',
  },
  {
    title: 'Marriage Story', score: 8.8,
    desc: 'A stage director and actress navigate a complicated, coast-to-coast divorce and its effect on their family.',
    duration: 136, tags: ['Netflix Original', 'Emotional'],
    reason: 'Devastating and beautifully observed — brings the tears.', category: 'drama',
  },
  {
    title: 'Minari', score: 8.9,
    desc: 'A Korean-American family moves to rural Arkansas in the 1980s to build a farm and pursue the American dream.',
    duration: 115, tags: ['A24', 'Award Winner'],
    reason: 'Tender, quiet, and genuinely moving.', category: 'drama',
  },
  {
    title: 'Spotlight', score: 9.0,
    desc: 'True story of the Boston Globe team that uncovered the massive child abuse scandal within the local Catholic Church.',
    duration: 129, tags: ['True Story', 'Award Winner'],
    reason: "Gripping journalism — one of the decade's best films.", category: 'drama',
  },
  {
    title: 'The Crown S1', score: 9.1,
    desc: 'The inside story of two of the most famous addresses in the world — Buckingham Palace and 10 Downing Street.',
    duration: 540, tags: ['Series', 'Historical'],
    reason: 'Lavishly crafted and endlessly compelling.', category: 'drama',
  },

  // ── SCI-FI ──────────────────────────────────────────────
  {
    title: 'Arrival', score: 9.0,
    desc: 'A linguist is recruited by the military to communicate with alien visitors before time runs out.',
    duration: 116, tags: ['Thoughtful Sci-Fi', 'Amy Adams'],
    reason: 'Quietly devastating — recontextualizes everything on rewatch.', category: 'scifi',
  },
  {
    title: 'Ex Machina', score: 8.9,
    desc: 'A programmer is selected to evaluate the human qualities of a highly advanced humanoid AI robot.',
    duration: 108, tags: ['A24', 'Psychological'],
    reason: 'Cold, tense, and uncomfortably plausible.', category: 'scifi',
  },
  {
    title: 'Interstellar', score: 9.1,
    desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    duration: 169, tags: ['Christopher Nolan', 'Epic'],
    reason: 'Breathtaking in scale, emotionally overwhelming.', category: 'scifi',
  },
  {
    title: 'Dark S1', score: 9.3,
    desc: 'A missing child sets four interconnected families on a frantic hunt for answers as they unearth a time travel conspiracy.',
    duration: 480, tags: ['Series', 'German', 'Mind-Bending'],
    reason: 'Among the most intricate TV ever made. Start here.', category: 'scifi',
  },
  {
    title: 'Blade Runner 2049', score: 8.7,
    desc: "A new blade runner discovers a long-buried secret that has the potential to plunge what's left of society into chaos.",
    duration: 164, tags: ['Visual Masterpiece', 'Denis Villeneuve'],
    reason: 'Stately and gorgeous — a slow burn that rewards patience.', category: 'scifi',
  },

  // ── ANIMATION ──────────────────────────────────────────────
  {
    title: "Spider-Man: Into the Spider-Verse", score: 9.3,
    desc: 'Miles Morales becomes Spider-Man and teams up with alternate versions of the hero from across the multiverse.',
    duration: 117, tags: ['Award Winner', 'All Ages'],
    reason: 'The most visually inventive animated film in decades.', category: 'animation',
  },
  {
    title: 'Your Name', score: 9.2,
    desc: 'Two strangers find they are mysteriously body-swapping while sleeping, leading them on a search for each other.',
    duration: 106, tags: ['Anime', 'Emotional'],
    reason: 'Heartbreakingly beautiful — keeps you thinking for days.', category: 'animation',
  },
  {
    title: 'Spirited Away', score: 9.4,
    desc: 'A sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits in this timeless adventure.',
    duration: 125, tags: ['Studio Ghibli', 'All-Time Classic'],
    reason: 'Imagination at its absolute peak. Perfect for any mood.', category: 'animation',
  },
  {
    title: 'Klaus', score: 8.8,
    desc: 'A selfish postal student is forced to work in a frozen town, where he befriends a reclusive toymaker.',
    duration: 97, tags: ['Netflix Original', 'Feel-Good'],
    reason: 'Warm and visually stunning — a new holiday classic.', category: 'animation',
  },
  {
    title: 'Arcane S1', score: 9.5,
    desc: 'Set in the utopian city of Piltover and the gritty underworld below it, two sisters are torn apart in a time of conflict.',
    duration: 560, tags: ['Series', 'Netflix', 'Stunning Visuals'],
    reason: 'Possibly the most beautiful animated series ever made.', category: 'animation',
  },
]
