class TransportService {
  constructor() {
    // Base rates (in INR)
    this.rates = {
      cab: {
        perKm: 12,
        baseFare: 50,
        avgSpeed: 50 // km/h
      },
      bus: {
        perKm: 1.5,
        baseFare: 20,
        avgSpeed: 40 // km/h
      },
      train: {
        perKm: 0.8,
        baseFare: 30,
        avgSpeed: 60 // km/h
      },
      auto: {
        perKm: 10,
        baseFare: 30,
        avgSpeed: 30 // km/h
      },
      flight: {
        perKm: 5,
        baseFare: 2000,
        avgSpeed: 600 // km/h
      }
    };

    // Distance thresholds for recommendations (in km)
    this.thresholds = {
      walking: 2,
      auto: 15,
      cab: 100,
      bus: 200,
      train: 500,
      flight: 500
    };
  }

  /**
   * Calculate distance between two points (simplified)
   * In production, use Google Maps Distance Matrix API or similar
   * @param {string} from - Starting location
   * @param {string} to - Destination
   * @returns {number} - Distance in km
   */
  calculateDistance(from, to) {
    // This is a placeholder. In production, integrate with:
    // - Google Maps Distance Matrix API
    // - OpenStreetMap Nominatim
    // - Or maintain a distance matrix in database
    
    // For now, return a mock distance based on common routes
    const mockDistances = {
      'mumbai-pune': 150,
      'delhi-agra': 230,
      'bangalore-mysore': 150,
      'chennai-pondicherry': 170,
      'jaipur-ajmer': 135,
      'goa-mumbai': 580
    };

    const routeKey = `${from.toLowerCase()}-${to.toLowerCase()}`;
    const reverseKey = `${to.toLowerCase()}-${from.toLowerCase()}`;

    return mockDistances[routeKey] || mockDistances[reverseKey] || 100;
  }

  /**
   * Calculate cost for a specific transport mode
   * @param {string} mode - Transport mode
   * @param {number} distance - Distance in km
   * @returns {number} - Estimated cost
   */
  calculateCost(mode, distance) {
    const rate = this.rates[mode];
    if (!rate) {
      throw new Error(`Invalid transport mode: ${mode}`);
    }

    const cost = rate.baseFare + (distance * rate.perKm);
    return Math.round(cost);
  }

  /**
   * Calculate travel time
   * @param {string} mode - Transport mode
   * @param {number} distance - Distance in km
   * @returns {object} - Time in hours and formatted string
   */
  calculateTravelTime(mode, distance) {
    const rate = this.rates[mode];
    if (!rate) {
      throw new Error(`Invalid transport mode: ${mode}`);
    }

    const hours = distance / rate.avgSpeed;
    const totalMinutes = Math.round(hours * 60);
    const displayHours = Math.floor(totalMinutes / 60);
    const displayMinutes = totalMinutes % 60;

    let formatted = '';
    if (displayHours > 0) {
      formatted += `${displayHours}h `;
    }
    if (displayMinutes > 0) {
      formatted += `${displayMinutes}m`;
    }

    return {
      hours: parseFloat(hours.toFixed(2)),
      minutes: totalMinutes,
      formatted: formatted.trim()
    };
  }

  /**
   * Get all transport options with costs and times
   * @param {string} from - Starting location
   * @param {string} to - Destination
   * @returns {Array} - List of transport options
   */
  getAllOptions(from, to) {
    const distance = this.calculateDistance(from, to);
    const options = [];

    // Add all applicable transport modes
    const modes = ['cab', 'bus', 'train', 'auto', 'flight'];

    modes.forEach(mode => {
      // Skip modes that don't make sense for the distance
      if (mode === 'auto' && distance > this.thresholds.auto) {
        return;
      }
      if (mode === 'flight' && distance < this.thresholds.flight) {
        return;
      }

      const cost = this.calculateCost(mode, distance);
      const time = this.calculateTravelTime(mode, distance);

      options.push({
        mode,
        distance,
        cost,
        time: time.formatted,
        timeMinutes: time.minutes,
        availability: this.getAvailability(mode),
        description: this.getDescription(mode, distance)
      });
    });

    return options;
  }

  /**
   * Get best transport option based on budget
   * @param {string} from - Starting location
   * @param {string} to - Destination
   * @param {number} budget - Maximum budget
   * @returns {object} - Best transport option
   */
  getBestTransport(from, to, budget = Infinity) {
    const options = this.getAllOptions(from, to);

    // Filter by budget
    const affordableOptions = options.filter(opt => opt.cost <= budget);

    if (affordableOptions.length === 0) {
      // Return cheapest option with warning
      const cheapest = options.sort((a, b) => a.cost - b.cost)[0];
      return {
        ...cheapest,
        warning: `Cheapest option (₹${cheapest.cost}) exceeds budget (₹${budget})`
      };
    }

    // Sort by time efficiency (faster is better)
    affordableOptions.sort((a, b) => a.timeMinutes - b.timeMinutes);

    return {
      ...affordableOptions[0],
      alternatives: affordableOptions.slice(1, 3)
    };
  }

  /**
   * Get transport recommendations with multiple criteria
   * @param {string} from - Starting location
   * @param {string} to - Destination
   * @param {object} preferences - User preferences
   * @returns {object} - Recommendations
   */
  getRecommendations(from, to, preferences = {}) {
    const { budget, priority = 'balanced' } = preferences;
    const options = this.getAllOptions(from, to);

    let cheapest = null;
    let fastest = null;
    let recommended = null;

    // Find cheapest
    cheapest = options.reduce((prev, curr) => 
      prev.cost < curr.cost ? prev : curr
    );

    // Find fastest
    fastest = options.reduce((prev, curr) => 
      prev.timeMinutes < curr.timeMinutes ? prev : curr
    );

    // Find recommended based on priority
    switch(priority) {
      case 'cost':
        recommended = cheapest;
        break;
      case 'time':
        recommended = fastest;
        break;
      case 'balanced':
        // Calculate score: normalize cost and time, then average
        const scoredOptions = options.map(opt => {
          const costScore = 1 - (opt.cost / Math.max(...options.map(o => o.cost)));
          const timeScore = 1 - (opt.timeMinutes / Math.max(...options.map(o => o.timeMinutes)));
          return {
            ...opt,
            score: (costScore + timeScore) / 2
          };
        });
        recommended = scoredOptions.sort((a, b) => b.score - a.score)[0];
        break;
      default:
        recommended = cheapest;
    }

    return {
      from,
      to,
      distance: options[0]?.distance || 0,
      cheapest,
      fastest,
      recommended,
      allOptions: options,
      summary: {
        costRange: {
          min: cheapest.cost,
          max: options.reduce((prev, curr) => prev.cost > curr.cost ? prev : curr).cost
        },
        timeRange: {
          min: fastest.time,
          max: options.reduce((prev, curr) => prev.timeMinutes > curr.timeMinutes ? prev : curr).time
        }
      }
    };
  }

  /**
   * Estimate total transport cost for a trip with multiple destinations
   * @param {Array} itinerary - Array of destinations
   * @param {string} mode - Preferred transport mode
   * @returns {object} - Total cost breakdown
   */
  estimateTripCost(itinerary, mode = 'cab') {
    if (!itinerary || itinerary.length < 2) {
      throw new Error('Itinerary must have at least 2 destinations');
    }

    let totalCost = 0;
    let totalDistance = 0;
    let totalTime = 0;
    const segments = [];

    for (let i = 0; i < itinerary.length - 1; i++) {
      const from = itinerary[i];
      const to = itinerary[i + 1];
      
      const distance = this.calculateDistance(from, to);
      const cost = this.calculateCost(mode, distance);
      const time = this.calculateTravelTime(mode, distance);

      totalCost += cost;
      totalDistance += distance;
      totalTime += time.minutes;

      segments.push({
        from,
        to,
        distance,
        cost,
        time: time.formatted
      });
    }

    return {
      mode,
      totalCost,
      totalDistance,
      totalTime: this.formatMinutes(totalTime),
      segments,
      averageCostPerKm: Math.round(totalCost / totalDistance)
    };
  }

  /**
   * Get availability information for transport mode
   * @param {string} mode - Transport mode
   * @returns {string} - Availability info
   */
  getAvailability(mode) {
    const availability = {
      cab: '24/7',
      bus: 'Multiple daily services',
      train: 'Check schedule',
      auto: 'Widely available',
      flight: 'Limited schedules'
    };

    return availability[mode] || 'Contact provider';
  }

  /**
   * Get description for transport mode
   * @param {string} mode - Transport mode
   * @param {number} distance - Distance in km
   * @returns {string} - Description
   */
  getDescription(mode, distance) {
    const descriptions = {
      cab: `Private cab service. Comfortable and convenient for ${distance}km.`,
      bus: `Public/private bus service. Economical option for ${distance}km.`,
      train: `Railway service. Best value for ${distance}km journey.`,
      auto: `Auto rickshaw. Good for short distances up to ${distance}km.`,
      flight: `Air travel. Fastest option for ${distance}km.`
    };

    return descriptions[mode] || '';
  }

  /**
   * Format minutes to hours and minutes
   * @param {number} minutes - Total minutes
   * @returns {string} - Formatted string
   */
  formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    let formatted = '';
    if (hours > 0) {
      formatted += `${hours}h `;
    }
    if (mins > 0) {
      formatted += `${mins}m`;
    }
    
    return formatted.trim();
  }

  /**
   * Get estimated fuel cost (for personal vehicle)
   * @param {number} distance - Distance in km
   * @param {number} mileage - Vehicle mileage in km/l
   * @param {number} fuelPrice - Fuel price per liter
   * @returns {object} - Fuel cost breakdown
   */
  calculateFuelCost(distance, mileage = 15, fuelPrice = 100) {
    const litersNeeded = distance / mileage;
    const totalCost = litersNeeded * fuelPrice;

    return {
      distance,
      mileage,
      fuelPrice,
      litersNeeded: parseFloat(litersNeeded.toFixed(2)),
      totalCost: Math.round(totalCost),
      costPerKm: parseFloat((totalCost / distance).toFixed(2))
    };
  }
}

module.exports = new TransportService();
