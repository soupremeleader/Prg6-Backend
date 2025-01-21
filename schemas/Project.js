import mongoose from 'mongoose';
import 'dotenv/config';

const projectSchema = new mongoose.Schema({
    title: {type: String, required: true},
    type: {type: String, required: true},
    size: {type: String, required: false},
    wool: {type: String, required: false},
    row: {type: String, required: false},
    link: {type: String, required: false}
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `${process.env.URL}${ret._id}`
                },
                collection: {
                    href: `${process.env.URL}`
                }
            }
            delete ret._id
        }
    }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;