// Input validation middleware
const validateExpense = (req, res, next) => {
  const { tripId, category, amount } = req.body;

  if (!category || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Category and amount are required'
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be greater than 0'
    });
  }

  const validCategories = ['Food', 'Hotel', 'Transport', 'Entry', 'Shopping', 'Other'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category'
    });
  }

  next();
};

const validateHotel = (req, res, next) => {
  const { name, city, pricePerNight, rating } = req.body;

  if (!name || !city || !pricePerNight) {
    return res.status(400).json({
      success: false,
      message: 'Name, city, and price are required'
    });
  }

  if (pricePerNight < 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be non-negative'
    });
  }

  if (rating !== undefined && (rating < 0 || rating > 5)) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 0 and 5'
    });
  }

  next();
};

const validateTrip = (req, res, next) => {
  const { destination, startDate, endDate, budget } = req.body;

  if (!destination || !startDate || !endDate || !budget) {
    return res.status(400).json({
      success: false,
      message: 'Destination, dates, and budget are required'
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return res.status(400).json({
      success: false,
      message: 'End date must be after start date'
    });
  }

  if (budget <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Budget must be greater than 0'
    });
  }

  next();
};

const sanitizeInput = (req, res, next) => {
  // Basic XSS prevention
  const sanitize = (obj) => {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    });
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  
  next();
};

module.exports = {
  validateExpense,
  validateHotel,
  validateTrip,
  sanitizeInput
};
