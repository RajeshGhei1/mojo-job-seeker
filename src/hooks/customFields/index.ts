
// Export the new hooks
export { useCustomFieldsHook as useCustomFields } from './useCustomFieldsHook';
export { useCustomFieldsList } from './useCustomFieldsList';
export { useCustomFieldValues } from './useCustomFieldValues';
export { useFieldOrder } from './useFieldOrder';

// Export utility functions
export { fetchCustomFieldValues } from './operations/fetchCustomFieldValues';
export { updateFieldOrderInDatabase } from './useFieldOrder';

// Export types
export * from './types';

// Export legacy hook for backward compatibility
// This will ensure existing code doesn't break
export { useCustomFieldsLegacy } from './useCustomFieldsLegacy';
