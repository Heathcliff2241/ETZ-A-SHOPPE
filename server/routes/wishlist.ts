import { Router } from 'express';
import { sql } from '../db.js';

export const wishlistRouter = Router();

wishlistRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlistItem = await sql`SELECT id, user_id, product_id, date_added FROM etz_wishlists WHERE user_id = ${userId}` as Array<Record<string, unknown>>;
    res.json(wishlistItem);
  } catch (error) {
    console.error('[wishlistRouter] Error fetching wishlist items:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist items' });
  }
});

wishlistRouter.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const newWishlistItem = await sql`
      INSERT INTO etz_wishlists (user_id, product_id, date_added)
      VALUES (${userId}, ${productId}, ${new Date().toISOString()})
      ON CONFLICT (user_id, product_id) DO NOTHING
      RETURNING id, user_id, product_id, date_added
    `;
    res.status(201).json(newWishlistItem[0]);
  } catch (error) {
    console.error('[wishlistRouter] Error adding item to wishlist:', error);
    res.status(500).json({ message: 'Failed to add item to wishlist' });
  }
});

wishlistRouter.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const deletedItem = await sql`
      DELETE FROM etz_wishlists
      WHERE user_id = ${userId} AND product_id = ${productId}
      RETURNING id
    ` as Array<Record<string, unknown>>;
    if (deletedItem.length === 0) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error('[wishlistRouter] Error removing item from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove item from wishlist' });
  }
});
