const fs = require('fs');
const path = require('path');

const dir = 'c:\\hawaahawaai';
const files = fs.readdirSync(dir);

const seoKeywords = [
  "balloon decoration near me",
  "balloon decoration",
  "premium birthday decoration",
  "party decorators",
  "balloon decor"
];

for (const file of files) {
  if (file.endsWith('.html')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Optimize Images
    content = content.replace(/<img\s+([^>]+)>/ig, (match, attrs) => {
      // Avoid modifying if it's already got fetchpriority="high" or loading="eager"
      if (attrs.includes('fetchpriority="high"') || attrs.includes("loading='eager'") || attrs.includes('loading="eager"')) {
        // still add decoding async if missing
        if (!attrs.includes('decoding=')) {
          return `<img ${attrs} decoding="async">`;
        }
        return match;
      }
      
      let newAttrs = attrs;
      if (!newAttrs.includes('loading=')) {
        newAttrs += ' loading="lazy"';
      }
      if (!newAttrs.includes('decoding=')) {
        newAttrs += ' decoding="async"';
      }
      return `<img ${newAttrs}>`;
    });

    // 2. Enhance SEO Keywords
    const keywordRegex = /<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i;
    const keywordsMatch = content.match(keywordRegex);
    
    if (keywordsMatch) {
      let existing = keywordsMatch[1];
      let combined = Array.from(new Set([...existing.split(','), ...seoKeywords].map(k => k.trim()).filter(Boolean))).join(', ');
      content = content.replace(keywordsMatch[0], `<meta name="keywords" content="${combined}"`);
    } else {
      // Inject after title if not exists
      content = content.replace(/<\/title>/i, `</title>\n  <meta name="keywords" content="${seoKeywords.join(', ')}">`);
    }

    // 3. Ensure a description tag exists
    const descRegex = /<meta\s+name=["']description["']/i;
    if (!descRegex.test(content)) {
      content = content.replace(/<\/title>/i, `</title>\n  <meta name="description" content="Premium balloon decoration services for birthdays, anniversaries, baby showers, and events in Delhi NCR. Book expert decorators today!">`);
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Optimized: ${file}`);
    }
  }
}

console.log('Optimization complete!');
