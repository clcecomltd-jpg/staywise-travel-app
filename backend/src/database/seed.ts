import { query } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const seed = async (): Promise<void> => {
  try {
    logger.info('Starting database seeding...');

    // Check if data already exists
    const userCount = await query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) > 2) {
      logger.info('Database already seeded, skipping...');
      return;
    }

    // Insert sample recommendations
    const propertyResult = await query('SELECT id FROM properties LIMIT 1');
    if (propertyResult.rows.length === 0) {
      logger.warn('No properties found, skipping recommendation seeding');
      return;
    }

    const propertyId = propertyResult.rows[0].id;
    const hostResult = await query('SELECT id FROM users WHERE user_type = \'host\' LIMIT 1');
    const hostId = hostResult.rows[0].id;

    const sampleRecommendations = [
      {
        place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        title: 'South Beach',
        description: 'Famous beach with crystal clear waters and vibrant nightlife',
        category: 'nature',
        priority: 'high'
      },
      {
        place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        title: 'Versailles Restaurant',
        description: 'Authentic Cuban cuisine in the heart of Little Havana',
        category: 'food',
        priority: 'high'
      },
      {
        place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        title: 'Wynwood Walls',
        description: 'Outdoor museum showcasing large-scale murals by international artists',
        category: 'culture',
        priority: 'medium'
      },
      {
        place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        title: 'Bayside Marketplace',
        description: 'Waterfront shopping and dining complex with live entertainment',
        category: 'shopping',
        priority: 'medium'
      },
      {
        place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        title: 'Vizcaya Museum & Gardens',
        description: 'Historic estate with beautiful gardens and European-inspired architecture',
        category: 'culture',
        priority: 'high'
      }
    ];

    for (const rec of sampleRecommendations) {
      await query(`
        INSERT INTO recommendations (property_id, place_id, title, description, category, priority, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [propertyId, rec.place_id, rec.title, rec.description, rec.category, rec.priority, hostId]);
    }

    // Insert sample messages
    const guestResult = await query('SELECT id FROM users WHERE user_type = \'guest\' LIMIT 1');
    if (guestResult.rows.length > 0) {
      const guestId = guestResult.rows[0].id;

      const sampleMessages = [
        {
          message: "Welcome to Sunset Villa! I'm Maria, your host. Feel free to ask me anything about your stay. 😊",
          user_id: hostId
        },
        {
          message: "Hi Maria! Thank you for the warm welcome. The place looks amazing!",
          user_id: guestId
        },
        {
          message: "So glad you like it! Let me know if you need any assistance during your stay. I'm here to help! 🏡",
          user_id: hostId
        }
      ];

      for (const msg of sampleMessages) {
        await query(`
          INSERT INTO messages (property_id, user_id, message, message_type)
          VALUES ($1, $2, $3, 'text')
          ON CONFLICT DO NOTHING
        `, [propertyId, msg.user_id, msg.message]);
      }
    }

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}