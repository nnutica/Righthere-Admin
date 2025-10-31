// src/types/user.d.ts
export type UserRole = 'admin' | 'moderator' | 'staff' | 'user';

export interface User {
  uid: string;              // UID จาก Firebase Auth
  username: string;         // ชื่อผู้ใช้ภายในระบบ
  email: string;            // อีเมล
  role: UserRole;           // สิทธิ์ของผู้ใช้
  coin: number;             // จำนวนเหรียญในระบบ
  createdAt: Date | string; // วันที่สร้างบัญชี (Firestore Timestamp หรือ ISO string)
}
