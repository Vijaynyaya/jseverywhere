// define resolver functions for mutations defined in GraphQl schema
module.exports = {
    newNote: async (parent,{ content }, { models }) => await models.Note.create({
        content,
        author: "Omar Khayyam"
    }),
    updateNote: async (parent, { id, content }, { models }) => {
        return await models.Note.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },
    deleteNote: async (parent, { id }, { models }) => {
        try {
            await models.Note.findOneAndRemove({ _id: id });
            return true;
        } catch (err) {
            return false;
        }
    }
}