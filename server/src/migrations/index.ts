import { Collection, USER_TYPE } from "../config/constants";
import { generateHash } from "../utils/jwt";
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { User, Job, JobAction, Company, GlobalSetting } from '../models';

// Create Indexing in Collections 
async function ensureCollectionExists(collectionName: string) {
    const collections = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
        await mongoose.connection.db.createCollection(collectionName);
    }
}

async function compareAndCreateIndexes(collectionName: string, conditions: any[]) {
    try {
        await ensureCollectionExists(collectionName);

        const collection = mongoose.connection.collection(collectionName);
        const existingIndexes = await collection.indexes();

        const newIndexes = conditions.filter((condition: any) => 
            !existingIndexes.some(index => 
                (index.name.endsWith('_-1') ? index.name.slice(0, -3) : index.name) === condition.name
            )
        );

        if (newIndexes.length) {
            await collection.createIndexes(newIndexes);
            console.log(`Created new indexes for ${collectionName}`);
        } else {
            console.log(`Indexes for ${collectionName} already exist. Skipping creation.`);
        }
    } catch (error) {
        console.error(`Error creating indexes for ${collectionName}:`, error);
        throw error;
    }
}

export async function adminSeeder() {
    try {
        const currentTime = parseInt(moment().tz(process.env.Timezone).format('x'));
        const hashPassword = await generateHash('Admin@123');

        const adminData = {
            email: 'admin@apify.com',
            name: 'Admin',
            password: hashPassword,
            number: "1234567890",
            isVerified: 1,
            isSubscribed: 1,
            status: 1,
            type: USER_TYPE.admin,
            isDeleted: false,
            createAt: currentTime,
            updatedAt: currentTime
        };

        await User.findOneAndUpdate(
            { email: adminData.email },
            { 
                $set: {
                    name: adminData.name,
                    password: adminData.password,
                    number: adminData.number,
                    isVerified: adminData.isVerified,
                    isSubscribed: adminData.isSubscribed,
                    updatedAt: currentTime
                },
                $setOnInsert: {
                    email: adminData.email,
                    status: adminData.status,
                    type: adminData.type,
                    isDeleted: adminData.isDeleted,
                    createAt: currentTime
                }
            },
            { upsert: true }
        );

        console.log("<<<<<<<<<-------------Admin Inserted Successfully------------->>>>>>>>>>>>");

    } catch (error) {
        console.log("<<<<<<<<<<<<<<<--------------seeder error---------------->>>>>>>>>>>>>>>", error);
        throw error;
    }
}

// export async function tableIndexes() {
//     try {
//         // Jobs Indexes
//         let condition_for_multiple_indexes = [
//             { key: { companyName: -1 }, name: 'companyName' },
//             { key: { publishedAt: -1 }, name: 'publishedAt' },
//             { key: { title: -1 }, name: 'title' },
//             { key: { description: -1 }, name: 'description' }
//         ];
//         await compareAndCreateIndexes(Collection.jobsTableName, condition_for_multiple_indexes);

//         // Job Actions Indexes
//         condition_for_multiple_indexes = [
//             { key: { status: -1 }, name: 'status' },
//             { key: { jobId: -1 }, name: 'jobId' },
//             { key: { userId: -1 }, name: 'userId' },
//             { key: { isDeleted: -1 }, name: 'isDeleted' },
//             { key: { updatedAt: -1 }, name: 'updatedAt' }
//         ];
//         await compareAndCreateIndexes(Collection.jobActionTableName, condition_for_multiple_indexes);

//         // Companies Indexes
//         condition_for_multiple_indexes = [
//             { key: { name: -1 }, name: 'name' }
//         ];
//         await compareAndCreateIndexes(Collection.companiesTableName, condition_for_multiple_indexes);

//         // Global Settings Indexes
//         condition_for_multiple_indexes = [
//             { key: { excludedCompanies: -1 }, name: 'excludedCompanies' }
//         ];
//         await compareAndCreateIndexes(Collection.globalSettingsTable, condition_for_multiple_indexes);

//         console.log("<<<<<<<<<<<<<<<--------------Indexes created---------------->>>>>>>>>>>>>>>")

//     } catch (error) {
//         console.log("<<<<<<<<<<<<<<<--------------Index error---------------->>>>>>>>>>>>>>>", error);
//         throw error;
//     }
// }

// Make sure database is connected before running seeders
mongoose.connection.once('open', () => {
    adminSeeder();
    // tableIndexes();
});