import type { WpPost } from '@/lib/wordpress';

/**
 * House journal.
 *
 * The back office is a fresh WordPress install and the journal must not sit
 * empty while the team writes there, so the spa's own stories live here in
 * code. They render alongside WordPress posts: real posts take precedence
 * and appear first, and these fill the page beneath them. Every fact below
 * comes from the business record: the treatments, the packages, the products
 * the spa actually uses, and the venue work it actually does.
 *
 * Slugs never collide with WordPress because they carry the house- prefix in
 * spirit only: WordPress demo posts are filtered upstream, and any post an
 * editor publishes appears ahead of these.
 */

function img(src: string, alt: string): Pick<WpPost, 'image' | 'imageAlt' | 'imageSrcset'> {
  return { image: src, imageAlt: alt, imageSrcset: '' };
}

export const HOUSE_POSTS: WpPost[] = [
  {
    id: 900001,
    slug: 'first-time-hydrotherapy-what-to-expect',
    title: 'First time in a hydrotherapy suite? Here is what actually happens',
    excerpt:
      'The warm water, the pressure, the half hour that feels like two. A practical walkthrough of your first hydrotherapy session in Windhoek North, from arrival to the moment you float home.',
    date: '2026-08-26T09:00:00',
    ...img(
      '/media/hydrotherapy-tub-set-1600.jpg',
      'Hydro tub prepared for a session',
    ),
    gallerySlugs: [
      'hydrotherapy-suite',
      'hydrotherapy-tub-set',
      'hydrotherapy-guest',
      'portrait-6',
    ],
    content: `
<p>Most people book their first hydrotherapy session out of curiosity and leave wondering why nobody told them about it sooner. The idea is simple: you settle into a private tub, and warm water jets do the work. The jets push pressurised water against the body, a strong, targeted massaging effect. That pressure, with the warmth, loosens tight muscle fibres and releases the tension a working week stores in them.</p>

<p>The same water is quietly doing three more jobs while you lie there. Its pressure widens blood vessels, so oxygen-rich blood keeps flowing to the areas that ache. The beat of the jets lands like a deep tissue massage, which helps quiet pain signals and loosen stiff joints. And the steady rhythmic pulsing calms the nervous system, drawing out endorphins and lowering mental stress. In practice there is a rhythm to a session, and knowing it beforehand makes it better. Here is the honest version of what happens.</p>

<h2>Arrival and the first ten minutes</h2>
<p>You will be shown to the suite and left alone to change. The room is private and warm, with everything you need within reach: robes, towels, water to drink. The tub fills and holds its temperature, so there is no waiting for heat and no moment of stepping into water that has gone lukewarm. Sit, lower yourself in, and give yourself a full minute before you judge anything. The first minute always feels like too little happening. That is the point.</p>

<h2>What the water is doing</h2>
<p>The mechanics are one thing; the half hour itself is another. The warmth tells the muscles near the skin they can stop holding. The pressure gives your body something gentle to push against, which is why joints feel lighter in the tub than they do on land. And the slow churn of the jets gives your nervous system a steady, repetitive signal that crowds out the busy one it was carrying. People fall asleep in these tubs with surprising regularity. Nobody here thinks that is a problem.</p>

<h2>After the soak</h2>
<p>When the session ends, rise slowly. Sit on the edge for a moment, drink the water, and let your blood pressure remember what it is doing. This is also when the treatment lands hardest: the half hour after a soak is when tight backs loosen and stiff knees start cooperating. If you can, book a massage in the same visit. Warm muscle tissue responds to massage better than cold tissue does, and the pairing is why our massage packages pair the two on purpose.</p>

<h2>How often to come</h2>
<p>Once is an experience. Once a fortnight is a habit your lower back will thank you for. Regular hydrotherapy is popular with people who sit at desks all week, runners nursing stubborn calves, and anyone who finds a massage table slightly too formal an idea. It is the most low-maintenance treatment on our menu: you bring nothing, you do nothing, and you leave lighter than you came.</p>

<p>The hydrotherapy suite takes single guests and pairs. If you have never tried it, book the slot after work one day this week, bring nothing but yourself, and see what half an hour of warm water does to a Windhoek week.</p>
`,
  },
  {
    id: 900002,
    slug: 'swedish-aromatherapy-hot-stone-choosing',
    title: 'Swedish, aromatherapy or hot stone: choosing the right massage',
    excerpt:
      'Three massages, three different jobs. A plain-language guide to what each one does, who each one suits, and how to pick without guessing.',
    date: '2026-08-19T09:00:00',
    ...img(
      '/media/spa-retreat-1600.jpg',
      'Treatment beds with mustard towels ready for a massage',
    ),
    content: `
<p>The most common message we receive reads roughly: I want a massage but I do not know which one. It is a fair question. The menu says Swedish, aromatherapy, hot stone, and the differences are not obvious from the names. Here is the guide we give people in person, written down.</p>

<h2>Swedish massage: the all-rounder</h2>
<p>Swedish is the massage most people picture when they hear the word. Long, gliding strokes, kneading, gentle pressure that works across the whole body. Its job is general relaxation and circulation: it loosens the surface muscles, moves blood, and settles the nervous system. If you are stressed, sleeping badly, or simply have not been touched by anything kinder than an office chair in months, Swedish is the correct answer. It is also the right choice for a first massage, because the pressure stays predictable and the therapist can adjust everything to taste. Most of our first-time guests start here, and most come back for it.</p>

<h2>Aromatherapy massage: the one that works on the mood</h2>
<p>Aromatherapy uses the same foundation of flowing strokes but adds concentrated essential oils chosen for what they do to the head as much as the body. Lavender for the guest who cannot switch off. Eucalyptus when a cold is threatening or breathing feels shallow. Citrus for the flat, tired Thursday feeling. The oils are absorbed through the skin and, just as importantly, through the nose: scent is the shortest route to memory and mood that the body has. Choose aromatherapy when the problem is not only in your shoulders but in your week. It is the massage equivalent of someone dimming the lights for you.</p>

<h2>Hot stone massage: the one for deep, stubborn tension</h2>
<p>Hot stone is the deepest of the three, and heat is the reason. Smooth basalt stones are warmed and used as tools: the therapist slides them along the muscles and rests them on the areas that hold the most tension, often the back and shoulders. The heat sinks into tissue in a way hands alone cannot reach, softening chronic knots before any real pressure is applied. If you train hard, carry your stress in your trapezius, or have tried relaxation massages and left feeling only half-loosened, hot stone is the upgrade. The warmth also makes it the most-loved winter treatment on the menu.</p>

<h2>A quick way to decide</h2>
<ul>
<li>Overloaded, sleepless, or new to massage: <strong>Swedish</strong>.</li>
<li>Emotionally drained, anxious, or craving a particular calm: <strong>Aromatherapy</strong>.</li>
<li>Deep knots, training aches, chronic shoulder armour: <strong>Hot stone</strong>.</li>
</ul>

<h2>Or do not choose alone</h2>
<p>Every massage at Emerald begins with a short conversation, and the therapist will happily steer you if you describe what you want in plain words. You can say I want to fall asleep, or my back is cement, and that is enough. For guests who want the full experience, our massage packages combine any massage you choose with a snack platter and hydrotherapy access: one guest for N$1,000, two for N$1,700, three for N$2,400. Couples and small groups book those most weekends, and the two-person package is the one people come back for.</p>

<p>Whichever you choose, arrive ten minutes early, put the phone away, and let the first few minutes be quiet. The massage starts working before the first stroke does.</p>
`,
  },
  {
    id: 900003,
    slug: 'why-the-facial-ritual-stays-honest',
    title: 'Why our facial ritual stays honest: the products we actually use',
    excerpt:
      'No miracle claims, no ten-step theatre. A look at the BioMedical Emporium range behind our facial treatments and what each product genuinely does for the skin.',
    date: '2026-08-12T09:00:00',
    ...img(
      '/media/facial-treatment-1600.jpg',
      'Guest resting during a facial',
    ),
    content: `
<p>Ask a facialist what sells facials and you will hear words like glow, radiance, and transformation. Ask a guest what they actually want and the answer is usually more modest: skin that behaves. That gap between the marketing and the want is why our facial menu is built around a small, serious range from BioMedical Emporium rather than a shelf of everything. Here is what we use and, more usefully, what each product actually does.</p>

<h2>The cleanser that starts every treatment</h2>
<p>Every facial at Emerald opens with a proper double cleanse using the BioMedical Emporium Facial Cleanser. The first pass removes the day, the second cleans the skin itself. It is a quiet product: no sting, no tight squeaky feeling afterwards, which is the feeling of a cleanser stripping the barrier you came here to protect. Clean skin takes the rest of the treatment better, so this step is never rushed.</p>

<h2>DermHydrix: the hydration layer</h2>
<p>Hydration is the difference between skin that looks rested and skin that looks tired, whatever your age. DermHydrix is the hydrating serum we reach for most: it replenishes water content in the upper layers of the skin, which softens fine dryness lines immediately and helps the skin hold what the rest of the treatment gives it. Guests with dry, tight, Windhoek-winter skin feel this one within the session. It is the workhorse of the range and the reason many facials finish with visible difference on the day rather than in a fortnight.</p>

<h2>NanoZyme: the gentle resurfacer</h2>
<p>NanoZyme does the work older treatments did with acid and abrasion, but gently: it lifts away the dull layer of dead surface cells and encourages the skin to renew itself. The result is texture that smooths and a surface that reflects light evenly, which is what the word glow actually describes in practice. It suits congested, rough, or uneven skin, and it is kind enough that the treatment is comfortable throughout. No peeling weekend required.</p>

<h2>Skin Repair Serum: for skin that has been through something</h2>
<p>Blemish marks, sun, scarring, the aftermath of a harsh product binge: Skin Repair Serum is the calming, restoring step for compromised skin. It supports the skin's own repair processes and reduces the look of post-blemish marks. If your skin is reactive or you have been fighting it rather than feeding it, this is usually where your treatment plan starts.</p>

<h2>Skin Biotic and the Wellness Pack: skin from the inside</h2>
<p>The most honest sentence in skincare is that the skin is an organ and organs are fed from within. Skin Biotic supports the gut-skin connection that dermatology keeps confirming, and the Wellness Pack bundles the range's internal support into one regimen. We stock both because guests asked, not because a shelf needed filling: what you do at home between treatments matters as much as the treatment itself.</p>

<h2>What we will not tell you</h2>
<p>We will not tell you one facial will change your life. We will not promise to erase a decade. What we can tell you is what each product is doing, why the order matters, and what a realistic series looks like for your skin specifically. Ask anything during your treatment: our therapists know this range down to the ingredient list and would rather answer a real question than sell you a vague promise.</p>

<p>The facial menu takes walk-ins, but Saturday mornings book out first. Come with a clean face if you can, come without makeup if you cannot be bothered, and come with questions.</p>
`,
  },
  {
    id: 900004,
    slug: 'venue-hire-that-started-with-a-gender-reveal',
    title: 'The venue hire that started with a gender reveal',
    excerpt:
      'A baby gender reveal, a garden full of family, and the afternoon that showed us our spa was also a venue. What hosting private celebrations in Windhoek North looks like.',
    date: '2026-08-05T09:00:00',
    ...img(
      '/media/venue-party-1-1600.jpg',
      'Private celebration set up in the garden',
    ),
    content: `
<p>The spa was built for quiet. Then one afternoon a family asked whether they could use the garden for a baby gender reveal, and we spent a confused happy hour watching our calmest space fill with balloons, grandmothers, and a box that was about to release pink confetti. The reveal was loud. The garden held it perfectly. That afternoon the venue side of Emerald was born, more or less by accident.</p>

<h2>What the space does well</h2>
<p>The garden is the heart of it. Green, enclosed, and private, with shade and seating, it takes a crowd without ever feeling packed. The treatment rooms open onto it, which means a celebration can spill outward: drinks on the lawn, photographs under the trees, a quiet corner indoors when the sun gets serious. The spa's own styling, the emerald palette, the plants, the light, photographs beautifully without a single hired prop, which families discover around the second photoshoot.</p>

<h2>How a gender reveal runs here</h2>
<p>Every reveal we host is different, but the shape is usually the same. The family arrives to a set table in the garden, welcome drinks are poured, and there is an hour of easy time before the moment itself: the box, the balloon, the cake, whatever the plan is. We stay out of the reveal and close by for everything around it. Because the space is private, the moment stays the family's own, no strangers, no onlookers, no half-cleared restaurant corner. Afterwards, cake, photographs in the garden, and the slow end that good afternoons have.</p>

<h2>Beyond the reveal</h2>
<p>Since that first afternoon we have hosted baby showers, birthdays, small weddings and anniversaries, and team afternoons that began as meetings and ended in the hydrotherapy suite. The spa side blends into these events better than we first imagined: a celebration where the guests can book treatments, a bridesmaid morning with manicures before the wedding, a birthday where the gift is the venue and the treatments together. The Besties packages, from N$1,700 for two to N$4,500 for six, were designed exactly for this: treatments, platters, and the space to spend the afternoon.</p>

<h2>What we ask of hosts</h2>
<p>Book early, weekends especially, and tell us the shape of the day rather than only the headcount: what time, what food, what moment the afternoon is built around, whether music matters, whether photographs do. We handle the space, the styling that is already here, the welcome, and the quiet logistics; you bring the reason and the people. We cap numbers at what the garden holds comfortably, because a venue that fits its guests is the difference between a party and a memory.</p>

<p>If you have an afternoon worth celebrating, come see the space first. Walk the garden, look at the rooms, and imagine your people in it. That walk is where every event we have hosted began.</p>
`,
  },
  {
    id: 900005,
    slug: 'quiet-corner-of-windhoek-north',
    title: 'A quiet corner of Windhoek North: how Emerald came to be',
    excerpt:
      'Proudly Namibian, built on Blackett Street, and named for a stone. The story of the spa, the garden, and the idea that a city needs somewhere soft to land.',
    date: '2026-07-29T09:00:00',
    ...img(
      '/media/serenity-garden-1600.jpg',
      'Fountain spray in the serenity garden',
    ),
    content: `
<p>Every spa tells you it is an escape. In Windhoek the word means something specific: the city is quick, dry, and bright, a place of long drives and longer to-do lists. What a Windhoek week wants is not an escape from the city but a soft place inside it. That is the idea Emerald was built on, on a quiet street in Windhoek North, behind a gate you would drive past without a second look.</p>

<h2>Why the garden came first</h2>
<p>When the space was found, the plan was treatment rooms, reception, the usual order of things. Then came the garden: a green pocket that the street noise somehow never reaches. It reshaped everything. The rooms were arranged to open onto it, the walkways were made slow on purpose, and the spa grew around the idea that the calm should start before the treatment does. Guests often say the garden is where they first exhale. We agree with them. The treatments are excellent, but the garden is the promise the treatments keep.</p>

<h2>The name and the stone</h2>
<p>Emerald, for the stone: deep green, unhurried, valuable without shouting about it. The colour runs through everything, from the robes to the walls to the marble underfoot. A gemstone is formed under pressure and takes its time, which is a fair description of how this place came together too. We kept the stone close, literally, and it is the first thing many guests ask about.</p>

<h2>Proudly Namibian</h2>
<p>Emerald is proudly Namibian, owned and run from Windhoek for Windhoek. That is not a marketing line; it shapes the details. The team is local and trained here. The treatments are priced for the lives people actually live, not for a once-a-year splurge. The hours respect how the city moves, early enough for a before-work massage and late enough for an after-work soak, seven days a week. And the welcome is the unforced warmth Namibians give each other, which no international chain can ship in.</p>

<h2>Built for regulars</h2>
<p>The spa was designed to be returned to, not just visited. That is why the hydrotherapy suite exists, why the massage packages reward bringing a friend, why the journal you are reading is written by people who see the same guests twice a month and know their names. A spa that only suits special occasions is a shop. A spa that suits a Tuesday is a habit, and habits are what actually keep people well.</p>

<h2>Come find the gate</h2>
<p>We are on Blackett Street, Windhoek North. Book a treatment, or simply come walk the garden before you decide anything. The first exhale is free.</p>
`,
  },
  {
    id: 900006,
    slug: 'the-case-for-the-group-spa-day',
    title: 'The case for the group spa day',
    excerpt:
      'One guest relaxes. Two reconnect. Six remember it for a year. Why treatments are better together, and how to plan a group day that suits everyone.',
    date: '2026-07-22T09:00:00',
    ...img(
      '/media/venue-party-8-1600.jpg',
      'Party tables and dessert buffet under the garden trees',
    ),
    content: `
<p>There is a version of the spa day that belongs to one person: the solo hour, the silent treatment room, the book afterwards. We love that version. But there is another version we keep witnessing, the group one, and it is quietly the more powerful medicine. Here is the case for bringing people.</p>

<h2>Treatments together lower the barrier</h2>
<p>Most people who need a massage most have never had one. The appointment feels formal, the unfamiliarity wins, and the year passes. A friend in the next room changes the arithmetic entirely: the booking is an occasion, not an appointment, and the nervous first-timer becomes a regular by the second visit. Group booking is how most of our regulars started, which is why we built the packages around it.</p>

<h2>The conversation after is half the treatment</h2>
<p>Watch a pair finish side-by-side massages and you will see it: the slow walk to the lounge, the drinks, the loose, laughing recap of who fell asleep first. The physiological calm of a treatment gets extended, stretched over another hour of easy company, and the combination is worth more than either half. Couples do this instinctively. Friends discover it once and then do it every birthday.</p>

<h2>How the packages work</h2>
<p>The Besties packages are built for exactly this: any massage you each choose, Swedish, aromatherapy, or hot stone, a snack platter to share, and hydrotherapy access for the group. N$1,700 for two, N$3,000 for four, N$4,500 for six, so the arithmetic scales instead of multiplying. The shape of the afternoon is the same at every size: treatments, water, platter, garden, and no clock ticking anywhere in it. The two-person package is our most-booked, and the six-person version has finished more than one birthday month in style.</p>

<h2>Planning one that suits everyone</h2>
<ul>
<li><strong>Match treatments to people, not to the group.</strong> The hot stone devotee and the Swedish-only guest can share an afternoon happily. Everyone books their own.</li>
<li><strong>Add hydrotherapy to the middle.</strong> It is the social hour of the visit: warm water, drinks, conversation, nobody under pressure to perform relaxation.</li>
<li><strong>Leave the after open.</strong> The best group spa days end slowly. Do not book dinner for 6pm.</li>
<li><strong>Book two weeks out.</strong> Synchronising therapists and the hydrotherapy suite for a group needs a little runway, especially before weekends.</li>
</ul>

<h2>The occasion that does not need an occasion</h2>
<p>Hen afternoons and birthdays are the regulars. But the group day that stays with people is usually the unremarkable one: a Tuesday two friends invented because the month had been long, a mother and daughter who made it quarterly, three colleagues who closed a hard project. Those are the bookings we take most and remember best.</p>

<p>Gather your two, or your four, or your six. Message us the date and we will build the afternoon around it.</p>
`,
  },
];
