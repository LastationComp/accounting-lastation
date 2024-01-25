import { responseError } from '@/app/_lib/Handling/Response';

export async function GET() {
  return responseError('Unauthorized', 401);
}

export async function POST() {
  return responseError('Unauthorized', 401);
}

export async function DELETE() {
  return responseError('Unauthorized', 401);
}

export async function PATCH() {
  return responseError('Unauthorized', 401);
}
