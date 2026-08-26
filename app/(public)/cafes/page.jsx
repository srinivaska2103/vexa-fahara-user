import { redirect } from 'next/navigation';

export default function PublicCafesRedirectPage() {
  redirect('/customer/cafe');
}
