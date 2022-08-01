const jwt = require('jsonwebtoken');
//Vérifie que l'utilisateur est bien connecté et transmission des informations de connexion
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'kANBoWabMRL6zKR$lKwB=n1dK6pt&wZYki&TqrZD3WONwlMnhE@@O^0zEETt%gqfk3ssHW');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};