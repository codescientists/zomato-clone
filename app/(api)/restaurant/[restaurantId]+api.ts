import { neon } from '@neondatabase/serverless';

export async function GET(request: Request, { restaurantId }: Record<string, string>) {
    try {
        // Check if the restaurant ID is provided
        if (!restaurantId) {
            return new Response(JSON.stringify({ error: 'Restaurant ID is required' }), { status: 400 });
        }

        // Initialize the SQL connection using the environment variable for the database URL
        const sql = neon(`${process.env.DATABASE_URL}`);

        // Combine both queries into one using LEFT JOIN to fetch the restaurant and its food items
        const response = await sql`
            SELECT 
                r.id AS restaurant_id,
                r.name AS restaurant_name,
                r.address,
                r.city,
                r.state,
                r.postal_code,
                r.contact_number,
                r.email,
                r.cuisine_type,
                r.rating AS restaurant_rating,
                r.total_reviews AS restaurant_total_reviews,
                r.open_time,
                r.close_time,
                r.price_range,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', fi.id,
                            'name', fi.name,
                            'description', fi.description,
                            'price', fi.price,
                            'is_veg', fi.is_veg,
                            'is_available', fi.is_available,
                            'category', fi.category,
                            'rating', fi.rating,
                            'total_reviews', fi.total_reviews,
                            'image_url', fi.image_url
                        )
                    ) FILTER (WHERE fi.id IS NOT NULL), '[]'
                ) AS food_items
            FROM restaurants r
            LEFT JOIN food_items fi ON r.id = fi.restaurant_id
            WHERE r.id = ${restaurantId}
            GROUP BY r.id
        `;


        if (response.length === 0) {
            return new Response(JSON.stringify({ error: 'Restaurant not found' }), { status: 404 });
        }

        // Return the fetched restaurant and food items as JSON with status 200 (OK)
        return new Response(JSON.stringify({ data: response[0] }), { status: 200 });

    } catch (error) {
        // If any error occurs, log it and return a 500 error response
        console.error('Error fetching restaurant with food items by ID:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
