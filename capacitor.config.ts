import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fi.dieettiapp',
  appName: 'Dieettiapp',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
};

export default config;
