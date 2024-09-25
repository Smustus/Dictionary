import '@testing-library/jest-dom/vitest' 
import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

export const server = setupServer(...handlers);

afterEach(() => cleanup());

beforeAll(() => server.listen());

afterAll(() => server.close());