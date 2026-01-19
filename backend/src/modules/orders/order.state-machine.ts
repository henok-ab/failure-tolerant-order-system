//Defines valid states (PENDING, CONFIRMED, FAILED) and allowed transitions
export const OrderStates = {
 CREATED: 'CREATED',
 PROCESSING: 'PROCESSING',
 COMPLETED: 'COMPLETED',
 FAILED: 'FAILED',
 RETRYING: 'RETRYING'
};