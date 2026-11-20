const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/customer/cart/page.jsx');
let s = fs.readFileSync(filePath, 'utf8');

if (!s.includes('CartGiftRewardTracker')) {
  // Add import
  s = "import CartGiftRewardTracker from '@/app/components/food/CartGiftRewardTracker';\n" + s;

  // Insert component directly above left column items
  const target = '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">';
  const addition = `
        {/* Grab2Go Automatic Gift Reward Tracker Banner */}
        <CartGiftRewardTracker 
          subtotal={subtotal} 
          rewardEligibility={cart?.rewardEligibility} 
        />
`;
  s = s.replace(target, addition + target);

  fs.writeFileSync(filePath, s, 'utf8');
  console.log('CustomerCartPage updated with CartGiftRewardTracker');
} else {
  console.log('Already imported in CustomerCartPage');
}
