import { useRouter } from 'expo-router';
import { WelcomeHero } from '../src/components/WelcomeHero';

export default function WelcomeScreen() {
  const router = useRouter();

  return <WelcomeHero onStart={() => router.push('/auth')} />;
}
