import { MongoClient } from "mongodb";
import { mongoURI } from "../const/environment";

const client = new MongoClient(mongoURI, {
    maxPoolSize: 5
})

client.connect()

export default client