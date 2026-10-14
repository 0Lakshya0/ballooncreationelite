"""Option-level full detail for Group 1 (8 chips x 6 options) — EN + HI.

Each option carries: what it is, how it is made, where it is used, good to know.
Used by _build2.py.
"""

OPTS_G1 = {
    "Balloon Decor": {
        "Organic balloon garland": dict(
            en=dict(what="A free-flowing, layered garland of mixed-size balloons.", how="Balloons in three to five sizes are inflated to exact diameters and pinned in clusters so the surface never looks flat.", where="Wrapped along a wall, arch, backdrop edge or staircase.", note="The most versatile balloon style — it works in any colour combination you choose."),
            hi=dict(what="Alag-alag size ke gubbare ki layered, free-flowing garland.", how="Teen se paanch size ke gubbare exact diameter me inflate karke clusters me pin karte hain — taki surface kabhi flat na lage.", where="Deewar, arch, backdrop ke kinare ya seedhi ke saath.", note="Sabse versatile balloon style — aapki koi bhi colour combination chalti hai."),
        ),
        "Balloon arch & columns": dict(
            en=dict(what="A structured arch or pair of pillars, built to a fixed height and width.", how="A hidden frame holds the shape while balloons are layered over it from the inside out.", where="Entrance gates, stage sides, photo frames and doorways.", note="Best where the venue already has a doorway worth dressing."),
            hi=dict(what="Bana-banaya arch ya do pillars, fixed height aur width me.", how="Chhupa hua frame shape sambhalta hai aur uspar andar se bahar tak gubbare layer hote hain.", where="Entrance gate, stage ke side, photo frame aur darwaze.", note="Sabse achha wahan jahan venue me pehle se sajane layak darwaza ho."),
        ),
        "Jumbo & chrome balloons": dict(
            en=dict(what="Oversized balloons with a mirror-like metallic finish.", how="Chrome balloons are inflated slowly and evenly so the surface stays flawless and free of marks.", where="As statement pieces inside garlands, clouds and arches.", note="They must never be deflated early — the shine is the entire point."),
            hi=dict(what="Bade size ke gubbare, mirror jaisi metallic chamak ke saath.", how="Chrome gubbare dheere aur barabar inflate karte hain — taki surface par koi daag ya nishaan na aaye.", where="Garland, cloud aur arch me statement piece ki tarah.", note="Inhe jaldi deflate nahi karna — poori baat hi unki chamak hai."),
        ),
        "Balloon wall & cloud": dict(
            en=dict(what="A dense wall or a floating cluster of balloons.", how="Balloons are built up row by row on a frame until the surface is solid.", where="Backdrops, selfie corners, behind the cake.", note="It is heavy — it needs a wall or a stand, never just a hook."),
            hi=dict(what="Ghana balloon wall ya hawa me tairta cluster.", how="Frame par ek-ek row gubbare chadhaate hain jab tak surface solid na ho jaaye.", where="Backdrop, selfie corner, cake ke peeche.", note="Ye bhaari hota hai — deewar ya stand chahiye, sirf hook se kaam nahi chalta."),
        ),
        "Bubble & confetti balloons": dict(
            en=dict(what="Clear balloons filled with confetti, feathers, or nothing at all.", how="Confetti is inserted dry first, then the balloon is inflated and sealed so nothing settles at the bottom.", where="Mixed into garlands to lighten the look.", note="A luxury feel for very little extra cost — ask for it in at least one size."),
            hi=dict(what="Transparent gubbare — andar confetti, pankh, ya kuch bhi nahi.", how="Pehle sookha confetti daalte hain, phir gubbara inflate karke seal karte hain — taki kuch neeche baith na jaaye.", where="Garland me mila dete hain, look halka karne ke liye.", note="Bahut kam extra kharch me luxury feel — kam se kam ek size me zaroor maangein."),
        ),
        "Number & alphabet balloons": dict(
            en=dict(what="Large numbers and letters, either inflated foil or built from balloons.", how="We choose between foil or a balloon-built frame depending on how large and how sharp the shape must be.", where="Milestones — first birthdays, 25th anniversaries, shop openings.", note="The shape is judged entirely in photographs, so we keep the edges crisp."),
            hi=dict(what="Bade numbers aur letters — foil se, ya gubbare se banaye hue.", how="Shape kitna bada aur kitna sharp chahiye, uske hisaab se foil ya balloon-frame choose karte hain.", where="Milestone — pehla birthday, 25vi anniversary, shop opening.", note="Shape ka poora faisla photo me hota hai, isliye edges sharp rakhte hain."),
        ),
    },
    "Floral Decor": {
        "Fresh flower wall": dict(
            en=dict(what="A full wall of fresh blooms, built panel by panel.", how="Each bloom is wired into a water-fed frame on site, so it stays fresh from the first guest to the last.", where="Backdrops, photo corners and stage fronts.", note="It is built on the day itself — a flower wall never looks tired if it is made fresh."),
            hi=dict(what="Taaza phoolon ki poori deewar, ek-ek panel karke bani.", how="Har phool ko site par water-fed frame me wire karte hain — taki pehle se aakhri mehmaan tak taaza rahe.", where="Backdrop, photo corner aur stage ke aage.", note="Ye usi din banti hai — taaza bani flower wall kabhi thaki hui nahi lagti."),
        ),
        "Rose & orchid arrangements": dict(
            en=dict(what="Dense, high-value arrangements in the flowers you choose.", how="Blooms are conditioned, then arranged in tiers of height so the arrangement reads full from every seat.", where="Centrepieces, plinths, gift tables and cake tables.", note="Fragrance is part of the design, not a side effect."),
            hi=dict(what="Ghani, mehngi arrangements — aapke chune hue phoolon me.", how="Phool taiyaar karke unchai ke tiers me sajate hain — taki har seat se arrangement bhara hua lage.", where="Centrepiece, plinth, gift table aur cake table.", note="Khushbu yahan design ka hissa hai, side effect nahi."),
        ),
        "Floral arch & pillars": dict(
            en=dict(what="A flower-covered arch, or a pair of floral pillars.", how="Florals are fixed to a hidden frame and finished from the top down, so no fixing is visible.", where="Entrances, mandap sides, aisle ends, stage corners.", note="Pillars usually give you more flower coverage per rupee than a full arch."),
            hi=dict(what="Phoolon se bhara arch, ya do floral pillars.", how="Phool chhupe hue frame par lagate hain aur upar se neeche finish karte hain — taki koi fixing dikhe na.", where="Entrance, mandap ke side, aisle ke end, stage corner.", note="Pillars me aksar poore arch se zyada phool mil jaate hain, kam paise me."),
        ),
        "Hanging & ceiling florals": dict(
            en=dict(what="Flowers suspended from above, out of everyone's way.", how="Wire and proper rigging hold the arrangement safely above head height, tested before guests arrive.", where="Ceilings, chandeliers, above the aisle and mandap.", note="Nothing touches the floor, which makes it perfect for tight venues."),
            hi=dict(what="Upar latakte hue phool, sabke raaste se hat ke.", how="Wire aur proper rigging arrangement ko sar ki unchai se upar safe rakhta hai — mehmaan aane se pehle test karte hain.", where="Chhat, chandelier, aisle aur mandap ke upar.", note="Farsh par kuch nahi aata — chhoti jagah ke liye perfect."),
        ),
        "Table centrepieces": dict(
            en=dict(what="Low arrangements that never block conversation.", how="Kept below eye level when seated, with the tallest element always in the centre.", where="Dining tables, guest tables, bar counters.", note="We plan these before the tablecloth is chosen, so the two always match."),
            hi=dict(what="Nichli arrangements jo baat-cheet rok dein na.", how="Baithne par aankh ki unchai se neeche rakhte hain, aur sabse uncha hissa hamesha beech me.", where="Dining table, guest table, bar counter.", note="Ye tablecloth chunne se pehle plan karte hain — taki dono match karein."),
        ),
        "Flower & petal walkway": dict(
            en=dict(what="A pathway dressed in petals and blooms.", how="Petals are laid in a gradient on the day itself, with heavier colour near the entry.", where="Entries, mandap approaches, proposal spots.", note="Wet surfaces get slippery — we manage the floor so nobody has to watch their step."),
            hi=dict(what="Petal aur phoolon se saja raasta.", how="Petals usi din gradient me bichate hain — entry ke paas colour zyada.", where="Entry, mandap ka raasta, proposal ki jagah.", note="Geela farsh phisalta hai — hum floor sambhalte hain taki kisi ko sambhal ke chalna na pade."),
        ),
    },
    "Drapes & Fabric": {
        "Sheer & chiffon drapes": dict(
            en=dict(what="Light, floating fabric that softens hard walls.", how="Draped in wide, even folds over hidden support, then steamed on site.", where="Backdrops, stage sides, ceilings and entrances.", note="This single change turns an ordinary hall into a set."),
            hi=dict(what="Halka, tairta kapda jo sakht deewaron ko narm kar deta hai.", how="Chhupe support par chaude, barabar folds me drape karte hain, phir site par steam karte hain.", where="Backdrop, stage ke side, chhat aur entrance.", note="Ye ek change hi aam hall ko set bana deta hai."),
        ),
        "Satin & velvet panels": dict(
            en=dict(what="Heavier fabrics with depth and a rich sheen.", how="Panelled to measure and steamed on site, because heavier cloth shows every crease.", where="Formal backdrops, lounges and VIP corners.", note="Never rush this one — creases show twice as much on camera."),
            hi=dict(what="Bhaari fabrics — gehrai aur rich sheen ke saath.", how="Naap ke hisaab se panel banate hain aur site par steam karte hain, kyunki bhaari kapda har crease dikha deta hai.", where="Formal backdrop, lounge aur VIP corner.", note="Ise kabhi jaldi me nahi karna — camera par creases dugni dikhti hain."),
        ),
        "Ceiling & tent draping": dict(
            en=dict(what="Fabric covering the whole ceiling in a soft canopy.", how="Stretched across the room under tension and pinned at the edges so it never sags.", where="Terrace functions, halls, pandals and courtyards.", note="The single biggest visual change for the money, on any ceiling."),
            hi=dict(what="Poori chhat par narm canopy ki tarah kapda.", how="Kamre bhar me tension me stretch karte hain aur kinaron par pin karte hain — taki kahin latke na.", where="Terrace function, hall, pandal aur aangan.", note="Kisi bhi chhat ke liye, paise ke hisaab se sabse bada visual change."),
        ),
        "Gathered backdrop drapes": dict(
            en=dict(what="Centrally gathered fabric for a classic curtain feel.", how="Fabric is gathered and fixed at a centre point, then spread evenly to both sides.", where="Behind the cake, the couple, the stage and the mandap.", note="The gathering height decides the whole character of the backdrop."),
            hi=dict(what="Beech me ikattha kapda — classic curtain feel.", how="Kapda centre point par ikattha karke fix karte hain, phir dono taraf barabar failate hain.", where="Cake, couple, stage aur mandap ke peeche.", note="Gathering ki unchai poore backdrop ka character tay karti hai."),
        ),
        "Table & chair draping": dict(
            en=dict(what="Dressed linen, runners and sashes.", how="Measured per table and pressed before setting, with sashes tied evenly across every chair.", where="Dining tables, lounges and head tables.", note="We match drapes and napkins to your palette instead of using venue stock."),
            hi=dict(what="Linen, runner aur sashes se saji tables.", how="Har table ka naap lete hain aur lagane se pehle press karte hain; sashes sab chairs par barabar bandhte hain.", where="Dining table, lounge aur head table.", note="Venue ka stock use karne ki jagah drapes aur napkins aapki palette se match karte hain."),
        ),
        "Floating fabric ceiling": dict(
            en=dict(what="Fabric suspended with visible air between each panel.", how="Panels are hung at staggered depths so they appear to float rather than hang.", where="High ceilings, mandaps and terrace setups.", note="It looks at its best with warm light glowing behind the fabric."),
            hi=dict(what="Hawa me latka kapda — har panel ke beech jagah.", how="Panels alag-alag gehrai par latkate hain — taki latke hue nahi, tairte hue lagein.", where="Unchi chhat, mandap aur terrace setup.", note="Kapde ke peeche warm light ho to sabse khoobsurat lagta hai."),
        ),
    },
    "Lighting Decor": {
        "Fairy & string lights": dict(
            en=dict(what="Warm, tiny lights woven through the decor.", how="Strings are woven through florals, drapes and ceilings so no wire is ever visible.", where="Backdrops, ceilings, trees, walkways and tables.", note="Cheapest way to make any setup feel warm — ask for double density in photos zones."),
            hi=dict(what="Warm, chhoti lights — decor me bunni hui.", how="Strings ko phool, drapes aur chhat me aise bun dete hain ki koi wire dikhe na.", where="Backdrop, chhat, ped, walkway aur table.", note="Kisi bhi setup ko warm banane ka sabse sasta tarika — photo zone me double density maangein."),
        ),
        "Warm uplighters": dict(
            en=dict(what="Lights placed on the floor, aimed upward at walls and drapes.", how="Each unit is aimed and dimmed by hand after the decor is standing, never left at full strength.", where="Stage walls, backdrops, pillars and tree trunks.", note="Uplighting alone can change the colour of an entire hall."),
            hi=dict(what="Farsh par rakhi lights, jo deewar aur drapes par upar ki taraf chalti hain.", how="Decor khada hone ke baad har unit ko haath se aim aur dim karte hain — full brightness par kabhi nahi chhodte.", where="Stage wall, backdrop, pillar aur ped ke tane.", note="Sirf uplighting poore hall ka rang badal sakti hai."),
        ),
        "Chandeliers & pendants": dict(
            en=dict(what="Hanging light fixtures that become part of the decor.", how="Hung from proper rigging points and levelled so they hang identically in every photograph.", where="Mandaps, dining areas, entrances and lounge corners.", note="Ideal when the venue has height but no character."),
            hi=dict(what="Latakti light fixtures, jo decor ka hissa ban jaati hain.", how="Proper rigging points se latkate hain aur level karte hain — taki har photo me ek jaisi latkein.", where="Mandap, dining area, entrance aur lounge.", note="Jahan venue me unchai hai par character nahi, wahan best."),
        ),
        "Neon-style light pieces": dict(
            en=dict(what="Glowing light shapes and lettering — names, dates, symbols.", how="Made to order and tested before the event so the glow is even, with no dark spots.", where="Backdrops, entrances, proposals and cake tables.", note="Warm white reads best in photographs; coloured light tends to look washed out."),
            hi=dict(what="Chamakte light shapes aur lettering — naam, tareekh, symbols.", how="Order par banate hain aur event se pehle test karte hain — taki glow barabar ho, koi dark spot na rahe.", where="Backdrop, entrance, proposal aur cake table.", note="Photo me warm white sabse achha padhta hai; coloured light aksar phiki lagti hai."),
        ),
        "Pathway & tree lighting": dict(
            en=dict(what="Lights that guide guests along a route.", how="Placed at even intervals and tested after dark, so the route reads clearly without glare.", where="Entries, driveways, gardens, terraces and walkways.", note="This is what makes an outdoor venue feel safe, grand and finished."),
            hi=dict(what="Lights jo mehmaanon ko raasta dikhati hain.", how="Barabar antar par lagate hain aur andhera hone ke baad test karte hain — taki raasta saaf dikhe, aankh na chubhe.", where="Entry, driveway, garden, terrace aur walkway.", note="Isi se outdoor venue safe, grand aur mukammal lagta hai."),
        ),
        "Candles & lanterns": dict(
            en=dict(what="Real or safe candles and lanterns, at floor and table level.", how="Placed inside lanterns or glass so they stay safe around fabric and children.", where="Walkways, tabletops, mandap steps and proposal setups.", note="Nothing photographs as romantically as a flame — we keep it safe instead of skipping it."),
            hi=dict(what="Asli ya safe candles aur lanterns — farsh aur table level par.", how="Lantern ya glass ke andar rakhte hain — taki kapde aur bachchon ke paas safe rahein.", where="Walkway, tabletop, mandap ke steps aur proposal setup.", note="Lau se zyada romantic kuch photo me nahi aata — hum ise chhodte nahi, safe banate hain."),
        ),
    },
    "Greenery & Foliage": {
        "Green walls & hedges": dict(
            en=dict(what="A solid panel of leaves, either standing or fixed to a wall.", how="Real or premium artificial foliage is pinned densely onto a frame until no backing shows.", where="Backdrops, dividers, photo walls and entrances.", note="It also hides whatever you would rather guests did not see behind it."),
            hi=dict(what="Patton ka solid panel — khada hua ya deewar par laga.", how="Asli ya premium artificial foliage frame par itna ghana pin karte hain ki peeche ka backing dikhe hi nahi.", where="Backdrop, divider, photo wall aur entrance.", note="Ise lagane se jo peeche tha — jo aap nahi dikhana chahte — chhup jaata hai."),
        ),
        "Hanging vines & creepers": dict(
            en=dict(what="Trailing greenery that falls from above.", how="Vines are layered over the rigging and combed straight, so they fall evenly instead of tangling.", where="Ceilings, arches, tablescapes and mandap corners.", note="Light in weight and quick to install, which makes it easy on tight timelines."),
            hi=dict(what="Upar se latakti hui hariyaali.", how="Bail ko rigging par layer karke seedha karte hain — taki barabar girein, uljhein na.", where="Chhat, arch, tablescape aur mandap ke corner.", note="Halki hoti hai aur jaldi lag jaati hai — kam time me aasan."),
        ),
        "Palm & monstera styling": dict(
            en=dict(what="Large structured leaves used for an architectural look.", how="Each leaf is wired individually so it holds its angle instead of drooping through the evening.", where="Modern venues, statement corners and entrances.", note="Best choice when the theme is contemporary rather than traditional."),
            hi=dict(what="Bade, structured patte — architectural look ke liye.", how="Har patte ko alag se wire karte hain — taki apna angle hold kare, shaam bhar latke na.", where="Modern venue, statement corner aur entrance.", note="Jab theme traditional ki jagah contemporary ho, tab best choice."),
        ),
        "Mogra & jasmine strands": dict(
            en=dict(what="Fragrant flower and leaf strands, traditional and fresh.", how="Fresh strands are hung on the same day and lightly misted to hold through the function.", where="Devotional setups, traditional weddings and mandaps.", note="Here the fragrance is the main feature, not the look alone."),
            hi=dict(what="Khushbudar phool aur patton ki ladiyan — traditional aur taaza.", how="Taazi ladiyan usi din latkate hain aur halka paani chhidakte hain — taki poore function chalein.", where="Devotional setup, traditional shaadi aur mandap.", note="Yahan khushbu hi main cheez hai, sirf dikhaawa nahi."),
        ),
        "Potted & planter setups": dict(
            en=dict(what="Plants in dressed pots, used as decor.", how="Pots are wrapped or painted to match the theme before they are placed.", where="Entry paths, corners, stage sides and waiting areas.", note="These can go home with you afterwards and be reused for years."),
            hi=dict(what="Saje hue gamlon me paudhe — decor ki tarah.", how="Gamlon ko theme ke hisaab se wrap ya paint karte hain, phir jagah par rakhte hain.", where="Entry raasta, corner, stage ke side aur waiting area.", note="Ye baad me ghar bhi ja sakte hain aur saalon tak kaam aate hain."),
        ),
        "Foliage arches": dict(
            en=dict(what="An arch built mostly from leaves, with minimal flowers.", how="Foliage is layered over the frame first and blooms are added last, only where they will be seen.", where="Entrances, walkways, proposals and photo corners.", note="It gives the same scale as a floral arch at a noticeably lower cost."),
            hi=dict(what="Zyada patton se bana arch, thode phoolon ke saath.", how="Pehle frame par foliage layer karte hain, phool sabse aakhir me — sirf wahan jahan nazar aayenge.", where="Entrance, walkway, proposal aur photo corner.", note="Floral arch jitna hi bada lagta hai, par kaafi kam kharch me."),
        ),
    },
    "Props & Cutouts": {
        "3D standees & cut-outs": dict(
            en=dict(what="Painted, standing shapes and figures.", how="Each piece is cut, painted and finished by hand in our own workshop — never printed flat.", where="Photo corners, kids areas, entrances and stage sides.", note="Tell us the shape or the theme and it is made to order."),
            hi=dict(what="Range hue, khade rehne wale shapes aur figures.", how="Har piece hamari workshop me haath se cut, paint aur finish hoti hai — flat print nahi.", where="Photo corner, kids area, entrance aur stage ke side.", note="Shape ya theme bata dein, order par bana denge."),
        ),
        "Mirror & sequin panels": dict(
            en=dict(what="Reflective panels that catch and multiply every light.", how="Acrylic or sequin sheets are fixed onto a safe frame and polished before guests arrive.", where="Backdrops, selfie walls and lounge corners.", note="A clever way to make a small venue look considerably bigger."),
            hi=dict(what="Reflect karne wale panels — har light ko dugna kar dete hain.", how="Acrylic ya sequin sheets ko safe frame par lagate hain aur mehmaan aane se pehle polish karte hain.", where="Backdrop, selfie wall aur lounge corner.", note="Chhoti jagah ko kaafi badi dikhane ka smart tarika."),
        ),
        "Ring & frame props": dict(
            en=dict(what="Large rings and frames that guests stand inside.", how="Frames are grounded on a hidden base so they stay standing even with people leaning on them.", where="Photo booths, welcome corners and entrances.", note="Guarantees a good couple photo without anyone having to pose twice."),
            hi=dict(what="Bade rings aur frames — jinke andar mehmaan khade hote hain.", how="Frames ko chhupe base par khada karte hain — taki log sahaara lene par bhi girein na.", where="Photo booth, welcome corner aur entrance.", note="Couple ki achhi photo pakki — bina dobara pose kiye."),
        ),
        "Kids props & soft shapes": dict(
            en=dict(what="Soft, safe, oversized shapes for children.", how="Made from padded or lightweight material, with every edge checked by hand.", where="Kids zones, play corners and birthday setups.", note="Safety is the design brief here — every edge is padded, no exceptions."),
            hi=dict(what="Bachchon ke liye narm, safe, bade shapes.", how="Padded ya halke material se bante hain, aur har edge haath se check hota hai.", where="Kids zone, play corner aur birthday setup.", note="Yahan safety hi design hai — har edge peeda hai, koi exception nahi."),
        ),
        "Hanging props & mobiles": dict(
            en=dict(what="Objects suspended in the air as decor.", how="Hung at varied heights to create depth, always above head height.", where="Ceilings, entry pathways and above tables.", note="It adds interest to a venue without blocking a single step of walkway."),
            hi=dict(what="Hawa me latkayi gayi cheezein — decor ki tarah.", how="Alag-alag unchai par latkate hain — taki gehrai bane, aur hamesha sar se upar.", where="Chhat, entry raasta aur tables ke upar.", note="Venue me interest add karta hai, aur raaste ka ek kadam bhi nahi rokta."),
        ),
        "Custom-shaped props": dict(
            en=dict(what="Anything built to your own idea.", how="We design it, make a small sample, get your approval, then finish the full piece.", where="Themed parties, brand launches and milestone birthdays.", note="If you can describe it, we can build it — share a reference and we will confirm."),
            hi=dict(what="Aapke apne idea se bani koi bhi cheez.", how="Design karte hain, chhota sample banate hain, aapki approval lete hain, phir poora piece finish karte hain.", where="Theme party, brand launch aur milestone birthday.", note="Jo aap bata sakte ho, hum bana sakte hain — reference bhejein, hum confirm kar denge."),
        ),
    },
    "Premium Finishes": {
        "Pearl & bead strands": dict(
            en=dict(what="Draped strands of pearls and beads.", how="Strung to the right length and pinned in soft loops so they hang identically across the width.", where="Backdrops, table edges, cake tables and arches.", note="A small detail that makes photographs look considerably more expensive."),
            hi=dict(what="Latki hui pearl aur moti ki ladiyan.", how="Sahi lambai me string karke narm loops me pin karte hain — taki poori width par ek jaise latkein.", where="Backdrop, table ke kinare, cake table aur arch.", note="Chhoti si detail, par photos kaafi mehngi dikhne lagti hain."),
        ),
        "Sequin & shimmer panels": dict(
            en=dict(what="Fabric covered in sequins that catches light from any angle.", how="Panelled and pinned with the light direction in mind, so the shimmer is even and not patchy.", where="Statement walls, booths and stage fronts.", note="Looks best with warm uplighting rather than white light."),
            hi=dict(what="Sequin wala kapda — kisi bhi angle se light pakadta hai.", how="Light ki direction dekh kar panel banate aur pin karte hain — taki shimmer barabar ho, patchy na lage.", where="Statement wall, booth aur stage ke aage.", note="White light se zyada, warm uplighting me best lagta hai."),
        ),
        "Metallic chrome accents": dict(
            en=dict(what="Gold, silver and rose-gold metallic touches across the setup.", how="Delivered as chrome balloons, painted props and foil detail, all matched to one another.", where="Garlands, tables, signage and centrepieces.", note="We match the metal to your palette rather than to whatever is trending."),
            hi=dict(what="Gold, silver aur rose-gold metallic touches — poore setup me.", how="Chrome gubbare, painted props aur foil detail ke roop me — sab ek doosre se match karke.", where="Garland, table, signage aur centrepiece.", note="Metal aapki palette se match karte hain — trend se nahi."),
        ),
        "Mirror & acrylic accents": dict(
            en=dict(what="Reflective acrylic shapes and panels.", how="Cut to shape, polished and fixed so no fixing shows from the front.", where="Backdrops, signage, tablescapes and entrances.", note="It quietly bounces light into corners that would otherwise stay dark."),
            hi=dict(what="Reflect karne wale acrylic shapes aur panels.", how="Shape me cut karke polish karte hain aur aise fix karte hain ki aage se koi fixing dikhe na.", where="Backdrop, signage, tablescape aur entrance.", note="Jo corners waise andhere reh jaate, wahan chup-chaap light pahuncha deta hai."),
        ),
        "Glitter & confetti detail": dict(
            en=dict(what="Fine sparkle worked into the decor itself, not thrown over it.", how="Applied by hand to props and panels so the density stays controlled and elegant.", where="Accents across the whole setup.", note="Kept subtle on purpose — overdone glitter is what makes decor look cheap."),
            hi=dict(what="Decor ke andar kaam kiya hua fine sparkle — upar se chhidka hua nahi.", how="Props aur panels par haath se lagate hain — taki density control me rahe aur elegant lage.", where="Poore setup me accents ki tarah.", note="Jaan-boojh kar subtle rakhte hain — zyada glitter hi decor ko sasta dikhata hai."),
        ),
        "Ribbon & tassel work": dict(
            en=dict(what="Satin ribbons and hand-tied tassels.", how="Measured, steamed and tied individually so every tassel falls to the same point.", where="Chairs, cake tables, narrow spaces and gift tables.", note="A delicate way to dress a small space without a full setup."),
            hi=dict(what="Satin ribbons aur haath se bandhe tassels.", how="Naap, steam aur ek-ek karke bandhte hain — taki sab ek hi point tak girein.", where="Chairs, cake table, chhoti jagah aur gift table.", note="Poora setup kiye bina chhoti jagah sajane ka nafees tarika."),
        ),
    },
    "Custom Signage": {
        "Neon-style name boards": dict(
            en=dict(what="Glowing light lettering carrying your names.", how="Made to order, tested before delivery, and mounted with a hidden fixing.", where="Backdrops, entrances, proposals and cake tables.", note="Warm white reads best on camera — we will show you the difference."),
            hi=dict(what="Chamakte light letters — aapke naam ke saath.", how="Order par bante hain, delivery se pehle test hote hain, aur chhupi fixing se lagte hain.", where="Backdrop, entrance, proposal aur cake table.", note="Camera par warm white sabse achha padhta hai — hum aapko farq dikha denge."),
        ),
        "Acrylic & mirror boards": dict(
            en=dict(what="Clean printed or cut boards on stands.", how="Built with a hidden stand so the board appears to float above the table.", where="Welcome tables, gift tables and photo corners.", note="Most of these can go home with you and be reused later."),
            hi=dict(what="Saaf printed ya cut boards, stands ke saath.", how="Chhupa stand banate hain — taki board table ke upar tairta hua lage.", where="Welcome table, gift table aur photo corner.", note="Inme se zyadatar baad me ghar bhi ja sakte hain, dobara kaam aate hain."),
        ),
        "Welcome boards": dict(
            en=dict(what="A styled board carrying your welcome message.", how="Designed in your fonts and colours, then finished and placed on site.", where="Entrances and guest tables.", note="It is the first thing guests read, so we keep it short and beautifully set."),
            hi=dict(what="Sajaya hua board — aapka welcome message.", how="Aapke font aur colour me design karte hain, phir site par finish karke lagate hain.", where="Entrance aur guest table.", note="Ye pehli cheez hai jo mehmaan padhta hai — isliye chhota aur sundar rakhte hain."),
        ),
        "Hashtag & quote boards": dict(
            en=dict(what="A board with your hashtag or a line you love.", how="Lettering designed, cut and framed to suit the backdrop behind it.", where="Photo corners, stages and entrances.", note="Guests photograph these more than almost anything else in the setup."),
            hi=dict(what="Board — aapka hashtag ya pasandeeda line.", how="Lettering design, cut aur frame karte hain — peeche wale backdrop ke hisaab se.", where="Photo corner, stage aur entrance.", note="Setup me inki photo sabse zyada banti hai."),
        ),
        "Table & menu signage": dict(
            en=dict(what="Small signs for tables, menus and seating.", how="Printed and finished to suit the tablescape, in the same palette and typeface.", where="Dining tables, bars and buffet counters.", note="It quietly stops guests from asking where they should sit."),
            hi=dict(what="Chhote signs — table, menu aur seating ke liye.", how="Tablescape ke hisaab se print aur finish karte hain — wahi palette, wahi typeface.", where="Dining table, bar aur buffet counter.", note="Mehmaanon ko poochhna nahi padta ki kahan baithna hai."),
        ),
        "Custom text of your choice": dict(
            en=dict(what="Any words, in any style you want.", how="Designed with you, approved by you, then produced to order.", where="Wherever the moment needs it — entry, stage, table, room.", note="Tell us the words and the mood, and we will handle everything else."),
            hi=dict(what="Koi bhi shabd, kisi bhi style me.", how="Aapke saath design karte hain, aapki approval lete hain, phir order par banate hain.", where="Jahan bhi zaroorat ho — entry, stage, table, room.", note="Shabd aur mood bata dein, baaki sab hum sambhal lenge."),
        ),
    },
}
