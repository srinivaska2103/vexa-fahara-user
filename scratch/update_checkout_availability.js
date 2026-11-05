const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/customer/checkout/page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fetch live ordering availability in CheckoutPage
const queryTarget = '  const { cart, fetchCart } = useCartStore();';
const queryReplacement = `  const { cart, fetchCart } = useCartStore();

  const [restaurantAvailability, setRestaurantAvailability] = useState(null);

  useEffect(() => {
    if (cart?.cafe?.id) {
      api.get(\`/public/cafes/\${cart.cafe.id}/ordering-availability\`)
        .then(res => setRestaurantAvailability(res.data?.data?.availability || null))
        .catch(() => {});
    }
  }, [cart?.cafe?.id]);`;

if (content.includes(queryTarget) && !content.includes('restaurantAvailability')) {
  content = content.replace(queryTarget, queryReplacement);
}

// 2. Add availability check in handlePlaceOrder
const placeTarget = '    try {\n      setIsSubmitting(true);';
const placeTargetCRLF = '    try {\r\n      setIsSubmitting(true);';

const placeReplacement = `    if (restaurantAvailability && !restaurantAvailability.canPlaceOrder) {
      toast.error(restaurantAvailability.message || 'Restaurant is currently closed for orders.');
      return;
    }

    try {
      setIsSubmitting(true);`;

if (content.includes(placeTarget)) {
  content = content.replace(placeTarget, placeReplacement);
} else if (content.includes(placeTargetCRLF)) {
  content = content.replace(placeTargetCRLF, placeReplacement.replace(/\n/g, '\r\n'));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated vexa-fahara-user checkout/page.jsx with availability check!');

