DROP FUNCTION IF EXISTS rateify.add_album(
  artist_id INTEGER,
  album_name VARCHAR(512),
  release_date DATE,
  album_type VARCHAR(256)
);
CREATE FUNCTION rateify.add_album(
  artist_id INTEGER,
  album_name VARCHAR(512),
  release_date DATE,
  album_type VARCHAR(256)
) RETURNS TABLE(
  new_id INTEGER,
  new_name VARCHAR(512),
  new_release_date DATE,
  new_artist_name VARCHAR(512),
  new_album_type VARCHAR(256)
) AS
$$
BEGIN
  RETURN QUERY
  INSERT INTO rateify.album AS al (name, release_date, artist_id, album_type_id)
  VALUES (
    $2,
    $3,
    $1,
    (SELECT id FROM rateify.album_type alt WHERE alt.name ILIKE '%' || $4 || '%')
  )
  RETURNING
    al.id,
    al.name,
    al.release_date,
    (SELECT name FROM rateify.artist ar WHERE al.artist_id = ar.id),
    (SELECT name FROM rateify.album_type alt WHERE al.album_type_id = alt.id);
END;
$$
LANGUAGE 'plpgsql' VOLATILE ;