
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
import { SubscriptionPlan } from '@/types/subscription-types';
import ModulePricingToggle from './ModulePricingToggle';

const editPlanSchema = z.object({
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

type EditPlanFormData = z.infer<typeof editPlanSchema>;

interface EditPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}

const EditPlanDialog: React.FC<EditPlanDialogProps> = ({ isOpen, onClose, plan }) => {
  const { updatePlan } = useSubscriptionPlans();
  
  const form = useForm<EditPlanFormData>({
    resolver: zodResolver(editPlanSchema),
    defaultValues: {
      name: plan?.name || '',
      description: plan?.description || '',
      price_monthly: plan?.price_monthly || 0,
      price_annually: plan?.price_annually || 0,
      base_price_monthly: plan?.base_price_monthly || 29,
      base_price_annually: plan?.base_price_annually || 290,
      plan_type: plan?.plan_type || 'recruitment',
      is_active: plan?.is_active || true,
      use_module_pricing: plan?.use_module_pricing || false
    }
  });

  React.useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        description: plan.description || '',
        price_monthly: plan.price_monthly,
        price_annually: plan.price_annually,
        base_price_monthly: plan.base_price_monthly || 29,
        base_price_annually: plan.base_price_annually || 290,
        plan_type: plan.plan_type,
        is_active: plan.is_active,
        use_module_pricing: plan.use_module_pricing || false
      });
    }
  }, [plan, form]);

  const useModulePricing = form.watch('use_module_pricing');

  const onSubmit = async (data: EditPlanFormData) => {
    if (!plan) return;
    
    try {
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
      
      await updatePlan.mutateAsync({ id: plan.id, updates: planData });
      onClose();
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Subscription Plan</DialogTitle>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updatePlan.isPending}
            >
              {updatePlan.isPending ? 'Updating...' : 'Update Plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlanDialog;
