import pool from './db';
import { RowDataPacket } from 'mysql2';

export type SystemSettingsPayload = {
  salonName: string;
  contactEmail: string;
  address: string;
  phone: string;
  currencyCode: string;
  currencyLocale: string;
  operatingHours: Record<string, { open: string; close: string; isClosed: boolean }>;
  securityAdmins: {
    enforceStrongPasswords: boolean;
    requireTwoFactorForAdmins: boolean;
    adminSessionTimeoutMinutes: number;
    maxFailedLoginAttempts: number;
  };
  notificationRules: {
    emailBookingAlerts: boolean;
    smsBookingAlerts: boolean;
    staffLeaveAlerts: boolean;
    reviewAlerts: boolean;
    dailySummaryTime: string;
  };
};

const defaultOperatingHours: SystemSettingsPayload['operatingHours'] = {
  Monday: { open: '09:00', close: '18:00', isClosed: false },
  Tuesday: { open: '09:00', close: '18:00', isClosed: false },
  Wednesday: { open: '09:00', close: '18:00', isClosed: false },
  Thursday: { open: '09:00', close: '18:00', isClosed: false },
  Friday: { open: '09:00', close: '18:00', isClosed: false },
  Saturday: { open: '10:00', close: '17:00', isClosed: false },
  Sunday: { open: '10:00', close: '17:00', isClosed: true },
};

const defaultSecurityAdmins: SystemSettingsPayload['securityAdmins'] = {
  enforceStrongPasswords: true,
  requireTwoFactorForAdmins: true,
  adminSessionTimeoutMinutes: 30,
  maxFailedLoginAttempts: 5,
};

const defaultNotificationRules: SystemSettingsPayload['notificationRules'] = {
  emailBookingAlerts: true,
  smsBookingAlerts: false,
  staffLeaveAlerts: true,
  reviewAlerts: true,
  dailySummaryTime: '18:00',
};

// ==================== AUTHENTICATION QUERIES ====================

/**
 * Register a new customer user
 */
export const registerCustomer = async (
  name: string,
  email: string,
  passwordHash: string,
  phone?: string,
  dateOfBirth?: string,
  gender?: string,
  address?: string
) => {
  try {
    const connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Insert into Users table (RoleId 3 is Customer)
    const [userResult] = await connection.query(
      `INSERT INTO Users (Name, Email, PasswordHash, Phone, RoleId)
       VALUES (?, ?, ?, ?, 3)`,
      [name, email, passwordHash, phone || null]
    );

    const userId = (userResult as any).insertId;

    // Insert into Customers table
    await connection.query(
      `INSERT INTO Customers (UserId, DateOfBirth, Gender, Address, IsActive)
       VALUES (?, ?, ?, ?, true)`,
      [userId, dateOfBirth || null, gender || null, address || null]
    );

    // Commit transaction
    await connection.commit();
    connection.release();

    return { userId, success: true };
  } catch (error) {
    console.error('Error registering customer:', error);
    throw error;
  }
};

/**
 * Get user by email for login
 */
export const getUserByEmail = async (email: string) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT u.Id, u.Name, u.Email, u.PasswordHash, u.RoleId, u.CreatedAt
       FROM Users u
       WHERE u.Email = ?`,
      [email]
    );
    connection.release();

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT u.Id, u.Name, u.Email, u.Phone, u.RoleId, u.CreatedAt
       FROM Users u
       WHERE u.Id = ?`,
      [id]
    );
    connection.release();

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Get customer profile by user ID
 */
export const getCustomerProfile = async (userId: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT c.Id, c.UserId, c.ProfilePhoto, c.DateOfBirth, c.Gender, c.Address, c.IsActive,
              u.Name, u.Email, u.Phone
       FROM Customers c
       JOIN Users u ON c.UserId = u.Id
       WHERE c.UserId = ?`,
      [userId]
    );
    connection.release();

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    throw error;
  }
};

/**
 * Get total count of customers
 */
export const getCustomerCount = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT COUNT(*) as count FROM Customers`
    );
    connection.release();

    if (Array.isArray(rows) && rows.length > 0) {
      return (rows[0] as any).count;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching customer count:', error);
    throw error;
  }
};

/**
 * Get total count of active staff members
 */
export const getStaffCount = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT COUNT(*) as count FROM Staff WHERE IsVerified = true AND IsActive = true`
    );
    connection.release();

    if (Array.isArray(rows) && rows.length > 0) {
      return (rows[0] as any).count;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching staff count:', error);
    throw error;
  }
};

/**
 * Get all customers (admin view)
 */
export const getAllCustomers = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT c.Id, c.UserId, c.ProfilePhoto, c.DateOfBirth, c.Gender, c.Address, c.IsActive,
              u.Name, u.Email, u.Phone, u.CreatedAt
       FROM Customers c
       JOIN Users u ON c.UserId = u.Id
       ORDER BY u.CreatedAt DESC`
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching all customers:', error);
    throw error;
  }
};

/**
 * Update customer status (activate/deactivate)
 */
export const updateCustomerStatus = async (userId: number, isActive: boolean) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `UPDATE Customers SET IsActive = ? WHERE UserId = ?`,
      [isActive, userId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error updating customer status:', error);
    throw error;
  }
};

/**
 * Delete customer (both user and customer records)
 */
export const deleteCustomer = async (userId: number) => {
  try {
    const connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete from Customers table first
      await connection.query(
        'DELETE FROM Customers WHERE UserId = ?',
        [userId]
      );

      // Delete from Users table
      await connection.query(
        'DELETE FROM Users WHERE Id = ?',
        [userId]
      );

      // Commit transaction
      await connection.commit();
      connection.release();

      return { success: true };
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

/**
 * Register a new staff member (pending verification)
 */
export const registerStaff = async (
  name: string,
  email: string,
  passwordHash: string,
  phone?: string,
  specialization?: string
) => {
  try {
    const connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert into Users table (RoleId 2 is Staff, but initially unverified)
      const [userResult] = await connection.query(
        `INSERT INTO Users (Name, Email, PasswordHash, Phone, RoleId)
         VALUES (?, ?, ?, ?, 2)`,
        [name, email, passwordHash, phone || null]
      );

      const userId = (userResult as any).insertId;

      // Insert into Staff table with IsVerified = false
      await connection.query(
        `INSERT INTO Staff (UserId, Specialization, IsVerified, IsActive)
         VALUES (?, ?, 0, 0)`,
        [userId, specialization || null]
      );

      // Commit transaction
      await connection.commit();
      connection.release();

      return { userId, success: true };
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error registering staff:', error);
    throw error;
  }
};

/**
 * Get all pending staff registrations (not verified)
 */
export const getPendingStaffRegistrations = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT s.Id, s.UserId, s.Specialization, s.YearsOfExperience, s.IsVerified,
              u.Name, u.Email, u.Phone, u.CreatedAt
       FROM Staff s
       JOIN Users u ON s.UserId = u.Id
       WHERE s.IsVerified = false
       ORDER BY u.CreatedAt DESC`
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching pending staff:', error);
    throw error;
  }
};

/**
 * Get all verified and active staff
 */
export const getActiveStaff = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT s.Id, s.UserId, s.Specialization, s.YearsOfExperience, s.IsActive, s.MyServices,
              u.Name, u.Email, u.Phone, u.CreatedAt
       FROM Staff s
       JOIN Users u ON s.UserId = u.Id
       WHERE s.IsVerified = true AND s.IsActive = true
       ORDER BY u.Name ASC`
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching active staff:', error);
    throw error;
  }
};

/**
 * Approve staff registration (admin)
 */
export const approveStaffRegistration = async (userId: number) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `UPDATE Staff SET IsVerified = true, IsActive = true WHERE UserId = ?`,
      [userId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error approving staff registration:', error);
    throw error;
  }
};

/**
 * Reject staff registration (delete unverified staff)
 */
export const rejectStaffRegistration = async (userId: number) => {
  try {
    const connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete from Staff table
      await connection.query(
        'DELETE FROM Staff WHERE UserId = ?',
        [userId]
      );

      // Delete from Users table
      await connection.query(
        'DELETE FROM Users WHERE Id = ?',
        [userId]
      );

      // Commit transaction
      await connection.commit();
      connection.release();

      return { success: true };
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error rejecting staff registration:', error);
    throw error;
  }
};

/**
 * Check if email already exists
 */
export const emailExists = async (email: string): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT 1 FROM Users WHERE Email = ?',
      [email]
    );
    connection.release();
    return Array.isArray(rows) && rows.length > 0;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
};

// ==================== SALON QUERIES ====================

// Example: Get all salons
export const getSalons = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM salons');
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching salons:', error);
    throw error;
  }
};

// Example: Get salon by ID
export const getSalonById = async (id: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM salons WHERE id = ?',
      [id]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching salon:', error);
    throw error;
  }
};

// Example: Create a new salon
export const createSalon = async (name: string, email: string, phone: string) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO salons (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error creating salon:', error);
    throw error;
  }
};

// Example: Update a salon
export const updateSalon = async (id: number, name: string, email: string, phone: string) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE salons SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, id]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error updating salon:', error);
    throw error;
  }
};

// Example: Delete a salon
export const deleteSalon = async (id: number) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM salons WHERE id = ?',
      [id]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error deleting salon:', error);
    throw error;
  }
};

// ==================== SERVICE QUERIES ====================

/**
 * Get all services with category info
 */
export const getAllServices = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT s.Id, s.CategoryId, s.Name, s.Description, s.Price, s.IsPriceConfirmed, 
             s.DurationMinutes, s.ImageUrl, s.IsActive, s.CreatedAt, s.UpdatedAt,
             c.CategoryName 
      FROM Services s 
      JOIN ServiceCategories c ON s.CategoryId = c.Id 
      ORDER BY c.CategoryName, s.Name
    `);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching all services:', error);
    throw error;
  }
};

/**
 * Update service price and confirm it
 */
export const updateServicePrice = async (serviceId: number, price: number) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Services SET Price = ?, IsPriceConfirmed = true WHERE Id = ?',
      [price, serviceId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error updating service price:', error);
    throw error;
  }
};

/**
 * Update service active status
 */
export const updateServiceStatus = async (serviceId: number, isActive: boolean) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Services SET IsActive = ? WHERE Id = ?',
      [isActive, serviceId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
};

// ==================== CATEGORY QUERIES ====================

/**
 * Get all service categories with active service count
 */
export const getAllCategories = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT c.Id, c.CategoryName, c.Description, c.IsActive, COUNT(s.Id) as ServiceCount 
      FROM ServiceCategories c 
      LEFT JOIN Services s ON c.Id = s.CategoryId AND s.IsActive = 1 
      GROUP BY c.Id
      ORDER BY c.CategoryName ASC
    `);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching all categories:', error);
    throw error;
  }
};

/**
 * Add a new service category
 */
export const addCategory = async (categoryName: string, description?: string) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO ServiceCategories (CategoryName, Description, IsActive) VALUES (?, ?, ?)',
      [categoryName, description || null, true]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Get all active services with category info for customers
 */
export const getActiveServices = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT s.Id, s.CategoryId, s.Name, s.Description, s.Price, 
             s.DurationMinutes, s.ImageUrl, c.CategoryName 
      FROM Services s 
      JOIN ServiceCategories c ON s.CategoryId = c.Id 
      WHERE s.IsActive = 1 AND c.IsActive = 1 AND s.IsPriceConfirmed = 1 AND s.Price IS NOT NULL
      ORDER BY c.CategoryName, s.Name
    `);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching active services:', error);
    throw error;
  }
};

// ==================== STAFF SERVICES QUERIES ====================

/**
 * Get staff services
 */
export const getStaffServices = async (userId: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT MyServices FROM Staff WHERE UserId = ?`,
      [userId]
    );
    connection.release();

    if (Array.isArray(rows) && rows.length > 0) {
      return (rows[0] as any).MyServices || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching staff services:', error);
    throw error;
  }
};

/**
 * Update staff services
 */
export const updateStaffServices = async (userId: number, serviceIds: number[]) => {
  try {
    const connection = await pool.getConnection();

    // In MySQL, JSON column can be updated by stringifying the array
    const servicesJson = JSON.stringify(serviceIds);

    const [result] = await connection.query(
      `UPDATE Staff SET MyServices = ? WHERE UserId = ?`,
      [servicesJson, userId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error updating staff services:', error);
    throw error;
  }
};

// ==================== APPOINTMENT QUERIES ====================

/**
 * Create a new appointment
 */
export const createAppointment = async (
  customerUserId: number,
  staffUserId: number,
  serviceId: number,
  appointmentDate: string,
  appointmentTime: string,
  totalPrice: number,
  durationMinutes: number
) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO Appointments 
       (CustomerUserId, StaffUserId, ServiceId, AppointmentDate, AppointmentTime, TotalPrice, DurationMinutes, Status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [customerUserId, staffUserId, serviceId, appointmentDate, appointmentTime, totalPrice, durationMinutes]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

/**
 * Get appointments for a customer
 */
export const getCustomerAppointments = async (customerUserId: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT a.Id, a.CustomerUserId, a.StaffUserId, a.ServiceId, 
              a.AppointmentDate, a.AppointmentTime, a.Status, a.TotalPrice, a.DurationMinutes,
              u.Name as StaffName, s.Name as ServiceName, s.ImageUrl as ServiceImageUrl
       FROM Appointments a
       JOIN Users u ON a.StaffUserId = u.Id
       JOIN Services s ON a.ServiceId = s.Id
       WHERE a.CustomerUserId = ?
       ORDER BY a.AppointmentDate ASC, a.AppointmentTime ASC`,
      [customerUserId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching customer appointments:', error);
    throw error;
  }
};

/**
 * Get appointments for a staff member
 */
export const getStaffAppointments = async (staffUserId: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT a.Id, a.CustomerUserId, a.StaffUserId, a.ServiceId, 
              a.AppointmentDate, a.AppointmentTime, a.Status, a.TotalPrice, a.DurationMinutes,
              u.Name as CustomerName, s.Name as ServiceName
       FROM Appointments a
       JOIN Users u ON a.CustomerUserId = u.Id
       JOIN Services s ON a.ServiceId = s.Id
       WHERE a.StaffUserId = ?
       ORDER BY a.AppointmentDate ASC, a.AppointmentTime ASC`,
      [staffUserId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching staff appointments:', error);
    throw error;
  }
};

/**
 * Get all appointments for admin management
 */
export const getAdminAppointments = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT a.Id, a.CustomerUserId, a.StaffUserId, a.ServiceId,
              a.AppointmentDate, a.AppointmentTime, a.Status, a.TotalPrice, a.DurationMinutes, a.CreatedAt,
              cu.Name AS CustomerName,
              su.Name AS StaffName,
              s.Name AS ServiceName
       FROM Appointments a
       JOIN Users cu ON a.CustomerUserId = cu.Id
       JOIN Users su ON a.StaffUserId = su.Id
       JOIN Services s ON a.ServiceId = s.Id
       ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC`
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    throw error;
  }
};

/**
 * Update appointment status (Staff/Admin)
 */
export const updateAppointmentStatus = async (appointmentId: number, staffUserId: number, status: string) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `UPDATE Appointments SET Status = ? WHERE Id = ? AND StaffUserId = ?`,
      [status, appointmentId, staffUserId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

// ==================== REVIEW QUERIES ====================

/**
 * Ensure Reviews table exists
 */
export const ensureReviewsTable = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Reviews (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        AppointmentId INT NOT NULL UNIQUE,
        CustomerUserId INT NOT NULL,
        StaffUserId INT NOT NULL,
        ServiceId INT NOT NULL,
        Rating INT NOT NULL,
        Comment TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_reviews_rating CHECK (Rating >= 1 AND Rating <= 5),
        FOREIGN KEY (AppointmentId) REFERENCES Appointments(Id) ON DELETE CASCADE,
        FOREIGN KEY (CustomerUserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (StaffUserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (ServiceId) REFERENCES Services(Id) ON DELETE CASCADE
      )
    `);
    connection.release();
  } catch (error) {
    console.error('Error ensuring Reviews table:', error);
    throw error;
  }
};

/**
 * Create a review for a completed appointment
 */
export const createReview = async (
  customerUserId: number,
  appointmentId: number,
  rating: number,
  comment: string
) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO Reviews (AppointmentId, CustomerUserId, StaffUserId, ServiceId, Rating, Comment)
       SELECT a.Id, a.CustomerUserId, a.StaffUserId, a.ServiceId, ?, ?
       FROM Appointments a
       WHERE a.Id = ? AND a.CustomerUserId = ? AND a.Status = 'Completed'`,
      [rating, comment || null, appointmentId, customerUserId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Get reviews by customer
 */
export const getCustomerReviews = async (customerUserId: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT r.Id, r.AppointmentId, r.Rating, r.Comment, r.CreatedAt,
              s.Name AS ServiceName,
              u.Name AS StaffName
       FROM Reviews r
       JOIN Services s ON r.ServiceId = s.Id
       JOIN Users u ON r.StaffUserId = u.Id
       WHERE r.CustomerUserId = ?
       ORDER BY r.CreatedAt DESC`,
      [customerUserId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    throw error;
  }
};

/**
 * Get reviews for a staff member
 */
export const getStaffReviews = async (staffUserId: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT r.Id, r.AppointmentId, r.Rating, r.Comment, r.CreatedAt,
              s.Name AS ServiceName,
              c.Name AS CustomerName
       FROM Reviews r
       JOIN Services s ON r.ServiceId = s.Id
       JOIN Users c ON r.CustomerUserId = c.Id
       WHERE r.StaffUserId = ?
       ORDER BY r.CreatedAt DESC`,
      [staffUserId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching staff reviews:', error);
    throw error;
  }
};

/**
 * Get all reviews for admin moderation
 */
export const getAdminReviews = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT r.Id, r.AppointmentId, r.Rating, r.Comment, r.CreatedAt,
              s.Name AS ServiceName,
              c.Name AS CustomerName,
              st.Name AS StaffName
       FROM Reviews r
       JOIN Services s ON r.ServiceId = s.Id
       JOIN Users c ON r.CustomerUserId = c.Id
       JOIN Users st ON r.StaffUserId = st.Id
       ORDER BY r.CreatedAt DESC`
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    throw error;
  }
};

/**
 * Get notification feed for a staff member
 * Includes appointment events and new customer reviews
 */
export const getStaffNotifications = async (staffUserId: number) => {
  try {
    const connection = await pool.getConnection();
    const [appointmentRows] = await connection.query(
      `SELECT a.Id, a.Status, a.CreatedAt, a.AppointmentDate, a.AppointmentTime,
              u.Name AS CustomerName, s.Name AS ServiceName
       FROM Appointments a
       JOIN Users u ON a.CustomerUserId = u.Id
       JOIN Services s ON a.ServiceId = s.Id
       WHERE a.StaffUserId = ?
       ORDER BY a.CreatedAt DESC
       LIMIT 50`,
      [staffUserId]
    );

    const [reviewRows] = await connection.query(
      `SELECT r.Id, r.Rating, r.Comment, r.CreatedAt,
              u.Name AS CustomerName, s.Name AS ServiceName
       FROM Reviews r
       JOIN Users u ON r.CustomerUserId = u.Id
       JOIN Services s ON r.ServiceId = s.Id
       WHERE r.StaffUserId = ?
       ORDER BY r.CreatedAt DESC
       LIMIT 50`,
      [staffUserId]
    );
    connection.release();

    return {
      appointments: appointmentRows as any[],
      reviews: reviewRows as any[],
    };
  } catch (error) {
    console.error('Error fetching staff notifications:', error);
    throw error;
  }
};

// ==================== STAFF LEAVE QUERIES ====================

/**
 * Ensure StaffLeaves table exists
 */
export const ensureStaffLeavesTable = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS StaffLeaves (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        StaffUserId INT NOT NULL,
        LeaveDate DATE NOT NULL,
        LeaveType VARCHAR(100) NOT NULL,
        Reason TEXT,
        Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        ReviewedByUserId INT NULL,
        ReviewedAt TIMESTAMP NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (StaffUserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (ReviewedByUserId) REFERENCES Users(Id) ON DELETE SET NULL
      )
    `);
    connection.release();
  } catch (error) {
    console.error('Error ensuring StaffLeaves table:', error);
    throw error;
  }
};

export const ensureSystemSettingsTable = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS SystemSettings (
        Id INT PRIMARY KEY DEFAULT 1,
        SalonName VARCHAR(255) NOT NULL,
        ContactEmail VARCHAR(255) NOT NULL,
        Address TEXT NOT NULL,
        Phone VARCHAR(50) NOT NULL,
        CurrencyCode VARCHAR(10) NOT NULL DEFAULT 'LKR',
        CurrencyLocale VARCHAR(30) NOT NULL DEFAULT 'en-LK',
        OperatingHours JSON NOT NULL,
        SecurityAdmins JSON NOT NULL,
        NotificationRules JSON NOT NULL,
        UpdatedByUserId INT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_system_settings_singleton CHECK (Id = 1),
        FOREIGN KEY (UpdatedByUserId) REFERENCES Users(Id) ON DELETE SET NULL
      )
    `);

    await connection.query(
      `INSERT INTO SystemSettings
       (Id, SalonName, ContactEmail, Address, Phone, CurrencyCode, CurrencyLocale, OperatingHours, SecurityAdmins, NotificationRules)
       VALUES (1, ?, ?, ?, ?, 'LKR', 'en-LK', ?, ?, ?)
       ON DUPLICATE KEY UPDATE Id = Id`,
      [
        'GlowVault Salon & Spa',
        'hello@glowvault.com',
        '123 Eco Boulevard, Green District, NY 10001',
        '+94 11 555 1234',
        JSON.stringify(defaultOperatingHours),
        JSON.stringify(defaultSecurityAdmins),
        JSON.stringify(defaultNotificationRules),
      ]
    );
    connection.release();
  } catch (error) {
    console.error('Error ensuring SystemSettings table:', error);
    throw error;
  }
};

export const getSystemSettings = async (): Promise<SystemSettingsPayload> => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT SalonName, ContactEmail, Address, Phone, CurrencyCode, CurrencyLocale,
              OperatingHours, SecurityAdmins, NotificationRules
       FROM SystemSettings
       WHERE Id = 1
       LIMIT 1`
    );
    connection.release();

    const row = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
    if (!row) {
      return {
        salonName: 'GlowVault Salon & Spa',
        contactEmail: 'hello@glowvault.com',
        address: '123 Eco Boulevard, Green District, NY 10001',
        phone: '+94 11 555 1234',
        currencyCode: 'LKR',
        currencyLocale: 'en-LK',
        operatingHours: defaultOperatingHours,
        securityAdmins: defaultSecurityAdmins,
        notificationRules: defaultNotificationRules,
      };
    }

    return {
      salonName: row.SalonName,
      contactEmail: row.ContactEmail,
      address: row.Address,
      phone: row.Phone,
      currencyCode: row.CurrencyCode || 'LKR',
      currencyLocale: row.CurrencyLocale || 'en-LK',
      operatingHours: typeof row.OperatingHours === 'string' ? JSON.parse(row.OperatingHours) : row.OperatingHours,
      securityAdmins: typeof row.SecurityAdmins === 'string' ? JSON.parse(row.SecurityAdmins) : row.SecurityAdmins,
      notificationRules:
        typeof row.NotificationRules === 'string' ? JSON.parse(row.NotificationRules) : row.NotificationRules,
    };
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

export const updateSystemSettings = async (payload: SystemSettingsPayload, updatedByUserId?: number) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `UPDATE SystemSettings
       SET SalonName = ?, ContactEmail = ?, Address = ?, Phone = ?, CurrencyCode = ?, CurrencyLocale = ?,
           OperatingHours = ?, SecurityAdmins = ?, NotificationRules = ?, UpdatedByUserId = ?
       WHERE Id = 1`,
      [
        payload.salonName,
        payload.contactEmail,
        payload.address,
        payload.phone,
        payload.currencyCode || 'LKR',
        payload.currencyLocale || 'en-LK',
        JSON.stringify(payload.operatingHours || defaultOperatingHours),
        JSON.stringify(payload.securityAdmins || defaultSecurityAdmins),
        JSON.stringify(payload.notificationRules || defaultNotificationRules),
        updatedByUserId || null,
      ]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};

/**
 * Request a staff leave
 */
export const createStaffLeave = async (
  staffUserId: number,
  leaveDate: string,
  leaveType: string,
  reason: string
) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO StaffLeaves (StaffUserId, LeaveDate, LeaveType, Reason, Status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [staffUserId, leaveDate, leaveType, reason || null]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error creating staff leave:', error);
    throw error;
  }
};

/**
 * Get leave history for a staff user
 */
export const getStaffLeaves = async (staffUserId: number) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT Id, StaffUserId, LeaveDate, LeaveType, Reason, Status, ReviewedByUserId, ReviewedAt, CreatedAt
       FROM StaffLeaves
       WHERE StaffUserId = ?
       ORDER BY LeaveDate DESC, CreatedAt DESC`,
      [staffUserId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching staff leaves:', error);
    throw error;
  }
};

/**
 * Cancel pending leave by staff
 */
export const cancelStaffLeave = async (leaveId: number, staffUserId: number) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `DELETE FROM StaffLeaves WHERE Id = ? AND StaffUserId = ? AND Status = 'Pending'`,
      [leaveId, staffUserId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error canceling staff leave:', error);
    throw error;
  }
};

/**
 * Get pending leave requests for admin
 */
export const getPendingStaffLeaves = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT l.Id, l.StaffUserId, l.LeaveDate, l.LeaveType, l.Reason, l.Status, l.CreatedAt,
              u.Name AS StaffName, u.Email AS StaffEmail
       FROM StaffLeaves l
       JOIN Users u ON l.StaffUserId = u.Id
       WHERE l.Status = 'Pending'
       ORDER BY l.CreatedAt DESC`
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching pending staff leaves:', error);
    throw error;
  }
};

/**
 * Approve or reject leave request by admin
 */
export const reviewStaffLeave = async (
  leaveId: number,
  adminUserId: number,
  status: 'Approved' | 'Rejected'
) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `UPDATE StaffLeaves
       SET Status = ?, ReviewedByUserId = ?, ReviewedAt = CURRENT_TIMESTAMP
       WHERE Id = ? AND Status = 'Pending'`,
      [status, adminUserId, leaveId]
    );
    connection.release();
    return result;
  } catch (error) {
    console.error('Error reviewing staff leave:', error);
    throw error;
  }
};

// ==================== ADMIN NOTIFICATIONS ====================

/**
 * Admin notification feed (recent events)
 */
export const getAdminNotifications = async () => {
  try {
    const connection = await pool.getConnection();

    const [customerRows] = await connection.query(
      `SELECT u.Id, u.Name, u.CreatedAt
       FROM Users u
       WHERE u.RoleId = 3
       ORDER BY u.CreatedAt DESC
       LIMIT 30`
    );

    const [appointmentRows] = await connection.query(
      `SELECT a.Id, a.CreatedAt, a.Status,
              cu.Name AS CustomerName,
              su.Name AS StaffName,
              s.Name AS ServiceName
       FROM Appointments a
       JOIN Users cu ON a.CustomerUserId = cu.Id
       JOIN Users su ON a.StaffUserId = su.Id
       JOIN Services s ON a.ServiceId = s.Id
       ORDER BY a.CreatedAt DESC
       LIMIT 30`
    );

    const [reviewRows] = await connection.query(
      `SELECT r.Id, r.CreatedAt, r.Rating,
              cu.Name AS CustomerName,
              su.Name AS StaffName,
              s.Name AS ServiceName
       FROM Reviews r
       JOIN Users cu ON r.CustomerUserId = cu.Id
       JOIN Users su ON r.StaffUserId = su.Id
       JOIN Services s ON r.ServiceId = s.Id
       ORDER BY r.CreatedAt DESC
       LIMIT 30`
    );

    const [pendingStaffRows] = await connection.query(
      `SELECT s.Id, s.UserId, u.Name, u.Email, u.CreatedAt
       FROM Staff s
       JOIN Users u ON s.UserId = u.Id
       WHERE s.IsVerified = false
       ORDER BY u.CreatedAt DESC
       LIMIT 30`
    );

    const [leaveRows] = await connection.query(
      `SELECT l.Id, l.CreatedAt, l.LeaveDate, l.LeaveType,
              u.Name AS StaffName
       FROM StaffLeaves l
       JOIN Users u ON l.StaffUserId = u.Id
       WHERE l.Status = 'Pending'
       ORDER BY l.CreatedAt DESC
       LIMIT 30`
    );

    connection.release();

    return {
      customers: customerRows as any[],
      appointments: appointmentRows as any[],
      reviews: reviewRows as any[],
      pendingStaff: pendingStaffRows as any[],
      pendingLeaves: leaveRows as any[],
    };
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    throw error;
  }
};

// ==================== ADMIN STATS ====================

export const getAdminAppointmentStats = async () => {
  try {
    const connection = await pool.getConnection();

    const [todayRows] = await connection.query(
      `SELECT COUNT(*) AS count
       FROM Appointments
       WHERE AppointmentDate = CURDATE()`
    );

    const [monthlyRows] = await connection.query(
      `SELECT COUNT(*) AS count
       FROM Appointments
       WHERE YEAR(AppointmentDate) = YEAR(CURDATE())
         AND MONTH(AppointmentDate) = MONTH(CURDATE())`
    );

    const [pendingRows] = await connection.query(
      `SELECT COUNT(*) AS count
       FROM Appointments
       WHERE Status = 'Pending'`
    );

    const [revenueRows] = await connection.query(
      `SELECT COALESCE(SUM(TotalPrice), 0) AS revenue
       FROM Appointments
       WHERE YEAR(AppointmentDate) = YEAR(CURDATE())
         AND MONTH(AppointmentDate) = MONTH(CURDATE())
         AND Status = 'Completed'`
    );

    connection.release();

    return {
      todayAppointments: Number((todayRows as any[])[0]?.count || 0),
      monthlyAppointments: Number((monthlyRows as any[])[0]?.count || 0),
      pendingAppointments: Number((pendingRows as any[])[0]?.count || 0),
      monthlyRevenue: Number((revenueRows as any[])[0]?.revenue || 0),
    };
  } catch (error) {
    console.error('Error fetching admin appointment stats:', error);
    throw error;
  }
};