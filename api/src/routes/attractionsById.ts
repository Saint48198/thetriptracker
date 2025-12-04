import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

const getAttractionById = (id: string) => {
  return db
    .prepare(
      `SELECT attractions.id,
              attractions.name,
              attractions.is_unesco,
              attractions.is_national_park,
              attractions.lat,
              attractions.lng,
              attractions.last_visited,
              attractions.wiki_term,
              countries.id as country_id
       FROM attractions
       JOIN countries ON attractions.country_id = countries.id
       WHERE attractions.id = ?`
    )
    .get(id);
};

// GET /api/attractions/:id
router.get('/api/attractions/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  try {
    const attraction = getAttractionById(id);

    if (!attraction) {
      return res.status(404).json({ error: 'Attraction not found.' });
    }

    return res.status(200).json(attraction);
  } catch (error) {
    console.error('Failed to fetch attraction:', error);
    return res.status(500).json({ error: 'Failed to fetch attraction.' });
  }
});

// PUT /api/attractions/:id
router.put('/api/attractions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    country_id,
    is_unesco,
    is_national_park,
    lat,
    lng,
    last_visited,
    wiki_term,
  } = req.body;

  if (!name || !country_id || !lat || !lng) {
    return res.status(400).json({
      error: 'Name, country_id, latitude, and longitude are required.',
    });
  }

  try {
    const stmt = db.prepare(
      `UPDATE attractions
       SET name = ?, 
           country_id = ?, 
           is_unesco = ?, 
           is_national_park = ?, 
           lat = ?, 
           lng = ?, 
           last_visited = ?, 
           wiki_term = ?
       WHERE id = ?`
    );

    const result = stmt.run(
      name,
      Number(country_id),
      is_unesco ? 1 : 0,
      is_national_park ? 1 : 0,
      parseFloat(lat),
      parseFloat(lng),
      last_visited || null,
      wiki_term,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Attraction not found.' });
    }

    return res
      .status(200)
      .json({ message: 'Attraction updated successfully.' });
  } catch (error) {
    console.error('Failed to update attraction:', error);
    return res.status(500).json({ error: 'Failed to update attraction.' });
  }
});

// DELETE /api/attractions/:id
router.delete('/api/attractions/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare(`DELETE FROM attractions WHERE id = ?`);
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Attraction not found.' });
    }

    return res
      .status(200)
      .json({ message: 'Attraction deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete attraction:', error);
    return res.status(500).json({ error: 'Failed to delete attraction.' });
  }
});

export default router;
