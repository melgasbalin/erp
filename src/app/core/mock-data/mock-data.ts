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

export interface MockFile {
    id: number;
    name: string;
    type: string;
    size: number;
    url: string;
}

export const MockFileData: MockFile[] = [
    { id: 1, name: 'reporte_ventas.pdf', type: 'application/pdf', size: 204800, url: 'https://example.com/files/reporte_ventas.pdf' },
    { id: 2, name: 'imagen_producto.png', type: 'image/png', size: 102400, url: 'https://example.com/files/imagen_producto.png' },
    { id: 3, name: 'datos_clientes.txt', type: 'text/plain', size: 51200, url: 'https://example.com/files/datos_clientes.txt' }
];
