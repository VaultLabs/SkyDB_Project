/**
 * bootstrap.js will create and publish the schemas and definition to our Ceramic node, 
 * and store the Ceramic document ID (DocID) of the definition to a JSON 
 * file that will be used by the app:
 */

const { writeFile } = require('fs').promises
const Ceramic = require('@ceramicnetwork/ceramic-http-client').default
const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools')
const Wallet = require('identity-wallet').default
const fromString = require('uint8arrays/from-string')
require('dotenv').config();

const NoteSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Note',
  type: 'object',
  properties: {
    date: {
      type: 'string',
      format: 'date-time',
      title: 'date',
      maxLength: 30,
    },
    text: {
      type: 'string',
      title: 'text',
      maxLength: 4000,
    },
  },
}

const NotesListSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NotesList',
  type: 'object',
  properties: {
    notes: {
      type: 'array',
      title: 'notes',
      items: {
        type: 'object',
        title: 'NoteItem',
        properties: {
          id: {
            $ref: '#/definitions/CeramicDocId',
          },
          title: {
            type: 'string',
            title: 'title',
            maxLength: 100,
          },
        },
      },
    },
  },
  definitions: {
    CeramicDocId: {
      type: 'string',
      pattern: '^ceramic://.+(\\\\?version=.+)?',
      maxLength: 150,
    },
  },
}

async function run() {
  // Connect to the local Ceramic node
  const ceramic = new Ceramic('http://localhost:7007')

  // Create a wallet and set it as the DID provider to author documents
  const wallet = await Wallet.create({
    ceramic,
    // The seed must be provided as an environment variable
    seed: fromString(process.env.SEED, 'base16'),
    //seed: fromString('456963cbcace8f7cc6870130de836b8c9cd05cc72f87319887663b1ad606bce8', 'base16'),
    
    getPermission() {
      // This will grant all permission requests
      return Promise.resolve([])
    },
    // IDX is not needed for this wallet
    disableIDX: true,
  })
  await ceramic.setDIDProvider(wallet.getDidProvider())

  // Publish the two schemas
  const [noteSchemaID, notesListSchemaID] = await Promise.all([
    publishSchema(ceramic, { content: NoteSchema }),
    publishSchema(ceramic, { content: NotesListSchema }),
  ])

  // Create the definition using the created schema ID
  const notesID = await createDefinition(ceramic, {
    name: 'notes',
    description: 'Simple text notes',
    schema: notesListSchemaID.toUrl('base36'),
  })

  // Write config to JSON file
  const config = {
    definitions: {
      notes: notesID.toString(),
    },
    schemas: {
      Note: noteSchemaID.toUrl('base36'),
      NotesList: notesListSchemaID.toUrl('base36'),
    },
  }
  await writeFile('../config.json', JSON.stringify(config))

  console.log('Config written to src/config.json file:', config)
  process.exit(0)
}

run().catch(console.error)
