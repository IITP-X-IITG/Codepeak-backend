// import { google } from 'googleapis'
// import { JWT } from 'google-auth-library'
// import * as fs from 'fs'
// import fetch from 'node-fetch'
// import dotenv from 'dotenv'
// import { URLSearchParams } from 'url'

// // Types
// interface GithubIssue {
// 	id: string
// 	repository_url: string
// 	user: {
// 		login: string
// 		avatar_url: string
// 	}
// 	html_url: string
// 	labels: Array<{
// 		name: string
// 	}>
// }

// interface Config {
// 	scope: string[]
// }

// // Initialize environment variables
// dotenv.config()

// // Configuration
// const config: Config = {
// 	scope: [
// 		'https://www.googleapis.com/auth/drive',
// 		'https://www.googleapis.com/auth/drive.file',
// 		'https://www.googleapis.com/auth/spreadsheets',
// 	],
// }

// // Load PR IDs that we've already processed
// let prsTakenCare: string[] = fs.readFileSync('pr_ids.txt', 'utf-8').split('\n')

// // Load allowed repositories
// const reposList: string[] = fs
// 	.readFileSync('repos.txt', 'utf-8')
// 	.split('\n')
// 	.map((repo) => repo.toLowerCase())

// // Setup Google Sheets
// const auth = new JWT({
// 	keyFile: 'client_key.json',
// 	scopes: config.scope,
// })

// const sheets = google.sheets({ version: 'v4', auth })
// const spreadsheetId = 'CODEPEAK_23_SCORING_ID' // Replace with your spreadsheet ID

// // Helper functions
// async function awardPoints(handle: string, points: number, link: string, id: string, avatarUrl: string): Promise<void> {
// 	try {
// 		const response = await sheets.spreadsheets.values.get({
// 			spreadsheetId,
// 			range: 'A:B',
// 		})

// 		const rows = response.data.values || []
// 		const userIndex = rows.findIndex((row) => row[0].toLowerCase() === handle.toLowerCase())

// 		if (userIndex !== -1) {
// 			const currentPoints = parseInt(rows[userIndex][1]) || 0
// 			const newPoints = currentPoints + points

// 			await sheets.spreadsheets.values.update({
// 				spreadsheetId,
// 				range: `B${userIndex + 1}`,
// 				valueInputOption: 'RAW',
// 				requestBody: {
// 					values: [[newPoints]],
// 				},
// 			})

// 			console.log(`Points awarded to ${handle}: ${points} (Total: ${newPoints})`)
// 		} else {
// 			// Add new user
// 			await sheets.spreadsheets.values.append({
// 				spreadsheetId,
// 				range: 'A:D',
// 				valueInputOption: 'RAW',
// 				requestBody: {
// 					values: [[handle, points, points, link]],
// 				},
// 			})

// 			console.log(`New user ${handle} added with ${points} points`)
// 		}

// 		prsTakenCare.push(id)
// 		fs.writeFileSync('pr_ids.txt', prsTakenCare.join('\n'))
// 	} catch (error) {
// 		console.error('Error awarding points:', error)
// 	}
// }

// async function findNewContributions(): Promise<void> {
// 	const headers = {
// 		Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
// 	}

// 	// Check issues with label:issue:1
// 	const response1 = await fetch('https://api.github.com/search/issues?q=label%3Aissue%3A1', { headers })
// 	const data1 = await response1.json()

// 	for (const issue of data1.items as GithubIssue[]) {
// 		const repoName = issue.repository_url.split('/').pop()?.toLowerCase()

// 		if (!repoName || !reposList.includes(repoName)) continue
// 		if (prsTakenCare.includes(issue.id)) continue

// 		await awardPoints(issue.user.login, 1, issue.html_url, issue.id, issue.user.avatar_url)
// 	}
// }

// // Start checking for new contributions
// setInterval(findNewContributions, 180000) // Check every 3 minutes
// findNewContributions() // Initial check
