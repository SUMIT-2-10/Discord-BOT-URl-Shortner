import shortid from 'shortid';
import URL from '../model/url.js';

const handleGenerateShortURL = async(discordUserId, username, guildId, originalUrl)=>{
    if(!originalUrl){
        throw new Error("URL is required");
    }
    
    const shortId = shortid.generate();
    await URL.create({
        shortId: shortId,
        redirectUrl: originalUrl,
        visitHistory:[],
        createdBy: discordUserId,
        username: username,
        guildId: guildId,
    });
    
    return shortId;
}

export { handleGenerateShortURL };