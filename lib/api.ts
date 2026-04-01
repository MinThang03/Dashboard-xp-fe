// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006/api';
const ACCESS_TOKEN_KEY = 'dashboardxp_access_token';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthUserPayload {
  id?: number;
  userId?: number;
  username: string;
  fullName: string;
  email?: string;
  roleId?: number;
  role?: number;
  isActive?: boolean;
  phone?: string;
  avatar?: string;
  department?: string;
  citizenId?: string;
  birthDate?: string;
  startDate?: string;
  address?: string;
  title?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUserPayload;
}

export interface LoginNeedsVerificationResponse {
  requiresVerification: true;
  email?: string;
  message: string;
}

export interface RegisterRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface RegisterResponse {
  message: string;
  email: string;
  requiresVerification: true;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  fullName: string;
  email?: string | null;
  roleId: number;
  isActive: boolean;
  phone?: string | null;
  avatar?: string | null;
  department?: string | null;
  citizenId?: string | null;
  birthDate?: string | null;
  startDate?: string | null;
  address?: string | null;
  title?: string | null;
}

export interface UserProfileUpdatePayload {
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  department?: string | null;
  citizenId?: string | null;
  birthDate?: string | null;
  startDate?: string | null;
  address?: string | null;
  title?: string | null;
}

export interface NotificationPayload {
  id: number;
  type: string;
  title: string;
  content?: string | null;
  detail?: Record<string, any> | null;
  unread: boolean;
  createdAt: string;
}

export interface MessagePayload {
  id: number;
  from: string;
  title: string;
  preview?: string | null;
  body?: string | null;
  unread: boolean;
  createdAt: string;
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function parseJsonSafely(response: Response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      clearAccessToken();
      return null;
    }

    const data = await parseJsonSafely(response);
    if (typeof data?.accessToken !== 'string') {
      clearAccessToken();
      return null;
    }

    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    clearAccessToken();
    return null;
  }
}

// Generic API call handler
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
  allowRetry = true,
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  try {
    const token = getAccessToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (response.status === 401 && allowRetry) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return apiCall<T>(endpoint, options, false);
      }
    }

    const data = await parseJsonSafely(response);

    if (typeof data?.success === 'boolean') {
      return data as ApiResponse<T>;
    }

    if (response.ok) {
      return {
        success: true,
        data: data as T,
      };
    }

    return {
      success: false,
      error: data?.error || 'Request failed',
      message: data?.message || data?.error || `HTTP ${response.status}`,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const authApi = {
  login: (identifier: string, password: string) => {
    return apiCall<LoginResponse | LoginNeedsVerificationResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },
  register: (payload: RegisterRequest) => {
    return apiCall<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  verifyOtp: (email: string, otp: string) => {
    return apiCall<{ message: string; success: true }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },
  resendOtp: (email: string) => {
    return apiCall<{ message: string; success: true }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  me: () => apiCall<AuthUserPayload>('/auth/me'),
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
  refresh: () => apiCall<{ accessToken: string }>('/auth/refresh', { method: 'POST' }),
};

export const userApi = {
  me: () => apiCall<UserProfileResponse>('/users/me'),
  updateMe: (payload: UserProfileUpdatePayload) =>
    apiCall<UserProfileResponse>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

export const notificationsApi = {
  list: () => apiCall<NotificationPayload[]>('/notifications'),
  markRead: (id: number) =>
    apiCall('/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
  markAllRead: () =>
    apiCall('/notifications/mark-all-read', {
      method: 'POST',
    }),
  clearAll: () =>
    apiCall('/notifications', {
      method: 'DELETE',
    }),
};

export const messagesApi = {
  list: () => apiCall<MessagePayload[]>('/messages'),
  markRead: (id: number) =>
    apiCall('/messages/mark-read', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
  markAllRead: () =>
    apiCall('/messages/mark-all-read', {
      method: 'POST',
    }),
};

// ============== HỒ SƠ NGHIỆP VỤ ==============
export const hoSoApi = {
  getList: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-so?${query}`);
  },

  getById: (maHoSo: string) => {
    return apiCall(`/ho-so/${maHoSo}`);
  },

  create: (data: {
    MaLoaiNghiepVu: number;
    MaCongDan: number;
    HanXuLy: string;
    MoTa?: string;
    CanCuPhapLy?: string;
    GhiChu?: string;
  }) => {
    return apiCall('/ho-so', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (maHoSo: string, data: {
    MaTrangThai?: string;
    HanXuLy?: string;
    MoTa?: string;
    GhiChu?: string;
  }) => {
    return apiCall(`/ho-so/${maHoSo}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: (maHoSo: string) => {
    return apiCall(`/ho-so/${maHoSo}`, {
      method: 'DELETE',
    });
  },
};

// ============== VĂN BẢN ==============
export const vanBanApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/van-ban?${query}`);
  },

  getStats: () => apiCall('/van-ban/stats'),

  getById: (maVanBan: number) => {
    return apiCall(`/van-ban/${maVanBan}`);
  },

  create: (data: {
    SoVanBan: string;
    TenVanBan: string;
    LoaiVanBan: string;
    NgayBanHanh: string;
    NgayCoHieuLuc: string;
    TrangThai?: string;
    FileDinhKem?: string;
  }) => {
    return apiCall('/van-ban', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (maVanBan: number, data: any) => {
    return apiCall(`/van-ban/${maVanBan}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: (maVanBan: number) => {
    return apiCall(`/van-ban/${maVanBan}`, {
      method: 'DELETE',
    });
  },
};

// ============== USERS ==============
export const usersApi = {
  getList: () => apiCall('/users'),
  create: (data: {
    username: string;
    fullName: string;
    email?: string | null;
    roleId?: number;
    isActive?: boolean;
    password?: string;
    department?: string | null;
  }) => apiCall('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: {
    username?: string;
    fullName?: string;
    email?: string | null;
    roleId?: number;
    isActive?: boolean;
    password?: string;
    phone?: string | null;
    department?: string | null;
  }) => apiCall(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/users/${id}`, { method: 'DELETE' }),
};

// ============== VAI TRO ==============
export const vaiTroApi = {
  getList: () => apiCall('/vai-tro'),
  create: (data: {
    name: string;
    code?: string;
    description?: string | null;
    order?: number;
    isActive?: boolean;
    permissions?: string[];
  }) => apiCall('/vai-tro', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: {
    name?: string;
    code?: string;
    description?: string | null;
    order?: number;
    isActive?: boolean;
    permissions?: string[];
  }) => apiCall(`/vai-tro/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/vai-tro/${id}`, { method: 'DELETE' }),
};

// ============== DON VI HANH CHINH ==============
export const donViHanhChinhApi = {
  getList: () => apiCall('/don-vi-hanh-chinh'),
};

// ============== QUAN HUYEN ==============
export const quanHuyenApi = {
  getList: () => apiCall('/quan-huyen'),
};

// ============== XA PHUONG ==============
export const xaPhuongApi = {
  getList: () => apiCall('/xa-phuong'),
  create: (data: {
    name: string;
    districtId?: number | null;
    population?: number;
    area?: number | null;
    dvhcCode?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    mayor?: string | null;
    isActive?: boolean;
  }) => apiCall('/xa-phuong', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: {
    name?: string;
    districtId?: number | null;
    population?: number;
    area?: number | null;
    dvhcCode?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    mayor?: string | null;
    isActive?: boolean;
  }) => apiCall(`/xa-phuong/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/xa-phuong/${id}`, { method: 'DELETE' }),
};

// ============== SYSTEM SETTINGS ==============
export const systemSettingsApi = {
  get: () => apiCall('/system-settings'),
  update: (data: {
    systemName?: string;
    adminEmail?: string | null;
    defaultExpiryDays?: number;
    overdueWarningDays?: number;
    notificationsEnabled?: boolean;
    autoUpdateEnabled?: boolean;
    autoUpdateInterval?: number;
    avatarUrl?: string | null;
  }) => apiCall('/system-settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ============== QUYẾT ĐỊNH ==============
export const quyetDinhApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/quyet-dinh?${query}`);
  },

  getById: (maQD: number) => {
    return apiCall(`/quyet-dinh/${maQD}`);
  },

  create: (data: {
    SoQD: string;
    TenQD: string;
    NgayBanHanh: string;
    NgayCoHieuLuc: string;
    NoiDung?: string;
  }) => {
    return apiCall('/quyet-dinh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (maQD: number, data: any) => {
    return apiCall(`/quyet-dinh/${maQD}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: (maQD: number) => {
    return apiCall(`/quyet-dinh/${maQD}`, {
      method: 'DELETE',
    });
  },
};

// ============== PHẢN ÁNH ==============
export const phanAnhApi = {
  getList: (params?: { page?: number; limit?: number; trangThai?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/phan-anh?${query}`);
  },

  getStats: () => {
    return apiCall('/phan-anh/stats');
  },

  getById: (maPhanAnh: number) => {
    return apiCall(`/phan-anh/${maPhanAnh}`);
  },

  create: (data: {
    MaLinhVuc?: number | null;
    MaCongDan?: number | null;
    TieuDe: string;
    NoiDung: string;
    MucDoUuTien?: string;
    ToaDo?: string;
    TenNguoiPhanAnh?: string;
    SoDienThoai?: string;
    DiaChi?: string;
    TenLinhVuc?: string;
    TrangThai?: string;
    TenCanBoXuLy?: string;
    KetQuaXuLy?: string;
    DiemDanhGia?: number | null;
  }) => {
    return apiCall('/phan-anh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (maPhanAnh: number, data: {
    TrangThai?: string;
    NgayPhanHoi?: string;
    GhiChu?: string;
    MucDoUuTien?: string;
    TenCanBoXuLy?: string;
    KetQuaXuLy?: string;
    TenLinhVuc?: string;
    TenNguoiPhanAnh?: string;
    SoDienThoai?: string;
    DiaChi?: string;
    MaLinhVuc?: number | null;
    MaCongDan?: number | null;
    NoiDung?: string;
    TieuDe?: string;
    DiemDanhGia?: number | null;
  }) => {
    return apiCall(`/phan-anh/${maPhanAnh}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: (maPhanAnh: number) => {
    return apiCall(`/phan-anh/${maPhanAnh}`, {
      method: 'DELETE',
    });
  },
};

// ============== TÀI LIỆU ==============
export const taiLieuApi = {
  getList: (params?: { page?: number; limit?: number; maHoSo?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/tai-lieu?${query}`);
  },

  getByHoSo: (maHoSo: string) => {
    return apiCall(`/ho-so/${maHoSo}/tai-lieu`);
  },

  upload: (data: {
    MaHoSo: string;
    TenTaiLieu: string;
    LoaiTaiLieu: string;
    DuongDanFile: string;
    DungLuong: number;
  }) => {
    return apiCall('/tai-lieu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: (maTaiLieu: number) => {
    return apiCall(`/tai-lieu/${maTaiLieu}`, {
      method: 'DELETE',
    });
  },
};

// ============== HEALTH CHECK ==============
export const healthCheck = () => {
  return apiCall('/health');
};

// ============== HỒ TỊCH ==============
export const hoTichApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-tich?${query}`);
  },
  getStats: () => apiCall('/ho-tich/stats'),
  getById: (id: number) => apiCall(`/ho-tich/${id}`),
  create: (data: any) => apiCall('/ho-tich', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ho-tich/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ho-tich/${id}`, { method: 'DELETE' }),
};

export const chungThucApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/chung-thuc?${query}`);
  },
  getStats: () => apiCall('/chung-thuc/stats'),
  getById: (id: number) => apiCall(`/chung-thuc/${id}`),
  create: (data: any) => apiCall('/chung-thuc', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/chung-thuc/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/chung-thuc/${id}`, { method: 'DELETE' }),
};

export const hoKhauApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-khau?${query}`);
  },
  getStats: () => apiCall('/ho-khau/stats'),
  getById: (id: string) => apiCall(`/ho-khau/${id}`),
  create: (data: any) => apiCall('/ho-khau', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/ho-khau/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/ho-khau/${id}`, { method: 'DELETE' }),
  getMembers: (id: string) => apiCall(`/ho-khau/${id}/thanh-vien`),
  addMember: (id: string, data: any) => apiCall(`/ho-khau/${id}/thanh-vien`, { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (memberId: number, data: any) => apiCall(`/ho-khau/thanh-vien/${memberId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (memberId: number) => apiCall(`/ho-khau/thanh-vien/${memberId}`, { method: 'DELETE' }),
};

export const hoSoTthcApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-so-tthc?${query}`);
  },
  getStats: () => apiCall('/ho-so-tthc/stats'),
  getLoaiThuTuc: () => apiCall('/ho-so-tthc/loai-thu-tuc'),
  getById: (id: string) => apiCall(`/ho-so-tthc/${id}`),
  create: (data: any) => apiCall('/ho-so-tthc', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/ho-so-tthc/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/ho-so-tthc/${id}`, { method: 'DELETE' }),
};

export const baoCaoApi = {
  getList: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/bao-cao?${query}`);
  },
  getById: (id: number) => apiCall(`/bao-cao/${id}`),
  create: (data: any) => apiCall('/bao-cao', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/bao-cao/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/bao-cao/${id}`, { method: 'DELETE' }),
};

// ============== Y TẾ ==============
export const tramYTeApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/tram-y-te?${query}`);
  },
  getStats: () => apiCall('/tram-y-te/stats'),
  getById: (id: number) => apiCall(`/tram-y-te/${id}`),
  create: (data: any) => apiCall('/tram-y-te', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/tram-y-te/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/tram-y-te/${id}`, { method: 'DELETE' }),
};

export const nhanVienYTeApi = {
  getList: (params?: { page?: number; limit?: number; maTram?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/nhan-vien-y-te?${query}`);
  },
  getStats: () => apiCall('/nhan-vien-y-te/stats'),
  getById: (id: number) => apiCall(`/nhan-vien-y-te/${id}`),
  create: (data: any) => apiCall('/nhan-vien-y-te', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/nhan-vien-y-te/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/nhan-vien-y-te/${id}`, { method: 'DELETE' }),
};

export const dichBenhApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/dich-benh?${query}`);
  },
  getStats: () => apiCall('/dich-benh/stats'),
  getById: (id: number) => apiCall(`/dich-benh/${id}`),
  create: (data: any) => apiCall('/dich-benh', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/dich-benh/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/dich-benh/${id}`, { method: 'DELETE' }),
};

export const tiemChungApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/tiem-chung?${query}`);
  },
  getStats: () => apiCall('/tiem-chung/stats'),
  getById: (id: number) => apiCall(`/tiem-chung/${id}`),
  create: (data: any) => apiCall('/tiem-chung', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/tiem-chung/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/tiem-chung/${id}`, { method: 'DELETE' }),
};

export const phieuKhamApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/phieu-kham?${query}`);
  },
  getStats: () => apiCall('/phieu-kham/stats'),
  getById: (id: number) => apiCall(`/phieu-kham/${id}`),
  create: (data: any) => apiCall('/phieu-kham', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/phieu-kham/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/phieu-kham/${id}`, { method: 'DELETE' }),
};

export const luotKhamApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/luot-kham?${query}`);
  },
  getStats: () => apiCall('/luot-kham/stats'),
  getById: (id: number) => apiCall(`/luot-kham/${id}`),
  create: (data: any) => apiCall('/luot-kham', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/luot-kham/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/luot-kham/${id}`, { method: 'DELETE' }),
};

// ============== GIÁO DỤC ==============
export const coSoGiaoDucApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/co-so-giao-duc?${query}`);
  },
  getStats: () => apiCall('/co-so-giao-duc/stats'),
  getById: (id: number) => apiCall(`/co-so-giao-duc/${id}`),
  create: (data: any) => apiCall('/co-so-giao-duc', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/co-so-giao-duc/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/co-so-giao-duc/${id}`, { method: 'DELETE' }),
};

export const lopHocApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/lop-hoc?${query}`);
  },
  getStats: () => apiCall('/lop-hoc/stats'),
  getById: (id: number) => apiCall(`/lop-hoc/${id}`),
  create: (data: any) => apiCall('/lop-hoc', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/lop-hoc/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/lop-hoc/${id}`, { method: 'DELETE' }),
};

// ============== KINH TẾ ==============
export const hoKinhDoanhApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-kinh-doanh?${query}`);
  },
  getStats: () => apiCall('/ho-kinh-doanh/stats'),
  getById: (id: number) => apiCall(`/ho-kinh-doanh/${id}`),
  create: (data: any) => apiCall('/ho-kinh-doanh', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ho-kinh-doanh/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ho-kinh-doanh/${id}`, { method: 'DELETE' }),
};

export const choDiemKinhDoanhApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/cho-diem-kinh-doanh?${query}`);
  },
  getStats: () => apiCall('/cho-diem-kinh-doanh/stats'),
  getById: (id: number) => apiCall(`/cho-diem-kinh-doanh/${id}`),
  create: (data: any) => apiCall('/cho-diem-kinh-doanh', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/cho-diem-kinh-doanh/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/cho-diem-kinh-doanh/${id}`, { method: 'DELETE' }),
};

export const thuPhiApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/thu-phi?${query}`);
  },
  getStats: () => apiCall('/thu-phi/stats'),
  getById: (id: number) => apiCall(`/thu-phi/${id}`),
  create: (data: any) => apiCall('/thu-phi', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/thu-phi/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/thu-phi/${id}`, { method: 'DELETE' }),
};

export const hoTroDoanhNghiepApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-tro-doanh-nghiep?${query}`);
  },
  getStats: () => apiCall('/ho-tro-doanh-nghiep/stats'),
  getById: (id: number) => apiCall(`/ho-tro-doanh-nghiep/${id}`),
  create: (data: any) => apiCall('/ho-tro-doanh-nghiep', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ho-tro-doanh-nghiep/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ho-tro-doanh-nghiep/${id}`, { method: 'DELETE' }),
};

export const thongKeKinhTeApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/thong-ke-kinh-te?${query}`);
  },
  getStats: () => apiCall('/thong-ke-kinh-te/stats'),
  getById: (id: number) => apiCall(`/thong-ke-kinh-te/${id}`),
  create: (data: any) => apiCall('/thong-ke-kinh-te', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/thong-ke-kinh-te/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/thong-ke-kinh-te/${id}`, { method: 'DELETE' }),
};

// ============== AN NINH TRẬT TỰ ==============
export const tamTruTamVangApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/tam-tru-tam-vang?${query}`);
  },
  getStats: () => apiCall('/tam-tru-tam-vang/stats'),
  getById: (id: number) => apiCall(`/tam-tru-tam-vang/${id}`),
  create: (data: any) => apiCall('/tam-tru-tam-vang', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/tam-tru-tam-vang/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/tam-tru-tam-vang/${id}`, { method: 'DELETE' }),
};

export const viPhamApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/vi-pham?${query}`);
  },
  getStats: () => apiCall('/vi-pham/stats'),
  getById: (id: number) => apiCall(`/vi-pham/${id}`),
  create: (data: any) => apiCall('/vi-pham', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/vi-pham/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/vi-pham/${id}`, { method: 'DELETE' }),
};

export const diemNongAnNinhApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/diem-nong-an-ninh?${query}`);
  },
  getStats: () => apiCall('/diem-nong-an-ninh/stats'),
  getById: (id: number) => apiCall(`/diem-nong-an-ninh/${id}`),
  create: (data: any) => apiCall('/diem-nong-an-ninh', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/diem-nong-an-ninh/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/diem-nong-an-ninh/${id}`, { method: 'DELETE' }),
};

export const anNinhTratTuApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/an-ninh-trat-tu?${query}`);
  },
  getStats: () => apiCall('/an-ninh-trat-tu/stats'),
  getById: (id: number) => apiCall(`/an-ninh-trat-tu/${id}`),
  create: (data: any) => apiCall('/an-ninh-trat-tu', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/an-ninh-trat-tu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/an-ninh-trat-tu/${id}`, { method: 'DELETE' }),
};

export const tinhHinhANTTApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/tinh-hinh-a-n-t-t?${query}`);
  },
  getStats: () => apiCall('/tinh-hinh-a-n-t-t/stats'),
  getById: (id: number) => apiCall(`/tinh-hinh-a-n-t-t/${id}`),
  create: (data: any) => apiCall('/tinh-hinh-a-n-t-t', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/tinh-hinh-a-n-t-t/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/tinh-hinh-a-n-t-t/${id}`, { method: 'DELETE' }),
};

export const viPhamHanhChinhApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/vi-pham-hanh-chinh?${query}`);
  },
  getStats: () => apiCall('/vi-pham-hanh-chinh/stats'),
  getById: (id: number) => apiCall(`/vi-pham-hanh-chinh/${id}`),
  create: (data: any) => apiCall('/vi-pham-hanh-chinh', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/vi-pham-hanh-chinh/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/vi-pham-hanh-chinh/${id}`, { method: 'DELETE' }),
};

// ============== XÂY DỰNG ==============
export const haTangDoThiApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ha-tang-do-thi?${query}`);
  },
  getStats: () => apiCall('/ha-tang-do-thi/stats'),
  getById: (id: number) => apiCall(`/ha-tang-do-thi/${id}`),
  create: (data: any) => apiCall('/ha-tang-do-thi', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ha-tang-do-thi/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ha-tang-do-thi/${id}`, { method: 'DELETE' }),
};

export const hoSoCapPhepXayDungApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-so-cap-phep-xay-dung?${query}`);
  },
  getStats: () => apiCall('/ho-so-cap-phep-xay-dung/stats'),
  getById: (id: number) => apiCall(`/ho-so-cap-phep-xay-dung/${id}`),
  create: (data: any) => apiCall('/ho-so-cap-phep-xay-dung', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ho-so-cap-phep-xay-dung/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ho-so-cap-phep-xay-dung/${id}`, { method: 'DELETE' }),
};

export const xayDungTraiPhepApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/xay-dung-trai-phep?${query}`);
  },
  getStats: () => apiCall('/xay-dung-trai-phep/stats'),
  getById: (id: number) => apiCall(`/xay-dung-trai-phep/${id}`),
  create: (data: any) => apiCall('/xay-dung-trai-phep', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/xay-dung-trai-phep/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/xay-dung-trai-phep/${id}`, { method: 'DELETE' }),
};

export const theoDoiTratTuXayDungApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/theo-doi-trat-tu-xay-dung?${query}`);
  },
  getStats: () => apiCall('/theo-doi-trat-tu-xay-dung/stats'),
  getById: (id: number) => apiCall(`/theo-doi-trat-tu-xay-dung/${id}`),
  create: (data: any) => apiCall('/theo-doi-trat-tu-xay-dung', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/theo-doi-trat-tu-xay-dung/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/theo-doi-trat-tu-xay-dung/${id}`, { method: 'DELETE' }),
};

export const nhaOCongTrinhApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/nha-o-cong-trinh?${query}`);
  },
  getStats: () => apiCall('/nha-o-cong-trinh/stats'),
  getById: (id: number) => apiCall(`/nha-o-cong-trinh/${id}`),
  create: (data: any) => apiCall('/nha-o-cong-trinh', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/nha-o-cong-trinh/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/nha-o-cong-trinh/${id}`, { method: 'DELETE' }),
};

// ============== DÂN CƯ - LAO ĐỘNG ==============
export const hoGiaDinhApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-gia-dinh?${query}`);
  },
  getStats: () => apiCall('/ho-gia-dinh/stats'),
  getById: (id: number) => apiCall(`/ho-gia-dinh/${id}`),
  create: (data: any) => apiCall('/ho-gia-dinh', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ho-gia-dinh/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ho-gia-dinh/${id}`, { method: 'DELETE' }),
};

export const bienDongDanCuApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/bien-dong-dan-cu?${query}`);
  },
  getStats: () => apiCall('/bien-dong-dan-cu/stats'),
  getById: (id: number) => apiCall(`/bien-dong-dan-cu/${id}`),
  create: (data: any) => apiCall('/bien-dong-dan-cu', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/bien-dong-dan-cu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/bien-dong-dan-cu/${id}`, { method: 'DELETE' }),
};

export const viecLamApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/viec-lam?${query}`);
  },
  getStats: () => apiCall('/viec-lam/stats'),
  getById: (id: number) => apiCall(`/viec-lam/${id}`),
  create: (data: any) => apiCall('/viec-lam', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/viec-lam/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/viec-lam/${id}`, { method: 'DELETE' }),
};

export const hoNgheoApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-ngheo?${query}`);
  },
  getStats: () => apiCall('/ho-ngheo/stats'),
  getById: (id: number) => apiCall(`/ho-ngheo/${id}`),
  create: (data: any) => apiCall('/ho-ngheo', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ho-ngheo/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ho-ngheo/${id}`, { method: 'DELETE' }),
};

export const baoTroXaHoiApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/bao-tro-xa-hoi?${query}`);
  },
  getStats: () => apiCall('/bao-tro-xa-hoi/stats'),
  getById: (id: number) => apiCall(`/bao-tro-xa-hoi/${id}`),
  create: (data: any) => apiCall('/bao-tro-xa-hoi', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/bao-tro-xa-hoi/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/bao-tro-xa-hoi/${id}`, { method: 'DELETE' }),
};

export const nguoiCoCongApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/nguoi-co-cong?${query}`);
  },
  getStats: () => apiCall('/nguoi-co-cong/stats'),
  getById: (id: number) => apiCall(`/nguoi-co-cong/${id}`),
  create: (data: any) => apiCall('/nguoi-co-cong', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/nguoi-co-cong/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/nguoi-co-cong/${id}`, { method: 'DELETE' }),
};

// ============== TÀI CHÍNH ==============
export const nganSachApi = {
  getList: (params?: { page?: number; limit?: number; loaiBanGhi?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ngan-sach?${query}`);
  },
  getStats: () => apiCall('/ngan-sach/stats'),
  getById: (id: number) => apiCall(`/ngan-sach/${id}`),
  create: (data: any) => apiCall('/ngan-sach', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ngan-sach/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ngan-sach/${id}`, { method: 'DELETE' }),
};

export const duToanNganSachApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/du-toan-ngan-sach?${query}`);
  },
  getStats: () => apiCall('/du-toan-ngan-sach/stats'),
  getById: (id: number) => apiCall(`/du-toan-ngan-sach/${id}`),
  create: (data: any) => apiCall('/du-toan-ngan-sach', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/du-toan-ngan-sach/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/du-toan-ngan-sach/${id}`, { method: 'DELETE' }),
};

export const giaiNganApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/giai-ngan?${query}`);
  },
  getStats: () => apiCall('/giai-ngan/stats'),
  getById: (id: number) => apiCall(`/giai-ngan/${id}`),
  create: (data: any) => apiCall('/giai-ngan', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/giai-ngan/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/giai-ngan/${id}`, { method: 'DELETE' }),
};

export const taiSanCongApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/tai-san-cong?${query}`);
  },
  getStats: () => apiCall('/tai-san-cong/stats'),
  getById: (id: number) => apiCall(`/tai-san-cong/${id}`),
  create: (data: any) => apiCall('/tai-san-cong', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/tai-san-cong/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/tai-san-cong/${id}`, { method: 'DELETE' }),
};

// ============== ĐỊA CHÍNH ==============
export const quyHoachApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/quy-hoach?${query}`);
  },
  getStats: () => apiCall('/quy-hoach/stats'),
  getById: (id: number) => apiCall(`/quy-hoach/${id}`),
  create: (data: any) => apiCall('/quy-hoach', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/quy-hoach/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/quy-hoach/${id}`, { method: 'DELETE' }),
};

export const thuaDatApi = {
  getList: (params?: { page?: number; limit?: number; loaiBanGhi?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/thua-dat?${query}`);
  },
  getStats: () => apiCall('/thua-dat/stats'),
  getById: (id: string) => apiCall(`/thua-dat/${id}`),
  create: (data: any) => apiCall('/thua-dat', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/thua-dat/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/thua-dat/${id}`, { method: 'DELETE' }),
};

export const bienDongDatApi = {
  getList: (params?: { page?: number; limit?: number; loaiBanGhi?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/bien-dong-dat?${query}`);
  },
  getStats: () => apiCall('/bien-dong-dat/stats'),
  getById: (id: number) => apiCall(`/bien-dong-dat/${id}`),
  create: (data: any) => apiCall('/bien-dong-dat', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/bien-dong-dat/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/bien-dong-dat/${id}`, { method: 'DELETE' }),
};

// ============== MÔI TRƯỜNG ==============
export const racThaiApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/rac-thai?${query}`);
  },
  getStats: () => apiCall('/rac-thai/stats'),
  getById: (id: number) => apiCall(`/rac-thai/${id}`),
  create: (data: any) => apiCall('/rac-thai', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/rac-thai/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/rac-thai/${id}`, { method: 'DELETE' }),
};

export const baoCaoONhiemApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/bao-cao-o-nhiem?${query}`);
  },
  getStats: () => apiCall('/bao-cao-o-nhiem/stats'),
  getById: (id: number) => apiCall(`/bao-cao-o-nhiem/${id}`),
  create: (data: any) => apiCall('/bao-cao-o-nhiem', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/bao-cao-o-nhiem/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/bao-cao-o-nhiem/${id}`, { method: 'DELETE' }),
};

export const tramQuanTracMTApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/tram-quan-trac-m-t?${query}`);
  },
  getStats: () => apiCall('/tram-quan-trac-m-t/stats'),
  getById: (id: number) => apiCall(`/tram-quan-trac-m-t/${id}`),
  create: (data: any) => apiCall('/tram-quan-trac-m-t', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/tram-quan-trac-m-t/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/tram-quan-trac-m-t/${id}`, { method: 'DELETE' }),
};

export const diemThuGomRacApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/diem-thu-gom-rac?${query}`);
  },
  getStats: () => apiCall('/diem-thu-gom-rac/stats'),
  getById: (id: number) => apiCall(`/diem-thu-gom-rac/${id}`),
  create: (data: any) => apiCall('/diem-thu-gom-rac', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/diem-thu-gom-rac/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/diem-thu-gom-rac/${id}`, { method: 'DELETE' }),
};

export const diemNongMoiTruongApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/diem-nong-moi-truong?${query}`);
  },
  getStats: () => apiCall('/diem-nong-moi-truong/stats'),
  getById: (id: number) => apiCall(`/diem-nong-moi-truong/${id}`),
  create: (data: any) => apiCall('/diem-nong-moi-truong', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/diem-nong-moi-truong/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/diem-nong-moi-truong/${id}`, { method: 'DELETE' }),
};

// ============== VĂN HÓA ==============
export const diTichApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/di-tich?${query}`);
  },
  getStats: () => apiCall('/di-tich/stats'),
  getById: (id: number) => apiCall(`/di-tich/${id}`),
  create: (data: any) => apiCall('/di-tich', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/di-tich/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/di-tich/${id}`, { method: 'DELETE' }),
};

export const leHoiApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/le-hoi?${query}`);
  },
  getStats: () => apiCall('/le-hoi/stats'),
  getById: (id: number) => apiCall(`/le-hoi/${id}`),
  create: (data: any) => apiCall('/le-hoi', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/le-hoi/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/le-hoi/${id}`, { method: 'DELETE' }),
};

export const langNgheApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/lang-nghe?${query}`);
  },
  getStats: () => apiCall('/lang-nghe/stats'),
  getById: (id: number) => apiCall(`/lang-nghe/${id}`),
  create: (data: any) => apiCall('/lang-nghe', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/lang-nghe/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/lang-nghe/${id}`, { method: 'DELETE' }),
};

export const hoSoDiTichApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/ho-so-di-tich?${query}`);
  },
  getStats: () => apiCall('/ho-so-di-tich/stats'),
  getById: (id: number) => apiCall(`/ho-so-di-tich/${id}`),
  create: (data: any) => apiCall('/ho-so-di-tich', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/ho-so-di-tich/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/ho-so-di-tich/${id}`, { method: 'DELETE' }),
};

export const coSoKinhDoanhDuLichApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/co-so-kinh-doanh-du-lich?${query}`);
  },
  getStats: () => apiCall('/co-so-kinh-doanh-du-lich/stats'),
  getById: (id: number) => apiCall(`/co-so-kinh-doanh-du-lich/${id}`),
  create: (data: any) => apiCall('/co-so-kinh-doanh-du-lich', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall(`/co-so-kinh-doanh-du-lich/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/co-so-kinh-doanh-du-lich/${id}`, { method: 'DELETE' }),
};

export const ruiRoQuyHoachApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/rui-ro-quy-hoach?${query}`);
  },
  getStats: () => apiCall('/rui-ro-quy-hoach/stats'),
  getById: (id: number) => apiCall(`/rui-ro-quy-hoach/${id}`),
  create: (data: any) => apiCall('/rui-ro-quy-hoach', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/rui-ro-quy-hoach/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/rui-ro-quy-hoach/${id}`, { method: 'DELETE' }),
};

export const sanPhamOCOPApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/san-pham-o-c-o-p?${query}`);
  },
  getStats: () => apiCall('/san-pham-o-c-o-p/stats'),
  getById: (id: number) => apiCall(`/san-pham-o-c-o-p/${id}`),
  create: (data: any) => apiCall('/san-pham-o-c-o-p', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/san-pham-o-c-o-p/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/san-pham-o-c-o-p/${id}`, { method: 'DELETE' }),
};

// Export all
export const api = {
  auth: authApi,
  hoSo: hoSoApi,
  vanBan: vanBanApi,
  users: usersApi,
  vaiTro: vaiTroApi,
  donViHanhChinh: donViHanhChinhApi,
  quanHuyen: quanHuyenApi,
  xaPhuong: xaPhuongApi,
  systemSettings: systemSettingsApi,
  quyetDinh: quyetDinhApi,
  phanAnh: phanAnhApi,
  taiLieu: taiLieuApi,
  health: healthCheck,
  // New APIs
  hoTich: hoTichApi,
  chungThuc: chungThucApi,
  hoKhau: hoKhauApi,
  hoSoTthc: hoSoTthcApi,
  baoCao: baoCaoApi,
  tramYTe: tramYTeApi,
  nhanVienYTe: nhanVienYTeApi,
  dichBenh: dichBenhApi,
  luotKham: luotKhamApi,
  coSoGiaoDuc: coSoGiaoDucApi,
  lopHoc: lopHocApi,
  hoKinhDoanh: hoKinhDoanhApi,
  choDiemKinhDoanh: choDiemKinhDoanhApi,
  tamTruTamVang: tamTruTamVangApi,
  tinhHinhANTT: tinhHinhANTTApi,
  viPhamHanhChinh: viPhamHanhChinhApi,
  haTangDoThi: haTangDoThiApi,
  hoSoCapPhepXayDung: hoSoCapPhepXayDungApi,
  xayDungTraiPhep: xayDungTraiPhepApi,
  hoGiaDinh: hoGiaDinhApi,
  bienDongDanCu: bienDongDanCuApi,
  viecLam: viecLamApi,
  hoNgheo: hoNgheoApi,
  duToanNganSach: duToanNganSachApi,
  giaiNgan: giaiNganApi,
  taiSanCong: taiSanCongApi,
  quyHoach: quyHoachApi,
  thuaDat: thuaDatApi,
  bienDongDat: bienDongDatApi,
  racThai: racThaiApi,
  baoCaoONhiem: baoCaoONhiemApi,
  tramQuanTracMT: tramQuanTracMTApi,
  diemThuGomRac: diemThuGomRacApi,
  diemNongMoiTruong: diemNongMoiTruongApi,
  diTich: diTichApi,
  leHoi: leHoiApi,
  langNghe: langNgheApi,
  hoSoDiTich: hoSoDiTichApi,
  coSoKinhDoanhDuLich: coSoKinhDoanhDuLichApi,
  ruiRoQuyHoach: ruiRoQuyHoachApi,
  sanPhamOCOP: sanPhamOCOPApi,
};

export default api;
