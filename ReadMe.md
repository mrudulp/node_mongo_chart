README.md

FAQ:
    * nodemon or express module found --
        Installation of nodemon and express module missing. Check dockerfile and use `npm install -g nodemon express`
    * docker does not build
        `docker-compose up --build`
    * docker does not rebuild image
        1. `docker-compose down`
        2. `docker-compose up --force-recreate`
    * Couldn't connect to Docker daemon at http+docker://localunixsocket - is it running? If it's at a non-standard location, specify the URL with the DOCKER_HOST environment variable.
        1. Ensure all linux installation steps from [here](https://docs.docker.com/engine/installation/linux/ubuntulinux/#/install) or (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-getting-started)
        2. [Install](https://docs.docker.com/compose/install/) Docker Compose
        3. Add your current user(eg: ubuntu here in the command) `sudo usermod -aG docker ubuntu` 

# References:
- http://www.fusioncharts.com/dev/using-with-server-side-languages/tutorials/creating-interactive-charts-using-node-express-and-mongodb.html
- https://medium.com/@sunnykay/docker-development-workflow-node-express-mongo-4bb3b1f7eb1e#.vy6eka7ju
- https://nodejs.org/en/docs/guides/nodejs-docker-webapp/