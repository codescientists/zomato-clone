import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userEmail = url.searchParams.get('userEmail');
        const restaurantId = url.searchParams.get('restaurantId'); 

        if (!userEmail || !restaurantId) {
            return new Response(JSON.stringify({ error: 'Missing userEmail or restaurantId' }), { status: 400 });
        }

        const sql = neon(`${process.env.DATABASE_URL}`);

        // Combined query to get active order and its items
        const result = await sql`
            SELECT 
                o.id AS order_id,
                o.order_number,
                o.user_name,
                o.order_total,
                o.order_status,
                o.order_date,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'item_id', oi.id,
                        'food_item_id', oi.food_item_id,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'item_name', fi.name,
                        'item_price', fi.price
                    )
                ) AS items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN food_items fi ON oi.food_item_id = fi.id
            WHERE o.user_email = ${userEmail}
            AND o.restaurant_id = ${restaurantId}
            AND o.order_status = 'Pending'
            GROUP BY o.id
        `;

        // Check if there’s an active order
        if (result.length === 0) {
            return new Response(JSON.stringify({ error: 'No active order found' }), { status: 404 });
        }

        // Return the active order with its items
        return new Response(JSON.stringify({order:result[0]}), { status: 200 });

    } catch (error) {
        console.error('Error fetching active order:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
