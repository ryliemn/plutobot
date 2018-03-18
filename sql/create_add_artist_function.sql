DROP FUNCTION IF EXISTS rateify.add_artist(VARCHAR(512));
CREATE FUNCTION rateify.add_artist(
  query VARCHAR(512)
) RETURNS TABLE(
  id INTEGER,
  name VARCHAR(512)
) AS
$$
BEGIN
  RETURN QUERY
  INSERT INTO rateify.artist AS ar (name)
  VALUES ($1)
  RETURNING ar.id, ar.name;
END;
$$
LANGUAGE 'plpgsql' VOLATILE ;