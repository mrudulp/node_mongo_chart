README.md

FAQ:
    * nodemon or express module found --
        Installation of nodemon and express module missing. Check dockerfile and use `npm install -g nodemon express`
    * docker does not build
        `docker-compose up --build`
    * docker does not rebuild image
        1. `docker-compose down`
        2. `docker-compose up --force-recreate`


# References:
- http://www.fusioncharts.com/dev/using-with-server-side-languages/tutorials/creating-interactive-charts-using-node-express-and-mongodb.html
- https://medium.com/@sunnykay/docker-development-workflow-node-express-mongo-4bb3b1f7eb1e#.vy6eka7ju
- https://nodejs.org/en/docs/guides/nodejs-docker-webapp/