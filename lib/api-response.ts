import { NextResponse } from 'next/server';
import { z } from 'zod';

type ApiBody = Record<string, unknown>;

type ParsedBody<T> =
  | { data: T; response?: never }
  | { data?: never; response: NextResponse };

export function apiSuccess<TBody extends ApiBody>(body: TBody, status = 200) {
  return NextResponse.json(body, { status });
}

export function apiError(message: string, status = 400, body: ApiBody = {}) {
  return NextResponse.json({ message, ...body }, { status });
}

export async function parseJsonBody<TSchema extends z.ZodType>(
  req: Request,
  schema: TSchema
): Promise<ParsedBody<z.infer<TSchema>>> {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return {
        response: apiError(getValidationMessage(parsed.error), 400),
      };
    }

    return { data: parsed.data };
  } catch {
    return { response: apiError('Invalid JSON body', 400) };
  }
}

function getValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? 'Invalid request';
}
