DROP FUNCTION IF EXISTS rateify.add_track(
  album_id INTEGER,
  song_name VARCHAR(512)
);
CREATE FUNCTION rateify.add_track(
  album_id INTEGER,
  song_name VARCHAR(512)
) RETURNS TABLE(
  new_id INTEGER,
  new_name VARCHAR(512)
) AS
$$
BEGIN
  RETURN QUERY
  INSERT INTO rateify.track AS tr (name, track_number, disc_number, album_id)
  VALUES (
    $2,
    (SELECT
       CASE
        WHEN max(tr.track_number) IS NOT NULL THEN max(tr.track_number) + 1
        ELSE 1
       END
     FROM rateify.track tr
     WHERE tr.album_id = $1),
    1,
    $1
  )
  RETURNING
    tr.id,
    tr.name;
END;
$$
LANGUAGE 'plpgsql' VOLATILE ;