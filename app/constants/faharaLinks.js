const IS_PROD = typeof window !== 'undefined' 
  ? !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
  : process.env.NODE_ENV === 'production';

const USER_URL = process.env.NEXT_PUBLIC_USER_URL || (IS_PROD ? 'https://fahara.in' : 'http://localhost:3001');
const CAFE_URL = process.env.NEXT_PUBLIC_CAFE_URL || (IS_PROD ? 'https://cafe.fahara.in' : 'http://localhost:3002');
const EM_URL = process.env.NEXT_PUBLIC_EM_URL || (IS_PROD ? 'https://em.fahara.in' : 'http://localhost:3002');

export const FAHARA_WHATSAPP_NUMBER = 
  process.env.NEXT_PUBLIC_FAHARA_WHATSAPP_NUMBER || "918946029205";

export const FAHARA_LINKS = {
  customerLogin: "/login",
  customerRegister: "/register",
  cafeSignup: `${CAFE_URL}/owner/signup?role=CAFE_OWNER`,
  restaurantSignup: `${CAFE_URL}/owner/signup?role=RESTAURANT_OWNER`,
  eventManagerSignup: `${EM_URL}/event/signup`,
  partnerSubscription: "#pricing",
  partnerInquiry: "#become-partner",
  partnerSignup: `${CAFE_URL}/owner/signup`,
};

export const getPartnerSignupUrl = (partnerType) => {
  switch (partnerType) {
    case 'CAFE':
      return FAHARA_LINKS.cafeSignup;
    case 'RESTAURANT':
      return FAHARA_LINKS.restaurantSignup;
    case 'EVENT_MANAGER':
      return FAHARA_LINKS.eventManagerSignup;
    default:
      return FAHARA_LINKS.customerRegister;
  }
};

