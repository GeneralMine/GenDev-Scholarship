# GenDev-Scholarship
My solution for the Check24 GenDev-Scholarship.<br/>
Personal Challenge: Complete it within 48h.<br/>
Currently needed only 18h! (passive Database feeding/seeding not counted)

## The Challenge
Build a holiday booking plattform for flights and hotels like [urlaub.check24.de](https://urlaub.check24.de).

For more details refer to [GenDev Scholarship](https://check24.de/gen-dev)

## The Solution
![image](https://user-images.githubusercontent.com/33132009/202933289-612f707c-5204-439e-8523-8917d713304a.png)

### Features
- [x] fully setup Database
  - [x] fully seeded DBMS from csv (~72 million Mallorca offers, 2k distinct hotels)
  - [x] optimized data schema (e.g. replaced airport strings with ints by encoding into concatination of charcodes)
  - [x] optimized search querys
  - [x] hotel database feed with geographic data (city, street, ...)
- [x] Search for offers grouped by hotel
  - [x] using start and end date of stay, numbers of adults&children traveling, starting airport, destination airport
  - [x] semi fancy UI
  - [x] filter the list after star range, exact flight date and price range
  - [x] sort the list after price
  - [ ] add more sort options, star, offerCount
  - [ ] pagination
- [x] Show all offers of the aggregated hotel from previous search
  - [x] semi fancy UI
  - [ ] filter the list after roomtypes, oceanview and mealtype
  - [ ] sort the list after price range, roomtypes, oceanview and mealtype
  - [ ] pagination

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
