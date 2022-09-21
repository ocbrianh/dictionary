# Vinoshipper Interview Project
This repository has a simple dictionary application that allows you to search for terms, add definitions and see recent searches and newly added definitions.

The code is poorly structured and the application does not match the design.  The project goal is to improve the code structure, and update the layout to match the UX Designs in Figma. You are welcome to improve upon the design if you like.

You are free to use any frameworks or tools you choose, and feel free to reach out if you need help integrating them into the docker configuration.  

## UX Design Document
https://www.figma.com/file/Qvw2UjG68WEXPlSovCayn6/Dev-Test?node-id=0%3A1

## Running the project

### Requirements
You will need docker desktop installed to run the application

### Starting the application
```bash
 ./bin/composer install
 docker compose up
```

Once the application has started, it should be accessible via http://localhost:8080.  If you run into any issues getting to this point, please contact us as it is probably an issue on our side and we'll be happy to help out.

### Adding Dependencies with Composer
If you want to add additional composer dependencies, the easiest way is with the bundled composer docker image. Make your updates to composer.json and then run composer from the bin dir.

```bash
./bin/composer install
```

### Starting Over
If you need to wipe out the DB and clean everything up you can re-set everything with
```bash
docker compose down
rm -rf .tmp
rm -rf src/vendor
```