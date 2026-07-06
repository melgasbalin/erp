export interface User {
    password?: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export const MOCK_USERS: User[] = [
    { email: 'admin@ejemplo.com', password: '123456', role: 'ADMIN', name: 'Usuario Admin' },
    { email: 'user@ejemplo.com', password: '123456', role: 'USER', name: 'Usuario Normal' }
];

export const getCurrentUserMock = (): User => {
    // Simulamos que el usuario actual es el admin para pruebas rápidas
    return MOCK_USERS.find(u => u.email === 'admin@ejemplo.com')!;
};
