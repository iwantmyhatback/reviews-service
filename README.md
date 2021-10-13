# Reviews Module Service

### Summary
Redesign of an existing Server API Service to store and respond to requests for product review data and reviews of that products characteristics. The service also tracks review meta-data such as 'Helpfulness' rating and 'Reported' status and displays reviews based on helpfulness, date, or relevance (exempting all reported reviews).

### Migration
Data was extracted from existing SQL database into 4 CSV files each representing a table from the existing database, a custom [ETL process](https://en.wikipedia.org/wiki/Extract,_transform,_load) was then designed using Javascript and Postgres on a local machine to insert data into the new database format. That process can be found here: [Reviews ETL](https://github.com/iwantmyhatback/sdc_etl). The data was then [pg_dump](https://www.postgresql.org/docs/12/app-pgdump.html)'ed from Postgres local and uploaded to the database server(s) using [psql](http://postgresguide.com/utilities/psql.html)

### Breakdown of Redesign
This service needed to be redesigned due to poor database management (Large amount of data redundancy) and inability to handle current web traffic at high loads. Redesign entailed implmenting a [nginx load balancer](https://nginx.org/en/docs/http/load_balancing.html) to distribute traffic in a [least connected](https://nginx.org/en/docs/http/load_balancing.html#nginx_load_balancing_methods) method to multiple servers (tested on up to 6). The API was redesigned to use [ExpressJS](https://expressjs.com/) to provide RESTful routing of HTTP requests, as well as serving and manipulating data queried from the database/cache. 

Data is stored in [Postgres](https://www.postgresql.org/) database server(s) making use of the JSON format to store characteristic reviews of products which decreased the size of the original database by roughly 18%. Database replication using a [Warm-Standby](https://www.postgresql.org/docs/9.1/warm-standby.html) provides data redundancy and performance reliability should the main server fail. 

The Database is supported under high load by individual [Redis Caches](https://redis.io/) on each implemented API server which have been tested with caching up to 2 minutes on low-memory server instances (1GB) and 5 minutes on servers with higher memory levels (16GB). Ultimately These changes were able to raise the maximum load to nearly 400% of the original maximum possible responses below 2000ms

### Deployment
All parts of the redesign were developed using [Docker](https://www.docker.com/) to make deployment and scaling up fast and painless, this also enables the use of server side shell scripting to deploy to and update instances from DockerHub (manually or scheduled) quickly and easily

### Visualization

![achitechture](https://github.com/iwantmyhatback/reviews-service/blob/master/planning/architecture.png)
