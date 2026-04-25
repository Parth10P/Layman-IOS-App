import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Tabs } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />;
}
