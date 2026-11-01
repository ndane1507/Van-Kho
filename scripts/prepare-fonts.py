"""Build local WOFF2 assets while retaining Vietnamese and existing source text.

Requires fonttools[woff] 4.67.0. Assets are checked in, so npm build does not
require Python or network access to a font provider.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
DESTINATION = ROOT / "src/app/fonts"
DESTINATION.mkdir(parents=True, exist_ok=True)
characters = (
    set(range(0x20, 0x100)) | set(range(0x1EA0, 0x1EFA)) |
    set(range(0x300, 0x370)) | set(range(0x2000, 0x2070)) |
    set(range(0x2190, 0x2200)) |
    {0x102, 0x103, 0x110, 0x111, 0x128, 0x129, 0x168, 0x169,
     0x1A0, 0x1A1, 0x1AF, 0x1B0, 0x20AB, 0x20AC, 0x2122, 0xFFFD}
)
source_characters = set()
for source in (ROOT / "src").rglob("*"):
    if source.suffix in {".ts", ".tsx", ".json"}:
        source_characters.update(map(ord, source.read_text(encoding="utf-8-sig")))
characters.update(source_characters)

faces = [(f"Newsreader-{name}", "Newsreader", weight) for name, weight in [("Regular", 400), ("Medium", 500), ("SemiBold", 600)]]
faces += [(f"Newsreader-{name}Italic", "Newsreader-Italic", weight) for name, weight in [("Regular", 400), ("Medium", 500), ("SemiBold", 600)]]
faces += [(f"BeVietnamPro-{name}", f"BeVietnamPro-{name}", weight) for name, weight in [("Regular", 400), ("Medium", 500), ("SemiBold", 600)]]
for name, source_name, weight in faces:
    font = TTFont(ROOT / "docs/media/fonts" / f"{source_name}.ttf")
    if source_name.startswith("Newsreader"):
        instantiateVariableFont(font, {"opsz": 16, "wght": weight}, inplace=True)
    required = source_characters.intersection(font.getBestCmap())
    advances = {code: font["hmtx"][glyph][0] for code, glyph in font.getBestCmap().items() if code in required}
    options = subset.Options()
    # Preserve display-font hinting; sans glyphs and advances remain checked.
    options.hinting = source_name.startswith("Newsreader")
    compiler = subset.Subsetter(options=options)
    compiler.populate(unicodes=characters)
    compiler.subset(font)
    assert required.issubset(font.getBestCmap()), f"Lost source glyphs in {name}"
    assert advances == {code: font["hmtx"][font.getBestCmap()[code]][0] for code in required}, f"Changed advances in {name}"
    font.flavor = "woff2"
    output = DESTINATION / f"{name}.woff2"
    font.save(output)
    print(f"{output.name}: {output.stat().st_size} bytes; {len(required)} source glyphs retained")
