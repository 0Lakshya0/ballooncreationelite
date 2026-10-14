"""Deeper option copy, part A — Balloon, Floral, Drapes, Lighting (24 options).

Adds to each option: pick ("choose this when"), time, colours, best-for tags,
what comes with it, and which other setups it pairs with. EN + HI.
"""

OPTS_A = {
    "Balloon Decor": {
        "Organic balloon garland": {
            "en": dict(
                pick="Choose this when you want maximum impact across a wall without a rigid structure.",
                time="45–60 mins", colours="Ivory · blush · sage · chrome gold · pastel mix",
                best=["Birthdays", "Baby Showers", "House Warming"],
                comes=["Three to five balloon sizes", "Matching chrome accents", "Hidden fixing and hooks", "On-site finishing and clean-up"],
                pairs=["Balloon wall & cloud", "Backdrop / Photo Booth", "Drapes & Fabric"],
            ),
            "hi": dict(
                pick="Jab deewar par bina kisi sakht dhaanche ke sabse zyada impact chahiye.",
                time="45–60 minute", colours="Ivory · blush · sage · chrome gold · pastel mix",
                best=["Birthday", "Baby Shower", "House Warming"],
                comes=["Teen se paanch size ke gubbare", "Matching chrome accents", "Chhupi fixing aur hooks", "Site par finishing aur safai"],
                pairs=["Balloon wall & cloud", "Backdrop / Photo Booth", "Drapes & Fabric"],
            ),
        },
        "Balloon arch & columns": {
            "en": dict(
                pick="Choose this when the entrance deserves a moment of its own.",
                time="60–90 mins", colours="Two-tone or three-tone palettes",
                best=["Weddings", "Grand Openings", "Birthdays"],
                comes=["Hidden rigid frame", "Balloon layering inside-out", "Weighted bases for wind", "Clean finish on the guest side"],
                pairs=["Walkway & Aisle Decor", "Custom Signage", "Arch / Entrance Gate"],
            ),
            "hi": dict(
                pick="Jab entrance ko apna ek alag moment dena ho.",
                time="60–90 minute", colours="Do ya teen tone ki palette",
                best=["Shaadi", "Grand Opening", "Birthday"],
                comes=["Chhupa hua rigid frame", "Andar se bahar balloon layering", "Hawa ke liye weighted base", "Mehmaan wali side par saaf finish"],
                pairs=["Walkway & Aisle Decor", "Custom Signage", "Arch / Entrance Gate"],
            ),
        },
        "Jumbo & chrome balloons": {
            "en": dict(
                pick="Choose this when photos will be taken with flash or in bright daylight.",
                time="30 mins", colours="Chrome gold · silver · rose gold · pearl white",
                best=["Engagements", "Anniversaries", "Luxury Birthdays"],
                comes=["Chrome and pearl jumbos", "Slow-inflated flawless finish", "Hidden suspension strings", "On-site placement by hand"],
                pairs=["Organic balloon garland", "Premium Finishes", "Backdrop / Photo Booth"],
            ),
            "hi": dict(
                pick="Jab photos flash ya tez roshni me lene ki hon.",
                time="30 minute", colours="Chrome gold · silver · rose gold · pearl white",
                best=["Engagement", "Anniversary", "Luxury Birthday"],
                comes=["Chrome aur pearl jumbo gubbare", "Dheere inflate karke flawless finish", "Chhupi suspension strings", "Site par haath se placement"],
                pairs=["Organic balloon garland", "Premium Finishes", "Backdrop / Photo Booth"],
            ),
        },
        "Balloon wall & cloud": {
            "en": dict(
                pick="Choose this when you need a solid, full background for photographs.",
                time="60–90 mins", colours="Single tone, ombre or mixed palette",
                best=["Birthdays", "Baby Showers", "Corporate"],
                comes=["Wall or frame mounting", "Row-by-row build", "Colour blocking", "Solid base for stability"],
                pairs=["Backdrop / Photo Booth", "Props & Cutouts", "Premium Finishes"],
            ),
            "hi": dict(
                pick="Jab photo ke liye solid aur poora background chahiye.",
                time="60–90 minute", colours="Ek tone, ombre ya mixed palette",
                best=["Birthday", "Baby Shower", "Corporate"],
                comes=["Deewar ya frame par mounting", "Ek-ek row karke build", "Colour blocking", "Stability ke liye solid base"],
                pairs=["Backdrop / Photo Booth", "Props & Cutouts", "Premium Finishes"],
            ),
        },
        "Bubble & confetti balloons": {
            "en": dict(
                pick="Choose this when the palette is soft and you want a lighter, airier look.",
                time="20 mins", colours="Clear with gold, silver or pastel confetti",
                best=["Baby Showers", "Engagements", "Bridal Showers"],
                comes=["Dry confetti filling", "Slow inflation, no settling", "Sealed finish", "Mixed into your main garland"],
                pairs=["Organic balloon garland", "Premium Finishes", "Floral Decor"],
            ),
            "hi": dict(
                pick="Jab palette soft ho aur look halka aur hawaadar chahiye.",
                time="20 minute", colours="Transparent gubbare — gold, silver ya pastel confetti ke saath",
                best=["Baby Shower", "Engagement", "Bridal Shower"],
                comes=["Sookha confetti filling", "Dheere inflation, kuch neeche nahi baithta", "Sealed finish", "Main garland me mixed"],
                pairs=["Organic balloon garland", "Premium Finishes", "Floral Decor"],
            ),
        },
        "Number & alphabet balloons": {
            "en": dict(
                pick="Choose this for a milestone where the number or name must be readable in every photo.",
                time="30 mins", colours="Foil metallic, or balloon-built in your palette",
                best=["1st Birthday", "25th Anniversary", "Shop Openings"],
                comes=["Foil or balloon-built letters", "Hidden support", "Backdrop pairing", "Daylight alignment check"],
                pairs=["Custom Signage", "Balloon wall & cloud", "Cake Table & Dessert Bar"],
            ),
            "hi": dict(
                pick="Milestone ke liye — jahan number ya naam har photo me padhna zaroori ho.",
                time="30 minute", colours="Foil metallic, ya aapki palette me balloon se bane",
                best=["Pehla Birthday", "25vi Anniversary", "Shop Opening"],
                comes=["Foil ya balloon se bane letters", "Chhupa support", "Backdrop ke saath pairing", "Din ki roshni me alignment check"],
                pairs=["Custom Signage", "Balloon wall & cloud", "Cake Table & Dessert Bar"],
            ),
        },
    },
    "Floral Decor": {
        "Fresh flower wall": {
            "en": dict(
                pick="Choose this when the photo zone is the highlight of the whole event.",
                time="2–3 hours", colours="White · blush · peach · seasonal blooms",
                best=["Weddings", "Receptions", "Engagements"],
                comes=["Water-fed frame", "Fresh blooms wired on site", "Green backing so no gaps show", "Clean-up of fallen petals"],
                pairs=["Backdrop / Photo Booth", "Premium Finishes", "Lighting Decor"],
            ),
            "hi": dict(
                pick="Jab photo zone hi poore event ka highlight ho.",
                time="2–3 ghante", colours="White · blush · peach · mausam ke phool",
                best=["Shaadi", "Reception", "Engagement"],
                comes=["Paani wala frame", "Taaza phool site par wire", "Peeche green backing, gaps nahi dikhte", "Gire petals ki safai"],
                pairs=["Backdrop / Photo Booth", "Premium Finishes", "Lighting Decor"],
            ),
        },
        "Rose & orchid arrangements": {
            "en": dict(
                pick="Choose this when the table needs to look valuable, not merely pretty.",
                time="1–2 hours", colours="Ivory · rose · orchid purple · green",
                best=["Anniversaries", "Weddings", "Corporate Dinners"],
                comes=["Conditioned fresh blooms", "Vase or plinth styling", "Tiered arrangement", "Replacement blooms kept on standby"],
                pairs=["Tablescape & Lounge", "Cake Table & Dessert Bar", "Lighting Decor"],
            ),
            "hi": dict(
                pick="Jab table sirf sundar nahi, mehnga dikhna chahiye.",
                time="1–2 ghante", colours="Ivory · rose · orchid purple · green",
                best=["Anniversary", "Shaadi", "Corporate Dinner"],
                comes=["Taiyaar kiye taaza phool", "Vase ya plinth styling", "Tiers me arrangement", "Backup phool saath rakhte hain"],
                pairs=["Tablescape & Lounge", "Cake Table & Dessert Bar", "Lighting Decor"],
            ),
        },
        "Floral arch & pillars": {
            "en": dict(
                pick="Choose this when guests will walk through it, not just look at it.",
                time="2–3 hours", colours="Classic white-green or your bridal palette",
                best=["Weddings", "Receptions", "Baby Showers"],
                comes=["Hidden structural frame", "Top-down floral finishing", "Weighted footing", "Evening misting to stay fresh"],
                pairs=["Arch / Entrance Gate", "Walkway & Aisle Decor", "Drapes & Fabric"],
            ),
            "hi": dict(
                pick="Jab mehmaan iske neeche se guzrenge, sirf dekhenge nahi.",
                time="2–3 ghante", colours="Classic white-green ya aapki bridal palette",
                best=["Shaadi", "Reception", "Baby Shower"],
                comes=["Chhupa structural frame", "Upar se neeche floral finishing", "Weighted base", "Shaam me paani chhidak kar taaza rakhte hain"],
                pairs=["Arch / Entrance Gate", "Walkway & Aisle Decor", "Drapes & Fabric"],
            ),
        },
        "Hanging & ceiling florals": {
            "en": dict(
                pick="Choose this when the floor is already full and you still want more impact.",
                time="1–3 hours", colours="Soft whites, greens and pastels",
                best=["Receptions", "Weddings", "Corporate"],
                comes=["Rigging and safety wire", "Hanging arrangements", "Set hanging height", "Safety test before guests arrive"],
                pairs=["Ceiling & Hanging Decor", "Lighting Decor", "Mandap & Pandal"],
            ),
            "hi": dict(
                pick="Jab farsh already bhara ho aur phir bhi impact badhana ho.",
                time="1–3 ghante", colours="Halke white, green aur pastel",
                best=["Reception", "Shaadi", "Corporate"],
                comes=["Rigging aur safety wire", "Latakte arrangements", "Fixed hanging height", "Mehmaan aane se pehle safety test"],
                pairs=["Ceiling & Hanging Decor", "Lighting Decor", "Mandap & Pandal"],
            ),
        },
        "Table centrepieces": {
            "en": dict(
                pick="Choose this when guests must be able to talk comfortably across the table.",
                time="45 mins", colours="Matched to your linen and crockery",
                best=["Weddings", "Anniversaries", "Corporate Dinners"],
                comes=["Low arrangements", "Vessel styling", "Identical repeated sets", "Table-by-table placement"],
                pairs=["Tablescape & Lounge", "Cake Table & Dessert Bar", "Lighting Decor"],
            ),
            "hi": dict(
                pick="Jab mehmaan ko table ke paar aaram se baat karni ho.",
                time="45 minute", colours="Aapke linen aur crockery se match",
                best=["Shaadi", "Anniversary", "Corporate Dinner"],
                comes=["Neeche wale arrangements", "Vessels ki styling", "Ek jaise repeat sets", "Table-by-table placement"],
                pairs=["Tablescape & Lounge", "Cake Table & Dessert Bar", "Lighting Decor"],
            ),
        },
        "Flower & petal walkway": {
            "en": dict(
                pick="Choose this when the entry or aisle deserves drama.",
                time="45 mins", colours="Rose · white · marigold for traditional setups",
                best=["Weddings", "Proposals", "Grand Entries"],
                comes=["Fresh petal laying", "Gradient colour planning", "Slip-safe handling", "Post-event sweeping"],
                pairs=["Walkway & Aisle Decor", "Arch / Entrance Gate", "Lighting Decor"],
            ),
            "hi": dict(
                pick="Jab entry ya aisle me drama chahiye.",
                time="45 minute", colours="Rose · white · traditional ke liye marigold",
                best=["Shaadi", "Proposal", "Grand Entry"],
                comes=["Taaza petals bichana", "Gradient colour planning", "Phisalne se bachav", "Function ke baad safai"],
                pairs=["Walkway & Aisle Decor", "Arch / Entrance Gate", "Lighting Decor"],
            ),
        },
    },
    "Drapes & Fabric": {
        "Sheer & chiffon drapes": {
            "en": dict(
                pick="Choose this when a hall looks plain and the budget needs to work hard.",
                time="2 hours", colours="White · ivory · blush · champagne",
                best=["Weddings", "Receptions", "Corporate"],
                comes=["Ceiling-to-floor draping", "Hidden support", "Even fold setting", "Steam finishing on site"],
                pairs=["Lighting Decor", "Backdrop / Photo Booth", "Ceiling & Hanging Decor"],
            ),
            "hi": dict(
                pick="Jab hall plain lage aur budget me sabse zyada kaam chahiye.",
                time="2 ghante", colours="White · ivory · blush · champagne",
                best=["Shaadi", "Reception", "Corporate"],
                comes=["Chhat se farsh tak draping", "Chhupa support", "Barabar folds", "Site par steam finishing"],
                pairs=["Lighting Decor", "Backdrop / Photo Booth", "Ceiling & Hanging Decor"],
            ),
        },
        "Satin & velvet panels": {
            "en": dict(
                pick="Choose this when the backdrop must look rich in a formal setting.",
                time="2–3 hours", colours="Ivory · burgundy · emerald · navy",
                best=["Weddings", "Corporate", "Receptions"],
                comes=["Made-to-measure panels", "Steamed finish", "Weighted hem", "Careful removal after the event"],
                pairs=["Stage & Front Truss", "Premium Finishes", "Lighting Decor"],
            ),
            "hi": dict(
                pick="Jab formal setting me backdrop rich dikhna chahiye.",
                time="2–3 ghante", colours="Ivory · burgundy · emerald · navy",
                best=["Shaadi", "Corporate", "Reception"],
                comes=["Naap ke hisaab se panels", "Steam kiya hua finish", "Neeche weight wala hem", "Baad me sambhal kar hatana"],
                pairs=["Stage & Front Truss", "Premium Finishes", "Lighting Decor"],
            ),
        },
        "Ceiling & tent draping": {
            "en": dict(
                pick="Choose this when you want one single change to lift the entire room.",
                time="2–3 hours", colours="Single ivory, or two-tone",
                best=["Weddings", "Receptions", "Haldi & Mehndi"],
                comes=["Room-wide canopy", "Edge pinning", "Tension testing", "Night-time light check"],
                pairs=["Lighting Decor", "Ceiling & Hanging Decor", "Mandap & Pandal"],
            ),
            "hi": dict(
                pick="Jab ek hi change se poore kamre ko uthana ho.",
                time="2–3 ghante", colours="Ek ivory tone, ya two-tone",
                best=["Shaadi", "Reception", "Haldi aur Mehndi"],
                comes=["Poore kamre par canopy", "Kinaron par pinning", "Tension testing", "Raat me light check"],
                pairs=["Lighting Decor", "Ceiling & Hanging Decor", "Mandap & Pandal"],
            ),
        },
        "Gathered backdrop drapes": {
            "en": dict(
                pick="Choose this when the cake or the couple needs a classic frame behind them.",
                time="1–2 hours", colours="Any single tone with a gold tie",
                best=["Weddings", "Birthdays", "Receptions"],
                comes=["Centre gather styling", "Even spread to both sides", "Gold tie or brooch detail", "Photo angle check"],
                pairs=["Cake Table & Dessert Bar", "Backdrop / Photo Booth", "Floral Decor"],
            ),
            "hi": dict(
                pick="Jab cake ya couple ke peeche classic frame chahiye.",
                time="1–2 ghante", colours="Koi bhi ek tone, gold tie ke saath",
                best=["Shaadi", "Birthday", "Reception"],
                comes=["Beech me gather styling", "Dono taraf barabar failav", "Gold tie ya brooch detail", "Photo angle check"],
                pairs=["Cake Table & Dessert Bar", "Backdrop / Photo Booth", "Floral Decor"],
            ),
        },
        "Table & chair draping": {
            "en": dict(
                pick="Choose this when the venue's own linen looks tired in photographs.",
                time="1–2 hours", colours="Palette-matched linen and sashes",
                best=["Weddings", "Corporate", "Anniversaries"],
                comes=["Fitted linen", "Runners and napkins", "Sashes tied evenly", "Pressed before setting"],
                pairs=["Tablescape & Lounge", "Floral Decor", "Premium Finishes"],
            ),
            "hi": dict(
                pick="Jab venue ka apna linen photos me thaka hua lage.",
                time="1–2 ghante", colours="Palette se match karta linen aur sashes",
                best=["Shaadi", "Corporate", "Anniversary"],
                comes=["Fitted linen", "Runners aur napkins", "Sashes barabar bandhe hue", "Lagane se pehle press"],
                pairs=["Tablescape & Lounge", "Floral Decor", "Premium Finishes"],
            ),
        },
        "Floating fabric ceiling": {
            "en": dict(
                pick="Choose this when the venue has height and you want to use it.",
                time="2–3 hours", colours="White · ivory · soft pastels",
                best=["Weddings", "Receptions", "Mandap"],
                comes=["Staggered panel hanging", "Hidden rigging", "Depth planning", "Light-ready finish"],
                pairs=["Lighting Decor", "Ceiling & Hanging Decor", "Mandap & Pandal"],
            ),
            "hi": dict(
                pick="Jab venue me unchai ho aur usko use karna ho.",
                time="2–3 ghante", colours="White · ivory · halke pastel",
                best=["Shaadi", "Reception", "Mandap"],
                comes=["Alag-alag gehrai par panels", "Chhupi rigging", "Depth planning", "Light ke liye taiyaar finish"],
                pairs=["Lighting Decor", "Ceiling & Hanging Decor", "Mandap & Pandal"],
            ),
        },
    },
    "Lighting Decor": {
        "Fairy & string lights": {
            "en": dict(
                pick="Choose this when you want warmth in every photograph.",
                time="45–90 mins", colours="Warm white (recommended) or cool white",
                best=["All Occasions", "Weddings", "Birthdays"],
                comes=["Dense string wiring", "Hidden cable runs", "Backup sets on site", "Extension and safety check"],
                pairs=["Drapes & Fabric", "Floral Decor", "Ceiling & Hanging Decor"],
            ),
            "hi": dict(
                pick="Jab har photo me warmth chahiye.",
                time="45–90 minute", colours="Warm white (recommended) ya cool white",
                best=["Har mauke", "Shaadi", "Birthday"],
                comes=["Ghani string wiring", "Chhupe hue cables", "Site par backup sets", "Extension aur safety check"],
                pairs=["Drapes & Fabric", "Floral Decor", "Ceiling & Hanging Decor"],
            ),
        },
        "Warm uplighters": {
            "en": dict(
                pick="Choose this when the hall feels cold or flat on camera.",
                time="45 mins", colours="Amber · warm white · magenta accent",
                best=["Weddings", "Corporate", "Receptions"],
                comes=["Floor units", "Hand aiming and dimming", "Cable safety covers", "One standby unit"],
                pairs=["Drapes & Fabric", "Stage & Front Truss", "Backdrop / Photo Booth"],
            ),
            "hi": dict(
                pick="Jab hall camera par thanda ya flat lage.",
                time="45 minute", colours="Amber · warm white · magenta accent",
                best=["Shaadi", "Corporate", "Reception"],
                comes=["Farsh par units", "Haath se aiming aur dimming", "Cable safety covers", "Ek standby unit"],
                pairs=["Drapes & Fabric", "Stage & Front Truss", "Backdrop / Photo Booth"],
            ),
        },
        "Chandeliers & pendants": {
            "en": dict(
                pick="Choose this when the venue has height but no character.",
                time="1–2 hours", colours="Crystal · gold · black metal",
                best=["Weddings", "Receptions", "Luxury Birthdays"],
                comes=["Rigging and levelling", "Matched hanging height", "Duplicate fixtures for symmetry", "Sturdy mounting"],
                pairs=["Ceiling & Hanging Decor", "Drapes & Fabric", "Tablescape & Lounge"],
            ),
            "hi": dict(
                pick="Jab venue me unchai ho par character nahi.",
                time="1–2 ghante", colours="Crystal · gold · black metal",
                best=["Shaadi", "Reception", "Luxury Birthday"],
                comes=["Rigging aur levelling", "Ek jaisi hanging height", "Symmetry ke liye duplicate fixtures", "Mazboot mounting"],
                pairs=["Ceiling & Hanging Decor", "Drapes & Fabric", "Tablescape & Lounge"],
            ),
        },
        "Neon-style light pieces": {
            "en": dict(
                pick="Choose this when a name or a date should glow in the photographs.",
                time="30 mins", colours="Warm white · gold glow · ice blue",
                best=["Proposals", "Birthdays", "Corporate"],
                comes=["Made-to-order lettering", "Hidden power routing", "Glow-evenness test", "Stand or hang mounting"],
                pairs=["Custom Signage", "Backdrop / Photo Booth", "Marry Me / Proposal"],
            ),
            "hi": dict(
                pick="Jab naam ya tareekh photos me chamakna chahiye.",
                time="30 minute", colours="Warm white · gold glow · ice blue",
                best=["Proposal", "Birthday", "Corporate"],
                comes=["Order par banayi lettering", "Chhupi power wiring", "Glow barabar hai ya nahi — test", "Stand ya hang mounting"],
                pairs=["Custom Signage", "Backdrop / Photo Booth", "Marry Me / Proposal"],
            ),
        },
        "Pathway & tree lighting": {
            "en": dict(
                pick="Choose this when guests must find their way in the dark.",
                time="1 hour", colours="Warm white, occasionally amber",
                best=["Weddings", "Outdoor Events", "Receptions"],
                comes=["Even-interval placement", "Weather-safe cabling", "After-dark testing", "Tree and trunk wrapping"],
                pairs=["Walkway & Aisle Decor", "Arch / Entrance Gate", "Greenery & Foliage"],
            ),
            "hi": dict(
                pick="Jab mehmaanon ko andhere me raasta dhundhna ho.",
                time="1 ghanta", colours="Warm white, kabhi amber",
                best=["Shaadi", "Outdoor Event", "Reception"],
                comes=["Barabar antar par placement", "Mausam-safe cabling", "Andhera hone ke baad testing", "Ped ke tane par wrapping"],
                pairs=["Walkway & Aisle Decor", "Arch / Entrance Gate", "Greenery & Foliage"],
            ),
        },
        "Candles & lanterns": {
            "en": dict(
                pick="Choose this when you want romance without building a big structure.",
                time="30 mins", colours="Amber glow with glass and brass",
                best=["Proposals", "Anniversaries", "Weddings"],
                comes=["Lantern or glass housing", "Wind protection", "Safe placement around fabric", "Tending through the evening"],
                pairs=["Marry Me / Proposal", "Walkway & Aisle Decor", "Tablescape & Lounge"],
            ),
            "hi": dict(
                pick="Jab bada setup banaye bina romance chahiye.",
                time="30 minute", colours="Amber glow, glass aur brass ke saath",
                best=["Proposal", "Anniversary", "Shaadi"],
                comes=["Lantern ya glass housing", "Hawa se bachav", "Kapde se door safe placement", "Shaam bhar dekhbhal"],
                pairs=["Marry Me / Proposal", "Walkway & Aisle Decor", "Tablescape & Lounge"],
            ),
        },
    },
}
