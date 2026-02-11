const API_BASE_URL = "http://localhost:8000/api"

type ApiOptions = RequestInit & {
    auth?: boolean
}

export async function FetchAPI<T = any>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const token = localStorage.getItem("token")

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    }

    if (options.auth !== false && token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (res.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/"
        throw new Error("Unauthorized")
    }

    const text = await res.text()
    const data = text ? JSON.parse(text) : {}

    if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan")
    }

    return data
}
