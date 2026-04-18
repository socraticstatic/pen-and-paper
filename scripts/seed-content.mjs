#!/usr/bin/env node
/**
 * Seed script for Pen & Paper Phase 1 content.
 *
 * Usage:
 *   node scripts/seed-content.mjs
 *
 * Requires a running dev server at NEXT_PUBLIC_SITE_URL (default: http://localhost:3000)
 * and a seeded admin user. Reads credentials from SEED_EMAIL / SEED_PASSWORD env vars,
 * or falls back to the dev defaults.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const EMAIL = process.env.SEED_EMAIL ?? 'admin@penandpaper.test';
const PASSWORD = process.env.SEED_PASSWORD ?? 'admin123!';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toRichText(text) {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((para) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
            text: para,
          },
        ],
      })),
    },
  };
}

async function api(path, opts = {}) {
  const { headers: extraHeaders, ...restOpts } = opts;
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(extraHeaders ?? {}) },
    ...restOpts,
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`${opts.method ?? 'GET'} ${path} → ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function login() {
  const data = await api('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  return data.token;
}

async function upsert(collection, slug, payload, token, lookupField = 'slug') {
  const headers = { Authorization: `JWT ${token}` };
  const lookupValue = lookupField === 'slug' ? slug : payload[lookupField];

  // Check if it already exists by lookupField
  const search = await fetch(
    `${BASE_URL}/api/${collection}?where[${lookupField}][equals]=${encodeURIComponent(lookupValue)}&limit=1`,
    { headers },
  );
  const found = await search.json();

  if (found.docs?.length > 0) {
    const id = found.docs[0].id;
    console.log(`  update  ${collection}/${id} (${lookupField}=${lookupValue})`);
    const updated = await api(`/${collection}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload),
    });
    return updated.doc ?? updated;
  }

  console.log(`  create  ${collection} (${slug})`);
  const created = await api(`/${collection}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return created.doc ?? created;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PENS = [
  { make: 'Pilot', model: 'Metropolitan', slug: 'pilot-metropolitan' },
  { make: 'LAMY', model: 'Safari', slug: 'lamy-safari' },
  { make: 'Kaweco', model: 'Classic Sport', slug: 'kaweco-classic-sport' },
  { make: 'Pilot', model: 'Kakuno', slug: 'pilot-kakuno' },
  { make: 'TWSBI', model: 'Eco', slug: 'twsbi-eco' },
  { make: 'Sailor', model: 'Pro Gear Slim', slug: 'sailor-pro-gear-slim' },
  { make: 'Platinum', model: '3776 Century', slug: 'platinum-3776-century' },
  { make: 'Pelikan', model: 'Souveran M400', slug: 'pelikan-souveran-m400' },
];

const PAPERS = [
  { mill: 'Clairefontaine', line: 'Triomphe', slug: 'clairefontaine-triomphe' },
  { mill: 'Rhodia', line: 'Dot Pad', slug: 'rhodia-dot-pad' },
  { mill: 'Tomoe River', line: 'S', slug: 'tomoe-river-s' },
  { mill: 'Life', line: 'Noble', slug: 'life-noble' },
  { mill: 'Leuchtturm1917', line: 'Medium A5', slug: 'leuchtturm1917-medium-a5' },
  { mill: 'Midori', line: 'MD', slug: 'midori-md' },
  { mill: 'Maruman', line: 'Mnemosyne', slug: 'maruman-mnemosyne' },
  { mill: 'G. Lalo', line: 'Verge de France', slug: 'g-lalo-verge-de-france' },
];

// Indexed by pen slug -> affiliate URL from research
const PEN_URLS = {
  'pilot-metropolitan': 'https://www.jetpens.com/Pilot-Metropolitan-Collection-Fountain-Pen-Black-Plain-Medium-Nib/pd/12385',
  'lamy-safari': 'https://www.jetpens.com/LAMY-Safari-Fountain-Pen-Charcoal-Fine-Nib/pd/1951',
  'kaweco-classic-sport': 'https://www.jetpens.com/Kaweco-Classic-Sport-Fountain-Pen-Black-Extra-Fine-Nib/pd/6122',
  'twsbi-eco': 'https://www.jetpens.com/TWSBI-ECO-Black-Fountain-Pen-Stub-1.1-mm-Nib/pd/14664',
  'sailor-pro-gear-slim': 'https://www.jetpens.com/Sailor-Professional-Gear-Slim-Fountain-Pen-Black-with-Gold-Trim-14k-Medium-Fine-Nib/pd/31666',
  'pelikan-souveran-m400': 'https://www.amazon.com/dp/B001B27IPO',
};

const PAPER_URLS = {
  'clairefontaine-triomphe': 'https://www.jetpens.com/Clairefontaine-Triomphe-Pad-A5-Blank-50-Sheets/pd/5155',
  'rhodia-dot-pad': 'https://www.jetpens.com/Rhodia-DotPad-No.-16-A5-Dot-Grid-Black/pd/8191',
  'tomoe-river-s': 'https://www.jetpens.com/Tomoe-River-S-FP-Loose-Sheet-Paper-A5-White-100-Sheets/pd/35659',
  'midori-md': 'https://www.jetpens.com/Midori-MD-Notebook-A5-Grid/pd/13607',
  'g-lalo-verge-de-france': 'https://www.bottleandplume.com/products/g-lalo-verge-de-france-stationery-tablet-a5',
};

// Specimens reference pen/paper by slug; IDs are resolved after creation.
const SPECIMENS = [
  {
    specimenNumber: 1,
    title: 'The Weight of Brass on Vellum',
    subtitle: 'A firm nib meets a surface that lets ink breathe',
    slug: 'the-weight-of-brass-on-vellum',
    stage: 'first-pen',
    acquired: '2022-03-15T00:00:00.000Z',
    published: '2022-04-01T00:00:00.000Z',
    penSlug: 'pilot-metropolitan',
    paperSlug: 'clairefontaine-triomphe',
    ink: {
      maker: 'Pilot',
      color: 'Iroshizuku Tsuki-yo',
      notes: 'Wet, shades from teal to deep blue-gray. Long dry time on Triomphe.',
    },
    essay: `The Metropolitan is heavier than it looks. Brass body, lacquered finish, cap that snaps cleanly. You notice the weight when you pick it up coming from ballpoints. It settles the hand.

The step-down at the grip section is real. If you choke up on your pen you feel it after an hour. If you hold higher it disappears. Either way, the medium steel nib moves across Triomphe paper without catching anything. It glides.

Triomphe is 90gsm and heavily sized, which means ink sits on top of the fibers rather than soaking in. That makes it slow to dry - allow 15 seconds with a wet ink or you will smear. The tradeoff: ink shades as it pools at the end of each loop. Tsuki-yo in particular goes from a warm blue-gray to a deeper slate depending on how much ink was on the nib at each stroke.

No show-through. Both sides of the sheet are usable, which you don't take for granted. The combination is not fast. It rewards slow writing - letters, notes worth keeping.

A Sunday afternoon, a well-lit desk, something formal to say. That's where this pairing makes sense.`,
    pairingRationale: `The Metropolitan's firm steel nib writes at a consistent pressure that suits Triomphe's slow-absorbing surface. A softer or wetter nib would leave too much ink on the page; a drier nib would lose the shading that makes Triomphe interesting. They calibrate each other without either one demanding anything special.`,
    affiliateOverrides: {
      penUrl: PEN_URLS['pilot-metropolitan'],
      paperUrl: PAPER_URLS['clairefontaine-triomphe'],
    },
  },
  {
    specimenNumber: 2,
    title: 'Fast Work',
    subtitle: 'Dry ink, dot grid, no ceremony',
    slug: 'fast-work',
    stage: 'first-pen',
    acquired: '2022-09-08T00:00:00.000Z',
    published: '2022-10-01T00:00:00.000Z',
    penSlug: 'lamy-safari',
    paperSlug: 'rhodia-dot-pad',
    ink: {
      maker: 'LAMY',
      color: 'Blue',
      notes: 'Dry, quick, consistent. No shading. Dries in under 8 seconds on Rhodia.',
    },
    essay: `The Safari is loud design with a clear reason. The triangular grip forces a tripod hold, which is either a correction or an annoyance depending on how you grip. ABS plastic, nearly indestructible, snap cap. It's not a subtle object but it's honest about what it is.

The fine nib writes wider than its label suggests - this is a German fine, not a Japanese one. On Rhodia 80gsm paper it puts down a consistent, dry line. LAMY Blue dries in under 8 seconds on Rhodia. That matters if you're taking notes in a meeting where you can't wait to close the pad.

Rhodia's satin finish is smooth enough that the nib never catches, slightly absorbent enough that the ink doesn't puddle. The dot grid is faint - you can write across it or align to it; it doesn't insist. The micro-perforated pages tear out cleanly, which turns out to be useful more often than you'd expect.

This pairing does one thing: gets words down fast without requiring anything of you. Not a performance. A work tool. The kind of thing you use without thinking about it, which is the point.`,
    pairingRationale: `LAMY Blue is a dry ink. On most papers that can make a fine nib feel slightly scratchy; Rhodia's smooth surface compensates, keeping the nib gliding while the dry ink keeps pace with fast writing. The Safari's snap cap and Rhodia's tear-out pages make the combination functional in a way that prettier pairings aren't.`,
    affiliateOverrides: {
      penUrl: PEN_URLS['lamy-safari'],
      paperUrl: PAPER_URLS['rhodia-dot-pad'],
    },
  },
  {
    specimenNumber: 3,
    title: 'Fifty-Two Grams',
    subtitle: 'How thin paper holds more ink than it should',
    slug: 'fifty-two-grams',
    stage: 'curious',
    acquired: '2023-01-22T00:00:00.000Z',
    published: '2023-02-14T00:00:00.000Z',
    penSlug: 'kaweco-classic-sport',
    paperSlug: 'tomoe-river-s',
    ink: {
      maker: 'Diamine',
      color: 'Ancient Copper',
      notes: 'Wet, shades from bright copper to deep sienna. Overcomes the Kaweco EF dry tendency.',
    },
    essay: `The Kaweco Sport is about the size of a lip balm when capped. Posted it becomes a reasonable pen. The extra fine nib runs slightly dry out of the box - Diamine Ancient Copper has enough lubricity to compensate for that without flooding the narrow feed.

Tomoe River is 52gsm. It feels like nothing in your hand, almost translucent when held to light. It shouldn't handle wet inks well but it does. The ink doesn't feather. It shades aggressively, copper going to deep burnt sienna in the thick parts of letters, bright copper where the nib ran fast. That color range is only visible on Tomoe River - on a heavier paper the ink just looks uniform.

Dry times are long, 30 seconds or more with a saturated ink. Ghosting is real; you'll see exactly what you wrote from the other side. Some people treat this as a flaw. It isn't. The paper is just thin, and thin is what it's doing intentionally.

Writing on Tomoe River feels different from other papers. There's a faint resistance, almost soft. Most papers feel like surfaces you're moving across. This one feels like a material you're writing into.

A quiet cafe in a foreign city. A letter home on a single sheet folded to nothing. That's where this goes.`,
    pairingRationale: `The Kaweco EF needs a wet ink to write consistently, and Ancient Copper gives it that without overloading the narrow nib. Tomoe River is the only commonly available paper that showcases this ink's shading range without feathering - the tight fiber structure keeps the line defined even while the ink moves within it.`,
    affiliateOverrides: {
      penUrl: PEN_URLS['kaweco-classic-sport'],
      paperUrl: PAPER_URLS['tomoe-river-s'],
    },
  },
  {
    specimenNumber: 4,
    title: 'Smiley Face on the Nib',
    subtitle: 'The cheapest pen that doesn\'t write cheap',
    slug: 'smiley-face-on-the-nib',
    stage: 'curious',
    acquired: '2023-06-14T00:00:00.000Z',
    published: '2023-07-01T00:00:00.000Z',
    penSlug: 'pilot-kakuno',
    paperSlug: 'life-noble',
    ink: {
      maker: 'Pilot',
      color: 'Iroshizuku Kon-peki',
      notes: 'Clear blue, high lubricity. 12-second dry time on Life Noble.',
    },
    essay: `The Kakuno has a smiley face stamped on the nib. That's either charming or a dealbreaker, and if it's a dealbreaker you're missing something good. Set it aside: the nib is the same steel unit Pilot puts in the Metropolitan. On Life Noble paper, the difference between this thirteen-dollar pen and something three times the cost mostly disappears.

Life Noble is a Japanese paper, ivory-toned at 100gsm. It's thick enough to feel cushioned under the nib, smooth enough that a fine nib doesn't drag. Iroshizuku Kon-peki is a cool, saturated blue with excellent flow. It dries in about 12 seconds on this paper and doesn't feather or bleed through.

The appeal here is color against surface. Kon-peki is a clear electric blue. Against the warm ivory of Life Noble it reads more saturated than it would on white stock. The contrast is pleasant without drawing attention to itself.

Both sides of the page are usable. No drama. Good for long writing sessions where you want to be comfortable and not think about the instrument.`,
    pairingRationale: `The Kakuno's thin Japanese fine nib needs a smooth paper with enough give to prevent any sense of scratching. Life Noble's 100gsm cream stock provides that cushion. Kon-peki's high lubricity keeps the narrow feed from running dry during extended writing, and its color against the ivory paper makes the result worth looking at afterward.`,
    affiliateOverrides: {},
  },
  {
    specimenNumber: 5,
    title: 'Watch the Level Drop',
    subtitle: 'A piston filler and a stub nib for long work',
    slug: 'watch-the-level-drop',
    stage: 'curious',
    acquired: '2023-11-03T00:00:00.000Z',
    published: '2023-12-01T00:00:00.000Z',
    penSlug: 'twsbi-eco',
    paperSlug: 'leuchtturm1917-medium-a5',
    ink: {
      maker: 'Robert Oster',
      color: 'Fire Engine Red',
      notes: 'Saturated, wet. Bold on vellum. Some ghosting on 80gsm stock.',
    },
    essay: `The TWSBI Eco is a demonstrator - the ink is visible through the clear barrel. With a 1.1mm stub nib and Robert Oster Fire Engine Red, you can watch the reservoir slowly empty as you write. After three or four pages of planning you can see exactly how much you've used. This is either delightful or distracting. Most people find it delightful.

The stub nib produces line variation without technique: downstrokes are broad, crossstrokes are thin. You don't need to apply any special pressure; the nib geometry does it automatically. Fire Engine Red is a wet, saturated ink that dries quickly enough on Leuchtturm's 80gsm paper that smearing isn't a problem with normal writing speed.

Leuchtturm is slightly more absorbent than Rhodia. The vellum surface has texture - not rough, but present. The stub nib's heavy ink delivery means ghosting on 80gsm paper; you'll see the writing from the other side. It's not bleed-through but it's visible.

The Eco holds a lot of ink. For a full journaling session or a planning spread, it keeps writing without needing a refill. That's the reason to own a piston filler. Watching the red level drop as the pages fill is part of the experience.`,
    pairingRationale: `A stub nib puts down a lot of ink. Leuchtturm absorbs quickly enough to keep pace with that volume without letting the ink pool into blobs. The Eco's piston capacity means you're not constantly refilling when writing in quantity. Fire Engine Red on cream Leuchtturm stock is visually distinct enough to use for headers or annotation without needing a second pen.`,
    affiliateOverrides: {
      penUrl: PEN_URLS['twsbi-eco'],
    },
  },
  {
    specimenNumber: 6,
    title: 'The Scritch',
    subtitle: 'What controlled resistance sounds like',
    slug: 'the-scritch',
    stage: 'collector',
    acquired: '2024-04-19T00:00:00.000Z',
    published: '2024-05-15T00:00:00.000Z',
    penSlug: 'sailor-pro-gear-slim',
    paperSlug: 'midori-md',
    ink: {
      maker: 'Sailor',
      color: 'Manyo Haha',
      notes: 'Lavender with green and blue shifts. Shading depends heavily on paper absorption.',
    },
    essay: `Sailor nibs have a reputation and it's accurate. The 14k gold in the Pro Gear Slim has spring without being a flex nib - more like give. It yields slightly under pressure and returns. On paper this produces a controlled resistance, not quite friction, closer to a soft pencil.

On Midori MD paper that quality becomes the whole experience. MD is uncoated, slightly toothy, cream-colored. The nib doesn't skate; it drags microscopically, intentionally. There's an audible scritching on each stroke. You hear the pen working.

Sailor Manyo Haha is a complex ink - lavender with green and blue shifts depending on flow. On an absorbent paper like MD it shades more dramatically than it would on Rhodia or Triomphe. The color changes within a single letter depending on how much ink was on the nib at that moment. A word written slowly looks different from the same word written quickly.

Slow down with this one. Fast writing fights the pairing. Slow writing is what it's for. It's journaling paper with a journaling pen, and it rewards that kind of attention.`,
    pairingRationale: `The Pro Gear Slim's spring and the MD's tooth are calibrated for each other in a way that's hard to engineer intentionally but becomes obvious in use. A softer paper would remove the feedback; a smoother paper would make the gold nib feel like it's skating. Manyo Haha needs a moderately absorbent surface to shade at its full range - on slick paper it just looks pale.`,
    affiliateOverrides: {
      penUrl: PEN_URLS['sailor-pro-gear-slim'],
      paperUrl: PAPER_URLS['midori-md'],
    },
  },
  {
    specimenNumber: 7,
    title: 'The Needle and the Silk',
    subtitle: 'A permanent ink on a paper built for permanence',
    slug: 'the-needle-and-the-silk',
    stage: 'collector',
    acquired: '2024-10-07T00:00:00.000Z',
    published: '2024-11-01T00:00:00.000Z',
    penSlug: 'platinum-3776-century',
    paperSlug: 'maruman-mnemosyne',
    ink: {
      maker: 'Platinum',
      color: 'Carbon Black',
      notes: 'Pigmented, permanent once dry. Waterproof. Can clog unsealed pens.',
    },
    essay: `The Platinum 3776 has a "Slip & Seal" cap that takes two rotations to open. This seals the nib so it won't dry out for months. With Platinum Carbon Black - a pigmented, permanent ink - this matters. Carbon Black will clog a pen that sits dry for a week. The Platinum cap prevents that.

The Soft Fine nib has a slight bounce that makes precise writing feel effortless. It's not a needle literally but the sensation is close - a narrow, responsive point that goes exactly where you direct it. On Mnemosyne paper, which is silky and almost plasticky-smooth, the line is clean and exact.

Carbon Black dries waterproof. On Mnemosyne's smooth surface it sits sharp and dark, not bleeding into the paper's fibers. The combination makes records that last. Not for everyday journaling - for things that need to stay. Permanent notes, signatures on documents, anything you intend to be permanent.

The pairing is not expressive. It doesn't shade, it doesn't shimmer. It's precise and it's permanent, and sometimes that's exactly what you need.`,
    pairingRationale: `Platinum Carbon Black is a pigmented ink that clogs most pens but sits without issue in the sealed 3776. Mnemosyne's smooth surface lets the pigmented ink dry cleanly without streaking or sinking into the paper. The Soft Fine nib provides the precision needed to write detailed notes with a permanent ink without the line width getting away from you.`,
    affiliateOverrides: {},
  },
  {
    specimenNumber: 8,
    title: 'Thrum',
    subtitle: 'What the nib sounds like crossing laid paper at speed',
    slug: 'thrum',
    stage: 'savant',
    acquired: '2025-02-11T00:00:00.000Z',
    published: '2025-03-01T00:00:00.000Z',
    penSlug: 'pelikan-souveran-m400',
    paperSlug: 'g-lalo-verge-de-france',
    ink: {
      maker: 'Pelikan',
      color: 'Edelstein Tanzanite',
      notes: 'Lubricated blue-black. Wet. Long dry time on laid paper.',
    },
    essay: `The M400 is a wide pen. The barrel flares at the back, the cap screws rather than snaps, and the striped acetate has a warmth that plastic doesn't. The piston fills slowly and holds a lot. The 14k broad nib lays down more ink per stroke than most pens, and it does it without any pressure at all.

Verge de France is French correspondence paper, 100gsm with a laid finish. Laid paper is made on a wire mold that leaves fine parallel ridges across the surface. You feel them when the broad nib crosses them at speed. It's a vibration, almost a sound. At slow speeds the nib settles into the valleys. At writing speed it thrums.

Dry times are long. Tanzanite is a wet ink and laid paper absorbs slowly. Leave 20 seconds before folding or closing a letter. The reward is a line that has weight - the ridges hold slightly more ink than the raised portions, so the stroke has micro-variation visible when you hold the page at an angle.

This is correspondence paper. It costs more per sheet than most notebooks. Writing on it changes what you write, or at least what you think you're doing when you write it. Not every sentence wants to be permanent, but this pairing makes you write as if it is.`,
    pairingRationale: `The M400's broad nib and the laid texture of Verge de France are matched in scale. A fine nib would get lost in the laid lines; a broad nib bridges them, creating that tactile vibration. Tanzanite provides the lubrication a broad nib needs to move across textured paper without catching on the ridges. The 100gsm weight handles the ink volume without saturating.`,
    affiliateOverrides: {
      penUrl: PEN_URLS['pelikan-souveran-m400'],
      paperUrl: PAPER_URLS['g-lalo-verge-de-france'],
    },
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Seeding ${BASE_URL} as ${EMAIL}`);

  let token;
  try {
    token = await login();
    console.log('Authenticated.\n');
  } catch (err) {
    console.error('Login failed:', err.message);
    process.exit(1);
  }

  // Build pen slug → id map
  console.log('--- Pens ---');
  const penIds = {};
  for (const pen of PENS) {
    const doc = await upsert('pens', pen.slug, { ...pen, draft: false }, token);
    penIds[pen.slug] = doc.id;
  }

  // Build paper slug → id map
  console.log('\n--- Papers ---');
  const paperIds = {};
  for (const paper of PAPERS) {
    const doc = await upsert('papers', paper.slug, { ...paper, draft: false }, token);
    paperIds[paper.slug] = doc.id;
  }

  // Create specimens
  console.log('\n--- Specimens ---');
  for (const spec of SPECIMENS) {
    const { penSlug, paperSlug, affiliateOverrides, essay, pairingRationale, ...rest } = spec;

    const payload = {
      ...rest,
      pen: penIds[penSlug],
      paper: paperIds[paperSlug],
      essay: toRichText(essay),
      pairingRationale: toRichText(pairingRationale),
      affiliateOverrides,
      draft: false,
    };

    await upsert('specimens', spec.slug, payload, token, 'specimenNumber');
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
