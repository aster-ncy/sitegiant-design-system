"""Generate channelIconPaths.ts from figma-design-system/icon/channel icon/*.svg.

Run:
    python scripts/build-channel-icons.py

Reads every SVG in the source folder, extracts each `<path d="...">` and the
`viewBox` attribute, and writes a TypeScript module that merges cleanly into
the existing icon library.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

# Resolve paths relative to this script so the build is portable across
# machines. Layout assumed:
#   <workspace>/
#     figma-design-system/icon/channel icon/*.svg     (private, source)
#     sitegiant-storybook/scripts/build-channel-icons.py
#     sitegiant-storybook/src/components/Icon/channelIconPaths.ts (output)
_SCRIPT_DIR = Path(__file__).resolve().parent
_STORYBOOK_ROOT = _SCRIPT_DIR.parent
_WORKSPACE_ROOT = _STORYBOOK_ROOT.parent

SRC = str(_WORKSPACE_ROOT / "figma-design-system" / "icon" / "channel icon")
OUT = str(_STORYBOOK_ROOT / "src" / "components" / "Icon" / "channelIconPaths.ts")

NAME_MAP = {
    "168live": "channel-168live",
    "Amazon": "channel-amazon",
    "Choice": "channel-choice",
    "Client Channel": "channel-client",
    "Coupang": "channel-coupang",
    "Cyberbiz": "channel-cyberbiz",
    "Decathlon": "channel-decathlon",
    "Driver": "channel-driver",
    "FB Live": "channel-fb-live",
    "FBE": "channel-fbe",
    "FairPrice": "channel-fairprice",
    "Google Shopping": "channel-google-shopping",
    "Instagram": "channel-instagram",
    "JamboLive": "channel-jambolive",
    "Landing Page": "channel-landing-page",
    "Lazada": "channel-lazada",
    "Line": "channel-line",
    "Magento": "channel-magento",
    "Microsoft Dynamic 365": "channel-ms-dynamics-365",
    "Momo": "channel-momo",
    "Momo +": "channel-momo-plus",
    "PG Mall": "channel-pg-mall",
    "QNESoftware": "channel-qne-software",
    "Qoo10": "channel-qoo10",
    "Quickbook": "channel-quickbook",
    "Redmart by Lazada": "channel-redmart",
    "SQL": "channel-sql",
    "SenHeng": "channel-senheng",
    "Shop.com": "channel-shop-com",
    "Shopee": "channel-shopee",
    "Shopify": "channel-shopify",
    "Shopline": "channel-shopline",
    "Shopping App": "channel-shopping-app",
    "SiteGiant ERP": "channel-sitegiant-erp",
    "SiteGiant Logistic": "channel-sitegiant-logistic",
    "SiteGiant POS": "channel-sitegiant-pos",
    "Telegram": "channel-telegram",
    "TikTok": "channel-tiktok",
    "Tracking": "channel-tracking",
    "Unicart": "channel-unicart",
    "Webstore": "channel-webstore",
    "WeChat": "channel-wechat",
    "WooCommerce": "channel-woocommerce",
    "Wow Shop": "channel-wow-shop",
    "Xero": "channel-xero",
    "Xilnex": "channel-xilnex",
    "Zalora": "channel-zalora",
}


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")

    files = sorted(f for f in os.listdir(SRC) if f.endswith(".svg"))
    present = {os.path.splitext(f)[0]: f for f in files}

    missing = sorted(k for k in NAME_MAP if k not in present)
    unmapped = sorted(b for b in present if b not in NAME_MAP)
    if missing:
        print(f"WARN: mapped but no file: {missing}", file=sys.stderr)
    if unmapped:
        print(f"WARN: on disk but unmapped: {unmapped}", file=sys.stderr)

    path_re = re.compile(r'<path[^>]*\bd="([^"]+)"', re.DOTALL)
    vb_re = re.compile(r'viewBox="([^"]+)"')
    # Strip <defs>...</defs> and <clipPath>...</clipPath> before path
    # extraction. Several Figma-exported SVGs include a 24x24 rect
    # inside <clipPath> that would otherwise get captured as an icon
    # path and render as a solid black square over the real artwork.
    defs_re = re.compile(r'<defs\b.*?</defs>', re.DOTALL | re.IGNORECASE)
    clippath_re = re.compile(r'<clipPath\b.*?</clipPath>', re.DOTALL | re.IGNORECASE)

    lines = [
        "// Auto-generated from figma-design-system/icon/channel icon/*.svg",
        "// Do not edit by hand — regenerate via scripts/build-channel-icons.py",
        "",
        "import type { IconPathData } from './iconPaths';",
        "",
        "export const channelIconPaths: Record<string, IconPathData> = {",
    ]

    count = 0
    for base, fname in sorted(present.items()):
        if base not in NAME_MAP:
            continue
        key = NAME_MAP[base]
        content = open(os.path.join(SRC, fname), encoding="utf-8").read()
        vb_m = vb_re.search(content)
        viewBox = vb_m.group(1) if vb_m else "0 0 24 24"
        # Remove <defs> and <clipPath> blocks so their paths don't get
        # captured as icon artwork.
        body = defs_re.sub("", content)
        body = clippath_re.sub("", body)
        paths = path_re.findall(body)
        if not paths:
            print(f"WARN: no <path> in {fname}; skipping", file=sys.stderr)
            continue
        # evenodd if the file uses it anywhere (path or wrapping <g>)
        has_evenodd = 'fill-rule="evenodd"' in content
        count += 1

        lines.append(f'  "{key}": {{')
        lines.append(f'    "viewBox": "{viewBox}",')
        lines.append('    "paths": [')
        for p in paths:
            # Escape backslash first, then double-quote.
            bslash = chr(92)
            safe = p.replace(bslash, bslash + bslash).replace('"', bslash + '"')
            lines.append(f'      "{safe}",')
        lines.append("    ],")
        if has_evenodd:
            lines.append('    "fillRule": "evenodd"')
        lines.append("  },")

    lines.append("};")
    lines.append("")
    lines.append("export type ChannelIconName = keyof typeof channelIconPaths;")
    lines.append(
        "export const channelIconNames = Object.keys(channelIconPaths) as ChannelIconName[];"
    )
    lines.append("")

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))

    print(f"Wrote {count} channel icons to {OUT}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
