import express, { Request, Response } from 'express'
const Project = require('../../models/Project');

const router = express.Router();

interface ProjectInput {
    title: string;
    description: string;
    tags: string;
    mentor: string;
    mentorGithub: string;
    languages: string;
    githubLink: string;
    image: string;
    sponsored?: boolean;
    year: number;
}

// POST /projects to add a new project
router.post('/add', async (req: Request<{}, {}, ProjectInput>, res: Response) => {
    try {
        const { title, description, tags, mentor, mentorGithub, languages, githubLink, image, sponsored, year } = req.body;
        
        // Convert comma separated strings to arrays if needed.
        const tagsArr = tags.split(',').map(tag => tag.trim());
        const languagesArr = languages.split(',').map(lang => lang.trim());

        const project = new Project({
            title,
            description,
            tags: tagsArr,
            mentor,
            mentorGithub,
            languages: languagesArr,
            githubLink,
            image,
            sponsored: sponsored ? true : false,
            year
        });
        await project.save();
        res.status(201).send('Project created successfully');
    } catch (err) {
        res.status(500).send('Error saving project');
    }
});

export default router;
