import {buildClientSchema, printSchema} from "graphql";
import * as fs from "fs";

function sortSchema(part) {
    if (part === null) return part;
    if (typeof part !== 'object')
        return part;
    if (Array.isArray(part)) {
        const strings = [];
        const objects = [];

        part.forEach(p => {
            const type = typeof p;
            if (type === 'object') objects.push(sortSchema(p));
            else if (type === 'string') strings.push(p);
            else throw new Error(`Unknown type: ${type}`);
        });
        return strings.sort().concat(objects.sort((a, b) => a.name < b.name ? -1 : 1));
    }
    const newObject = {};
    Object.keys(part).sort().forEach(key => newObject[key] = sortSchema(part[key]));
    return newObject;
}

const json = JSON.parse(fs.readFileSync(process.argv[2]).toString('utf8'));
const schema = buildClientSchema(sortSchema(json.data));
console.log(printSchema(schema));
