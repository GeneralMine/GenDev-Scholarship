# GenDev-Scholarship
My solution for the Check24 GenDev-Scholarship.<br/>
Personal Challenge: Complete it within 48h.<br/>
Currently needed only 10h! (passive Database feeding/seeding not counted)

## The Challenge
Build a holiday booking plattform for flights and hotels like [urlaub.check24.de](https://urlaub.check24.de).

For more details refer to [GenDev Scholarship](https://check24.de/gen-dev)

## The Solution
![image](https://user-images.githubusercontent.com/33132009/202933289-612f707c-5204-439e-8523-8917d713304a.png)

## Setup
### Database
1. Move dataset (`hotels.csv`, `offers.csv`) into `seedData` folder
2. Copy `hotels.csv` to `hotelsFeeded.csv`
3. Go to scripts `cd scripts`
4. Install packages `npm i`
5. Execute feeding of hotels dataset `node feed_hotels`
   > This will feed the hotels dataset with geographic data (country, city, ...). Feeding takes up to 1h, due to the limitations of the api used. It can be aborted and continued anytime. It stores the progress.
6. Go back to main directory `cd ..`
7. Enter your database setup into `.env`
8. Start your database
   > Using Docker: `docker-compose up dbms -d` <br/>
9. Go to backend `cd backend`
10. Install packages `npm i`
11. After the dbms is online, push the database schema `npx prisma db push`
12. Seed the database `npx prisma db seed`
   > Optionally command line tools can be used beforehand to slice the offers table into a smaller dataset, because seeding the database takes up to 24h.
13. Check if the seeding added the correct count of database entries!


### Docker Setup
After completing the Database Setup simply run docker-compose `docker-compose up` <br/>
Or `docker-compose -d` for detatched mode

### Development Setup
Refer to the README of [Backend](/backend/README.md) and [Frontend](/frontend/README.md)
