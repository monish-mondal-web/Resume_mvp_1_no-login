export type ApiErrorResponse = {
  message: string;
  nextResend?: string;
};

type ApiResult<TResponse> =
  | { ok: true; status: number; data: TResponse }
  | { ok: false; status: number; data: ApiErrorResponse };

export async function postJson<
  TResponse,
  TBody extends Record<string, unknown> = Record<string, unknown>,
>(url: string, body: TBody): Promise<ApiResult<TResponse>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await readJson<TResponse | ApiErrorResponse>(response);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data: normalizeApiError(data),
    };
  }

  return {
    ok: true,
    status: response.status,
    data: data as TResponse,
  };
}

async function readJson<TResponse>(response: Response): Promise<TResponse> {
  try {
    return (await response.json()) as TResponse;
  } catch {
    return {} as TResponse;
  }
}

function normalizeApiError(data: unknown): ApiErrorResponse {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as ApiErrorResponse).message;

    if (typeof message === 'string') {
      return data as ApiErrorResponse;
    }
  }

  return { message: 'Request failed' };
}
