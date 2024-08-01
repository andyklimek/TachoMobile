import {z} from 'zod';

export const schema = z.object({
  language: z.enum(['pl', 'en', 'de', 'uk', 'cz', 'sk']),
});

export const langItems = [
  {label: 'Polski', value: 'pl'},
  {label: 'Angielski', value: 'en'},
  {label: 'Niemiecki', value: 'de'},
  {label: 'Ukraiński', value: 'uk'},
  {label: 'Czeski', value: 'cz'},
  {label: 'Słowacki', value: 'sk'},
];
