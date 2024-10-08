const User = require('../models/User');

const isTeamMember = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isTeamMember) {
      return res.status(403).json({ message: 'Access denied. Team members only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying team member status', error: error.message });
  }
};

module.exports = isTeamMember;