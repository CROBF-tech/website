#!/usr/bin/env node
// Resets and fills all blog frontmatter in-place.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const blogDir = "src/content/blog";

const TAG_RULES_ES = [
    { tag: "CSS", match: /\bcss\b/i },
    { tag: "JavaScript", match: /\b(javascript|js)\b/i },
    { tag: "React", match: /\breact\b/i },
    { tag: "Bases de datos", match: /\b(base(?:s)? de datos|database|sql|nosql|turso|normalizaci[oó]n)\b/i },
    { tag: "Git", match: /\bgit\b/i },
    { tag: "IA", match: /\b(ia|inteligencia artificial)\b/i },
    { tag: "Gestión", match: /\b(gesti[oó]n|project management)\b/i },
    { tag: "Soft Skills", match: /\bsoft skills\b/i },
    { tag: "Pair Programming", match: /\bpair programming\b/i },
    { tag: "SOLID", match: /\bsolid\b/i },
    { tag: "Frontend", match: /\b(frontend|front-end)\b/i },
    { tag: "Mobile", match: /\b(mobile|android|iphone|celular)\b/i },
    { tag: "Aprendizaje", match: /\b(aprender a programar|ruta.*programar|programming)\b/i },
    { tag: "Mujeres en IT", match: /\b(mujer(?:es)?)\b/i },
    { tag: "Conflictos", match: /\bconflictos?\b/i },
    { tag: "Equipos", match: /\bequipos?\b/i },
    { tag: "Herramientas", match: /\bherramientas?\b/i },
    { tag: "Requerimientos", match: /\brequerimientos\b/i },
    { tag: "Automatización", match: /\bautomatizaci[oó]n\b/i },
];

const TAG_RULES_EN = [
    { tag: "CSS", match: /\bcss\b/i },
    { tag: "JavaScript", match: /\b(javascript|js)\b/i },
    { tag: "React", match: /\breact\b/i },
    { tag: "Databases", match: /\b(databases?|sql|nosql|turso|normalization)\b/i },
    { tag: "Git", match: /\bgit\b/i },
    { tag: "AI", match: /\b(ai|artificial intelligence)\b/i },
    { tag: "Project Management", match: /\b(project management|management)\b/i },
    { tag: "Soft Skills", match: /\bsoft skills\b/i },
    { tag: "Pair Programming", match: /\bpair programming\b/i },
    { tag: "SOLID", match: /\bsolid\b/i },
    { tag: "Frontend", match: /\b(frontend|front-end)\b/i },
    { tag: "Mobile", match: /\b(mobile|android|iphone)\b/i },
    { tag: "Learning", match: /\b(learn to program|learning.*program)\b/i },
    { tag: "Women in IT", match: /\b(women|woman)\b/i },
    { tag: "Conflict", match: /\bconflict[s]?\b/i },
    { tag: "Teams", match: /\bteam[s]?\b/i },
    { tag: "Tools", match: /\btool[s]?\b/i },
    { tag: "Requirements", match: /\brequirement[s]?\b/i },
];

const FALLBACK_TAG = { es: "Software", en: "Software" };
const WPM = { es: 210, en: 230 };

function estimateReadingTime(content, lang) {
    const text = content
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / (WPM[lang] || 220)));
}

function deriveTags(title, lang) {
    const rules = lang === "en" ? TAG_RULES_EN : TAG_RULES_ES;
    const tags = new Set();
    for (const { tag, match } of rules) {
        if (match.test(title)) tags.add(tag);
    }
    if (tags.size === 0) tags.add(FALLBACK_TAG[lang] || "Software");
    return [...tags].slice(0, 3);
}

function stripMarkdown(text) {
    return text
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/__([^_]+)__/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/_([^_]+)_/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function firstParagraph(body) {
    const lines = body.split(/\r?\n/);
    const out = [];
    let started = false;
    for (const raw of lines) {
        const line = raw.trim();
        if (!started) {
            if (!line) continue;
            if (line.startsWith("import ")) continue;
            if (line.startsWith("#")) continue;
            if (line.startsWith(">")) continue;
            started = true;
        }
        if (!line) break;
        if (line.startsWith("import ")) continue;
        if (line.startsWith("#")) break;
        if (line.startsWith(">")) break;
        if (line.startsWith("<")) break;
        out.push(line);
        if (out.join(" ").length > 220) break;
    }
    let text = out.join(" ");
    text = stripMarkdown(text);
    if (text.length > 180) {
        const cut = text.slice(0, 177);
        const lastSpace = cut.lastIndexOf(" ");
        text = cut.slice(0, lastSpace > 80 ? lastSpace : 177).replace(/[.,;:!?]+$/, "") + "…";
    }
    return text;
}

function parseFrontmatter(raw) {
    const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) return null;
    return { fm: m[1], body: m[2] };
}

function parseYamlSimple(yaml) {
    const obj = {};
    const lines = yaml.split(/\r?\n/);
    let currentArrayKey = null;
    for (const line of lines) {
        if (!line.trim()) continue;
        const arrayItem = line.match(/^\s*-\s*(.+)$/);
        if (arrayItem && currentArrayKey) {
            obj[currentArrayKey].push(arrayItem[1].trim().replace(/^['"]|['"]$/g, ""));
            continue;
        }
        const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
        if (!m) continue;
        const key = m[1];
        let val = m[2].trim();
        if (val === "" || val === undefined) {
            obj[key] = [];
            currentArrayKey = key;
            continue;
        }
        currentArrayKey = null;
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1).replace(/''/g, "'");
        else if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val === "true") val = true;
        else if (val === "false") val = false;
        obj[key] = val;
    }
    return obj;
}

function quoteValue(v) {
    return `'${String(v).replace(/'/g, "''")}'`;
}

function formatScalar(_key, v) {
    if (typeof v === "number") return String(v);
    if (typeof v === "boolean") return v ? "true" : "false";
    return quoteValue(v);
}

function buildFrontmatter(meta) {
    const lines = [];
    const ordered = ["title", "description", "pubDate", "updatedDate", "heroImage", "author", "tags", "readingTime", "featured"];
    const used = new Set();
    for (const key of ordered) {
        if (meta[key] !== undefined && meta[key] !== null) {
            if (Array.isArray(meta[key])) {
                lines.push(`${key}:`);
                for (const v of meta[key]) lines.push(`  - ${quoteValue(v)}`);
            } else {
                lines.push(`${key}: ${formatScalar(key, meta[key])}`);
            }
            used.add(key);
        }
    }
    for (const [key, val] of Object.entries(meta)) {
        if (used.has(key)) continue;
        if (Array.isArray(val)) {
            lines.push(`${key}:`);
            for (const v of val) lines.push(`  - ${quoteValue(v)}`);
        } else {
            lines.push(`${key}: ${formatScalar(key, val)}`);
        }
    }
    return `---\n${lines.join("\n")}\n---\n`;
}

async function processFile(file, lang) {
    const raw = await readFile(file, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed) return;
    const meta = parseYamlSimple(parsed.fm);
    const next = { ...meta };

    if (!meta.description || meta.description.length < 10) {
        next.description = firstParagraph(parsed.body);
    }

    if (!meta.author) next.author = "CROBF";
    next.tags = deriveTags(meta.title || "", lang);
    next.readingTime = estimateReadingTime(parsed.body, lang);

    const fm = buildFrontmatter(next);
    const out = `${fm}${parsed.body.startsWith("\n") ? parsed.body.slice(1) : parsed.body}`;
    if (out !== raw) {
        await writeFile(file, out, "utf8");
        console.log(`updated: ${file}`);
    }
}

async function processDir(dir, lang) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!/\.(md|mdx)$/i.test(entry.name)) continue;
        await processFile(join(dir, entry.name), lang);
    }
}

await processDir(join(blogDir, "es"), "es");
await processDir(join(blogDir, "en"), "en");
console.log("done");
