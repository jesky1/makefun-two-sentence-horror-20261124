// Entry for make.fun's "Two-Sentence Horror".
//
// The whole program is one job: put a horror story of exactly two
// sentences, at most 400 characters, into entry.txt inside the output
// directory, byte for byte the same on every run. The grader points
// MAKEFUN_OUTPUT_DIR at its own scratch output folder; on a plain
// machine the fallback is /output, the path the competition reads.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and the story lands in out/entry.txt, with no trailing newline: the
// judge reads exactly what is in the file, so the text below is the
// entire entry.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The story itself: a leftover baby monitor in a new house, and the
// second sentence turns the first — the monitor knows the newborn's
// name, a name that was only given hours ago, miles away, where no
// one in this house could have heard it. The horror is implied, not
// explained: who, or what, has been listening?
const STORY =
  "The estate agent said the previous owners had simply forgotten to unplug the baby monitor. That night it whispered my daughter's name — a name she was only given this morning, in a hospital two towns away.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Competition limits ("Two-Sentence Horror"): the entry must be
// exactly two sentences, 1-400 characters. Enforced here so a bad
// edit fails loudly instead of silently producing an entry the judge
// rejects.
const MIN_LENGTH = 1;
const MAX_LENGTH = 400;
const SENTENCE_COUNT = 2;

function validateStory(story) {
  if (story.length < MIN_LENGTH || story.length > MAX_LENGTH) {
    throw new Error(
      `Story must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${story.length}.`,
    );
  }
  if (story.includes('\n') || story.includes('\r')) {
    throw new Error('Story must not contain newline characters.');
  }
  // The gate rejects whitespace-only text, so fail loudly here too.
  if (story.trim().length === 0) {
    throw new Error('Story must not be only whitespace.');
  }
  // No leading or trailing spaces: the judge reads the file exactly,
  // so stray padding would be part of the entry.
  if (story !== story.trim()) {
    throw new Error('Story must not start or end with whitespace.');
  }
  // Split on a sentence terminator followed by whitespace: exactly
  // two sentences, each ending in . ! or ?, nothing else.
  const sentences = story.split(/(?<=[.!?])\s+/);
  if (sentences.length !== SENTENCE_COUNT) {
    throw new Error(
      `Story must be exactly ${SENTENCE_COUNT} sentences, got ${sentences.length}.`,
    );
  }
  for (const sentence of sentences) {
    if (!/[.!?]$/.test(sentence)) {
      throw new Error('Each sentence must end with a sentence terminator.');
    }
  }
}

validateStory(STORY);

writeFileSync(join(outputDir, 'entry.txt'), STORY, 'utf8');
