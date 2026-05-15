const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') && !file.includes('HeroSection.tsx')) results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('<img')) {
    const newContent = c.replace(/<img(?!([^>]*?)loading=['"]lazy['"])/g, '<img loading="lazy"');
    if (c !== newContent) {
      fs.writeFileSync(f, newContent);
      console.log('Updated ' + f);
    }
  }
});
