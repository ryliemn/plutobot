CREATE OR REPLACE FUNCTION rateify.find_album(
  query VARCHAR(512)
) RETURNS TABLE(
  id INTEGER,
  release_year DOUBLE PRECISION,
  artist_name VARCHAR(512),
  album_name VARCHAR(512)
) AS
$$
BEGIN
  RETURN QUERY
    SELECT
      al.id   id,
      date_part('year', al.release_date) release_year,
      ar.name artist_name,
      al.name album_name
    FROM
      rateify.album al
      JOIN rateify.artist ar ON al.artist_id = ar.id
    WHERE
      al.name ILIKE '%' || $1 || '%'
    ORDER BY
      ar.name;
END;
$$
LANGUAGE 'plpgsql' IMMUTABLE;