"""Chip-level full detail for group 2 — the nine structures. EN + HI.

what / why / how / facts(3) / bestFor(4), matching the group 1 pattern.
"""

CHIPS2 = {
    "Backdrop / Photo Booth": dict(
        en=dict(
            what="A styled wall or frame built as the place guests photograph themselves.",
            why="Of everything we set up, this is the only piece that stays in the album forever.",
            how="We build the frame first, layer florals and balloons over it, then set seating and light so it looks complete in every photo.",
            facts=[("Typical setup", "1–2 hours"), ("Needs", "A wall or hidden stand"), ("Runs", "Through the event")],
            bestFor=["Birthdays", "Baby Showers", "Weddings", "Corporate"],
        ),
        hi=dict(
            what="Sajayi hui deewar ya frame — jahan mehmaan khud ki photo lete hain.",
            why="Jo bhi hum lagate hain, sirf yahi cheez album me hamesha ke liye rehti hai.",
            how="Pehle frame banate hain, uspar phool aur gubbare layer karte hain, phir seating aur light set karte hain — taki har photo me poora lage.",
            facts=[("Setup ka time", "1–2 ghante"), ("Zaroorat", "Deewar ya chhupa stand"), ("Chalta hai", "Poora function")],
            bestFor=["Birthday", "Baby Shower", "Shaadi", "Corporate"],
        ),
    ),
    "Arch / Entrance Gate": dict(
        en=dict(
            what="The frame guests pass through before they see anything else.",
            why="It sets the expectation for the whole celebration in three seconds.",
            how="We measure the width and the walking height, then build the arch on site so it sits straight and stays steady all evening.",
            facts=[("Typical setup", "1–2 hours"), ("Needs", "8–10 ft width"), ("Runs", "Through the event")],
            bestFor=["Weddings", "Receptions", "Grand Openings", "Birthdays"],
        ),
        hi=dict(
            what="Wo frame jisse hokar mehmaan andar aate hain — baaki sab uske baad dikhta hai.",
            why="Teen second me poori celebration ka andaaza isse lag jaata hai.",
            how="Width aur chalne ki unchai naapte hain, phir arch site par banate hain — taki seedha khada rahe aur poore function tikā rahe.",
            facts=[("Setup ka time", "1–2 ghante"), ("Zaroorat", "8–10 feet jagah"), ("Chalta hai", "Poora function")],
            bestFor=["Shaadi", "Reception", "Grand Opening", "Birthday"],
        ),
    ),
    "Mandap & Pandal": dict(
        en=dict(
            what="A full traditional structure — pillars, canopy and draping for the ceremony itself.",
            why="Families need a setting that holds the ritual respectfully and still looks premium on camera.",
            how="We plan around the ritual first — seating, havan, walkway — then style florals and drapes around that plan.",
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
            what="The main working frame — truss, panels, skirting and the backdrop behind it.",
            why="Every function needs a focal point the eye lands on first.",
            how="The truss is rigged for weight and safety, then dressed with drapes, florals and light bars so the structure itself disappears.",
            facts=[("Typical setup", "2–4 hours"), ("Needs", "Level ground"), ("Runs", "Through the event")],
            bestFor=["Weddings", "Corporate", "Award Nights", "Annual Days"],
        ),
        hi=dict(
            what="Main kaam wala dhaancha — truss, panels, skirting aur peeche ka backdrop.",
            why="Har function ko ek focal point chahiye jahan nazar pehle jaaye.",
            how="Truss weight aur safety ke hisaab se rig hota hai, phir drapes, phool aur light bars se sajaya jata hai — taki dhaancha dikhe hi na.",
            facts=[("Setup ka time", "2–4 ghante"), ("Zaroorat", "Samtal zameen"), ("Chalta hai", "Poora function")],
            bestFor=["Shaadi", "Corporate", "Award Night", "Annual Day"],
        ),
    ),
    "Ceiling & Hanging Decor": dict(
        en=dict(
            what="Decoration above eye level — the layer most setups forget entirely.",
            why="Guests look up the moment they walk in, and a dressed ceiling makes a room feel twice as grand.",
            how="We map the ceiling height and rigging points, then hang florals, balloons and lights in balanced layers.",
            facts=[("Typical setup", "1–3 hours"), ("Needs", "Rigging points"), ("Runs", "Through the event")],
            bestFor=["Receptions", "Weddings", "Corporate", "Baby Showers"],
        ),
        hi=dict(
            what="Aankh ki unchai se upar ki sajawat — jo zyaadatar setup poori tarah bhool jaate hain.",
            why="Mehmaan andar aate hi upar dekhta hai, aur saji hui chhat kamre ko dugna bada dikhati hai.",
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
            why="Aaraam kisi bhi arch se kaafi zyada yaad rehta hai.",
            how="Linen, cutlery aur centrepieces sabse aakhir me lagate hain, ek hi rhythm me, aur tabletop ke hisaab se light set karte hain.",
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
            what="Private setup — ek sawaal aur ek jawaab ke liye bani hui.",
            why="Ye personal lagni chahiye — kiraye ki nahi.",
            how="Jagah dekh kar reveal angle plan karte hain, aur sab kuch aapke pahunchne se pehle chup-chaap taiyaar kar dete hain.",
            facts=[("Setup ka time", "45–90 minute"), ("Kahan", "Rooftop, pool, room"), ("Hataya jata hai", "Moment ke baad")],
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
            why="Cake cutting hi kisi bhi function ka sabse zyada photographed minute hai.",
            how="Plinth ki unchai set karte hain, dessert display sajate hain, phir light aise dete hain ki cake camera me perfect lage.",
            facts=[("Setup ka time", "45–60 minute"), ("Zaroorat", "Power point"), ("Chalta hai", "Poora function")],
            bestFor=["Birthday", "Shaadi", "Baby Shower", "Anniversary"],
        ),
    ),
}
