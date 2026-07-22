import { sql } from '../server/db.ts';

async function main() {
  const tables = ['products', 'orders', 'users', 'contact_messages', 'carts', 'wishlists'];

  for (const table of tables) {
    const columns = await sql.query(
      'select column_name from information_schema.columns where table_name = $1 order by ordinal_position',
      [table],
    ) as Array<{ column_name: string }>;
    const sampleRows = await sql.query(`select * from ${table} limit 5`) as Array<Record<string, unknown>>;

    console.log(`TABLE ${table}`);
    console.log('COLUMNS', columns.map((c) => c.column_name));
    console.log('ROWS', JSON.stringify(sampleRows, null, 2));
    console.log('');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
