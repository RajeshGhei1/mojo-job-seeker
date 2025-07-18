
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormDefinition, FormDefinitionInsert } from '@/types/form-builder';
import { useToast } from '@/hooks/use-toast';

export const useFormDefinitions = (tenantId?: string) => {
  return useQuery({
    queryKey: ['form-definitions', tenantId],
    queryFn: async () => {
      let query = supabase
        .from('form_definitions')
        .select('*')
        .order('created_at', { ascending: false });

      if (tenantId) {
        query = query.or(`tenant_id.eq.${tenantId},tenant_id.is.null`);
      } else {
        query = query.is('tenant_id', null);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching form definitions:', error);
        throw error;
      }
      
      // Transform the data to match our FormDefinition interface
      return data.map(form => ({
        ...form,
        settings: typeof form.settings === 'string' ? JSON.parse(form.settings) : form.settings || {}
      })) as FormDefinition[];
    },
  });
};

export const useCreateFormDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: Omit<FormDefinitionInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('form_definitions')
        .insert({
          ...formData,
          settings: formData.settings || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating form definition:', error);
        throw error;
      }

      // Transform the response to match our FormDefinition interface
      return {
        ...data,
        settings: typeof data.settings === 'string' ? JSON.parse(data.settings) : data.settings || {}
      } as FormDefinition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-definitions'] });
      toast({
        title: 'Success',
        description: 'Form created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating form:', error);
      toast({
        title: 'Error',
        description: 'Failed to create form',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateFormDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormDefinitionInsert> }) => {
      const { data, error } = await supabase
        .from('form_definitions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating form definition:', error);
        throw error;
      }

      // Transform the response to match our FormDefinition interface
      return {
        ...data,
        settings: typeof data.settings === 'string' ? JSON.parse(data.settings) : data.settings || {}
      } as FormDefinition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-definitions'] });
      toast({
        title: 'Success',
        description: 'Form updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating form:', error);
      toast({
        title: 'Error',
        description: 'Failed to update form',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteFormDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_definitions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting form definition:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-definitions'] });
      toast({
        title: 'Success',
        description: 'Form deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete form',
        variant: 'destructive',
      });
    },
  });
};
