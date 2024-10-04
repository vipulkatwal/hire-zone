import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

// Function to connect to MongoDB Atlas
const connectToDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  return client.db('yourDatabaseName');
};

// API to get all companies
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const db = await connectToDB();
      const companies = await db.collection('companies').find({}).toArray();
      res.status(200).json({ companies });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching companies' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
