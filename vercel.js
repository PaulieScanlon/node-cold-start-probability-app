require('dotenv').config();
const { getDB } = require('./pg');

let count = 1;
const max = 40;

// const interval = 10; // minutes
const interval = 7; // minutes
// const interval = 5; // minutes
// const interval = 2; // minutes

const endpoint = 'https://vercel-cold-start-probability-api.vercel.app/api/v1/create';
const runtime = 'vercel-serverless';

const run = async () => {
  const fn_start = performance.now();
  const client = await getDB().connect();
  const date = new Date();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        date: date,
        runtime: runtime,
      }),
    });

    if (!response.ok) {
      throw new Error('Bad create');
    }

    const json = await response.json();
    const fn_end = performance.now();

    const { id, db_start, db_end } = json.results;

    const fn_total = fn_end - fn_start;
    const db_total = db_end - db_start;

    const results = [
      {
        id: id,
        date: date,
        runtime: runtime,
        interval: interval,
        fn_start: fn_start,
        fn_end: fn_end,
        db_start: db_start,
        db_end: db_end,
        fn_total: `${(fn_total / 1000).toFixed(2)}seconds`,
        db_total: `${(db_total / 1000).toFixed(2)}seconds`,
      },
    ];

    console.table(results);

    await client.query(
      'UPDATE results SET id = $1, interval = $2, fn_start = $3, fn_end = $4, db_start = $5, db_end = $6, fn_total = $7, db_total = $8 WHERE id = $1',
      [id, interval, fn_start, fn_end, db_start, db_end, fn_total, db_total]
    );

    count++;
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};

// run();

const callEveryXMinutes = () => {
  setTimeout(() => {
    console.log('Run:', count);
    run();
    if (count < max) {
      callEveryXMinutes();
    } else {
      console.log('End:');
    }
  }, interval * 60 * 1000);
};

callEveryXMinutes();
