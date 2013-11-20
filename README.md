##Peer 2 Peer Architecture Demo

This is a visually tool to demonstrate how load balancing to a peer 2 peer cluster can work.

To run the demo, 
```javascript

npm install

node server.js

```

Then from different terminals

```javascript

node worker --id 1
node worker --id 2
node worker --id 3
node worker --id 4
node worker --id 5

```

Send jobs with different levels of load and durations to the workers from the ui. The workers will report their load to each other. In the demo whenever a worker has an update it will post its view of the cluster to the ui server. 

The server gets requests for jobs, and picks a p2p worker at random and askes it for the lowest loaded server in the cluster.


It uses [https://github.com/tristanls/gossipmonger](https://github.com/tristanls/gossipmonger) by Tristan Slominski

