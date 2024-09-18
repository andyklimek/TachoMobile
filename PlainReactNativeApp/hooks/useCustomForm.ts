import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

const useCustomForm = (schema: ZodSchema, defaultValues: any = {}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    reset,
    watch,
  };
};

export default useCustomForm;
