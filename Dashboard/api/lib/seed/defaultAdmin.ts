// lib/seed/defaultAdmin.ts
import bcrypt from 'bcryptjs';
import UserModel from '../modules/schemas/user.schema';

export async function ensureDefaultAdmin(): Promise<void> {
    const email = 'admin';
    const password = 'admin';

    const existing = await UserModel.findOne({ email });

    if (!existing) {
        const passwordHash = await bcrypt.hash(password, 10);

        await UserModel.create({
            email,
            name: email,         // masz unique name, więc najprościej = email
            role: 'admin',
            isAdmin: true,
            active: true,
            passwordHash,
        });

        console.log('[seed] Default admin created: admin/admin');
        return;
    }

    // jeśli istnieje, dopilnuj uprawnień (np. jak ktoś zrobił go jako user)
    let changed = false;
    if (existing.role !== 'admin') { existing.role = 'admin'; changed = true; }
    if (existing.isAdmin !== true) { existing.isAdmin = true; changed = true; }
    if (existing.active !== true) { existing.active = true; changed = true; }

    if (changed) {
        await existing.save();
        console.log('[seed] Default admin fixed to admin role');
    }
}
