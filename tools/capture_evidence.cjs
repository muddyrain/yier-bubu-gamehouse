// Screenshot transport only: callers supply bytes from the current, permitted capture.
// This module never opens an app or captures a screen. No REPL image free variables.
'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

async function saveCapture(directory, name, imageBytes) {
  if (!/^[0-9]{2}-[a-z0-9-]+$/.test(name)) throw new Error('Use a numbered capture name without an extension');
  if (!(imageBytes instanceof Uint8Array) || imageBytes.length === 0 || imageBytes.length > 32 * 1024 * 1024) {
    throw new Error('Supply current screenshot bytes (1 byte to 32 MiB)');
  }
  // Copy now, before awaiting I/O; later caller mutations cannot replace this capture.
  const bytes = Buffer.from(imageBytes);
  const format = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? 'png'
    : bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff ? 'jpg' : null;
  if (!format) throw new Error('Unsupported screenshot signature');
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  await fs.mkdir(directory, {recursive: true});
  const entries = await fs.readdir(directory);
  const images = entries.filter(entry => /\.(png|jpe?g)$/i.test(entry));
  if (images.length >= 100) throw new Error('Capture directory limit reached');
  for (const entry of images) {
    const previous = await fs.readFile(path.join(directory, entry));
    if (crypto.createHash('sha256').update(previous).digest('hex') === sha256) {
      throw new Error(`Duplicate screenshot bytes: ${entry}; inspect the current state before saving`);
    }
  }
  const file = `${name}.${format}`;
  await fs.writeFile(path.join(directory, file), bytes, {flag: 'wx'});
  // Receipt proves byte transport only, never that a keyboard action passed.
  return {file, sha256, bytes: bytes.length, saved_at: new Date().toISOString()};
}

module.exports = {saveCapture};
