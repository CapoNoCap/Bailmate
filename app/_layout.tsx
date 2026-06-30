import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: 'navy' },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'BailMate',
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: 'Log In',
        }}
      />

      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
        }}
      />

<Stack.Screen
  name="user-login"
  options={{ title: 'User Log In' }}
/>

<Stack.Screen
  name="user-dashboard"
  options={{ title: 'User Dashboard' }}
/>

      <Stack.Screen
      name= "user-signup"
      options={{ title: 'User Sign Up'}}
/>

<Stack.Screen
  name="check-email"
  options={{ title: 'Check Email' }}
/>

      <Stack.Screen
        name="privacy"
        options={{
          title: 'Privacy Policy',
        }}
      />

      <Stack.Screen
        name="provider-dashboard"
        options={{
          title: 'Provider Dashboard',
        }}
      />

      <Stack.Screen
        name="intake"
        options={{
          title: 'Get Help',
        }}
      />

      <Stack.Screen
        name="results"
        options={{
          title: 'Results',
        }}
      />

      <Stack.Screen
        name="map"
        options={{
          title: 'Map',
        }}
      />

      <Stack.Screen
        name="provider/[id]"
        options={{
          title: 'Provider Details',
        }}
      />

      <Stack.Screen
        name="request-help"
        options={{
          title: 'Request Help',
        }}
      />

      <Stack.Screen
        name="success"
        options={{
          title: 'Success',
        }}
      />
    </Stack>
  );
}