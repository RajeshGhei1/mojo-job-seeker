
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import ModulePricingToggle from './ModulePricingToggle';

const createPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price_monthly: z.number().min(0, "Monthly price must be 0 or greater"),
  price_annually: z.number().min(0, "Annual price must be 0 or greater"),
  base_price_monthly: z.number().min(0, "Base monthly price must be 0 or greater"),
  base_price_annually: z.number().min(0, "Base annual price must be 0 or greater"),
  plan_type: z.enum(['recruitment', 'employer', 'talent']),
  is_active: z.boolean(),
  use_module_pricing: z.boolean()
});

type CreatePlanFormData = z.infer<typeof createPlanSchema>;

interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlanDialog: React.FC<CreatePlanDialogProps> = ({ isOpen, onClose }) => {
  const { createPlan } = useSubscriptionPlans();
  
  const form = useForm<CreatePlanFormData>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      price_monthly: 29,
      price_annually: 290,
      base_price_monthly: 29,
      base_price_annually: 290,
      plan_type: 'recruitment',
      is_active: true,
      use_module_pricing: false
    }
  });

  const useModulePricing = form.watch('use_module_pricing');

  const onSubmit = async (data: CreatePlanFormData) => {
    try {
      console.log('Creating plan with data:', data);
      
      const planData = {
        name: data.name,
        description: data.description || null,
        price_monthly: data.use_module_pricing ? data.base_price_monthly : data.price_monthly,
        price_annually: data.use_module_pricing ? data.base_price_annually : data.price_annually,
        base_price_monthly: data.base_price_monthly,
        base_price_annually: data.base_price_annually,
        plan_type: data.plan_type,
        is_active: data.is_active,
        use_module_pricing: data.use_module_pricing
      };
      
      await createPlan.mutateAsync(planData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Subscription Plan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="e.g., Professional Plan"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Brief description of the plan features"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan_type">Plan Type</Label>
            <Select 
              value={form.watch('plan_type')}
              onValueChange={(value: 'recruitment' | 'employer' | 'talent') => 
                form.setValue('plan_type', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruitment">Recruitment Companies</SelectItem>
                <SelectItem value="employer">Employers</SelectItem>
                <SelectItem value="talent">Talent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ModulePricingToggle
            useModulePricing={useModulePricing}
            onToggle={(enabled) => form.setValue('use_module_pricing', enabled)}
          />

          {useModulePricing ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_price_monthly">Base Monthly Price ($)</Label>
                <Input
                  id="base_price_monthly"
                  type="number"
                  step="0.01"
                  {...form.register('base_price_monthly', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Base platform features cost
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_price_annually">Base Annual Price ($)</Label>
                <Input
                  id="base_price_annually"
                  type="number"
                  step="0.01"
                  {...form.register('base_price_annually', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Base platform features cost
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_monthly">Monthly Price ($)</Label>
                <Input
                  id="price_monthly"
                  type="number"
                  step="0.01"
                  {...form.register('price_monthly', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_annually">Annual Price ($)</Label>
                <Input
                  id="price_annually"
                  type="number"
                  step="0.01"
                  {...form.register('price_annually', { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Active Plan</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPlan.isPending}
            >
              {createPlan.isPending ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanDialog;
