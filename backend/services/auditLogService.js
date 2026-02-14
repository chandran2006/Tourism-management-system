const db = require('../config/database');

class AuditLogService {
  static async log(adminId, action, target, details = null) {
    try {
      await db.query(
        'INSERT INTO audit_logs (adminId, action, target, details) VALUES (?, ?, ?, ?)',
        [adminId, action, target, details]
      );
    } catch (error) {
      console.error('Audit log error:', error);
    }
  }

  static async getLogs(limit = 100, offset = 0) {
    try {
      const [logs] = await db.query(`
        SELECT al.*, u.name as adminName, u.email as adminEmail 
        FROM audit_logs al 
        JOIN users u ON al.adminId = u.id 
        ORDER BY al.timestamp DESC 
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      return logs;
    } catch (error) {
      console.error('Get logs error:', error);
      return [];
    }
  }

  static async getLogsByAdmin(adminId) {
    try {
      const [logs] = await db.query(
        'SELECT * FROM audit_logs WHERE adminId = ? ORDER BY timestamp DESC LIMIT 50',
        [adminId]
      );
      return logs;
    } catch (error) {
      console.error('Get admin logs error:', error);
      return [];
    }
  }
}

module.exports = AuditLogService;
