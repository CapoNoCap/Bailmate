import { Image, ScrollView, Text } from 'react-native';

export default function BailProcessScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f2f2f2' }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          fontSize: 34,
          fontWeight: 'bold',
          color: 'navy',
          marginBottom: 20,
        }}
      >
        How Bail Works
      </Text>

      <Image
        source={require('./assets/bail-process.jpeg')}
        style={{
          width: '100%',
          height: 260,
          resizeMode: 'contain',
          marginBottom: 25,
        }}
      />

      <Text style={{ fontSize: 18, lineHeight: 28 }}>
        After an arrest, the defendant is booked into jail and appears before a judge for a bail hearing.
        {'\n\n'}
        If bail is set, a bail bond agent can help secure release by posting bond on the defendant’s behalf.
        {'\n\n'}
        Once payment arrangements are made, the bondsman works with the jail to process release.
      </Text>
    </ScrollView>
  );
}