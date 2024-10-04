import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

// Function to connect to MongoDB Atlas
const connectToDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  return client.db('hire-zone');
};

// API to delete a company
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      const db = await connectToDB();
      await db.collection('companies').deleteOne({ _id: new ObjectId(id as string) });
      res.status(200).json({ message: "Company deleted" });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting company' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
