DROP FUNCTION IF EXISTS rateify.find_album(VARCHAR(512));
CREATE FUNCTION rateify.find_album(
  query VARCHAR(512)
) RETURNS TABLE(
  id INTEGER,
  release_year DOUBLE PRECISION,
  artist_name VARCHAR(512),
  album_name VARCHAR(512),
  rating NUMERIC
) AS
$$
BEGIN
  RETURN QUERY
    SELECT
      al.id   id,
      date_part('year', al.release_date) release_year,
      ar.name artist_name,
      al.name album_name,
      (
        SELECT
          round(avg(tr.rating), 1)
        FROM
          rateify.track tr
        WHERE
          tr.album_id = al.id
          AND tr.is_filler = FALSE
      ) rating
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