import { z } from 'zod';

export const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const defaultValues = {
  email: '',
  password: '',
};
