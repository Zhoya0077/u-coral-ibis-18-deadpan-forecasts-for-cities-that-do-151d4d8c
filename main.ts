// Deadpan Forecasts for Cities That Do Not Exist
// Writes one absurd-but-believable weather line for the invented city
// of Varn Hollow to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "In Varn Hollow, expect 4 cm of uphill rain, a low of minus Tuesday, and a 90% chance the council fines the clouds for loitering.";

// Self-checking gate: the sealed scorer requires UTF-8 text of
// 1 to 160 characters, not only whitespace, on a single line.
function gate(text: string): void {
  if (text.length < 1 || text.length > 160) {
    throw new Error(`entry length ${text.length} is outside the 1-160 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

gate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Harden the gate: read the file back and confirm the exact bytes
// round-trip, so a silent write failure can never pass unnoticed.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt round-trip mismatch");
}
gate(written);
console.log(ENTRY);
