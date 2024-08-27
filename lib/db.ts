import { sql } from '@vercel/postgres';

export async function query(text: string, params: any[] = []) {
  try {
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function createTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subdomain VARCHAR(63) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS stars (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        skills TEXT[],
        availability_status VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS star_projects (
        id SERIAL PRIMARY KEY,
        star_id INTEGER REFERENCES stars(id),
        project_id INTEGER REFERENCES projects(id),
        role VARCHAR(100),
        start_date DATE,
        end_date DATE,
        status VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

export async function insertSampleTenant() {
  try {
    await sql`
      INSERT INTO tenants (name, subdomain)
      VALUES ('Stellar Productions', 'stellar')
      ON CONFLICT (subdomain) DO NOTHING
    `;
    console.log('Sample tenant inserted successfully');
  } catch (error) {
    console.error('Error inserting sample tenant:', error);
    throw error;
  }
}