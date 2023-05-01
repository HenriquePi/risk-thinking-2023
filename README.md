# ASSESSMENT README

## Sources
  - syntax to allow importing CSV files
    - https://dev.to/mahdi_falamarzi/how-to-read-csv-file-in-typescript-react-app-106h
  - use client error
    - https://nextjs.org/docs/messages/react-client-hook-in-server-component

## additional packages
  - papaparse
    - handle CSV import
  - csv-loader, dsv-loader
    - handle loading CSV
  - Axios
    - handle requests. friendlier API than vanilla fetch, handle errors, etc.
  - @react-google-maps/api
    - https://www.npmjs.com/package/@react-google-maps/api
  - react-data-table-component
    - data table component
  - d3
    - chart library
  

## API
  - /api/riskdata
    - get endpoint for fetching the data, intermediate layer to prep for fetching this data from an external source

## Notes
  -  Not a fan of having the CSV in the public directory. unable to find a straight forward alternative at this time
    - on a team i would consult peers/lead
    - if there was a roadmap to fetch data from an external source, and having the CSV in public is for test/building purposes, then i would disregard this concern
  - set up data aggregation due to entries with the same location/business category/asset name/ year
  - avoided data processing (e.g taking averages to better symbolize risk rating for given location across business categories and assets with a single line) because of risk of data distortion. would need to communicate concerns with data science team before proceeding.
  - would add more checks and controls to make data visualization more intuitive
    - make selectable filters restricted to options that connect with available data
    - add a reset button 
  - could have used tailwind classes, but for speed this was ignored. for more thorough view of my capabilities and considerations in this area you can review [My Summer Starter](https://github.com/HenriquePi/summer-starter)
    - the readme me contains my base considerations and methodology for organizing projects. this starter is not intended for scale or SaSS.
  - for creating websites from designs designs you can review the following sites which i programmed solo or as the primary UI developer. Repositories are private.
    - [Unlyst.com crowd valuation platform](https://www.unlyst.com/) : NextJS + Tailwind
    - [Strain NFT](https://www.strainnft.io/) : NextJS + SCSS; Currently the full site is not live. just the landing page while Cryptocurrency related auditing is in progress
    - [Life Without a Doctor](https://lifewithoutadoctor.ca/) : GatsbyJS + SCSS
    - this list was valid as of 2023-05-1
  - as of 2023-05-1 Task 4 is not complete as per my standards.
   -  I have invested more than 500% of the time i would usually put in to an assessment, i did so because of my keen interest in this specific position and my interest in both the mission and the nature of work that RiskThinking.AI provides. but having invested a considerable amount of time into this assessment, i had to start prioritizing my other efforts.



## Tasks

### Problem 1: Implement a Map with Location Markers and Risk Indicators
  1. ✔️ Install 
  2. ✔️ Load and parse the sample datasets.
  3. ✔️ Integrate a mapping library (e.g., Mapbox, Leaflet, Google Maps).
  4. ✔️ Implement a control for users to select different decades.
  5. ✔️ Display the locations (Lat, Long) from the dataset as markers on the map of a given decade year.
  6. ✔️ Color-code the markers based on their Risk Rating (climate risk score) derived from the dataset.
  7. ✔️ Add interactivity to the map, such as zooming and panning, and display a tooltip with the Asset Name and Business Category on marker hover.
    - added onclick, view info
### Problem 2: Create a Data Table with Sorting and Filtering Capabilities

  1. ✔️ Create a data table component.
  2. ✔️ Load and display the sample dataset with a given year selection (from Problem 1) in the table.
  3. ✔️ Implement sorting functionality on reasonable columns.
  4. ✔️ Implement filter functionality on reasonable columns, especially risk factors.

### Problem 3: Visualize Risk Over Time with Line Graphs

  1. ✔️ Set up a charting library (e.g., Chart.js, D3.js, Highcharts).
  2. ✔️ Implement a line graph component that displays the Risk Rating over time (Year) for a selected location (Lat, Long), Asset, or Business Category.
  3. ✔️ Add interactivity to the graph, such as tooltips displaying Asset Name, Risk Rating, Risk Factors, and Year.
  4. ✔️ Implement controls for selecting different locations, Assets, or Business Categories to visualize their risk levels over time.
      -  ✔️ You may need to perform some data aggregation in order to achieve this.

### Problem 4: Integrate Components and Optimize Performance

  1. ✔️ Design a user interface that integrates the map, data table, and line graph components.
  2. Implement state management to handle user interactions and data flow between components (e.g., selecting a location on the map updates the line graph and data table).
  3. ✔️ Optimize the app's performance by implementing lazy loading for components and efficient data handling, such as pagination for the data table.
  4. (Bonus) Implement reasonable tests for utility functions, data flow hooks, and React components.



# NEXT.js README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[http://localhost:3000/api/hello](http://localhost:3000/api/hello) is an endpoint that uses [Route Handlers](https://beta.nextjs.org/docs/routing/route-handlers). This endpoint can be edited in `app/api/hello/route.ts`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
