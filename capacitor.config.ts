import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.myplate',
  appName: 'myPlate',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
};

export default config;
