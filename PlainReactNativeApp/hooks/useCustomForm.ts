import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

const useCustomForm = (schema: ZodSchema, defaultValues: any) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return {
    control,
    handleSubmit,
    errors,
  };
};

export default useCustomForm;
