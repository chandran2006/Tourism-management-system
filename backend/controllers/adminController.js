const db = require('../config/database');
const bcrypt = require('bcryptjs');
const AuditLogService = require('../services/auditLogService');

// Admin Registration with Secret Key
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    console.log('Admin registration attempt:', { name, email, adminKey });
    console.log('Expected key:', process.env.ADMIN_SECRET_KEY);

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid Admin Key' });
    }

    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'admin']
    );

    // Log audit only if table exists
    try {
      await AuditLogService.log(result.insertId, 'ADMIN_REGISTERED', email, 'New admin registered');
    } catch (logError) {
      console.log('Audit log skipped:', logError.message);
    }

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dashboard Overview
exports.getDashboardStats = async (req, res) => {
  try {
    const [users] = await db.query('SELECT COUNT(*) as total FROM users');
    const [places] = await db.query('SELECT COUNT(*) as total FROM tourist_places');
    const [reviews] = await db.query('SELECT COUNT(*) as total FROM reviews');
    const [trips] = await db.query('SELECT COUNT(*) as total FROM saved_plans');
    const [activeToday] = await db.query(
      'SELECT COUNT(DISTINCT userId) as count FROM reviews WHERE DATE(created_at) = CURDATE()'
    );
    const [popular] = await db.query(
      'SELECT name, rating, viewCount FROM tourist_places ORDER BY viewCount DESC, rating DESC LIMIT 1'
    );
    const [highestRated] = await db.query(
      'SELECT name, rating FROM tourist_places ORDER BY rating DESC LIMIT 1'
    );

    res.json({
      totalUsers: users[0].total,
      totalPlaces: places[0].total,
      totalReviews: reviews[0].total,
      totalTrips: trips[0].total,
      activeToday: activeToday[0].count,
      mostPopular: popular[0] || null,
      highestRated: highestRated[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT id, name, email, role, status, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await db.query(query, params);
    
    const [total] = await db.query('SELECT COUNT(*) as count FROM users');
    const [activeNow] = await db.query(
      'SELECT COUNT(DISTINCT userId) as count FROM reviews WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)'
    );
    
    res.json({ 
      users, 
      total: total[0].count, 
      activeNow: activeNow[0].count,
      page: parseInt(page), 
      totalPages: Math.ceil(total[0].count / limit) 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const [user] = await db.query('SELECT email FROM users WHERE id = ?', [id]);
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    
    await AuditLogService.log(req.user.id, 'USER_DELETED', user[0]?.email, `Deleted user ID: ${id}`);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change User Role
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const [user] = await db.query('SELECT email FROM users WHERE id = ?', [id]);
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    
    await AuditLogService.log(req.user.id, 'ROLE_CHANGED', user[0]?.email, `Changed role to ${role}`);
    
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [mostVisited] = await db.query(
      'SELECT name, viewCount FROM tourist_places ORDER BY viewCount DESC LIMIT 5'
    );

    const [mostSaved] = await db.query(`
      SELECT tp.name, COUNT(f.id) as saveCount 
      FROM tourist_places tp 
      LEFT JOIN favorites f ON tp.id = f.placeId 
      GROUP BY tp.id 
      ORDER BY saveCount DESC 
      LIMIT 5
    `);

    const [highestRated] = await db.query(
      'SELECT name, rating FROM tourist_places ORDER BY rating DESC LIMIT 5'
    );

    const [newUsers] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    res.json({
      mostVisited,
      mostSaved,
      highestRated,
      newUsersThisWeek: newUsers[0].count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle User Status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const [user] = await db.query('SELECT email FROM users WHERE id = ?', [id]);
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    
    await AuditLogService.log(req.user.id, 'USER_STATUS_CHANGED', user[0]?.email, `Status changed to ${status}`);
    
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [reviews] = await db.query(`
      SELECT r.*, u.name as userName, tp.name as placeName 
      FROM reviews r 
      JOIN users u ON r.userId = u.id 
      JOIN tourist_places tp ON r.placeId = tp.id 
      ORDER BY r.created_at DESC 
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    const [total] = await db.query('SELECT COUNT(*) as count FROM reviews');

    res.json({ reviews, total: total[0].count, page: parseInt(page), totalPages: Math.ceil(total[0].count / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [review] = await db.query('SELECT placeId FROM reviews WHERE id = ?', [id]);
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    
    await AuditLogService.log(req.user.id, 'REVIEW_DELETED', `Review ID: ${id}`, 'Deleted inappropriate review');
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Audit Logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const logs = await AuditLogService.getLogs(parseInt(limit), parseInt(offset));
    
    res.json({ logs, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Trip Plans
exports.getTripPlans = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [plans] = await db.query(`
      SELECT sp.*, u.name as userName, u.email as userEmail 
      FROM saved_plans sp 
      JOIN users u ON sp.userId = u.id 
      ORDER BY sp.created_at DESC 
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    const [total] = await db.query('SELECT COUNT(*) as count FROM saved_plans');

    res.json({ plans, total: total[0].count, page: parseInt(page), totalPages: Math.ceil(total[0].count / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
