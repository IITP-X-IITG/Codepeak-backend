import { readFileSync } from 'fs';
import fetch from 'node-fetch';

const github_token = process.env.GITHUB_TOKEN;
const headers = {'Authorization': 'Bearer ' + github_token};
//use github token for higher rate limit upto 5000 requests per hour without it 60 requests per hour

const URLs = [
    "https://api.github.com/search/issues?q=is%3Aissue+label%3A%22codepeak+23%22",
    "https://api.github.com/search/issues?q=is%3Aissue+label%3A%22codepeak23%22",
    "https://api.github.com/search/issues?q=is%3Aissue+label%3A%22CodePeak%E2%80%9923%22",
    "https://api.github.com/search/issues?q=is%3Aissue+is%3Aclosed+label%3A%22codepeak+23%22",
    "https://api.github.com/search/issues?q=is%3Aissue+is%3Aclosed+label%3A%22codepeak23%22",
    "https://api.github.com/search/issues?q=is%3Apr+label%3A%22codepeak+23%22",
    "https://api.github.com/search/issues?q=is%3Apr+label%3A%22codepeak23%22",
    "https://api.github.com/search/issues?q=is%3Apr+is%3Amerged+label%3A%22codepeak+23%22",
    "https://api.github.com/search/issues?q=is%3Apr+is%3Amerged+label%3A%22codepeak23%22"
];

async function fetchGithubData() {
    try {
        const distinctUrls = new Set();
        
        for(let j = 0; j < URLs.length; j++) {
            const response = await fetch(URLs[j]);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            for (const item of data.items) {
                const repoUrl = item.html_url.replace(item.html_url.split('/').slice(-2).join('/'), '');
                distinctUrls.add(repoUrl);
            }
        }
        
        console.log('Distinct repositories:', Array.from(distinctUrls));
        console.log('Total distinct repositories:', distinctUrls.size);
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the async function
fetchGithubData();
