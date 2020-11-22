# SkyDB_IDX_Project

### Skynet URL: 
https://siasky.net/LACxsA6d6wQVF7pOdJlljYCtvAV-E94XvmVLfSwFELqVXw

## Introduction
Spatial data contains information relevant to locations in the physical world. Different locations have different rules - depending on where you are you have to abide to a different regulatory framework.

To create decentralized applications that leverage spatial data and location information, we need to be able to store and access spatial data in ways that ensure it is simple and reliable for Web3 developers to work with. 

For the past 10 years, the go-to standard for storing, retrieving, processing, and analyzing geospatial data, has traditionally been with cloud service providers.

As a result, most of the tooling, workflows, specifications, and projects have been built to compliment the web2 space. The Spatio Temporal Asset Catalog(STAC) specification and the Cloud Optimized GeoTIFFs (COGs) are two of the leading specifications/standards used within the geospatial industry.

STAC is supported by an active community of developers, with involvement from a large range of organizations, including Radiant Earth Foundation, Microsoft, Google Earth Engine, Near Space Labs, L3Harris, etc. In addition, COGs are gaining widespread adoption from the likes of Raster Foundry, GDAL, Google Earth Engine, QGIS, and interoperability with Amazon S3.

The problem is that the aforementioned specification and file standard are only beneficial for the web2 ecosystem. They are optimized and designed to leverage cloud architecture, and location based addresses. When porting these to web3, we see that they become useless because they are not interoperable with CIDs and distributed file systems, as they do not offer web3 leveraged features.

In order to solve these problems, the Vault Labs team has been working to bring more geospatial applications to the Skynet Ecosystem and ultimately the greater web3 ecosystem as well. We believe that SkyDB can be a leading distributed file system of geospatial data in the web3 ecosystem.

## GeoLocker
For the SkyDB hackathon we decided to create our alpha prototype of the GeoLocker. GeoLocker is a STAC (Spatio Temporal Asset Catalog) Explorer that utilizes SkyDB as a means of storage. The STAC Items are stored on SkyDB and can be pulled by the user to view on the front end. In addition we implemented IDX and Ceramic  to give the user’s a more fine grained approach to utilizing their own geospatial data. This allows different user's to maintain many types of SkyDB instances all of which can have their own set of STAC Items. 

## Future Iterations and Value
In further iterations, we hope to add more value to the Skynet and Ceramic Ecosystems, by furthering the development of our GeoDID specification. We hope to create the GeoDID specification as a web3 means to organize and utilize geo-spatial data. These GeoDIDs will contain several service endpoints that have web3 optimized geospatial data. 

## SkyDB x IDX Hackathon 
For this bounty, we’re looking for someone to build a project that makes use of IDX as an identity protocol alongside SkyDB. To achieve this, during onboarding you can use the IDX SDK to import or create identities, add your user’s SkyDB instance for your application to their identity index, and query their index for their data stored throughout the Web3 ecosystem – on any other Web3 platform. Feel free to use IDX for additional in-app features such as user profiles, social graphs, or anything else you can imagine. IDX allows you to store this identity metadata natively in documents on the Ceramic network, where it can be consumed everywhere across the Web3 ecosystem – within Sia applications and beyond.

### Submission Requirements:
- The project must be open source
- The app must live on Skynet at a Skynet URL
- The app should do something that is useful and interesting
- The app must use IDX to connect a user to a SkyDB instance
- The app may optionally use IDX for things like profiles, social graphs, and other fun features
- Demo videos are strongly recommended for complete submissions (upload your videos to Skynet!)

### Resources:
IDX Website: https://idx.xyz 
IDX Docs: https://idx.xyz/docs 
Dev Chat: IDX Discord 
IDX Announcement: https://medium.com/3box/idx-a-devkit-for-open-identity-48edc88e8e85
