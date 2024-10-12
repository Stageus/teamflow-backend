import client from "../database/mongodb";

export async function getSequenceNextValue(seqName: string) {
    await client.db("team_flow").collection("counters").findOneAndUpdate(
        { id: seqName },
        { $setOnInsert: { sequence_value: 1 }},
        { returnDocument: 'after', upsert: true }
    )

    const result = await client.db("team_flow").collection("counters").findOneAndUpdate(
        { id: seqName },
        { $inc: { sequence_value: 1 }},
        { returnDocument: 'after', upsert: true }
    )

    return result?.sequence_value
}