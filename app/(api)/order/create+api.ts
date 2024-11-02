import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { restaurantId, userName, userEmail } = await request.json();

        if (!restaurantId || !userName) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Generate a unique order number (e.g., based on timestamp)
        const orderNumber = `ORD-${Date.now()}`;

        // Insert the new order into the orders table
        const response = await sql`
            INSERT INTO orders (
                restaurant_id,
                order_number,
                user_name,
                order_total,
                order_status,
                order_date,
                created_at,
                user_email
            )
            VALUES (
                ${restaurantId},
                ${orderNumber},
                ${userName},
                0,
                'Pending',
                NOW(),
                NOW(),
                ${userEmail}
            )
            RETURNING id
        `;

        return new Response(JSON.stringify({ orderId: response[0].id }), { status: 201 });

    } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}