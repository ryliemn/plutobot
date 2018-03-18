DROP FUNCTION IF EXISTS rateify.find_artist(VARCHAR(512));
CREATE FUNCTION rateify.find_artist(
  query VARCHAR(512)
) RETURNS TABLE(
  id INTEGER,
  artist_name VARCHAR(512)
) AS
$$
BEGIN
  RETURN QUERY
    SELECT
      ar.id,
      ar.name
    FROM
      rateify.artist ar
    WHERE
      ar.name ILIKE '%' || $1 || '%'
    ORDER BY
      ar.name;
END;
$$
LANGUAGE 'plpgsql' IMMUTABLE;