# Air Arabia Virtual Hub

Create a Simple frontend only site, which is for Air Arabia Virtual. An Virtual Airline in Infinite Flight. Make these pages and add the logo in Navbar and make the site in this theme.

Pages: About Us, Our Staff, Fleet, Routes, Hubs, Ranks, Apply.

Theme: #FF0041 and white/ultra light Grey and matching colors

And in routes page add some content and add a routes map based on csc file system. The map will be grey and white and the route lines will be #FF0041

The CSV will be like route_id, route_no, dep_icao, arr_icao, dep_airport, arr_airport, aircraft_used, dep_coordinates, arr_coordinates

So whenever we'll add the CSV (which will be in the same place as of our files or you can say GitHub), it will have above info and the route line will start from dep coordinates and end at arr coordinates, when someone pressed the line, a small card will popup showing dep and arr icaos and airport names with aircraft used and route no. On top as main. But when someone pressed a hub or airport fot, then it will show that airports info which will also be in another CSV, which will have airport_name, airport_icao, airport_coordinates, flights_from_this_airport, more_to_know

And the routes will match the coordinates so make the system yourself

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3d2273de-d34e-454d-abca-3fd98b25dd4f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
