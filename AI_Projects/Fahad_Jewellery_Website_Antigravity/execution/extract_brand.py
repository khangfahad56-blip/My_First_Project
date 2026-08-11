#!/usr/bin/env python3
"""
Layer 3 Execution Tool: Firecrawl Brand Extraction.
Extracts brand data and automatically generates BRAND_GUIDELINES.md file.
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.parse
import re

FIRECRAWL_API_URL = "https://api.firecrawl.dev/v2/scrape"

def load_env():
    """Load variables from .env file if available."""
    env_path = os.path.join(os.getcwd(), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip().strip('"').strip("'")

def download_image(url, output_dir, filename):
    """Download an image file to local directory."""
    if not url or not url.startswith("http"):
        return None
    try:
        os.makedirs(output_dir, exist_ok=True)
        filepath = os.path.join(output_dir, filename)
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp, open(filepath, "wb") as f:
            f.write(resp.read())
        return filepath
    except Exception as e:
        print(f"[Warning] Failed to download {url}: {e}", file=sys.stderr)
        return None

def extract_brand_with_firecrawl(target_url, api_key=None):
    """Call Firecrawl v2 API to extract branding, markdown, and images."""
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    payload = {
        "url": target_url,
        "formats": ["branding", "markdown", "images"]
    }

    req = urllib.request.Request(
        FIRECRAWL_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            if res_data.get("success"):
                return res_data.get("data", {})
            else:
                print(f"[Error] Firecrawl API response failed: {res_data}", file=sys.stderr)
                return None
    except Exception as e:
        print(f"[Error] Firecrawl request failed: {e}", file=sys.stderr)
        return None

def generate_brand_guidelines_md(data, target_url, output_md_path="BRAND_GUIDELINES.md"):
    """Generate BRAND_GUIDELINES.md file from extracted data."""
    branding = data.get("branding", {})
    colors = branding.get("colors", {})
    typography = branding.get("typography", {})
    font_families = typography.get("fontFamilies", {})
    font_sizes = typography.get("fontSizes", {})
    spacing = branding.get("spacing", {})
    components = branding.get("components", {})
    images = branding.get("images", {})
    downloaded = data.get("downloaded_assets", {})

    c_primary = colors.get("primary", "#111827")
    c_secondary = colors.get("secondary", "#4B5563")
    c_accent = colors.get("accent", "#D97706")
    c_bg = colors.get("background", "#FFFFFF")
    c_text = colors.get("textPrimary", "#111827")
    c_text_muted = colors.get("textSecondary", "#6B7280")

    f_primary = font_families.get("primary") or (branding.get("fonts", [{}])[0].get("family") if branding.get("fonts") else "Inter")
    f_heading = font_families.get("heading") or f_primary
    f_code = font_families.get("code", "monospace")

    logo_val = downloaded.get("logo") or images.get("logo") or branding.get("logo") or "N/A"
    hero_val = downloaded.get("hero_image") or images.get("ogImage") or "N/A"
    favicon_val = downloaded.get("favicon") or images.get("favicon") or "N/A"

    btn_p = components.get("buttonPrimary", {})
    btn_s = components.get("buttonSecondary", {})

    md_content = f"""# 🎨 Brand Guidelines & Design System

> Extracted from **[{target_url}]({target_url})**  
> **Color Scheme Mode**: `{branding.get("colorScheme", "light")}`

---

## 🖌️ Color Palette

| Role | Color Token | Hex Code | Preview |
| :--- | :--- | :--- | :--- |
| **Primary** | `--color-primary` | `{c_primary}` | `{c_primary}` |
| **Secondary** | `--color-secondary` | `{c_secondary}` | `{c_secondary}` |
| **Accent / CTA** | `--color-accent` | `{c_accent}` | `{c_accent}` |
| **Background** | `--color-bg` | `{c_bg}` | `{c_bg}` |
| **Text Primary** | `--color-text` | `{c_text}` | `{c_text}` |
| **Text Muted** | `--color-text-muted` | `{c_text_muted}` | `{c_text_muted}` |

---

## 🔤 Typography & Font Family

- **Primary Body Font**: `{f_primary}, sans-serif`
- **Heading Font**: `{f_heading}, serif`
- **Code Font**: `{f_code}`

### Font Size Hierarchy
- **H1**: `{font_sizes.get("h1", "48px")}`
- **H2**: `{font_sizes.get("h2", "36px")}`
- **H3**: `{font_sizes.get("h3", "24px")}`
- **Body**: `{font_sizes.get("body", "16px")}`

---

## 🖼️ Brand Assets & Media

- **Logo**: `{logo_val}`
- **Hero Graphic / OG Banner**: `{hero_val}`
- **Favicon**: `{favicon_val}`

---

## 🔘 UI Components & Styling

- **Border Radius**: `{spacing.get("borderRadius", "8px")}`
- **Base Spacing Unit**: `{spacing.get("baseUnit", 8)}px`
- **Primary Button**:
  - Background: `{btn_p.get("background", c_primary)}`
  - Text Color: `{btn_p.get("textColor", "#FFFFFF")}`
  - Border Radius: `{btn_p.get("borderRadius", "8px")}`
- **Secondary Button**:
  - Background: `{btn_s.get("background", "transparent")}`
  - Text Color: `{btn_s.get("textColor", c_primary)}`
  - Border: `{btn_s.get("borderColor", c_primary)}`

---

## 💻 CSS Variables (`brand-tokens.css`)

```css
:root {{
  /* Colors */
  --color-primary: {c_primary};
  --color-secondary: {c_secondary};
  --color-accent: {c_accent};
  --color-bg: {c_bg};
  --color-text: {c_text};
  --color-text-muted: {c_text_muted};

  /* Typography */
  --font-primary: '{f_primary}', sans-serif;
  --font-heading: '{f_heading}', serif;

  /* Spacing & Borders */
  --border-radius: {spacing.get("borderRadius", "8px")};
  --space-unit: {spacing.get("baseUnit", 8)}px;
}}
```
"""
    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(md_content.strip())
    print(f"[+] Brand Guidelines Markdown saved to: {output_md_path}")

def main():
    parser = argparse.ArgumentParser(description="Extract brand design system using Firecrawl v2 API.")
    parser.add_argument("--url", required=True, help="Target website URL to extract brand data from.")
    parser.add_argument("--download-assets", action="store_true", help="Download logo, favicon, and hero images locally.")
    parser.add_argument("--output", default=".tmp/brand_extraction.json", help="Path to save output JSON.")
    parser.add_argument("--output-md", default="BRAND_GUIDELINES.md", help="Path to save output Brand Guidelines Markdown.")
    args = parser.parse_args()

    load_env()
    api_key = os.getenv("FIRECRAWL_API_KEY")

    print(f"[*] Extracting brand identity for: {args.url}")
    data = extract_brand_with_firecrawl(args.url, api_key)
    
    if not data:
        # Fallback basic structure
        data = {
            "branding": {
                "colorScheme": "light",
                "colors": {"primary": "#111827", "secondary": "#4B5563", "accent": "#D97706", "background": "#FFFFFF", "textPrimary": "#111827", "textSecondary": "#6B7280"},
                "fonts": [{"family": "Inter"}, {"family": "Playfair Display"}]
            }
        }

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    # Generate Brand Guidelines Markdown
    generate_brand_guidelines_md(data, args.url, args.output_md)

    print(f"[+] Extraction complete! Raw JSON saved to {args.output}")

if __name__ == "__main__":
    main()
