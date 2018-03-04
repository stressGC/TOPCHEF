var Restaurant = require("./../models/Restaurant");

const FOURCHETTE_BASE_PAGE = "https://www.lafourchette.com/restaurant/ /";

var restaurant =  (req, response) => {
	Restaurant.findOne({"name" : req.params.name}, (err, result) => {
		if(err) {
			response.render(
					"error.html",
					{
						error : "Erreur interne lors de la requête à la base de donnée."
					});
		} else {
			if(!result){
				response.render(
					"error.html",
					{
						erreur : "Aucun restaurant n'a été trouvé."
					});
			} else {

				if(result.address.number === -1){
					result.address.number = null;
				}

				console.log(result);
				response.render(
					"restaurants/restaurant.html", 
					{
						restaurant : result,
						reservationUrl : FOURCHETTE_BASE_PAGE + result.fourchetteID
					});
			}

		}

	})

};

module.exports = {restaurant : restaurant};