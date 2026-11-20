const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/customer/checkout/page.jsx');
let s = fs.readFileSync(filePath, 'utf8');

if (!s.includes('CartGiftRewardTracker')) {
  s = "import CartGiftRewardTracker from '@/app/components/food/CartGiftRewardTracker';\n" + s;

  const target = '{/* Right Col: Price Breakdown & Place Order Action */}';
  const addition = `
            {/* Grab2Go Automatic Gift Reward Checkout Banner */}
            <CartGiftRewardTracker 
              subtotal={discountedFood || originalSubtotal} 
              rewardEligibility={cart?.rewardEligibility} 
            />
`;
  s = s.replace(target, addition + target);

  fs.writeFileSync(filePath, s, 'utf8');
  console.log('CheckoutPage updated with CartGiftRewardTracker');
} else {
  console.log('Already in CheckoutPage');
}
