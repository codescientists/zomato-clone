import { neon } from '@neondatabase/serverless';

export async function PUT(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { orderId, userEmail, restaurantId, orderStatus } = await request.json();

        // Validate required fields
        if (!orderId || !userEmail || !restaurantId) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Update the order
        const updateOrder = await sql`
            UPDATE orders
            SET 
                order_status = ${orderStatus || 'Pending'}
            WHERE 
                id = ${orderId}
                AND user_email = ${userEmail}
                AND restaurant_id = ${restaurantId}
            RETURNING *;
        `;

        if (updateOrder.length === 0) {
            return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ data: updateOrder[0] }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
