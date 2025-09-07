function buildInfographySVG(cfg) {
    // ---- helpers ----
    const esc = s => String(s ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const px = v => (typeof v === "number" ? `${v}` : (v || "0")).replace("px", "");

    const wrapText = (text, maxCharsPerLine) => {
        if (!maxCharsPerLine || maxCharsPerLine <= 0) return [text];
        const words = String(text || "").split(/\s+/);
        const lines = [];
        let line = "";
        for (const w of words) {
            if ((line + " " + w).trim().length > maxCharsPerLine) {
                if (line) lines.push(line);
                line = w;
            } else {
                line = (line ? line + " " : "") + w;
            }
        }
        if (line) lines.push(line);
        return lines;
    };

    const genId = (pfx = "id") => pfx + Math.random().toString(36).slice(2, 9);

    // ---- defaults ----
    const width = Number(cfg?.width) || 1200;
    const height = Number(cfg?.height) || 675;
    const padding = Number(cfg?.padding) || 24;

    // ---- background/defs ----
    let defs = "";
    let bgFill = esc(cfg?.background?.color || "#0b0b0b");
    if (cfg?.background?.gradient) {
        const g = cfg.background.gradient;
        const gid = g.id || genId("grad");
        const stops = (g.stops || []).map(s =>
            `<stop offset="${esc(s.offset ?? "0%")}" stop-color="${esc(s.color || "#000")}" ${s.opacity != null ? `stop-opacity="${esc(s.opacity)}"` : ""}/>`
        ).join("");
        if ((g.type || "linear") === "radial") {
            defs += `<radialGradient id="${gid}" cx="${esc(g.cx ?? "50%")}" cy="${esc(g.cy ?? "50%")}" r="${esc(g.r ?? "75%")}">${stops}</radialGradient>`;
        } else {
            defs += `<linearGradient id="${gid}" x1="${esc(g.x1 ?? "0%")}" y1="${esc(g.y1 ?? "0%")}" x2="${esc(g.x2 ?? "100%")}" y2="${esc(g.y2 ?? "0%")}">${stops}</linearGradient>`;
        }
        bgFill = `url(#${gid})`;
    }

    // ---- CSS ----
    const baseCSS = `
    .title { dominant-baseline: hanging; }
    .point { display: block; }
    .point-text { dominant-baseline: hanging; }
    .point-img { }
  `;

    const userCSS = cfg?.css ? String(cfg.css) : "";

    // ---- title ----
    const t = cfg?.title || {};
    const titleX = Number(t.x ?? padding);
    const titleY = Number(t.y ?? padding);
    const titleMaxChars = t.maxCharsPerLine ?? Math.floor(((t.maxWidth || (width - padding * 2)) / (t.fontSize || 36)) * 1.8);
    const titleLines = wrapText(t.text || "", titleMaxChars);
    const titleFontSize = Number(t.fontSize ?? 40);
    const titleLineHeight = Number(t.lineHeight ?? (titleFontSize * 1.2));
    const titleAnchor = esc(t.textAnchor || "start"); // start|middle|end

    // ---- points layout ----
    const plist = Array.isArray(cfg?.points) ? cfg.points : [];
    const layout = cfg?.layout || {};
    const cols = Math.max(1, Number(layout.columns || 1));
    const colGap = Number(layout.columnGap ?? 24);
    const rowGap = Number(layout.rowGap ?? 16);
    const itemW = Number(layout.itemWidth || ((width - padding * 2 - (cols - 1) * colGap) / cols));
    const startY = Number(layout.startY ?? (titleY + (titleLines.length * titleLineHeight) + (t.marginBottom ?? 20)));
    const startX = Number(layout.startX ?? padding);
    const iconPos = (layout.iconPosition || "left"); // left or top

    const pTextSize = Number(layout.text?.fontSize ?? 18);
    const pTextColor = esc(layout.text?.fill ?? "#ffffff");
    const pFont = esc(layout.text?.fontFamily ?? "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif");
    const pWeight = esc(layout.text?.fontWeight ?? "400");
    const pLineH = Number(layout.text?.lineHeight ?? Math.round(pTextSize * 1.3));
    const pMaxChars = layout.text?.maxCharsPerLine ?? Math.floor((itemW - (iconPos === "left" ? (layout.icon?.size ?? 40) + (layout.icon?.gap ?? 12) : 0)) / (pTextSize * 0.55));

    const iconSize = Number(layout.icon?.size ?? 40);
    const iconGap = Number(layout.icon?.gap ?? 12);
    const iconRadius = Number(layout.icon?.radius ?? 8);
    const imageClipCircle = !!layout.icon?.clipCircle;

    // ---- defs for clipping (optional) ----
    if (imageClipCircle) {
        const clipId = "clipCircle";
        defs += `<clipPath id="${clipId}"><circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2}"/></clipPath>`;
    }

    // ---- build title SVG ----
    let titleSVG = "";
    if (t.text) {
        const fill = esc(t.fill ?? "#ffffff");
        const font = esc(t.fontFamily ?? "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif");
        const weight = esc(t.fontWeight ?? "700");
        const shadow = t.textShadow ? `text-shadow:${esc(t.textShadow)};` : "";
        const letterSpacing = t.letterSpacing != null ? `letter-spacing:${esc(t.letterSpacing)};` : "";
        const maxWidth = t.maxWidth ? Number(t.maxWidth) : null;

        // compute anchor offset
        const anchorAdj = (anchor, x) => {
            if (!maxWidth) return x;
            if (anchor === "middle") return x + maxWidth / 2;
            if (anchor === "end") return x + maxWidth;
            return x;
        };

        const anchoredX = anchorAdj(titleAnchor, titleX);

        titleSVG += `<g class="title" font-family="${font}" font-weight="${weight}" fill="${fill}" font-size="${titleFontSize}" text-anchor="${titleAnchor}">`;
        titleLines.forEach((ln, i) => {
            titleSVG += `<text x="${anchoredX}" y="${titleY + i * titleLineHeight}" style="${shadow}${letterSpacing}">${esc(ln)}</text>`;
        });
        titleSVG += `</g>`;
    }

    // ---- build points ----
    let pointsSVG = "";
    plist.forEach((p, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (itemW + colGap);
        const y = startY + row * (iconPos === "top"
            ? (iconSize + iconGap + (pLineH * 3)) + rowGap // rough row height if top icons
            : Math.max(iconSize, pLineH * 3) + rowGap);    // rough row height if left icons

        // image/icon
        let imgSVG = "";
        if (p.image?.href) {
            const href = esc(p.image.href);
            const iw = Number(p.image.width ?? iconSize);
            const ih = Number(p.image.height ?? iconSize);
            const rx = Number(p.image.rx ?? iconRadius);
            const ry = Number(p.image.ry ?? iconRadius);
            if (iconPos === "left") {
                imgSVG = `<image class="point-img" href="${href}" x="${x}" y="${y}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid slice" ${imageClipCircle ? `clip-path="url(#clipCircle)"` : (rx || ry ? `rx="${rx}" ry="${ry}"` : "")}/>`;
            } else {
                imgSVG = `<image class="point-img" href="${href}" x="${x + (itemW - iw) / 2}" y="${y}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid slice" ${imageClipCircle ? `clip-path="url(#clipCircle)"` : (rx || ry ? `rx="${rx}" ry="${ry}"` : "")}/>`;
            }
        }

        // text
        const text = String(p.text ?? "");
        const estChars = p.maxCharsPerLine ?? pMaxChars;
        const lines = wrapText(text, estChars);
        const textX = iconPos === "left"
            ? (x + (p.image?.href ? (p.image.width ?? iconSize) : 0) + (p.image?.href ? iconGap : 0))
            : x;
        const textY = iconPos === "left"
            ? y + Math.max(0, ((p.image?.height ?? iconSize) - pLineH * lines.length) / 2)
            : y + (p.image?.href ? (p.image.height ?? iconSize) + iconGap : 0);

        const textWidth = iconPos === "left"
            ? (itemW - (textX - x))
            : itemW;

        const fill = esc(p.textStyle?.fill ?? pTextColor);
        const fs = Number(p.textStyle?.fontSize ?? pTextSize);
        const lh = Number(p.textStyle?.lineHeight ?? pLineH);
        const ff = esc(p.textStyle?.fontFamily ?? pFont);
        const fw = esc(p.textStyle?.fontWeight ?? pWeight);
        const ta = esc(p.textStyle?.textAnchor ?? "start");

        let textSVG = `<text class="point-text" x="${textX}" y="${textY}" fill="${fill}" font-family="${ff}" font-weight="${fw}" font-size="${fs}" text-anchor="${ta}">`;
        lines.forEach((ln, li) => {
            const dy = li === 0 ? 0 : lh;
            textSVG += `<tspan x="${textX}" dy="${dy}">${esc(ln)}</tspan>`;
        });
        textSVG += `</text>`;

        pointsSVG += `<g class="point" data-idx="${i}">` + imgSVG + textSVG + `</g>`;
    });

    // ---- assemble ----
    const viewBox = `0 0 ${px(width)} ${px(height)}`;
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${px(width)}" height="${px(height)}" viewBox="${viewBox}" role="img" aria-label="${esc(cfg?.ariaLabel || cfg?.title?.text || "Infography")}">
  <defs>${defs}</defs>
  <style>${baseCSS}\n${userCSS}</style>
  <rect x="0" y="0" width="100%" height="100%" fill="${bgFill}"/>
  ${titleSVG}
  ${pointsSVG}
</svg>`;

    console.log(svg, 'svg');


    return svg;
}

const jsonConfig = {
    "width": 1200,
    "height": 675,
    "padding": 24,
    "css": ".point-text{opacity:.95}",

    "background": {
        "color": "#0b1220",
        // or gradient:
        "gradient": {
            "type": "linear",         // "linear" | "radial"
            "id": "bgGrad",           // optional
            "x1": "0%", "y1": "0%", "x2": "100%", "y2": "0%",  // linear
            // for radial: cx, cy, r
            "stops": [
                { "offset": "0%", "color": "#0ea5ea" },
                { "offset": "100%", "color": "#2a2a72" }
            ]
        }
    },

    "title": {
        "text": "AI SEO Writer — Key Benefits",
        "x": 48, "y": 36,
        "maxWidth": 1000,
        "maxCharsPerLine": 28,      // fallback wrapper if no measurement
        "fontSize": 48,
        "lineHeight": 56,
        "fontFamily": "Inter, system-ui, sans-serif",
        "fontWeight": "800",
        "fill": "#ffffff",
        "letterSpacing": "0.5px",
        "textShadow": "0 2px 8px rgba(0,0,0,.35)",
        "textAnchor": "start",      // start|middle|end
        "marginBottom": 24
    },

    "layout": {
        "columns": 2,
        "columnGap": 32,
        "rowGap": 20,
        "itemWidth": 520,
        "startX": 48,
        "startY": 140,
        "iconPosition": "left",     // "left" | "top"
        "icon": { "size": 44, "gap": 14, "radius": 8, "clipCircle": false },
        "text": {
            "fontSize": 18,
            "lineHeight": 24,
            "fontFamily": "Inter, system-ui, sans-serif",
            "fontWeight": "500",
            "fill": "#e6eefc",
            "maxCharsPerLine": 38
        }
    },

    "points": [
        {
            "text": "Generate SEO-optimized drafts in seconds with SERP-aware outlines.",
            "image": { "href": "https://cdn.example.com/icons/bolt.png", "width": 44, "height": 44, "rx": 8, "ry": 8 },
            "textStyle": { "fill": "#e6eefc" }
        },
        {
            "text": "1-click internal links and meta tags that match your keywords.",
            "image": { "href": "https://cdn.example.com/icons/link.png" }
        },
        {
            "text": "Publish directly to WordPress with scheduled posts.",
            "image": { "href": "https://cdn.example.com/icons/wp.png" }
        },
        {
            "text": "Team workspaces, templates, and project analytics built-in.",
            "image": { "href": "https://cdn.example.com/icons/team.png" }
        }
    ]
}


const svg = buildInfographySVG(jsonConfig);