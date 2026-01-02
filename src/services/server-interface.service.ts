import api from "./axios.service";

class ServerInterfaceService {
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    signal?: AbortSignal
  ) {
    const { data } = await api.get<T>(url, {
      params,
      signal,
    });
    return data;
  }

  async post<T = any>(
    url: string,
    params?: Record<string, any>,
    body?: Record<string, any>,
    signal?: AbortSignal
  ) {
    const { data } = await api.post<T>(url, body, {
      params,
      signal,
    });
    return data;
  }

  async put<T = any>(url: string, body?: Record<string, any>) {
    const { data } = await api.put<T>(url, body);
    return data;
  }

  async patch<T = any>(url: string, body?: Record<string, any>) {
    const { data } = await api.patch<T>(url, body);
    return data;
  }

  async delete<T = any>(
    url: string,
    body: Record<string, any> = {} as Record<string, any>,
    params?: Record<string, any>
  ): Promise<T> {
    const { data } = await api.delete<T>(url, {
      params,
      data: body,
    });
    return data;
  }
}

const serverInterfaceService = new ServerInterfaceService();
export default serverInterfaceService;
