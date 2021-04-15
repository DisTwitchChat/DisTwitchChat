import  fs from "fs"
import {promises} from "fs"
import {join} from "path"

const loggingPath = join(__dirname, "../../", "logging");


export const log = async (loggingString, {file, writeToConsole=false}:any={}) => {
	const loggingFilePath = join(loggingPath, file || `${new Date().toLocaleDateString().replace(/\//g, "-")}.log`);
	if (!fs.existsSync(loggingPath)) {
		console.log("creating directory");
		await promises.mkdir(loggingPath, { recursive: true });
		await promises.writeFile(loggingFilePath, "");
	}

	loggingString = `${new Date().toLocaleTimeString("en-us", {timeZone: "America/New_York", timeZoneName: "short"})}: ${loggingString}`

	promises.appendFile(loggingFilePath, `\n${loggingString}`)
	if(writeToConsole){
		console.log(loggingString)
	}
}