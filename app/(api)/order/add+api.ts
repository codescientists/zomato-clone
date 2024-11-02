import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { orderId, itemId, quantity, price } = await request.json();

        if (!orderId || !itemId || !quantity || !price) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Insert the item and update the total order price
        const [insertItemResult, updateOrderResult] = await Promise.all([
            sql`
                INSERT INTO order_items (
                    order_id,
                    food_item_id,
                    quantity,
                    price
                )
                VALUES (
                    ${orderId},
                    ${itemId},
                    ${quantity},
                    ${price}
                )
                RETURNING *;
            `,
            sql`
                UPDATE orders
                SET order_total = order_total + (${quantity}::numeric * ${price}::numeric)
                WHERE id = ${orderId}
                RETURNING *;
            `
        ]);

        // Response indicating success with the updated order details
        return new Response(JSON.stringify({
            message: 'Item added to order',
            orderItem: insertItemResult[0],
            updatedOrder: updateOrderResult[0]
        }), { status: 201 });

    } catch (error) {
        console.error('Error adding item to order:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
