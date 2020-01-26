# docker stop mongo
# docker rm mongo
# docker run --name MONGODB -p 27017:27017 -d mongo

# docker build -t survey:v0.1 .
# docker stop app
# docker rm app
# # docker run --name app -p 8011:3000 -h "local" -v //c//Users//Jaime//Documents//Node//node-api-rest-survey//api://app survey:v0.1 
# docker run --name app  -p 8011:3000 -h "local" --link MONGODB:MONGODB survey:v0.1 


# --------------------------------------------------------------------------------------------------------------------------------
docker-compose stop
# docker-compose up


docker container stop MONGODB
docker container rm MONGODB


docker container stop api
docker container rm api
docker rmi api_survey

docker container stop apptest
docker container rm apptest
docker rmi api_survey-test
docker rmi $(docker images -f "dangling=true" -q)


docker-compose up 