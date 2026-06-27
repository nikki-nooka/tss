import { redirect } from 'next/navigation';

export default function GetVerifiedRedirect() {
  redirect('/register');
}
