# Geolocker

### SkyDB Geolocker - a dApp for storing Spatio Temporal Asset Catalogs (https://stacspec.org) over Skynet, using Ceramic, IDX and The Graph

Note: The project builds in development mode with a 3id-connect warning, but fails in production: `Critical dependency: the request of a dependency is an expression`. We are already in discussion with the Ceramic team and the issue is being tracked [here](https://github.com/3box/3id-connect/issues/86)

### [Submission Video](https://www.youtube.com/watch?v=YZ0QWzr-mQk&feature=youtu.be)

### [Geolocker dApp over Skynet](https://siasky.net/LACxsA6d6wQVF7pOdJlljYCtvAV-E94XvmVLfSwFELqVXw) (did not build because of 3id-connect error)

### [Geolocker dApp over Netlify](https://geolocker.vaultlabs.org) (with CI=false in envinronmental variables so that build is possible)

### [Geolocker Subgraph for the registry Smart Contract](https://api.thegraph.com/subgraphs/name/vaultlabs/skydb-bounty-geo-browser)

## How to work with the dApp:

1. `yarn`
2. Create a .env file with the following variables:

- REACT_APP_GRAPHQL_HTTP_ENDPOINT=https://api.thegraph.com/subgraphs/name/vaultlabs/skydb-bounty-geo-browser
- REACT_APP_GRAPHQL_WS_ENDPOINT=wss://api.thegraph.com/subgraphs/name/vaultlabs/skydb-bounty-geo-browser
- REACT_APP_MapboxAccessToken= ADD A MAPBOX API KEY HERE, YOU CAN GET ONE BY REGISTERING AT https://www.mapbox.com/

3. Do `yarn start`. Connect with your metamask wallet to the Ropsten network. You should be able to authenticate with the dApp

4. Upload some test stac items. You can find some examples here:

- [planet.stac.cloud](https://planet.stac.cloud) ([catalog on GitHub](https://github.com/cholmes/pdd-stac/))
- [CBERS](https://cbers.stac.cloud) ([catalog tools on GitHub](https://github.com/fredliporace/cbers-2-stac))
- [Google Earth Engine](https://gee.stac.cloud)
- [sat-api.stac.cloud](https://sat-api.stac.cloud) ([sat-api on GitHub](https://github.com/sat-utils/sat-api))

If a specific STAC item throws an error when trying to register it, change its ID by opening the json file and saving it again. The dApp was built with the assumption that a single STAC item belongs to a single ethereum address.

---

## Introduction

Spatial data contains information relevant to locations in the physical world. Different locations have different rules - depending on where you are you have to abide to a different regulatory framework.

To create decentralized applications that leverage spatial data and location information, we need to be able to store and access spatial data in ways that ensure it is simple and reliable for Web3 developers to work with.

For the past 10 years, the go-to standard for storing, retrieving, processing, and analyzing geospatial data, has traditionally been with cloud service providers.

As a result, most of the tooling, workflows, specifications, and projects have been built to compliment the web2 space. The Spatio Temporal Asset Catalog(STAC) specification and the Cloud Optimized GeoTIFFs (COGs) are two of the leading specifications/standards used within the geospatial industry.

STAC is supported by an active community of developers, with involvement from a large range of organizations, including Radiant Earth Foundation, Microsoft, Google Earth Engine, Near Space Labs, L3Harris, etc. In addition, COGs are gaining widespread adoption from the likes of Raster Foundry, GDAL, Google Earth Engine, QGIS, and interoperability with Amazon S3.

The problem is that the aforementioned specification and file standard are only beneficial for the web2 ecosystem. They are optimized and designed to leverage cloud architecture, and location based addresses. When porting these to web3, we see that they become useless because they are not interoperable with CIDs and distributed file systems, as they do not offer web3 leveraged features.

In order to solve these problems, we decided to hack geospatial applications into the Skynet Ecosystem and ultimately the greater web3 ecosystem as well. We believe that SkyDB can be a leading distributed file system of geospatial data in the web3 ecosystem.

## GeoLocker

For the SkyDB hackathon we decided to create our alpha prototype of the GeoLocker. GeoLocker is a STAC (Spatio Temporal Asset Catalog) Explorer that utilizes SkyDB as a means of storage. The STAC Items are stored on SkyDB and can be pulled by the user to view on the front end. In addition we implemented IDX and Ceramic to give the user’s a more fine grained approach to utilizing their own geospatial data. This allows different user's to maintain many types of SkyDB instances all of which can have their own set of STAC Items.

## Future Iterations and Value

In further iterations, we hope to add more value to the Skynet and Ceramic Ecosystems, by furthering the development of our GeoDID specification. We hope to create the GeoDID specification as a web3 means to organize and utilize geo-spatial data. These GeoDIDs will contain several service endpoints that have web3 optimized geospatial data.
