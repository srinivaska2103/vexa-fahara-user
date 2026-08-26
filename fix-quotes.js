const fs = require('fs');
const path = require('path');

const filesToFix = [
  "app/components/booking/EventSelector.jsx",
  "app/components/booking/GuestCounter.jsx",
  "app/components/booking/SpecialRequestBox.jsx",
  "app/components/cafe-details/LocationSection.jsx",
  "app/components/cafe-details/PoliciesSection.jsx",
  "app/components/cafe-details/StickyBookingCard.jsx",
  "app/components/cafes/InfiniteScroll.jsx",
  "app/components/home/CafeListSection.jsx",
  "app/components/home/EventsAndOffers.jsx",
  "app/components/home/MarketingSections.jsx",
  "app/components/home/NearbyCafeSection.jsx"
];

for (const relPath of filesToFix) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Simple naive replacements for common unescaped characters in JSX text
    // A better approach is to just run eslint --fix, but since it doesn't auto-fix these:
    
    content = content.replace(/you've/g, "you&apos;ve")
                     .replace(/You've/g, "You&apos;ve")
                     .replace(/host's/g, "host&apos;s")
                     .replace(/Host's/g, "Host&apos;s")
                     .replace(/It's/g, "It&apos;s")
                     .replace(/it's/g, "it&apos;s")
                     .replace(/can't/g, "can&apos;t")
                     .replace(/don't/g, "don&apos;t")
                     .replace(/Let's/g, "Let&apos;s")
                     .replace(/We'll/g, "We&apos;ll")
                     .replace(/you'll/g, "you&apos;ll")
                     .replace(/There's/g, "There&apos;s")
                     .replace(/"Perfect for /g, "&quot;Perfect for ")
                     .replace(/your vision"/g, "your vision&quot;")
                     .replace(/"Fahara makes it/g, "&quot;Fahara makes it")
                     .replace(/easy."/g, "easy.&quot;");
                     
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', fullPath);
  }
}
