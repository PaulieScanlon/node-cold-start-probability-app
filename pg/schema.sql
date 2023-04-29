CREATE TABLE results (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,         
  date        timestamptz,         
  runtime     VARCHAR,
  interval    INT,
  fn_start    DECIMAL,
  fn_end      DECIMAL,
  db_start    DECIMAL,
  db_end      DECIMAL,
  fn_total    DECIMAL,
  db_total    DECIMAL
);


DELETE FROM results WHERE id='befbda7b-de46-4a8d-a982-7f7fa6d52c17';

