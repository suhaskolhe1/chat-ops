import jwt from 'jsonwebtoken';

export const generateToken = (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    return res.json({ token });
  } catch (err) {
    next(err);
  }
};
