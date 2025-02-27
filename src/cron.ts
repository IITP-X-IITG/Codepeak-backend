import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { addTransaction } from "./service/transaction";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoContent = readFileSync(resolve(__dirname, "repo.txt"), "utf-8");
const repo = repoContent.split("\n");
const repos:any[] =[];
repo.forEach((r) => {
    try {
        r=r.split("/").splice(-2).join("/");
        repos.push(r);
    } catch (error) {
        console.error("Error processing repo:", r, error);
    }
});

async function fetchIssuesAndPRs() {
  try {
    
    const response = await octokit.request("GET /search/issues", {
      q: "label:codepeak25"
    });
    
    const filteredIssues = response.data.items.filter((issue: any) => {
        try {
            return repos.some(repo => issue.repository_url.endsWith(repo));
        } catch (error) {
            console.error("Error filtering issues:", issue, error);
            return false;
        }
    });
    
    // const prResponse = await octokit.request("GET /search/issues", {
    //   q: "is:pr label:codepeak25"
    // });
    
    // const filteredPRs = prResponse.data.items.filter((pr: any) => {
    //     try {
    //         return repos.some(repo => pr.repository_url.endsWith(repo));
    //     } catch (error) {
    //         console.error("Error filtering PRs:", pr, error);
    //         return false;
    //     }
    // }
    // );
    filteredIssues.forEach(async (issue: any) => {
      try {
        console.log(`Mentor: ${issue.repository_url.replace(issue.repository_url.split("/").slice(-1).join("/"),"").replace("https://api.github.com/repos/","https://github.com/")}`);
        console.log(`Students: ${issue.user.html_url}`);
        console.log(`Issue Title: ${issue.title}`);
        console.log(`Issue URL: ${issue.html_url}`);
        console.log(`type: ${issue.html_url.split("/")?.slice(-2,-1)?.[0]}`);
        console.log(`Issue State: ${issue.state}`);
        console.log("---------------------------");
        //pranjal do error handling here if data is already present dont add it
        addTransaction(issue.user.html_url, 
                       issue.repository_url.replace(issue.repository_url.split("/").slice(-1).join("/"),"").replace("https://api.github.com/repos/","https://github.com/"),
                       issue.html_url,
                       0,
                       issue.html_url.split("/")?.slice(-2,-1)?.[0],
                       issue.state === "open");
      } catch (error) {
        console.error("Error processing issue:", issue, error);
      }
    });

    // filteredPRs.forEach((pr: any) => {
    //   try {
    //     console.log(`Mentor: ${pr.repository_url.replace(pr.repository_url.split("/").slice(-1).join("/"),"").replace("https://api.github.com/repos/","https://github.com/")}`);
    //     console.log(`Students: ${pr.user.html_url}`);
    //     console.log(`Issue Title: ${pr.title}`);
    //     console.log(`Issue URL: ${pr.html_url}`);
    //     console.log(`type: ${pr.html_url.split("/")?.slice(-2,-1)?.[0]}`);
    //     console.log(`Issue State: ${pr.state}`);
    //     console.log("---------------------------");
    //     //pranjal do error handling here if data is already present dont add it
    //     addTransaction(pr.user.html_url, pr.repository_url.replace(pr.repository_url.split("/").slice(-1).join("/"),"").replace("https://api.github.com/repos/","https://github.com/"),pr.html_url,0,pr.html_url.split("/")?.slice(-2,-1)?.[0],pr.state === "open");
    //   } catch (error) {
    //     console.error("Error processing PR:", pr, error);
    //   }
    // });

    // console.log(`Filtered Issues:`,filteredIssues);
    // console.log(`Filtered Pull Requests:`,filteredPRs);
    console.log("---------------------------");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

setInterval(fetchIssuesAndPRs, 60 * 1000);
fetchIssuesAndPRs();
