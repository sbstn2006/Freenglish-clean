// Servicio de API para conectar con el backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  status?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: number;
  role?: 'estudiante' | 'docente' | 'admin';
}

export interface ApiResponse<T> {
  message?: string;
  error?: string;
  data?: T;
  token?: string;
  userId?: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token si existe
    const token = this.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('Error en API request:', error);
      throw error;
    }
  }

  // Autenticación
  async login(credentials: LoginData): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ userId: number }>> {
    return this.request<{ userId: number }>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Usuarios
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Utilidades
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async testConnection(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/test');
  }
}

export const apiService = new ApiService();

// Funciones para gestión de docentes pendientes (usando rutas de compatibilidad)
export const getPendingDocentes = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/pending-docentes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al obtener docentes pendientes');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const activateDocente = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:4000/api/activate-docente/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al activar docente');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Obtener todos los docentes (usando ruta de compatibilidad)
export const getAllDocentes = async () => {
  const response = await fetch('http://localhost:4000/api/docentes', {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener docentes');
  return await response.json();
};

// Aprobar docente (usando ruta de compatibilidad)
export const aprobarDocente = async (id: number) => {
  const response = await fetch(`http://localhost:4000/api/docentes/${id}/activar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al aprobar docente');
  return await response.json();
};

// Rechazar docente (usando ruta de compatibilidad)
export const rechazarDocente = async (id: number) => {
  const response = await fetch(`http://localhost:4000/api/docentes/${id}/rechazar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al rechazar docente');
  return await response.json();
};

// Actualizar docente (usando ruta de compatibilidad)
export const actualizarDocente = async (id: number, data: any) => {
  const response = await fetch(`http://localhost:4000/api/docentes/${id}/actualizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al actualizar docente');
  return await response.json();
};

// Obtener cursos y horarios de un docente
export const getCursosHorariosDocente = async (docenteId: number) => {
  const response = await fetch(`http://localhost:4000/api/horarios/docente/${docenteId}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener cursos y horarios');
  return await response.json();
};

// Enviar mensaje de contacto
export const sendContactMessage = async (contactData: {
  nombre: string;
  email: string;
  mensaje: string;
}) => {
  const response = await fetch('http://localhost:4000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  if (!response.ok) throw new Error('Error al enviar mensaje');
  return await response.json();
};

// Eliminar docente (usando ruta de compatibilidad)
export const eliminarDocente = async (id: number) => {
  const response = await fetch(`http://localhost:4000/api/docentes/${id}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  if (!response.ok) throw new Error('Error al eliminar docente');
  return await response.json();
};

// Funciones para gestión de cursos
export const crearCurso = async (cursoData: any) => {
  // Generar slug automáticamente si no se proporciona
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim()
      .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
  };

  const dataToSend = {
    ...cursoData,
    slug: cursoData.slug || generateSlug(cursoData.titulo)
  };

  console.log('Datos a enviar:', dataToSend);

  const response = await fetch('http://localhost:4000/api/cursos', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(dataToSend)
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.log('Error response:', errorData);
    throw new Error(errorData.error || 'Error al crear curso');
  }
  
  return await response.json();
};

export const actualizarCurso = async (id: number, cursoData: any) => {
  // Generar slug automáticamente si no se proporciona y hay título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim()
      .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
  };

  const dataToSend = {
    ...cursoData,
    slug: cursoData.slug || (cursoData.titulo ? generateSlug(cursoData.titulo) : undefined)
  };

  const response = await fetch(`http://localhost:4000/api/cursos/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(dataToSend)
  });
  if (!response.ok) throw new Error('Error al actualizar curso');
  return await response.json();
};

export const eliminarCurso = async (id: number) => {
  console.log('Intentando eliminar curso con ID:', id);
  
  const response = await fetch(`http://localhost:4000/api/cursos/${id}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.log('Error response:', errorData);
    throw new Error(errorData.error || 'Error al eliminar curso');
  }
  
  return await response.json();
}; 