const fs = require('fs');
const path = require('path');

// Load .env manually
if (fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf8');
  env.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;
const cacheFile = path.join(__dirname, '.notion-cache.json');

if (!token || !databaseId) {
  console.error("Error: Missing NOTION_TOKEN or NOTION_DATABASE_ID in .env file.");
  process.exit(1);
}

function getHeaders() {
  return {
    'Authorization': `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  };
}

// Helper to extract rich text
function getRichText(prop) {
  if (!prop || !prop.rich_text) return '';
  return prop.rich_text.map(t => t.plain_text).join('');
}

async function listTasks() {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        filter: {
          property: "Status",
          status: {
            does_not_equal: "Done"
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const tasks = data.results.map(page => {
      return {
        id: page.id,
        title: page.properties['Work item']?.title?.[0]?.plain_text || "Untitled",
        status: page.properties['Status']?.status?.name || "No Status",
        priority: page.properties['Priority']?.select?.name || "None",
        problem: getRichText(page.properties['Problem / request']),
        criteria: getRichText(page.properties['Acceptance criteria']),
        files: getRichText(page.properties['Files'])
      };
    });

    // Save to cache
    fs.writeFileSync(cacheFile, JSON.stringify(tasks, null, 2));

    console.log("\n=== Active Notion Backlog ===");
    if (tasks.length === 0) {
      console.log("No active tasks found!");
    } else {
      tasks.forEach((task, idx) => {
        let statusStr = `[${task.status}]`;
        if (task.status === "Ready for agent") statusStr = `\x1b[36m[${task.status}]\x1b[0m`;
        else if (task.status === "In progress") statusStr = `\x1b[33m[${task.status}]\x1b[0m`;
        else if (task.status === "Blocked") statusStr = `\x1b[31m[${task.status}]\x1b[0m`;
        
        const priorityStr = task.priority !== "None" ? ` (Priority: ${task.priority})` : '';
        console.log(`${idx + 1}. ${statusStr} ${task.title}${priorityStr}`);
      });
    }
    console.log("\nUsage:");
    console.log("  node tools/notion-backlog.cjs list");
    console.log("  node tools/notion-backlog.cjs view <index>");
    console.log("  node tools/notion-backlog.cjs start <index>");
    console.log("  node tools/notion-backlog.cjs complete <index>\n");
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
  }
}

function loadCache() {
  if (!fs.existsSync(cacheFile)) {
    console.error("Error: No cached tasks. Run 'node tools/notion-backlog.cjs list' first.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
}

async function viewTask(indexStr) {
  const index = parseInt(indexStr, 10) - 1;
  const tasks = loadCache();
  const task = tasks[index];
  if (!task) {
    console.error(`Error: Task index '${indexStr}' not found in cache.`);
    process.exit(1);
  }

  console.log(`\n==================================================`);
  console.log(`Title:       ${task.title}`);
  console.log(`Status:      ${task.status}`);
  console.log(`Priority:    ${task.priority}`);
  console.log(`Notion ID:   ${task.id}`);
  console.log(`==================================================`);
  console.log(`\n[Problem / Request]`);
  console.log(task.problem || "(None)");
  console.log(`\n[Acceptance Criteria]`);
  console.log(task.criteria || "(None)");
  console.log(`\n[Files to Edit]`);
  console.log(task.files || "(None)");
  console.log(`==================================================\n`);
}

async function updateStatus(indexStr, newStatusName) {
  const index = parseInt(indexStr, 10) - 1;
  const tasks = loadCache();
  const task = tasks[index];
  if (!task) {
    console.error(`Error: Task index '${indexStr}' not found in cache.`);
    process.exit(1);
  }

  console.log(`Updating task '${task.title}' status to '${newStatusName}'...`);

  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${task.id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        properties: {
          'Status': {
            status: {
              name: newStatusName
            }
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log(`Successfully updated status to '${newStatusName}'!`);
    // Update local cache
    task.status = newStatusName;
    fs.writeFileSync(cacheFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error updating status:", error.message);
  }
}

async function main() {
  const [command, arg] = process.argv.slice(2);

  switch (command) {
    case 'list':
    case undefined:
      await listTasks();
      break;
    case 'view':
      if (!arg) {
        console.error("Error: Missing task index. Usage: node tools/notion-backlog.cjs view <index>");
        process.exit(1);
      }
      await viewTask(arg);
      break;
    case 'start':
      if (!arg) {
        console.error("Error: Missing task index. Usage: node tools/notion-backlog.cjs start <index>");
        process.exit(1);
      }
      await updateStatus(arg, 'In progress');
      break;
    case 'complete':
      if (!arg) {
        console.error("Error: Missing task index. Usage: node tools/notion-backlog.cjs complete <index>");
        process.exit(1);
      }
      await updateStatus(arg, 'Done');
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log("Available commands: list, view <index>, start <index>, complete <index>");
  }
}

main();
