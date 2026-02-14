-- Check if tourist_places table has data
SELECT COUNT(*) as total_places FROM tourist_places;

-- Check if imageUrl column exists
DESCRIBE tourist_places;

-- View sample data to see if images are present
SELECT id, name, imageUrl FROM tourist_places LIMIT 5;

-- If no data exists, run this to insert sample places with images:
INSERT INTO tourist_places (name, description, category, location, rating, imageUrl, latitude, longitude) VALUES
('Taj Mahal', 'Iconic white marble mausoleum, symbol of love', 'Heritage', 'Agra, Uttar Pradesh', 4.8, 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', 27.1751, 78.0421),
('Goa Beaches', 'Beautiful beaches with water sports and nightlife', 'Beach', 'Goa', 4.6, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', 15.2993, 74.1240),
('Manali', 'Scenic hill station with adventure activities', 'Adventure', 'Himachal Pradesh', 4.7, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 32.2396, 77.1887),
('Golden Temple', 'Sacred Sikh shrine with stunning architecture', 'Temple', 'Amritsar, Punjab', 4.9, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800', 31.6200, 74.8765),
('Kerala Backwaters', 'Serene network of lagoons and lakes', 'Nature', 'Kerala', 4.7, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', 9.4981, 76.3388),
('Jaipur City Palace', 'Royal palace with museums and courtyards', 'Heritage', 'Jaipur, Rajasthan', 4.5, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', 26.9258, 75.8237),
('Rishikesh', 'Yoga capital with river rafting and temples', 'Adventure', 'Uttarakhand', 4.6, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 30.0869, 78.2676),
('Mumbai Street Food', 'Famous for vada pav, pav bhaji, and more', 'Food', 'Mumbai, Maharashtra', 4.4, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 19.0760, 72.8777),
('Varanasi Ghats', 'Ancient spiritual city on Ganges river', 'Temple', 'Varanasi, Uttar Pradesh', 4.7, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', 25.3176, 82.9739),
('Andaman Islands', 'Pristine beaches and coral reefs', 'Beach', 'Andaman and Nicobar', 4.8, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 11.7401, 92.6586),
('Valley of Flowers', 'UNESCO site with alpine flowers', 'Nature', 'Uttarakhand', 4.9, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 30.7268, 79.6005),
('Mysore Palace', 'Indo-Saracenic palace with grand architecture', 'Heritage', 'Mysore, Karnataka', 4.6, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', 12.3051, 76.6551);
