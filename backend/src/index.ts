import express, { Express, Request, Response } from 'express';
import pool from './db';
import * as queries from './queries';
import { hashPassword, comparePassword, generateToken } from './auth';
import { authenticateToken, requireCustomerRole, requireAdminRole } from './middleware';
import { AuthRequest, RegisterPayload, LoginPayload } from './types';

const app: Express = express();
const PORT = process.env.PORT || 3000;

const initializeTables = async () => {
  try {
    await queries.ensureReviewsTable();
    await queries.ensureStaffLeavesTable();
    await queries.ensureSystemSettingsTable();
    console.log('Reviews table ready');
    console.log('StaffLeaves table ready');
    console.log('SystemSettings table ready');
  } catch (error) {
    console.error('Table initialization failed:', error);
  }
};

// Middleware
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==================== BASIC ROUTES ====================

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to GlowVault Backend' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Database health check
app.get('/db-health', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1');
    connection.release();
    res.json({ status: 'Database connected', database: 'salondb' });
  } catch (error) {
    res.status(500).json({ status: 'Database connection failed', error: String(error) });
  }
});

// ==================== AUTHENTICATION ROUTES ====================

/**
 * POST /auth/register
 * Register a new customer
 */
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, address } = req.body as RegisterPayload;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if email already exists
    const exists = await queries.emailExists(email);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Register customer
    const result = await queries.registerCustomer(
      name,
      email,
      passwordHash,
      phone,
      dateOfBirth,
      gender,
      address
    );

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      userId: result.userId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: String(error),
    });
  }
});

/**
 * POST /auth/login
 * Login customer and return JWT token
 */
app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginPayload;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Get user by email
    const user = await queries.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const userData = user as any;

    // Check if user is customer (roleId 3)
    if (userData.RoleId !== 3) {
      return res.status(403).json({
        success: false,
        message: 'Only customers can login through this endpoint',
      });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, userData.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: userData.Id,
      email: userData.Email,
      roleId: userData.RoleId,
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userData.Id,
        name: userData.Name,
        email: userData.Email,
        roleId: userData.RoleId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: String(error),
    });
  }
});

/**
 * POST /auth/staff-register
 * Register a new staff member (pending verification)
 */
app.post('/auth/staff-register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, specialization } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if email already exists
    const exists = await queries.emailExists(email);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Register staff
    const result = await queries.registerStaff(
      name,
      email,
      passwordHash,
      phone,
      specialization
    );

    res.status(201).json({
      success: true,
      message: 'Staff registration submitted. Awaiting admin verification.',
      userId: result.userId,
    });
  } catch (error) {
    console.error('Staff Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Staff registration failed',
      error: String(error),
    });
  }
});

/**
 * POST /auth/staff-login
 * Login staff and return JWT token
 */
app.post('/auth/staff-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginPayload;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Get user by email
    const user = await queries.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const userData = user as any;

    // Check if user is staff or admin (roleId 1 or 2)
    if (userData.RoleId !== 1 && userData.RoleId !== 2) {
      return res.status(403).json({
        success: false,
        message: 'Only staff can login through this endpoint',
      });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, userData.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: userData.Id,
      email: userData.Email,
      roleId: userData.RoleId,
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userData.Id,
        name: userData.Name,
        email: userData.Email,
        roleId: userData.RoleId,
      },
    });
  } catch (error) {
    console.error('Staff Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: String(error),
    });
  }
});

/**
 * GET /auth/me
 * Get current authenticated customer
 */
app.get('/auth/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const user = await queries.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: String(error),
    });
  }
});

/**
 * GET /customer/profile
 * Get customer profile (customer only)
 */
app.get('/customer/profile', authenticateToken, requireCustomerRole, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const profile = await queries.getCustomerProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found',
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profile',
      error: String(error),
    });
  }
});

// ==================== APPOINTMENT ROUTES ====================

/**
 * GET /customer/appointments
 * Get customer appointments (customer only)
 */
app.get('/customer/appointments', authenticateToken, requireCustomerRole, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const appointments = await queries.getCustomerAppointments(req.user.id);

    res.json({
      success: true,
      data: appointments,
      count: (appointments as any[]).length,
    });
  } catch (error) {
    console.error('Error fetching customer appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: String(error),
    });
  }
});

/**
 * POST /customer/appointments
 * Create a new appointment (customer only)
 */
app.post('/customer/appointments', authenticateToken, requireCustomerRole, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { staffUserId, serviceId, appointmentDate, appointmentTime, totalPrice, durationMinutes } = req.body;

    if (!staffUserId || !serviceId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'staffUserId, serviceId, appointmentDate, and appointmentTime are required',
      });
    }

    await queries.createAppointment(
      req.user.id,
      staffUserId,
      serviceId,
      appointmentDate,
      appointmentTime,
      totalPrice || 0,
      durationMinutes || 0
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: String(error),
    });
  }
});

/**
 * GET /customer/reviews
 * Get all reviews created by logged in customer
 */
app.get('/customer/reviews', authenticateToken, requireCustomerRole, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const reviews = await queries.getCustomerReviews(req.user.id);
    res.json({
      success: true,
      data: reviews,
      count: (reviews as any[]).length,
    });
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: String(error),
    });
  }
});

/**
 * POST /customer/reviews
 * Create a review for a completed appointment
 */
app.post('/customer/reviews', authenticateToken, requireCustomerRole, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { appointmentId, rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!appointmentId || !numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'appointmentId and rating (1-5) are required',
      });
    }

    const result = await queries.createReview(req.user.id, Number(appointmentId), numericRating, comment || '');
    const affectedRows = (result as any).affectedRows || 0;

    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Review can be added only for your completed appointments',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
    });
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Review already exists for this appointment',
      });
    }

    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: String(error),
    });
  }
});

// ==================== SALON ROUTES ====================

app.get('/salons', async (req: Request, res: Response) => {
  try {
    const salons = await queries.getSalons();
    res.json(salons);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/salons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const salon = await queries.getSalonById(Number(id));
    res.json(salon);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post('/salons', async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    const result = await queries.createSalon(name, email, phone);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.put('/salons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const result = await queries.updateSalon(Number(id), name, email, phone);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.delete('/salons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await queries.deleteSalon(Number(id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ==================== ADMIN ROUTES ====================

/**
 * GET /admin/stats/customers-count
 * Get total customers count (admin only)
 */
app.get('/admin/stats/customers-count', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const count = await queries.getCustomerCount();

    res.json({
      success: true,
      data: {
        totalCustomers: count,
      },
    });
  } catch (error) {
    console.error('Error fetching customer count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer count',
      error: String(error),
    });
  }
});

/**
 * GET /admin/stats/staff-count
 * Get total active staff count (admin only)
 */
app.get('/admin/stats/staff-count', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const count = await queries.getStaffCount();

    res.json({
      success: true,
      data: {
        totalStaff: count,
      },
    });
  } catch (error) {
    console.error('Error fetching staff count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff count',
      error: String(error),
    });
  }
});

/**
 * GET /admin/stats/appointments
 * Get appointment counts + revenue for admin dashboard
 */
app.get('/admin/stats/appointments', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await queries.getAdminAppointmentStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment stats',
      error: String(error),
    });
  }
});

/**
 * GET /admin/appointments
 * Get all appointments (admin only)
 */
app.get('/admin/appointments', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await queries.getAdminAppointments();

    const formattedAppointments = (appointments as any[]).map((appointment) => ({
      id: appointment.Id,
      customer: appointment.CustomerName,
      staff: appointment.StaffName,
      service: appointment.ServiceName,
      date: appointment.AppointmentDate,
      time: appointment.AppointmentTime,
      status: appointment.Status,
      totalPrice: Number(appointment.TotalPrice || 0),
      durationMinutes: Number(appointment.DurationMinutes || 0),
      createdAt: appointment.CreatedAt,
    }));

    res.json({
      success: true,
      data: formattedAppointments,
      count: formattedAppointments.length,
    });
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: String(error),
    });
  }
});

/**
 * GET /admin/staff/pending
 * Get all pending staff registrations (admin only)
 */
app.get('/admin/staff/pending', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const pendingStaff = await queries.getPendingStaffRegistrations();
    
    const formattedStaff = (pendingStaff as any[]).map(staff => ({
      id: staff.Id,
      userId: staff.UserId,
      name: staff.Name,
      email: staff.Email,
      phone: staff.Phone || 'N/A',
      specialization: staff.Specialization || 'Not Specified',
      experience: staff.YearsOfExperience || 0,
      registrationDate: new Date(staff.CreatedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
    }));

    res.json({
      success: true,
      data: formattedStaff,
      count: formattedStaff.length,
    });
  } catch (error) {
    console.error('Error fetching pending staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending staff',
      error: String(error),
    });
  }
});

/**
 * GET /admin/staff
 * Get all verified and active staff (admin only)
 */
app.get('/admin/staff', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const staff = await queries.getActiveStaff();
    
    const formattedStaff = (staff as any[]).map(member => ({
      id: member.Id,
      userId: member.UserId,
      name: member.Name,
      email: member.Email,
      phone: member.Phone || 'N/A',
      specialization: member.Specialization || 'Not Specified',
      experience: member.YearsOfExperience || 0,
      status: member.IsActive ? 'Active' : 'Inactive',
      joinDate: new Date(member.CreatedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
    }));

    res.json({
      success: true,
      data: formattedStaff,
      count: formattedStaff.length,
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff',
      error: String(error),
    });
  }
});

/**
 * PUT /admin/staff/:userId/approve
 * Approve staff registration (admin only)
 */
app.put('/admin/staff/:userId/approve', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    await queries.approveStaffRegistration(Number(userId));

    res.json({
      success: true,
      message: 'Staff member approved and activated',
    });
  } catch (error) {
    console.error('Error approving staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve staff',
      error: String(error),
    });
  }
});

/**
 * DELETE /admin/staff/:userId/reject
 * Reject staff registration (admin only)
 */
app.delete('/admin/staff/:userId/reject', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    await queries.rejectStaffRegistration(Number(userId));

    res.json({
      success: true,
      message: 'Staff registration rejected and removed',
    });
  } catch (error) {
    console.error('Error rejecting staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject staff',
      error: String(error),
    });
  }
});

/**
 * GET /admin/customers
 * Get all customers (admin only)
 */
app.get('/admin/customers', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const customers = await queries.getAllCustomers();
    
    // Transform database results to match frontend format
    const formattedCustomers = (customers as any[]).map(customer => ({
      id: customer.UserId,
      name: customer.Name,
      email: customer.Email,
      phone: customer.Phone || 'N/A',
      joinDate: new Date(customer.CreatedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      status: customer.IsActive ? 'Active' : 'Inactive',
      gender: customer.Gender || 'N/A',
      dateOfBirth: customer.DateOfBirth || 'N/A',
      address: customer.Address || 'N/A',
    }));

    res.json({
      success: true,
      data: formattedCustomers,
      count: formattedCustomers.length,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: String(error),
    });
  }
});

/**
 * PUT /admin/customers/:userId/status
 * Update customer status (activate/deactivate)
 */
app.put('/admin/customers/:userId/status', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean',
      });
    }

    await queries.updateCustomerStatus(Number(userId), isActive);

    res.json({
      success: true,
      message: `Customer ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Error updating customer status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer status',
      error: String(error),
    });
  }
});

/**
 * DELETE /admin/customers/:userId
 * Delete a customer (admin only)
 */
app.delete('/admin/customers/:userId', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    await queries.deleteCustomer(Number(userId));

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: String(error),
    });
  }
});

// ==================== SERVICE ADMIN ROUTES ====================

/**
 * GET /admin/services
 * Get all services (admin only)
 */
app.get('/admin/services', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const services = await queries.getAllServices();
    res.json({
      success: true,
      data: services,
      count: (services as any[]).length,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: String(error),
    });
  }
});

/**
 * PUT /admin/services/:id/price
 * Update service price and confirm it (admin only)
 */
app.put('/admin/services/:id/price', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (price === undefined || price === null || isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required',
      });
    }

    await queries.updateServicePrice(Number(id), Number(price));

    res.json({
      success: true,
      message: 'Service price updated successfully',
    });
  } catch (error) {
    console.error('Error updating service price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service price',
      error: String(error),
    });
  }
});

// ==================== CATEGORY ADMIN ROUTES ====================

/**
 * GET /admin/categories
 * Get all categories (admin only)
 */
app.get('/admin/categories', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const categories = await queries.getAllCategories();
    res.json({
      success: true,
      data: categories,
      count: (categories as any[]).length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: String(error),
    });
  }
});

/**
 * POST /admin/categories
 * Add a new service category (admin only)
 */
app.post('/admin/categories', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { categoryName, description } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    await queries.addCategory(categoryName, description);

    res.json({
      success: true,
      message: 'Category added successfully',
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add category',
      error: String(error),
    });
  }
});

// ==================== STAFF SERVICES ROUTES ====================

/**
 * GET /staff/services
 * Get logged in staff's services
 */
app.get('/staff/services', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const services = await queries.getStaffServices(req.user.id);
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching staff services:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff services' });
  }
});

/**
 * PUT /staff/services
 * Update logged in staff's services
 */
app.put('/staff/services', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { serviceIds } = req.body;
    if (!Array.isArray(serviceIds)) {
      return res.status(400).json({ success: false, message: 'serviceIds must be an array' });
    }

    await queries.updateStaffServices(req.user.id, serviceIds);
    res.json({
      success: true,
      message: 'Services updated successfully',
    });
  } catch (error) {
    console.error('Error updating staff services:', error);
    res.status(500).json({ success: false, message: 'Failed to update staff services' });
  }
});

// ==================== PUBLIC SERVICES ROUTE ====================

/**
 * GET /services
 * Get all active, priced services
 */
app.get('/services', async (req: Request, res: Response) => {
  try {
    const services = await queries.getActiveServices();
    res.json({
      success: true,
      data: services,
      count: (services as any[]).length,
    });
  } catch (error) {
    console.error('Error fetching active services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: String(error),
    });
  }
});

/**
 * GET /public/staff
 * Get all active staff grouped with their services 
 */
app.get('/public/staff', async (req: Request, res: Response) => {
  try {
    const staff = await queries.getActiveStaff() as any[];
    const allServices = await queries.getActiveServices() as any[];

    // Map each staff member to have a `services` array hydrated from `MyServices`
    const staffWithServices = staff.map(member => {
      let myServiceIds: number[] = [];
      if (typeof member.MyServices === 'string') {
        try { myServiceIds = JSON.parse(member.MyServices); } catch (e) { myServiceIds = []; }
      } else if (Array.isArray(member.MyServices)) {
        myServiceIds = member.MyServices;
      }

      // Filter global active services to only those that the staff member provides
      const staffServices = allServices.filter(s => myServiceIds.includes(s.Id));

      return {
        id: member.Id,
        userId: member.UserId,
        name: member.Name,
        specialization: member.Specialization || 'Stylist',
        experience: member.YearsOfExperience || 0,
        services: staffServices,
      };
    });

    res.json({
      success: true,
      data: staffWithServices,
      count: staffWithServices.length,
    });
  } catch (error) {
    console.error('Error fetching public staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public staff catalog',
      error: String(error),
    });
  }
});

// ==================== STAFF APPOINTMENTS ROUTES ====================

/**
 * GET /staff/appointments
 * Get appointments assigned to the logged in staff member
 */
app.get('/staff/appointments', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const appointments = await queries.getStaffAppointments(req.user.id);
    res.json({
      success: true,
      data: appointments,
      count: (appointments as any[]).length,
    });
  } catch (error) {
    console.error('Error fetching staff appointments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff appointments' });
  }
});

/**
 * PUT /staff/appointments/:id/status
 * Update appointment status securely (Staff/Admin)
 */
app.put('/staff/appointments/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'status is required' });
    }

    // Only allow updating to certain statuses to keep consistency
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'In Progress'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await queries.updateAppointmentStatus(Number(id), req.user.id, status);
    
    res.json({
      success: true,
      message: 'Appointment status updated successfully'
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

/**
 * GET /staff/reviews
 * Get reviews for logged in staff member
 */
app.get('/staff/reviews', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const reviews = await queries.getStaffReviews(req.user.id);
    res.json({
      success: true,
      data: reviews,
      count: (reviews as any[]).length,
    });
  } catch (error) {
    console.error('Error fetching staff reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff reviews' });
  }
});

/**
 * GET /admin/reviews
 * Get all reviews for admin moderation
 */
app.get('/admin/reviews', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await queries.getAdminReviews();
    res.json({
      success: true,
      data: reviews,
      count: (reviews as any[]).length,
    });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin reviews' });
  }
});

/**
 * GET /staff/notifications
 * Get real notification feed for logged in staff member
 */
app.get('/staff/notifications', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { appointments, reviews } = await queries.getStaffNotifications(req.user.id);

    const appointmentNotifications = appointments.map((apt: any) => ({
      id: Number(`1${apt.Id}`),
      message: `Appointment ${apt.Status} for ${apt.CustomerName} (${apt.ServiceName}) on ${new Date(apt.AppointmentDate).toLocaleDateString('en-US')} at ${apt.AppointmentTime}`,
      type: apt.Status === 'Cancelled' ? 'cancellation' : apt.Status === 'Pending' ? 'appointment_new' : 'appointment_update',
      read: false,
      createdAt: apt.CreatedAt,
    }));

    const reviewNotifications = reviews.map((review: any) => ({
      id: Number(`2${review.Id}`),
      message: `${review.CustomerName} left a ${review.Rating}-star review for ${review.ServiceName}`,
      type: 'review',
      read: false,
      createdAt: review.CreatedAt,
    }));

    const notifications = [...appointmentNotifications, ...reviewNotifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100);

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching staff notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff notifications' });
  }
});

/**
 * GET /staff/leaves
 * Get logged in staff leave history
 */
app.get('/staff/leaves', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const leaves = await queries.getStaffLeaves(req.user.id);
    res.json({ success: true, data: leaves, count: (leaves as any[]).length });
  } catch (error) {
    console.error('Error fetching staff leaves:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff leaves' });
  }
});

/**
 * POST /staff/leaves
 * Request leave for logged in staff
 */
app.post('/staff/leaves', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { leaveDate, leaveType, reason } = req.body;
    if (!leaveDate || !leaveType) {
      return res.status(400).json({ success: false, message: 'leaveDate and leaveType are required' });
    }
    await queries.createStaffLeave(req.user.id, leaveDate, leaveType, reason || '');
    res.status(201).json({ success: true, message: 'Leave request submitted' });
  } catch (error) {
    console.error('Error creating staff leave:', error);
    res.status(500).json({ success: false, message: 'Failed to create leave request' });
  }
});

/**
 * DELETE /staff/leaves/:id
 * Cancel pending leave by staff
 */
app.delete('/staff/leaves/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.roleId !== 2 && req.user.roleId !== 1)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { id } = req.params;
    const result = await queries.cancelStaffLeave(Number(id), req.user.id);
    const affectedRows = (result as any).affectedRows || 0;
    if (affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Only pending leave requests can be cancelled' });
    }
    res.json({ success: true, message: 'Leave request cancelled' });
  } catch (error) {
    console.error('Error canceling staff leave:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel leave request' });
  }
});

/**
 * GET /admin/staff/leaves/pending
 * Get pending leave requests (admin only)
 */
app.get('/admin/staff/leaves/pending', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const leaves = await queries.getPendingStaffLeaves();
    res.json({ success: true, data: leaves, count: (leaves as any[]).length });
  } catch (error) {
    console.error('Error fetching pending staff leaves:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending leave requests' });
  }
});

/**
 * PUT /admin/staff/leaves/:id/approve
 * Approve pending leave (admin only)
 */
app.put('/admin/staff/leaves/:id/approve', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;
    const result = await queries.reviewStaffLeave(Number(id), req.user.id, 'Approved');
    const affectedRows = (result as any).affectedRows || 0;
    if (affectedRows === 0) return res.status(400).json({ success: false, message: 'Leave request not found or already reviewed' });
    res.json({ success: true, message: 'Leave request approved' });
  } catch (error) {
    console.error('Error approving leave:', error);
    res.status(500).json({ success: false, message: 'Failed to approve leave request' });
  }
});

/**
 * PUT /admin/staff/leaves/:id/reject
 * Reject pending leave (admin only)
 */
app.put('/admin/staff/leaves/:id/reject', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;
    const result = await queries.reviewStaffLeave(Number(id), req.user.id, 'Rejected');
    const affectedRows = (result as any).affectedRows || 0;
    if (affectedRows === 0) return res.status(400).json({ success: false, message: 'Leave request not found or already reviewed' });
    res.json({ success: true, message: 'Leave request rejected' });
  } catch (error) {
    console.error('Error rejecting leave:', error);
    res.status(500).json({ success: false, message: 'Failed to reject leave request' });
  }
});

/**
 * GET /admin/notifications
 * Admin notification feed (real events)
 */
app.get('/admin/notifications', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { customers, appointments, reviews, pendingStaff, pendingLeaves } = await queries.getAdminNotifications();

    const customerNotifs = customers.map((u: any) => ({
      id: Number(`1${u.Id}`),
      type: 'registration',
      message: `New customer registered: ${u.Name}`,
      read: false,
      createdAt: u.CreatedAt,
    }));

    const appointmentNotifs = appointments.map((a: any) => ({
      id: Number(`2${a.Id}`),
      type: a.Status === 'Cancelled' ? 'cancellation' : 'booking',
      message: `New appointment ${a.Status} — ${a.CustomerName} with ${a.StaffName} (${a.ServiceName})`,
      read: false,
      createdAt: a.CreatedAt,
    }));

    const reviewNotifs = reviews.map((r: any) => ({
      id: Number(`3${r.Id}`),
      type: 'review',
      message: `${r.CustomerName} left a ${r.Rating}-star review for ${r.StaffName} (${r.ServiceName})`,
      read: false,
      createdAt: r.CreatedAt,
    }));

    const pendingStaffNotifs = pendingStaff.map((s: any) => ({
      id: Number(`4${s.UserId}`),
      type: 'staff_pending',
      message: `New staff registration pending: ${s.Name} (${s.Email})`,
      read: false,
      createdAt: s.CreatedAt,
    }));

    const leaveNotifs = pendingLeaves.map((l: any) => ({
      id: Number(`5${l.Id}`),
      type: 'leave_request',
      message: `${l.StaffName} requested leave (${l.LeaveType}) on ${new Date(l.LeaveDate).toLocaleDateString('en-US')}`,
      read: false,
      createdAt: l.CreatedAt,
    }));

    const notifications = [...customerNotifs, ...appointmentNotifs, ...reviewNotifs, ...pendingStaffNotifs, ...leaveNotifs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100);

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin notifications' });
  }
});

/**
 * GET /admin/system-settings
 * Get editable system settings (admin only)
 */
app.get('/admin/system-settings', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const settings = await queries.getSystemSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch system settings' });
  }
});

/**
 * PUT /admin/system-settings
 * Save editable system settings (admin only)
 */
app.put('/admin/system-settings', authenticateToken, requireAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const settings = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Valid settings payload is required' });
    }

    if (!settings.salonName || !settings.contactEmail || !settings.address || !settings.phone) {
      return res.status(400).json({
        success: false,
        message: 'salonName, contactEmail, address, and phone are required',
      });
    }

    if (settings.currencyCode && typeof settings.currencyCode !== 'string') {
      return res.status(400).json({ success: false, message: 'currencyCode must be a string' });
    }

    if (settings.currencyCode && settings.currencyCode.toUpperCase() !== 'LKR') {
      return res.status(400).json({ success: false, message: 'Only LKR currency is supported' });
    }

    await queries.updateSystemSettings(
      {
        salonName: settings.salonName,
        contactEmail: settings.contactEmail,
        address: settings.address,
        phone: settings.phone,
        currencyCode: 'LKR',
        currencyLocale: 'en-LK',
        operatingHours: settings.operatingHours || {},
        securityAdmins: settings.securityAdmins || {},
        notificationRules: settings.notificationRules || {},
      },
      req.user?.id
    );

    const updated = await queries.getSystemSettings();
    res.json({
      success: true,
      message: 'System settings saved successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update system settings' });
  }
});

// Start server
app.listen(PORT, () => {
  initializeTables();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Database: salondb (configured)`);
});
