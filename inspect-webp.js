const fs = require("fs");
const path = require("path");
const root = path.join("C:", "Users", "Cesar", "Desktop", "Work", "ETZ-A-SHOPPE", "public", "images");
const files = ["hero2.webp", "hero2-overlay.webp", "hero2mobile.webp", "hero2mobile-overlay.webp", "hero_fullbleed.webp"];
const parse = (buf) => {
  const riff = buf.toString("ascii", 0, 4);
  if (riff !== "RIFF") return { error: "not riff" };
  const form = buf.toString("ascii", 8, 12);
  if (form !== "WEBP") return { error: "not webp" };
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return { format: "VP8", width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { format: "VP8L", width: (b & 0x3fff) + 1, height: (((b >> 14) & 0x3fff)) + 1 };
  }
  if (chunk === "VP8X") {
    return { format: "VP8X", width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  return { error: "unknown " + chunk };
};
files.forEach((f) => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) {
    console.log(f, "MISSING");
    return;
  }
  const buf = fs.readFileSync(p);
  console.log(f, JSON.stringify(parse(buf)));
});