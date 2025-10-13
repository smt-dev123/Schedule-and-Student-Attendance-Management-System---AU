import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function HomeScreen() {
  const { theme } = useUnistyles()

  const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
  });

  return (
    <View>
      <Text style={styles.title}>Hello Theme!</Text>
    </View>
  );
}
