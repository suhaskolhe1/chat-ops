import db from '../config/db.js';

export const getRoomMessages = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const beforeCursor = req.query.before;
    const limit = parseInt(req.query.limit, 10) || 20;

    let result;
    if (beforeCursor) {
      result = await db.query(
        'SELECT id, room_id, sender_id, content, created_at FROM messages WHERE room_id = $1 AND created_at < $2 ORDER BY created_at DESC LIMIT $3',
        [roomId, beforeCursor, limit]
      );
    } else {
      result = await db.query(
        'SELECT id, room_id, sender_id, content, created_at FROM messages WHERE room_id = $1 ORDER BY created_at DESC LIMIT $2',
        [roomId, limit]
      );
    }
    
    return res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
