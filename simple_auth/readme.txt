you need to install redis to use this program.
once installed go to the redis-cli and type :

hmset jack password "beanstalk" fullname "Jack Spratt"

this should return some info:
hgetall jack


to use the program (index.js) just do:

node index.js

then open up browser at localhost:8080

