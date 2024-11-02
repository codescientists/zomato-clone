import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userEmail = url.searchParams.get('userEmail');

        if (!userEmail) {
            return new Response(JSON.stringify({ error: 'Missing user\'s email' }), { status: 400 });
        }

        const sql = neon(`${process.env.DATABASE_URL}`);

        // Fetch active (pending) order for the user at the specific restaurant
        const orders = await sql`
            SELECT * FROM orders
            WHERE user_email = ${userEmail}
            ORDER BY order_date DESC
        `;

        // if (orders.length === 0) {
        // }
        return new Response(JSON.stringify(orders), { status: 200 });


    } catch (error) {
        console.error('Error fetching active order:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
