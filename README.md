# Michelin and LaFourchette service merging

The project uses Node.js to scrap the michelin website, looking for french starred restaurants. Searches their corresponding LaFourchette promotions live and is used through a Node.js / MongoDB / Express / Nunjucks website.

Restaurants can be searched by name and sorted by alphabetical order / price order / number of stars.

The Website is responsive.

![alt text](https://raw.githubusercontent.com/stressGC/TOPCHEF/master/img/screen1.PNG)
![alt text](https://raw.githubusercontent.com/stressGC/TOPCHEF/master/img/screen2.PNG)
![alt text](https://raw.githubusercontent.com/stressGC/TOPCHEF/master/img/screen3.PNG)
![alt text](https://raw.githubusercontent.com/stressGC/TOPCHEF/master/img/screen4.PNG)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

What things you need to use the project

```
Node.js
```
```
MongoDB
```

### Installing

A step by step series of examples that tell you have to get a development environment running

1) Fork or download the project via `github`

2) Launch MongoDB
```
cd path/to/MongoDB
mongod
```

3) Launch the scrapping script

```
node path/to/project/scrap.js
```

4) Once finished, the restaurants are fetched in the database. Launch the website

```
node path/to/project/app.js
```

5) Enjoy !

## Built With

* [Node.js](https://nodejs.org/en/) - Open source server framework
* [Express](http://expressjs.com/) - Web application framework
* [MongoDB](https://www.mongodb.com/) - Styling and Client-side JavaScript
* [Nunjucks](https://mozilla.github.io/nunjucks/) - Templating Engine
* [Bootstrap](https://rometools.github.io/rome/) - Styling and Client-side JavaScript


## Authors

* **Georges Cosson**  - [StressGC](https://github.com/StressGC)


## License

This project is licensed under the MIT License.
