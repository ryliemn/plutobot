DROP VIEW IF EXISTS rateify.top_10_albums;
CREATE VIEW rateify.top_10_albums
AS
SELECT
  ar.name artist_name,
  al.name album_name,
  al.release_date release_date,
  (
    SELECT
      round(CASE WHEN avg(tr.rating) IS NOT NULL THEN avg(tr.rating) ELSE 0 END, 1)
    FROM
      rateify.track tr
    WHERE
      tr.album_id = al.id
      AND tr.is_filler = FALSE
      AND tr.rating IS NOT NULL
  ) rating
FROM
  rateify.album al
  JOIN rateify.artist ar ON al.artist_id = ar.id
ORDER BY
  rating DESC
LIMIT 10;