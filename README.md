# Michelin and LaFourchette service merging

The project uses Node.js to scrap the michelin website, looking for french starred restaurants. Searches their corresponding LaFourchette promotions live and is used through a Node.js / MongoDB / Express / Nunjucks website.

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

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
