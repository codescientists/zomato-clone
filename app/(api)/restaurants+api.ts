import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
    try {
        // Initialize the SQL connection using the environment variable for the database URL
        const sql = neon(`${process.env.DATABASE_URL}`);

        // Fetch all restaurants from the database
        const response = await sql`
            SELECT * FROM restaurants
        `;

        // Return the fetched restaurants as JSON with status 200 (OK)
        return new Response(JSON.stringify({ data: response }), { status: 200 });

    } catch (error) {
        // If any error occurs, log it and return a 500 error response
        console.error('Error fetching restaurants:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
