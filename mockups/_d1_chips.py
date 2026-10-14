"""Chip-level full detail (all 25 chips) — what / why / how / facts / best-for, EN + HI.

Used by _build2.py to generate the decor-types drafts.
"""

CHIPS = {
    # ─────────────── GROUP 1 — the elements ───────────────
    "Balloon Decor": dict(
        en=dict(
            what="Balloon styling is our signature craft — layered organic garlands, sculpted arches and colour stories built for the camera.",
            why="It is the fastest way to turn a plain room into a celebration, and it photographs beautifully from every angle.",
            how="We start from your palette and the venue's light, sketch the silhouette, then build on site with premium latex, chrome and jumbo balloons in matched tones.",
            facts=[("Typical setup", "1–2 hours"), ("Where it works", "Indoor & outdoor"), ("Stays fresh", "2–3 days")],
            bestFor=["Birthdays", "Baby Showers", "Weddings", "Corporate"],
        ),
        hi=dict(
            what="Balloon styling hamari pehchaan hai — layered organic garlands, arches aur colour stories jo camera ke liye banti hain.",
            why="Ye sabse tez tarika hai plain kamre ko celebration banane ka, aur har angle se photo me sundar lagta hai.",
            how="Pehle aapki palette aur venue ki roshni dekhte hain, silhouette banate hain, phir site par premium latex, chrome aur jumbo gubbare matched tones me lagate hain.",
            facts=[("Setup ka time", "1–2 ghante"), ("Kahan chalta hai", "Andar aur bahar"), ("Kitne din", "2–3 din")],
            bestFor=["Birthday", "Baby Shower", "Shaadi", "Corporate"],
        ),
    ),
    "Floral Decor": dict(
        en=dict(
            what="Fresh flowers arranged the way a florist composes — full, fragrant, and never simply placed.",
            why="Flowers bring the two things balloons cannot: fragrance and softness.",
            how="Blooms are sourced fresh on the day, conditioned, then arranged on site in the venue's own light so nothing looks tired by the time guests arrive.",
            facts=[("Typical setup", "1–2 hours"), ("Where it works", "Shaded areas"), ("Stays fresh", "Same day")],
            bestFor=["Weddings", "Ring Ceremony", "Anniversaries", "Devotional"],
        ),
        hi=dict(
            what="Taaza phool, florist ke andaaz me — bhare hue, khushbudar, sirf rakh diye nahi.",
            why="Phool wahi do cheezein dete hain jo gubbare nahi de sakte: khushbu aur narmi.",
            how="Phool usi din taaza aate hain, taiyaar kiye jaate hain, phir venue ki roshni me site par sajaye jaate hain — taki mehmaan aane tak kuch bhi thaka na lage.",
            facts=[("Setup ka time", "1–2 ghante"), ("Kahan chalta hai", "Chhaya wali jagah"), ("Kitne din", "Usi din tak")],
            bestFor=["Shaadi", "Ring Ceremony", "Anniversary", "Devotional"],
        ),
    ),
    "Drapes & Fabric": dict(
        en=dict(
            what="Fabric is what makes a room feel like a set instead of a hall.",
            why="It hides what you would rather not see and frames what you want everyone to look at.",
            how="We measure the venue's heights first, then drape to the ceiling in sheer, satin or velvet so the fall stays clean and looks permanent.",
            facts=[("Typical setup", "2–3 hours"), ("Where it works", "Any indoor venue"), ("Removed", "Same night")],
            bestFor=["Weddings", "Receptions", "Corporate", "Baby Showers"],
        ),
        hi=dict(
            what="Kapda hi kamre ko hall ki jagah set banata hai.",
            why="Jo dikhana nahi chahte wo chhupa deta hai, aur jo dikhana chahte ho usko frame karta hai.",
            how="Pehle venue ki unchai naapte hain, phir sheer, satin ya velvet se ceiling tak drape karte hain — taki fold saaf aur pakka lage.",
            facts=[("Setup ka time", "2–3 ghante"), ("Kahan chalta hai", "Koi bhi indoor venue"), ("Hataya jata hai", "Usi raat")],
            bestFor=["Shaadi", "Reception", "Corporate", "Baby Shower"],
        ),
    ),
    "Lighting Decor": dict(
        en=dict(
            what="Light decides how premium a setup feels — more than any other single element.",
            why="Warm light flatters people in photographs; harsh light ruins even expensive decor.",
            how="We add the light last, after the decor is standing, so every fixture is aimed at whatever deserves to glow.",
            facts=[("Typical setup", "1–2 hours"), ("Where it works", "Indoor & terrace"), ("Runs", "Through the event")],
            bestFor=["Receptions", "Anniversaries", "Corporate", "Engagements"],
        ),
        hi=dict(
            what="Setup kitna premium lagega ye roshni tay karti hai — kisi bhi doosri cheez se zyada.",
            why="Warm light photos me sabko achha dikhati hai; tez light mehnga decor bhi kharab kar deti hai.",
            how="Light sabse aakhir me lagate hain, jab decor khada ho jaata hai — taki har fixture wahi roshan kare jo roshan hona chahiye.",
            facts=[("Setup ka time", "1–2 ghante"), ("Kahan chalta hai", "Andar aur terrace"), ("Chalta hai", "Poora function")],
            bestFor=["Reception", "Anniversary", "Corporate", "Engagement"],
        ),
    ),
    "Greenery & Foliage": dict(
        en=dict(
            what="Leaves, vines and palms bring the freshness that flowers alone cannot hold.",
            why="Green balances strong colours and keeps a large setup from feeling heavy.",
            how="Foliage is wired and layered behind the blooms so the structure never shows and the greens stay upright all evening.",
            facts=[("Typical setup", "1–2 hours"), ("Where it works", "Indoor & outdoor"), ("Stays fresh", "2–3 days")],
            bestFor=["Weddings", "Baby Showers", "Corporate", "Baby Reveal"],
        ),
        hi=dict(
            what="Patte, bail aur palm wo taazgi dete hain jo sirf phool nahi de sakte.",
            why="Green tez colours ko balance karta hai aur bada setup bhaari nahi lagne deta.",
            how="Foliage ko wire karke phoolon ke peeche layer karte hain — taki dhaancha kahin dikhe na aur green poore function khada rahe.",
            facts=[("Setup ka time", "1–2 ghante"), ("Kahan chalta hai", "Andar aur bahar"), ("Kitne din", "2–3 din")],
            bestFor=["Shaadi", "Baby Shower", "Corporate", "Baby Reveal"],
        ),
    ),
    "Props & Cutouts": dict(
        en=dict(
            what="Shapes, panels and standees — the playful layer that makes photographs interesting.",
            why="Guests need something to interact with, not just something to look at.",
            how="Every prop is cut, painted and finished in our own workshop, then placed so it frames the guest instead of hiding them.",
            facts=[("Typical setup", "30–60 mins"), ("Where it works", "Any venue"), ("Reusable", "For years")],
            bestFor=["Birthdays", "Kids Parties", "Corporate", "College Events"],
        ),
        hi=dict(
            what="Shapes, panels aur standees — mazedaar layer jo photos ko interesting banati hai.",
            why="Mehmaan ko sirf dekhne ki nahi, khelne ki cheez chahiye.",
            how="Har prop hamari workshop me cut, paint aur finish hota hai, phir aise lagaya jata hai ki mehmaan frame ho, chhupe na.",
            facts=[("Setup ka time", "30–60 minute"), ("Kahan chalta hai", "Koi bhi venue"), ("Reusable", "Saalon tak")],
            bestFor=["Birthday", "Kids Party", "Corporate", "College Events"],
        ),
    ),
    "Premium Finishes": dict(
        en=dict(
            what="Pearl, sequin, mirror and metallic detail — the last ten percent that decides the class.",
            why="This is the difference between a decorated venue and a styled one.",
            how="Finishes are matched to your palette, then added only after the structure is complete, so nothing competes for attention.",
            facts=[("Typical setup", "30 mins"), ("Added", "Last, on site"), ("Reused", "Across setups")],
            bestFor=["Weddings", "Engagements", "Anniversaries", "Luxury Birthdays"],
        ),
        hi=dict(
            what="Pearl, sequin, mirror aur metallic detail — aakhri das percent jo class tay karta hai.",
            why="Yahi farq hai sajaye hue venue aur styled venue me.",
            how="Finish aapki palette se match karte hain, aur lagate hain sabse aakhir me — taki kisi cheez se compete na ho.",
            facts=[("Setup ka time", "30 minute"), ("Lagta hai", "Sabse aakhir me"), ("Reuse", "Har setup me")],
            bestFor=["Shaadi", "Engagement", "Anniversary", "Luxury Birthday"],
        ),
    ),
    "Custom Signage": dict(
        en=dict(
            what="Your own words, written in light or acrylic — names, dates, welcomes.",
            why="A personalised board is the detail guests photograph most often.",
            how="We design the lettering to your font and colour, produce it, and light it so it reads cleanly in photographs.",
            facts=[("Made in", "1–2 days"), ("Delivery", "On site"), ("Reusable", "Afterwards")],
            bestFor=["Weddings", "Birthdays", "Proposals", "Corporate"],
        ),
        hi=dict(
            what="Aapke apne shabd, light ya acrylic me — naam, tareekh, welcome.",
            why="Personalised board hi wo detail hai jiski sabse zyada photo banti hai.",
            how="Lettering aapke font aur colour me design karte hain, banate hain, aur aise light karte hain ki photo me saaf padhe.",
            facts=[("Ban jata hai", "1–2 din"), ("Delivery", "Site par"), ("Reuse", "Baad me bhi")],
            bestFor=["Shaadi", "Birthday", "Proposal", "Corporate"],
        ),
    ),
    # ─────────────── GROUP 2 — the structures ───────────────
    "Backdrop / Photo Booth": dict(
        en=dict(
            what="The wall every guest ends up standing in front of.",
            why="It is the only part of the decor that lives on in the album forever.",
            how="We build the frame first, layer florals and balloons over it, then add seating and light so it looks complete in every photograph.",
            facts=[("Typical setup", "1–2 hours"), ("Needs", "A wall or stand"), ("Runs", "Through the event")],
            bestFor=["All Occasions", "Birthdays", "Baby Showers", "Corporate"],
        ),
        hi=dict(
            what="Wo deewar jiske saamne har mehmaan khada hokar photo leta hai.",
            why="Decor ka sirf yahi hissa album me hamesha ke liye rehta hai.",
            how="Pehle frame banate hain, uspar phool aur gubbare layer karte hain, phir seating aur light jodte hain — taki har photo me poora lage.",
            facts=[("Setup ka time", "1–2 ghante"), ("Zaroorat", "Deewar ya stand"), ("Chalta hai", "Poora function")],
            bestFor=["Har mauke", "Birthday", "Baby Shower", "Corporate"],
        ),
    ),
    "Arch / Entrance Gate": dict(
        en=dict(
            what="The frame guests pass through before they see anything else.",
            why="It sets the expectation for the whole celebration in three seconds.",
            how="We measure your doorway or driveway, then build the arch on site so it sits straight and stays steady all evening.",
            facts=[("Typical setup", "1–2 hours"), ("Needs", "8–10 ft width"), ("Runs", "Through the event")],
            bestFor=["Weddings", "Receptions", "Grand Openings", "Birthdays"],
        ),
        hi=dict(
            what="Wo frame jisse hokar mehmaan andar aate hain — baaki sab baad me dikhta hai.",
            why="Teen second me poori celebration ka andaaza isse lag jaata hai.",
            how="Aapke gate ya driveway ka naap lete hain, phir arch site par banate hain — taki seedha khada rahe aur poore function tikā rahe.",
            facts=[("Setup ka time", "1–2 ghante"), ("Zaroorat", "8–10 feet jagah"), ("Chalta hai", "Poora function")],
            bestFor=["Shaadi", "Reception", "Grand Opening", "Birthday"],
        ),
    ),
    "Mandap & Pandal": dict(
        en=dict(
            what="A full traditional structure — pillars, canopy and draping for the ceremony itself.",
            why="Families need a setting that holds the ritual respectfully and still looks premium on camera.",
            how="We plan around the ritual first — seating, fire, walkway — then style the florals and drapes around that plan.",
            facts=[("Typical setup", "3–5 hours"), ("Where", "Outdoor or garden"), ("Runs", "Through the ritual")],
            bestFor=["Weddings", "Haldi", "Mehndi", "Ring Ceremony"],
        ),
        hi=dict(
            what="Poora traditional dhaancha — pillars, canopy aur draping, khud rasm ke liye.",
            why="Parivaar ko aisa setup chahiye jo rasm ko izzat se sambhale aur camera me bhi premium lage.",
            how="Pehle rasm ke hisaab se plan karte hain — seating, havan, raasta — phir usi plan ke around phool aur drapes sajate hain.",
            facts=[("Setup ka time", "3–5 ghante"), ("Kahan", "Bahar ya garden"), ("Chalta hai", "Poori rasm")],
            bestFor=["Shaadi", "Haldi", "Mehndi", "Ring Ceremony"],
        ),
    ),
    "Stage & Front Truss": dict(
        en=dict(
            what="The main working frame — truss, panels, skirting and backdrop.",
            why="Every function needs a focal point where the eye lands first.",
            how="The truss is rigged for weight and safety, then dressed with drapes, florals and light bars so the structure disappears.",
            facts=[("Typical setup", "2–4 hours"), ("Needs", "Level ground"), ("Runs", "Through the event")],
            bestFor=["Weddings", "Corporate", "Award Nights", "Annual Days"],
        ),
        hi=dict(
            what="Main dhaancha — truss, panels, skirting aur backdrop.",
            why="Har function ko ek focal point chahiye jahan nazar pehle jaaye.",
            how="Truss weight aur safety ke hisaab se rig hota hai, phir drapes, phool aur light bars se sajaya jata hai — taki dhaancha dikhe hi na.",
            facts=[("Setup ka time", "2–4 ghante"), ("Zaroorat", "Samtaल zameen"), ("Chalta hai", "Poora function")],
            bestFor=["Shaadi", "Corporate", "Award Night", "Annual Day"],
        ),
    ),
    "Ceiling & Hanging Decor": dict(
        en=dict(
            what="Decoration above eye level — the layer most setups forget.",
            why="Guests look up the moment they walk in; a dressed ceiling makes a room feel twice as grand.",
            how="We map the ceiling height and rigging points, then hang florals, balloons and lights in balanced layers.",
            facts=[("Typical setup", "1–3 hours"), ("Needs", "Rigging points"), ("Runs", "Through the event")],
            bestFor=["Receptions", "Weddings", "Corporate", "Baby Showers"],
        ),
        hi=dict(
            what="Aankh ki unchai se upar ki sajawat — jo zyaadatar setup bhool jaate hain.",
            why="Mehmaan andar aate hi upar dekhta hai; saji hui chhat kamre ko dugna bada dikhati hai.",
            how="Chhat ki unchai aur rigging points ka naqsha banate hain, phir phool, gubbare aur lights balanced layers me latkate hain.",
            facts=[("Setup ka time", "1–3 ghante"), ("Zaroorat", "Rigging points"), ("Chalta hai", "Poora function")],
            bestFor=["Reception", "Shaadi", "Corporate", "Baby Shower"],
        ),
    ),
    "Tablescape & Lounge": dict(
        en=dict(
            what="The part guests actually touch — tables, seating and lounge corners.",
            why="Comfort is remembered far longer than any arch.",
            how="Linen, cutlery and centrepieces are set last, in a repeating rhythm, with the light adjusted for the tabletop.",
            facts=[("Typical setup", "1–2 hours"), ("Where", "Indoors"), ("Set", "Just before guests")],
            bestFor=["Weddings", "Anniversaries", "Corporate Dinners", "Baby Showers"],
        ),
        hi=dict(
            what="Wo hissa jise mehmaan chhoota hai — tables, seating aur lounge corners.",
            why="Aaraam kisi bhi arch se zyada yaad rehta hai.",
            how="Linen, cutlery aur centrepieces sabse aakhir me lagate hain, ek rhythm me, aur tabletop ke hisaab se light set karte hain.",
            facts=[("Setup ka time", "1–2 ghante"), ("Kahan", "Andar"), ("Lagta hai", "Mehmaan aane se pehle")],
            bestFor=["Shaadi", "Anniversary", "Corporate Dinner", "Baby Shower"],
        ),
    ),
    "Marry Me / Proposal": dict(
        en=dict(
            what="A private setup built for one question and one answer.",
            why="It has to feel personal — never rented.",
            how="We study the spot, plan the reveal angle, and finish everything before you arrive, quietly.",
            facts=[("Typical setup", "45–90 mins"), ("Where", "Rooftop, pool, room"), ("Cleared", "After the moment")],
            bestFor=["Proposals", "Anniversaries", "Date Nights", "Reconciliations"],
        ),
        hi=dict(
            what="Private setup — ek sawaal aur ek jawaab ke liye.",
            why="Ye personal lagna chahiye — kiraye ka nahi.",
            how="Jagah dekh kar reveal angle plan karte hain, aur sab kuch aapke pahunchne se pehle chup-chaap taiyaar kar dete hain.",
            facts=[("Setup ka time", "45–90 minute"), ("Kahan", "Rooftop, pool, room"), ("Hataya jata hai", "Baad me")],
            bestFor=["Proposal", "Anniversary", "Date Night", "Reconciliation"],
        ),
    ),
    "Walkway & Aisle Decor": dict(
        en=dict(
            what="The path that leads guests in — and the one the couple walks.",
            why="A dressed walkway builds anticipation step by step.",
            how="We line the route with petals, lanterns and florals, always keeping the walking width clear and safe.",
            facts=[("Typical setup", "1 hour"), ("Needs", "3–4 ft width"), ("Kept", "Clear for walking")],
            bestFor=["Weddings", "Receptions", "Proposals", "Grand Entries"],
        ),
        hi=dict(
            what="Wo raasta jo mehmaan ko andar le jaata hai — aur jispar couple chalta hai.",
            why="Saji hui walkway kadam-kadam par utsaah badhati hai.",
            how="Raaste ko petals, lanterns aur phoolon se sajate hain — chalne ki jagah hamesha khaali aur safe rakhte hue.",
            facts=[("Setup ka time", "1 ghanta"), ("Zaroorat", "3–4 feet jagah"), ("Rakha jata hai", "Chalne ke liye khaali")],
            bestFor=["Shaadi", "Reception", "Proposal", "Grand Entry"],
        ),
    ),
    "Cake Table & Dessert Bar": dict(
        en=dict(
            what="The sweet station, built around the cake.",
            why="Cake cutting is the most photographed minute of any function.",
            how="We set the plinth height, arrange the dessert display, then light it so the cake reads perfectly on camera.",
            facts=[("Typical setup", "45–60 mins"), ("Needs", "A power point"), ("Runs", "Through the function")],
            bestFor=["Birthdays", "Weddings", "Baby Showers", "Anniversaries"],
        ),
        hi=dict(
            what="Meethi station — cake ke around bani hui.",
            why="Cake cutting hi kisi bhi function ka sabse zyada photographed moment hai.",
            how="Plinth ki unchai set karte hain, dessert display sajate hain, phir light aise dete hain ki cake camera me perfect lage.",
            facts=[("Setup ka time", "45–60 minute"), ("Zaroorat", "Power point"), ("Chalta hai", "Poora function")],
            bestFor=["Birthday", "Shaadi", "Baby Shower", "Anniversary"],
        ),
    ),
    # ─────────────── GROUP 3 — the experiences ───────────────
    "Cold Pyro & Fountains": dict(
        en=dict(
            what="Cold sparkler fountains — the five-second moment that makes everyone look up.",
            why="Nothing else creates a reaction this large from something this small.",
            how="Machines are placed on both sides, tested for indoor safety, and fired exactly on cue.",
            facts=[("Typical setup", "20 mins"), ("Safety", "Indoor-safe machines"), ("Effect", "30–60 seconds")],
            bestFor=["Weddings", "Receptions", "Birthdays", "Proposals"],
        ),
        hi=dict(
            what="Cold sparkler fountains — paanch second ka wo moment jab poori mehfil upar dekhti hai.",
            why="Itni chhoti cheez se itna bada reaction aur kahin nahi milta.",
            how="Machines dono taraf lagate hain, indoor safety test karte hain, aur exact cue par fire karte hain.",
            facts=[("Setup ka time", "20 minute"), ("Safety", "Indoor-safe machine"), ("Effect", "30–60 second")],
            bestFor=["Shaadi", "Reception", "Birthday", "Proposal"],
        ),
    ),
    "Fog, Bubbles & Smoke": dict(
        en=dict(
            what="Air you can see — low fog, bubbles and haze.",
            why="It makes an ordinary floor look like a stage.",
            how="We place the machines off-camera and control the drift, so the fog hugs the floor instead of the guests.",
            facts=[("Typical setup", "20 mins"), ("Where", "Indoors, on request"), ("Runs", "Through the event")],
            bestFor=["Receptions", "First Dances", "Birthdays", "Concerts"],
        ),
        hi=dict(
            what="Aisi hawa jo dikhti hai — low fog, bubbles aur haze.",
            why="Aam zameen bhi stage jaisi lagne lagti hai.",
            how="Machines camera se bahar rakhte hain aur drift control karte hain — taki fog zameen par rahe, mehmaanon par nahi.",
            facts=[("Setup ka time", "20 minute"), ("Kahan", "Andar, request par"), ("Chalta hai", "Poora function")],
            bestFor=["Reception", "First Dance", "Birthday", "Concert"],
        ),
    ),
    "Confetti & Balloon Drop": dict(
        en=dict(
            what="Confetti cannons and a ceiling release that hands the celebration straight to the guests.",
            why="It turns the crowd itself into the decoration.",
            how="The net or cannons are rigged above, timed to your entry or cake cut, and cleared immediately after.",
            facts=[("Typical setup", "30–45 mins"), ("Needs", "Ceiling height"), ("Moment", "One big one")],
            bestFor=["Receptions", "Birthdays", "New Year", "Grand Finales"],
        ),
        hi=dict(
            what="Confetti cannons aur chhat se release — jo celebration seedha mehmaanon ke haath me de deta hai.",
            why="Isse bheed khud decoration ban jaati hai.",
            how="Net ya cannons upar rig karte hain, aapki entry ya cake cut par time karte hain, aur turant baad hata dete hain.",
            facts=[("Setup ka time", "30–45 minute"), ("Zaroorat", "Chhat ki unchai"), ("Moment", "Ek bada moment")],
            bestFor=["Reception", "Birthday", "New Year", "Grand Finale"],
        ),
    ),
    "360° Booth / Selfie Point": dict(
        en=dict(
            what="A camera that spins around your guests and sends them a clip.",
            why="Guests share it — so your celebration travels far beyond the venue.",
            how="We position it where the queue will not block the walkway, with lighting and props ready before guests arrive.",
            facts=[("Typical setup", "45 mins"), ("Needs", "8–10 ft space"), ("Runs", "2–4 hours")],
            bestFor=["Weddings", "Corporate", "Birthdays", "College Events"],
        ),
        hi=dict(
            what="Camera jo mehmaanon ke chaaron taraf ghumta hai aur unhe clip bhej deta hai.",
            why="Mehmaan usko share karte hain — aapki celebration venue se bahar bhi pahunch jaati hai.",
            how="Wahan lagate hain jahan line walkway na roke, aur light aur props mehmaan aane se pehle taiyaar rakhte hain.",
            facts=[("Setup ka time", "45 minute"), ("Zaroorat", "8–10 feet jagah"), ("Chalta hai", "2–4 ghante")],
            bestFor=["Shaadi", "Corporate", "Birthday", "College Event"],
        ),
    ),
    "Kids Zone & Character Fun": dict(
        en=dict(
            what="A dedicated area where the children get to be children.",
            why="When the kids are happy, the parents actually enjoy the function.",
            how="We keep it in sight of the main seating, soften every edge, and staff it so the hosts never have to supervise.",
            facts=[("Typical setup", "1–2 hours"), ("Where", "Corner, within sight"), ("Runs", "Through the function")],
            bestFor=["Kids Birthdays", "Weddings", "Family Functions", "Baby Showers"],
        ),
        hi=dict(
            what="Alag jagah jahan bachche bachche reh sakte hain.",
            why="Bachche khush to mummy-papa sach me function enjoy karte hain.",
            how="Ise main seating ke saamne rakhte hain, har edge narm karte hain, aur staff dete hain — taki hosts ko nazar rakhni na pade.",
            facts=[("Setup ka time", "1–2 ghante"), ("Kahan", "Saamne, corner me"), ("Chalta hai", "Poora function")],
            bestFor=["Kids Birthday", "Shaadi", "Family Function", "Baby Shower"],
        ),
    ),
    "Sweet Cart & Candy Bar": dict(
        en=dict(
            what="A styled cart of sweets, jars and treats.",
            why="It is the busiest corner of every function — for every age.",
            how="The cart is dressed to match your palette and stocked before guests arrive, with refills through the event.",
            facts=[("Typical setup", "45 mins"), ("Where", "Near the entrance"), ("Restocked", "Through the event")],
            bestFor=["Birthdays", "Baby Showers", "Weddings", "Corporate"],
        ),
        hi=dict(
            what="Sajaya hua cart — mithai, jars aur treats ka.",
            why="Har function ka sabse busy corner — har umar ke liye.",
            how="Cart aapki palette me sajta hai, mehmaan aane se pehle bhar diya jata hai, aur poore function refill hota rehta hai.",
            facts=[("Setup ka time", "45 minute"), ("Kahan", "Entrance ke paas"), ("Refill", "Poore function")],
            bestFor=["Birthday", "Baby Shower", "Shaadi", "Corporate"],
        ),
    ),
    "Live Entertainment": dict(
        en=dict(
            what="Anchors, dhol, DJ, magicians and performers.",
            why="Performers decide the energy of the evening — more than the decor does.",
            how="We book, brief and time each act around your schedule, so nothing overlaps with the rituals.",
            facts=[("Booked", "In advance"), ("Where", "Any venue"), ("Timed", "To your schedule")],
            bestFor=["Weddings", "Sangeet", "Corporate", "Birthdays"],
        ),
        hi=dict(
            what="Anchor, dhol, DJ, magician aur performers.",
            why="Shaam ki energy performers tay karte hain — decor se bhi zyada.",
            how="Har act ko aapke schedule ke around book, brief aur time karte hain — taki rasmon se kuch overlap na ho.",
            facts=[("Booking", "Pehle se"), ("Kahan", "Koi bhi venue"), ("Timing", "Aapke schedule par")],
            bestFor=["Shaadi", "Sangeet", "Corporate", "Birthday"],
        ),
    ),
    "Surprise Setups": dict(
        en=dict(
            what="Small, personal setups — a room, a car, a desk or a pet.",
            why="It is the simplest way to say something words cannot.",
            how="We set up quietly before you arrive, work to your timings, and clear everything away after the moment.",
            facts=[("Typical setup", "30–45 mins"), ("Where", "Room, car, desk"), ("Cleared", "Quietly after")],
            bestFor=["Surprises", "Anniversaries", "Proposals", "Farewells"],
        ),
        hi=dict(
            what="Chhote, personal setups — room, car, desk ya pet.",
            why="Jo shabdon me kehna mushkil ho, uske liye sabse aasan tarika.",
            how="Aapke aane se pehle chup-chaap sajate hain, aapke timing ke hisaab se chalte hain, aur moment ke baad sab hata dete hain.",
            facts=[("Setup ka time", "30–45 minute"), ("Kahan", "Room, car, desk"), ("Hataya", "Chup-chaap, baad me")],
            bestFor=["Surprise", "Anniversary", "Proposal", "Farewell"],
        ),
    ),
}
