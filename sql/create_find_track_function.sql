CREATE OR REPLACE FUNCTION rateify.find_track(
  query VARCHAR(512)
) RETURNS TABLE(
  id INTEGER,
  track_name VARCHAR(512),
  artist_name VARCHAR(512),
  album_name VARCHAR(512),
  rating NUMERIC
) AS
$$
BEGIN
  RETURN QUERY
    SELECT
      tr.id   id,
      tr.name track_name,
      ar.name artist_name,
      al.name album_name,
      tr.rating rating
    FROM
      rateify.track tr
      JOIN rateify.album al ON tr.album_id = al.id
      JOIN rateify.artist ar ON al.artist_id = ar.id
    WHERE
      tr.name ILIKE '%' || $1 || '%'
    ORDER BY
      tr.name;
END;
$$
LANGUAGE 'plpgsql' IMMUTABLE;
