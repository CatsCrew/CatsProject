// scripts/generate-build-date.js
import fs from "fs";
import path from "path";

function generateBuildDate() {
  const buildDate = new Date();

  const envFilePath = path.resolve(process.cwd(), ".env");
  fs.writeFileSync(
    envFilePath,
    `VITE_APP_LAST_UPDATED="${buildDate}"\n`,
    { flag: "w" }
  );

  console.log(`Build date set to: ${buildDate}`);
}

generateBuildDate();