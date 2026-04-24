import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme';
import type { TabKey } from '../types';

const tabs: TabKey[] = ['home', 'saved', 'profile'];

const iconForTab = (tab: TabKey) => {
  if (tab === 'home') return 'H';
  if (tab === 'saved') return 'S';
  return 'P';
};

const labelForTab = (tab: TabKey) => {
  if (tab === 'home') return 'Home';
  if (tab === 'saved') return 'Saved';
  return 'Profile';
};

export function BottomTabBar({ activeTab }: { activeTab: TabKey }) {
  const router = useRouter();

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const active = tab === activeTab;
        const href = tab === 'home' ? '/(tabs)' : `/(tabs)/${tab}`;

        return (
          <Pressable key={tab} style={styles.item} onPress={() => router.replace(href)}>
            <View style={[styles.icon, active && styles.iconActive]}>
              <Text style={[styles.iconText, active && styles.iconTextActive]}>{iconForTab(tab)}</Text>
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{labelForTab(tab)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: colors.primaryDark,
  },
  iconText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  iconTextActive: {
    color: colors.white,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  labelActive: {
    color: colors.primaryDark,
  },
});
