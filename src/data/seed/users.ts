import type { UserRecord } from '@/types';

/**
 * Demo accounts (fictional, documented in README.md). Passwords are stored
 * as salted SHA-256 digests — never plaintext — teaching the real pattern
 * while staying honest that this is not production password storage
 * (docs/ARCHITECTURE.md §9). Hashes were generated with:
 *   sha256(salt + password)  →  hex
 */
export const seedUsers: UserRecord[] = [
  {
    id: 'u-admin',
    email: 'admin@scholarsphere.test',
    role: 'admin',
    displayName: 'Program Office',
    credential: {
      algorithm: 'sha256',
      salt: 'c2e6db67e74ae9cf624b488c6ed4fb56',
      hash: 'e4f62edca873eb58ab51f9d3179a679bef26593ea49181b408f3186a8b5172fd',
    },
  },
  {
    id: 'u-ayesha',
    email: 'ayesha@scholarsphere.test',
    role: 'applicant',
    displayName: 'Ayesha Rahman',
    credential: {
      algorithm: 'sha256',
      salt: '1a1b3a2471000f1d8c688121d86803ab',
      hash: 'a66f694f1fa337ae43a6592d607e9883570575c4c31393d4530662ed2067cd60',
    },
  },
  {
    id: 'u-rafiq',
    email: 'rafiq@scholarsphere.test',
    role: 'applicant',
    displayName: 'Rafiq Chowdhury',
    credential: {
      algorithm: 'sha256',
      salt: '7c8c887cd2590575d02d7df6c753f98a',
      hash: '5af12e720d8973e0d7ded3aa8997ee8e6fca7dec7f3a2723a5f9d84786649ec7',
    },
  },
];
