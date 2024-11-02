import { neon } from '@neondatabase/serverless';


export async function POST(request: Request){
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { name, email, clerkId } = await request.json();
        
        if(!name || !email || !clerkId){
            return Response.json({ error: "Missing required fields"}, { status: 404 })
        }

        const response = await sql`
            INSERT INTO users (
            name,
            email,
            clerk_id
            )
            VALUES (
            ${name},
            ${email},
            ${clerkId}
            )
            ON CONFLICT (clerk_id)
            DO UPDATE SET name = ${name}, email = ${email}
            `
        return new Response(JSON.stringify({ data: response }), { status: 201 })

    } catch (error) {
        console.log(error)
        return Response.json({ error: error}, { status: 500 })
    }
}