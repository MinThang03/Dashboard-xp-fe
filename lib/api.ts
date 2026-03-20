// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006/api';

// Generic API call handler
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

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
    MaLinhVuc: number;
    MaCongDan: number;
    TieuDe: string;
    NoiDung: string;
    MucDoUuTien?: string;
    ToaDo?: string;
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
  getList: (params?: { page?: number; limit?: number }) => {
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

// ============== TÀI CHÍNH ==============
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
  getList: (params?: { page?: number; limit?: number }) => {
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
  getList: (params?: { page?: number; limit?: number }) => {
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
  hoSo: hoSoApi,
  vanBan: vanBanApi,
  quyetDinh: quyetDinhApi,
  phanAnh: phanAnhApi,
  taiLieu: taiLieuApi,
  health: healthCheck,
  // New APIs
  hoTich: hoTichApi,
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
  tramQuanTracMT: tramQuanTracMTApi,
  diemThuGomRac: diemThuGomRacApi,
  diemNongMoiTruong: diemNongMoiTruongApi,
  diTich: diTichApi,
  leHoi: leHoiApi,
  langNghe: langNgheApi,
  sanPhamOCOP: sanPhamOCOPApi,
};

export default api;
