const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/components/home/FaharaHeroBannerCarousel.jsx');
let s = fs.readFileSync(filePath, 'utf8');

const regexImg = /\{\/\* Responsive Desktop vs Mobile Background Image \*\/\}[\s\S]*?<\/picture>\s*\}\)/;

const newImageBlock = `{/* Responsive Desktop vs Mobile Background / Featured Banner Image */}
              {(currentBanner.desktopImageUrl || currentBanner.mobileImageUrl) && (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <picture className="w-full h-full block">
                    {currentBanner.mobileImageUrl && (
                      <source media="(max-width: 640px)" srcSet={currentBanner.mobileImageUrl} />
                    )}
                    <img
                      src={currentBanner.desktopImageUrl || currentBanner.mobileImageUrl}
                      alt={currentBanner.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </picture>
                  {/* High contrast gradient overlay so white title and CTA stand out crisply */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                </div>
              )}`;

s = s.replace(regexImg, newImageBlock);
fs.writeFileSync(filePath, s, 'utf8');
console.log('Banner image visibility updated! 🖼️✨');
