const { MongoClient } = require('mongodb');
require('dotenv').config({ path: "./.env" });
async function main() {
    const Db = process.env.mongoo_URI;
    const client = new MongoClient(Db);

    try {
        await client.connect();
        const collections = await client.db("testDB").collections();
        collections.forEach((collection) => console.log(collection.s.namespace.collection));
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

main()