import { 
  getCustomers, 
  getCustomerById, 
  getActivities, 
  getActivitiesByCustomerId,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  updateCustomerLastContactDate
} from '@/lib/store';
import { ActivityType, ActivityOutcome, CreateActivityInput } from '@/lib/types/activity';

describe('Activity Store', () => {
  const testCustomerId = 'cust-1';
  
  describe('Customer operations', () => {
    it('should get all customers', () => {
      const customers = getCustomers();
      expect(customers).toHaveLength(2);
      expect(customers[0]).toHaveProperty('id');
      expect(customers[0]).toHaveProperty('name');
      expect(customers[0]).toHaveProperty('email');
    });

    it('should get customer by id', () => {
      const customer = getCustomerById(testCustomerId);
      expect(customer).toBeDefined();
      expect(customer?.id).toBe(testCustomerId);
    });

    it('should return undefined for non-existent customer', () => {
      const customer = getCustomerById('non-existent');
      expect(customer).toBeUndefined();
    });

    it('should update customer last contact date', () => {
      const before = getCustomerById(testCustomerId);
      const beforeDate = before?.last_contact_date;
      
      updateCustomerLastContactDate(testCustomerId);
      
      const after = getCustomerById(testCustomerId);
      expect(after?.last_contact_date).toBeDefined();
      expect(after?.last_contact_date).not.toBe(beforeDate);
    });
  });

  describe('Activity CRUD operations', () => {
    let createdActivityId: string;

    it('should create an activity', () => {
      const input: CreateActivityInput = {
        customer_id: testCustomerId,
        type: 'phone' as ActivityType,
        date: new Date().toISOString(),
        duration: 30,
        notes: 'Test activity',
        outcome: 'positive' as ActivityOutcome,
      };

      const activity = createActivity(input);
      createdActivityId = activity.id;

      expect(activity).toBeDefined();
      expect(activity.customer_id).toBe(testCustomerId);
      expect(activity.type).toBe('phone');
      expect(activity.duration).toBe(30);
      expect(activity.notes).toBe('Test activity');
      expect(activity.outcome).toBe('positive');
      expect(activity.id).toBeDefined();
      expect(activity.created_at).toBeDefined();
      expect(activity.updated_at).toBeDefined();
    });

    it('should auto-update customer last_contact_date on activity creation', () => {
      const customer = getCustomerById(testCustomerId);
      expect(customer?.last_contact_date).toBeDefined();
    });

    it('should get all activities', () => {
      const activities = getActivities();
      expect(activities.length).toBeGreaterThan(0);
    });

    it('should get activities by customer id', () => {
      const activities = getActivitiesByCustomerId(testCustomerId);
      expect(activities.length).toBeGreaterThan(0);
      expect(activities[0].customer_id).toBe(testCustomerId);
    });

    it('should get activity by id', () => {
      const activity = getActivityById(createdActivityId);
      expect(activity).toBeDefined();
      expect(activity?.id).toBe(createdActivityId);
    });

    it('should update an activity', () => {
      const updated = updateActivity(createdActivityId, {
        notes: 'Updated notes',
        outcome: 'neutral' as ActivityOutcome,
      });

      expect(updated).toBeDefined();
      expect(updated?.notes).toBe('Updated notes');
      expect(updated?.outcome).toBe('neutral');
    });

    it('should return undefined when updating non-existent activity', () => {
      const updated = updateActivity('non-existent', { notes: 'Test' });
      expect(updated).toBeUndefined();
    });

    it('should delete an activity', () => {
      const deleted = deleteActivity(createdActivityId);
      expect(deleted).toBe(true);

      const activity = getActivityById(createdActivityId);
      expect(activity).toBeUndefined();
    });

    it('should return false when deleting non-existent activity', () => {
      const deleted = deleteActivity('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('Activity sorting', () => {
    it('should return activities sorted by date descending', () => {
      // Create activities with different dates
      const now = new Date();
      
      createActivity({
        customer_id: testCustomerId,
        type: 'email',
        date: new Date(now.getTime() - 86400000).toISOString(), // yesterday
        outcome: 'neutral',
      });
      
      createActivity({
        customer_id: testCustomerId,
        type: 'meeting',
        date: now.toISOString(), // today
        outcome: 'positive',
      });

      const activities = getActivitiesByCustomerId(testCustomerId);
      expect(activities.length).toBeGreaterThanOrEqual(2);
      
      // Check that activities are sorted by date descending
      for (let i = 0; i < activities.length - 1; i++) {
        const current = new Date(activities[i].date).getTime();
        const next = new Date(activities[i + 1].date).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });
  });
});
