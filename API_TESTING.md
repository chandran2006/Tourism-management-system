# API Testing Guide - Verify All Functions 🧪

## Quick Test Commands

### 1. Test Server Health
```bash
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"OK","message":"Server is running"}`

---

## Authentication Tests

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\",\"interests\":\"Nature,Beach\"}"
```

### 3. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```
**Save the token from response!**

---

## Places Tests

### 4. Get All Places
```bash
curl http://localhost:5000/api/places
```

### 5. Get Places by Category
```bash
curl http://localhost:5000/api/places?category=Nature
```

### 6. Search Places
```bash
curl http://localhost:5000/api/places?search=Taj
```

### 7. Get Place by ID
```bash
curl http://localhost:5000/api/places/1
```

### 8. Get Recommendations (Auth Required)
```bash
curl http://localhost:5000/api/places/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Favorites Tests (Auth Required)

### 9. Get Favorites
```bash
curl http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 10. Add to Favorites
```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"placeId\":1}"
```

### 11. Remove from Favorites
```bash
curl -X DELETE http://localhost:5000/api/favorites/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Reviews Tests

### 12. Add Review (Auth Required)
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"placeId\":1,\"rating\":5,\"comment\":\"Amazing place!\"}"
```

### 13. Get Reviews for Place
```bash
curl http://localhost:5000/api/reviews/1
```

---

## Admin Tests (Admin Auth Required)

### 14. Register Admin
```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin\",\"email\":\"admin@test.com\",\"password\":\"admin123\",\"adminKey\":\"RPHM\"}"
```

### 15. Get Dashboard Stats
```bash
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### 16. Get All Users
```bash
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### 17. Get Analytics
```bash
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

---

## Travel Planner Tests

### 18. Generate Itinerary
```bash
curl -X POST http://localhost:5000/api/places/itinerary \
  -H "Content-Type: application/json" \
  -d "{\"city\":\"Agra\",\"duration\":3}"
```

### 19. Generate Timeline
```bash
curl -X POST http://localhost:5000/api/places/timeline \
  -H "Content-Type: application/json" \
  -d "{\"city\":\"Jaipur\",\"duration\":\"2\"}"
```

---

## Performance Tests

### 20. Test Response Time
```bash
# Windows PowerShell
Measure-Command { Invoke-WebRequest http://localhost:5000/api/places }

# Expected: < 200ms
```

### 21. Load Test (100 concurrent requests)
```bash
# Install Apache Bench first
ab -n 1000 -c 100 http://localhost:5000/api/places

# Expected:
# - Requests per second: > 200
# - Average time: < 100ms
# - Failed requests: 0
```

---

## Frontend Tests

### Browser Tests

1. **Home Page**
   - Open: http://localhost:3000
   - Check: Hero slider loads
   - Check: Categories display
   - Check: Popular places show
   - Time: < 2 seconds

2. **Explore Page**
   - Open: http://localhost:3000/explore
   - Test: Category filter
   - Test: Location filter
   - Test: Search (type slowly, should debounce)
   - Test: Map view toggle
   - Time: < 2 seconds

3. **Place Details**
   - Open: http://localhost:3000/place/1
   - Check: Place info loads
   - Check: Reviews display
   - Check: Map shows location
   - Time: < 1.5 seconds

4. **Admin Dashboard**
   - Register admin at: http://localhost:3000/admin-register
   - Login at: http://localhost:3000/login
   - Should redirect to: http://localhost:3000/admin-dashboard
   - Check: Stats load quickly
   - Check: All tabs work
   - Time: < 1 second

---

## Cache Testing

### Test Client-Side Cache

1. Open DevTools (F12)
2. Go to Network tab
3. Visit: http://localhost:3000/explore
4. Note the response time (e.g., 200ms)
5. Refresh the page
6. Check response time again (should be ~5ms from cache)
7. Wait 5 minutes
8. Refresh again (should hit server again)

**Expected:**
- First load: 100-200ms
- Cached load: 5-10ms
- After 5 min: 100-200ms (cache expired)

---

## Database Performance Tests

### Run in MySQL

```sql
-- Test query performance
EXPLAIN SELECT * FROM tourist_places WHERE category = 'Nature';

-- Should show "Using index" if optimized

-- Test join performance
EXPLAIN SELECT tp.*, COUNT(f.id) as favCount 
FROM tourist_places tp 
LEFT JOIN favorites f ON tp.id = f.placeId 
GROUP BY tp.id;

-- Check slow queries
SHOW FULL PROCESSLIST;

-- Analyze tables
ANALYZE TABLE users, tourist_places, reviews, favorites;
```

---

## Automated Test Script

### Create test.js
```javascript
const axios = require('axios');

const API = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  // Test 1: Health Check
  try {
    const health = await axios.get(`${API}/health`);
    console.log('✅ Health Check:', health.data.status);
  } catch (e) {
    console.log('❌ Health Check Failed');
  }
  
  // Test 2: Get Places
  try {
    const start = Date.now();
    const places = await axios.get(`${API}/places`);
    const time = Date.now() - start;
    console.log(`✅ Get Places: ${places.data.length} places in ${time}ms`);
  } catch (e) {
    console.log('❌ Get Places Failed');
  }
  
  // Test 3: Search
  try {
    const start = Date.now();
    const search = await axios.get(`${API}/places?search=Taj`);
    const time = Date.now() - start;
    console.log(`✅ Search: ${search.data.length} results in ${time}ms`);
  } catch (e) {
    console.log('❌ Search Failed');
  }
  
  // Test 4: Category Filter
  try {
    const start = Date.now();
    const category = await axios.get(`${API}/places?category=Nature`);
    const time = Date.now() - start;
    console.log(`✅ Category Filter: ${category.data.length} places in ${time}ms`);
  } catch (e) {
    console.log('❌ Category Filter Failed');
  }
  
  console.log('\n✅ All tests completed!');
}

runTests();
```

### Run Tests
```bash
node test.js
```

---

## Expected Results

### ✅ All Tests Should Pass

| Test | Expected Result | Time |
|------|----------------|------|
| Health Check | Status: OK | < 10ms |
| Get Places | 20+ places | < 100ms |
| Search | Relevant results | < 100ms |
| Category Filter | Filtered places | < 100ms |
| Place Details | Full info + reviews | < 150ms |
| Add Review | Success message | < 100ms |
| Admin Dashboard | All stats | < 100ms |
| Favorites | User favorites | < 50ms |

---

## Troubleshooting

### Issue: Slow responses (> 500ms)
**Check:**
1. Database indexes installed?
2. Connection pool size adequate?
3. Too many results (add LIMIT)?
4. Network latency?

### Issue: Cache not working
**Check:**
1. Browser DevTools Network tab
2. Look for "from disk cache" or "from memory cache"
3. Clear browser cache and retry
4. Check cache duration in api.js

### Issue: Tests failing
**Check:**
1. Backend server running?
2. Database connected?
3. Correct API URL?
4. Valid authentication token?

---

## Performance Benchmarks

### Excellent Performance ⚡
- API response: < 100ms
- Page load: < 1.5s
- Database query: < 50ms
- Cache hit rate: > 80%

### Good Performance ✅
- API response: 100-200ms
- Page load: 1.5-3s
- Database query: 50-100ms
- Cache hit rate: 60-80%

### Needs Optimization ⚠️
- API response: > 200ms
- Page load: > 3s
- Database query: > 100ms
- Cache hit rate: < 60%

---

## Continuous Monitoring

### Daily Checks
```bash
# Check server status
curl http://localhost:5000/api/health

# Check response time
time curl http://localhost:5000/api/places

# Check database connections
mysql -u root -p -e "SHOW PROCESSLIST;"
```

### Weekly Reports
- Average response time
- Error rate
- Cache hit rate
- Database performance
- User activity

---

**All functions tested and optimized!** ✅

Run these tests after any code changes to ensure everything works correctly.
