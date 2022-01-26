// define resolver functions for queries defined in GraphQl schema
module.exports = {
    notes: async (parent, args, { models }) => await models.Note.find().limit(100),
    note: async (parent, { id }, { models }) => await models.Note.findById(id),
    noteFeed: async (parent, { cursor }, { models }) => {
        // defaults
        const LIMIT = 10;
        let hasNextPage = false;
        let curosrQuery = {}; // all by default

        if (cursor) curosrQuery =  { _id: { $lt: cursor } };
        let notes = await models.Note.find(curosrQuery)
            .sort({ _id: -1 })
            .limit(LIMIT + 1);
        if (notes.length > LIMIT) {
            hasNextPage = true;
            notes = notes.slice(0, -1)
        }
        const newCursor = notes.length? notes[notes.length - 1]._id: "";

        return { notes, cursor: newCursor, hasNextPage }
        
    },
    user: async (parent, { username }, { models }) => await models.User.findOne({ username }),
    users: async (parent, args, { models }) => await models.User.find({}),
    me: async (parent, args, { models, user }) => await models.User.findById(user.id)
}