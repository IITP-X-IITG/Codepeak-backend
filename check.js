const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Define Project Schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  mentor: {
    type: String,
    required: true
  },
  mentorGithub: {
    type: String,
    required: true
  },
  languages: {
    type: [String],
    default: []
  },
  githubLink: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String
  },
  sponsered: { // Note: this matches your existing data which uses "sponsered" not "sponsored"
    type: Boolean,
    default: true
  },
  year: {
    type: Number,
    required: true
  }
});

// Create model
const Project = mongoose.model('Project', projectSchema);

// MongoDB connection
const mongoUri = process.env.URL || "mongodb://localhost:27017/codepeak";

// Read projects data
const loadProjects = () => {
  try {
    const projectsData = fs.readFileSync('./updatedProjects.json', 'utf-8');
    return JSON.parse(projectsData);
  } catch (error) {
    console.error('Error reading projects file:', error);
    return [];
  }
};

// Upload projects to database
const uploadProjects = async (projects) => {
  console.log(`Attempting to upload ${projects.length} projects to database...`);
  
  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const project of projects) {
    try {
      // Check if project already exists
      const existingProject = await Project.findOne({ githubLink: project.githubLink });
      
      if (existingProject) {
        console.log(`Project already exists: ${project.title}`);
        skippedCount++;
        continue;
      }
      
      // Fill in any missing fields with defaults
      const completeProject = {
        ...project,
        tags: project.tags || [],
        languages: project.languages || [],
        image: project.image || "",
        sponsered: project.sponsered !== undefined ? project.sponsered : true
      };
      
      // Create and save new project
      const newProject = new Project(completeProject);
      await newProject.save();
      console.log(`Added project: ${project.title}`);
      addedCount++;
    } catch (error) {
      console.error(`Error adding project ${project.title}:`, error.message);
      errorCount++;
    }
  }
  
  return { addedCount, skippedCount, errorCount };
};

// Main function
const main = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // Load projects
    const projects = loadProjects();
    console.log(`Loaded ${projects.length} projects from file`);
    
    // Upload projects
    const results = await uploadProjects(projects);
    
    console.log('\nSummary:');
    console.log(`Projects processed: ${projects.length}`);
    console.log(`Projects added: ${results.addedCount}`);
    console.log(`Projects skipped (already exist): ${results.skippedCount}`);
    console.log(`Errors: ${results.errorCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

main();