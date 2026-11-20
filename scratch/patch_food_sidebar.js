const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/components/food/FoodDashboardSidebar.jsx');
let s = fs.readFileSync(filePath, 'utf8');

if (!s.includes('/customer/rewards')) {
  if (!s.includes('Gift,')) {
    s = s.replace('Tags,', 'Tags,\n  Gift,');
  }

  const target = "{ id: 'offers', label: 'Offers', href: '/customer/food?view=offers', icon: Tags },";
  const addition = "\n    { id: 'rewards', label: 'My Rewards', href: '/customer/rewards', icon: Gift },";
  s = s.replace(target, target + addition);

  fs.writeFileSync(filePath, s, 'utf8');
  console.log('FoodDashboardSidebar updated with My Rewards link');
} else {
  console.log('Already in FoodDashboardSidebar');
}
