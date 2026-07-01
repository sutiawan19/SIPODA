import { Metadata } from 'next';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Login Admin | SIPODA',
  description: 'Halaman login administrator.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
