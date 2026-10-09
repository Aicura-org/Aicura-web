import fs from 'fs';
import path from 'path';

export function syncCampaignAssets() {
  try {
    const brainDir = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\7cd1018b-f9f7-4be8-ac45-5039979c4311';
    const publicDir = path.join(process.cwd(), 'public');

    const assetsToSync = [
      {
        srcNames: ['senior_couple_hero_1791291769977.jpg', 'media_1791286709370.png'],
        destName: 'senior-couple.webp',
      },
    ];

    for (const item of assetsToSync) {
      const destPath = path.join(publicDir, item.destName);
      if (!fs.existsSync(destPath)) {
        for (const srcName of item.srcNames) {
          const possiblePaths = [
            path.join(brainDir, srcName),
            path.join(brainDir, '.tempmediaStorage', srcName),
            path.join(brainDir, '.user_uploaded', srcName),
          ];
          for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
              fs.copyFileSync(p, destPath);
              break;
            }
          }
          if (fs.existsSync(destPath)) break;
        }
      }
    }
  } catch (err) {
    // Non-blocking
  }
}
