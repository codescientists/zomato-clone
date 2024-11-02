import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, { orderId }: Record<string, string>) {
    try {
        
        if (!orderId) {
            return new Response(JSON.stringify({ error: 'Order ID is required' }), { status: 400 });
        }

        const sql = neon(`${process.env.DATABASE_URL}`);
        const orderResponse = await sql`
            SELECT * FROM orders WHERE id = ${orderId}
        `;

        const itemsResponse = await sql`
            SELECT oi.*, fi.name AS item_name
            FROM order_items oi
            JOIN food_items fi ON oi.item_id = fi.id
            WHERE oi.order_id = ${orderId}
        `;

        return new Response(JSON.stringify({
            order: orderResponse[0],
            items: itemsResponse
        }), { status: 200 });

    } catch (error) {
        console.error('Error fetching order details:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
