import { redirect } from 'next/navigation';

export default async function CustomerCafeRedirectPage({ params }) {
  const { id } = await params;
  redirect(`/cafes/${id}`);
}
