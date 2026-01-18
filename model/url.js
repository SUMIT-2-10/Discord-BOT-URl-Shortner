import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
    {
         shortId:{
            type :String,
            required: true,
            unique: true,
        },
        redirectUrl:{
            type:String,
            required: true,
        },
        visitHistory:[
            {timestamp:{type:Number}}
        ],
        createdBy: {
            type: String,  // Discord user ID (snowflake)
            required: true,
        },
        username: {
            type: String,  // Discord username
        },
        guildId: {
            type: String,  // Discord server/guild ID where created
        }
    },{timestamps:true}
    
)

const URL = mongoose.model('urldc',urlSchema);

export default URL;