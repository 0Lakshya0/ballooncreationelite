"""Extra visuals for the option sheet: photos for best-for tags, for the
palette line, and a small example strip.

Nothing here is new copy — it only decides which photo illustrates each tag
and each colour word, so the option sheet can show pictures next to the
setup-time row, exactly like the deeper sections show them.
"""
from __future__ import annotations

# ── occasion / best-for tag -> photo in mockups/img ──
TAG_PHOTOS = {
    "Weddings": "mandap-pandal.jpg",
    "Traditional Weddings": "mandap-pandal.jpg",
    "Modern Weddings": "round-backdrop.jpg",
    "Pre-Wedding": "floral-decor.jpg",
    "Mandap": "mandap-pandal.jpg",
    "Haldi": "floral-decor.jpg",
    "Haldi & Mehndi": "floral-decor.jpg",
    "Mehndi": "floral-decor.jpg",
    "Baraat": "fabric-gate.jpg",
    "Baraat Welcome": "fabric-gate.jpg",
    "Bride Entry": "arch-entrance.jpg",
    "Ring Ceremony": "candle-aisle.jpg",
    "Ring Exchange": "candle-aisle.jpg",
    "Sangeet": "stage-truss.jpg",
    "Pooja & Havan": "floral-decor.jpg",
    "Devotional": "floral-decor.jpg",
    "Satsang & Chowki": "floral-decor.jpg",
    "Receptions": "round-backdrop.jpg",
    "Reception Entry": "red-carpet-entry.jpg",
    "Cocktails": "live-entertainment.jpg",
    "First Dance": "fog-bubbles.jpg",
    "First Dances": "fog-bubbles.jpg",
    "Grand Finales": "confetti-balloon-drop.jpg",
    "Big Celebrations": "balloon-decor.jpg",
    "Birthdays": "balloon-decor.jpg",
    "Kids Birthdays": "kids-zone.jpg",
    "1st Birthday": "kids-zone.jpg",
    "Milestone Birthdays": "cake-dessert.jpg",
    "Luxury Birthdays": "premium-finishes.jpg",
    "Kids Parties": "kids-zone.jpg",
    "Themed Parties": "round-backdrop.jpg",
    "New Year": "confetti-balloon-drop.jpg",
    "Corporate": "stage-truss.jpg",
    "Corporate Events": "stage-truss.jpg",
    "Corporate Dinners": "tablescape-lounge.jpg",
    "Corporate Parties": "stage-truss.jpg",
    "Annual Days": "live-entertainment.jpg",
    "Award Nights": "stage-truss.jpg",
    "Brand Launches": "custom-signage.jpg",
    "Grand Openings": "red-carpet-entry.jpg",
    "Shop Openings": "red-carpet-entry.jpg",
    "Work Anniversaries": "tablescape-lounge.jpg",
    "Farewells": "low-seating.jpg",
    "School Events": "live-entertainment.jpg",
    "College Events": "live-entertainment.jpg",
    "Graduations": "balloon-decor.jpg",
    "Family Functions": "tablescape-lounge.jpg",
    "Family Events": "tablescape-lounge.jpg",
    "Family Days": "low-seating.jpg",
    "House Warming": "arch-entrance.jpg",
    "House Warmings": "arch-entrance.jpg",
    "Griha Pravesh": "arch-entrance.jpg",
    "All Occasions": "balloon-decor.jpg",
    "Proposals": "marry-me-proposal.jpg",
    "Anniversaries": "marry-me-proposal.jpg",
    "25th Anniversary": "cake-dessert.jpg",
    "Date Nights": "candle-aisle.jpg",
    "Couple Shoots": "halo-corner.jpg",
    "Reconciliations": "marry-me-proposal.jpg",
    "Baby Showers": "round-backdrop.jpg",
    "Bridal Showers": "floral-decor.jpg",
    "Outdoor Events": "arch-entrance.jpg",
    "DJ Nights": "live-entertainment.jpg",
    "Grand Entries": "red-carpet-entry.jpg",
    "Cake Cuttings": "cake-dessert.jpg",
}

# ── colour word -> photo + swatch colour (for the "Colour & palette" card) ──
COLOUR_WORDS = {
    "silver": ("sequin-wall.jpg", "#c9ccd1"),
    "white": ("round-backdrop.jpg", "#f7f5f1"),
    "ivory": ("round-backdrop.jpg", "#f6f0e2"),
    "cream": ("premium-finishes.jpg", "#f2e6cf"),
    "pearl": ("premium-finishes.jpg", "#efe9e3"),
    "champagne": ("premium-finishes.jpg", "#e6d3ab"),
    "gold": ("premium-finishes.jpg", "#c9a227"),
    "copper": ("premium-finishes.jpg", "#b4724a"),
    "bronze": ("premium-finishes.jpg", "#a97142"),
    "mustard": ("floral-decor.jpg", "#d8a72a"),
    "blush": ("floral-decor.jpg", "#f0c7c2"),
    "pink": ("floral-decor.jpg", "#e79ab2"),
    "rose": ("floral-decor.jpg", "#d98a95"),
    "peach": ("floral-decor.jpg", "#f0b48a"),
    "red": ("marry-me-proposal.jpg", "#c0392b"),
    "maroon": ("marry-me-proposal.jpg", "#7d2b34"),
    "burgundy": ("marry-me-proposal.jpg", "#6d1f2c"),
    "blue": ("drapes-lighting.jpg", "#3b6fa0"),
    "navy": ("stage-truss.jpg", "#2b3a5c"),
    "teal": ("drapes-lighting.jpg", "#2e8b8b"),
    "turquoise": ("drapes-lighting.jpg", "#3fbfc4"),
    "green": ("greenery-foliage.jpg", "#4b7f52"),
    "emerald": ("greenery-foliage.jpg", "#1f7a54"),
    "sage": ("greenery-foliage.jpg", "#9caf88"),
    "mint": ("greenery-foliage.jpg", "#a8ddc6"),
    "purple": ("sequin-wall.jpg", "#6f4a9c"),
    "lavender": ("sequin-wall.jpg", "#b6a6d6"),
    "violet": ("sequin-wall.jpg", "#7d5ba6"),
    "lilac": ("sequin-wall.jpg", "#c3b2d4"),
    "yellow": ("floral-decor.jpg", "#e8c547"),
    "orange": ("floral-decor.jpg", "#e08a3c"),
    "marigold": ("floral-decor.jpg", "#e8930c"),
    "sunset": ("confetti-balloon-drop.jpg", "#e2703a"),
    "black": ("stage-truss.jpg", "#2b2b2b"),
    "charcoal": ("stage-truss.jpg", "#3c3c3c"),
    "grey": ("stage-truss.jpg", "#9a9a9a"),
    "brown": ("mandap-pandal.jpg", "#7b5230"),
    "multi-colour": ("confetti-balloon-drop.jpg", "#c86fa8"),
    "multicolour": ("confetti-balloon-drop.jpg", "#c86fa8"),
    "rainbow": ("confetti-balloon-drop.jpg", "#c86fa8"),
    "pastel": ("floral-decor.jpg", "#e8cfd8"),
    "colour-block": ("premium-finishes.jpg", "#b98a5e"),
    # hinglish / hindi colour words
    "safed": ("round-backdrop.jpg", "#f7f5f1"),
    "sunehra": ("premium-finishes.jpg", "#c9a227"),
    "chaandi": ("sequin-wall.jpg", "#c9ccd1"),
    "gulabi": ("floral-decor.jpg", "#e79ab2"),
    "laal": ("marry-me-proposal.jpg", "#c0392b"),
    "neela": ("drapes-lighting.jpg", "#3b6fa0"),
    "hara": ("greenery-foliage.jpg", "#4b7f52"),
    "peela": ("floral-decor.jpg", "#e8c547"),
    "narangi": ("floral-decor.jpg", "#e08a3c"),
    "jamuni": ("sequin-wall.jpg", "#6f4a9c"),
    "kesariya": ("floral-decor.jpg", "#e8930c"),
}

FALLBACK_PHOTO = "premium-finishes.jpg"
FALLBACK_COLOUR = "#cbb79a"


def tag_photo(tag: str, fallback: str) -> str:
    """Photo for a best-for tag."""
    return TAG_PHOTOS.get(tag, fallback)


def palette_parts(text: str) -> list[dict]:
    """Split a 'colours' line into two or three named palette choices."""
    if not text:
        return []
    raw = (
        text.replace(" / ", ", ")
        .replace(";", ",")
        .replace(" — ", ", ")
        .replace(" ya ", ", ")      # hinglish "silver ya gold"
        .replace(" aur ", ", ")     # hinglish "silver aur gold"
    )
    parts: list[str] = []
    for chunk in raw.split(","):
        chunk = chunk.strip(" .")
        if not chunk:
            continue
        # "or" / "and" joined choices read better split apart
        for bit in chunk.split(" or "):
            bit = bit.strip(" .")
            if bit:
                parts.append(bit)
    # keep it to three, merging the tail so nothing is lost
    if len(parts) > 3:
        parts = parts[:2] + [", ".join(parts[2:])]
    out = []
    for part in parts:
        low = part.lower()
        word = next((w for w in COLOUR_WORDS if w in low), None)
        photo, css = COLOUR_WORDS[word] if word else (FALLBACK_PHOTO, FALLBACK_COLOUR)
        out.append({"t": part[:1].upper() + part[1:], "c": css, "img": photo})
    return out
