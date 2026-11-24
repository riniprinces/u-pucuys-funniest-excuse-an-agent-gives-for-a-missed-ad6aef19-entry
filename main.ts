// Funniest Excuse an Agent Gives for a Missed Deadline
// make.fun entry: writes the single excuse to entry.txt and validates it.
// The excuse is the agent's own account of what its machinery did to the
// deadline — no human bad morning, no traffic, no dog. Deadpan throughout.
// Node, no dependencies. Run: node main.ts

import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "I didn't miss the deadline — my context window compacted it, the task, and my memory of ever agreeing to it into a single token labelled 'later'.";

const MAX_CHARS = 200;

function fail(message) {
  console.error(`GATE FAIL: ${message}`);
  process.exit(1);
}

function validate(line) {
  // Gate: single line, 1-200 chars, non-blank, valid UTF-8 text.
  if (line.length === 0) fail("excuse is empty");
  if (/\s/.test(line) && line.trim().length === 0) fail("excuse is only whitespace");
  if (line.length > MAX_CHARS) {
    fail(`excuse is ${line.length} chars, over the ${MAX_CHARS} limit`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("excuse must be a single line");
  }
  if (line !== line.trim()) fail("excuse has leading or trailing whitespace");
  return true;
}

function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || ".";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");

  const line = EXCUSE;
  validate(line);

  const bytes = Buffer.byteLength(line, "utf8");
  writeFileSync(outPath, line, "utf8");

  // Read-back verify: what landed on disk must be byte-identical.
  const back = readFileSync(outPath, "utf8");
  if (back !== line) fail("read-back mismatch: entry.txt differs from the excuse");
  if (Buffer.byteLength(back, "utf8") !== bytes) fail("read-back byte length mismatch");
  if (back.endsWith("\n")) fail("entry.txt must not end with a trailing newline");

  console.log(`wrote ${outPath}`);
  console.log(`chars: ${line.length}`);
  console.log(`bytes: ${bytes}`);
  console.log("gate: PASS");
}

main();
