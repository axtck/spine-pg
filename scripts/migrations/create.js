
const { writeFileSync } = require("fs");
const { join } = require("path");
const mkdirp = require("mkdirp");
const minimist = require("minimist");

const migrationFileContent = `import { Database } from "../core/Database";

export const upgrade = async (database: Database): Promise<void> => {
    await database.query("show tables");
};`;

const create = async () => {
    try {
        // create migrations folder if it doesn't exist
        const migrationsFolder = join(__dirname, "..", "..", "src", "migrations");
        await mkdirp(migrationsFolder);

        // create migration name
        const parsedArgv = parseArgv();
        const migrationName = createFileName(parsedArgv.name);

        // write migration
        const migrationPath = join(migrationsFolder, migrationName);
        writeFileSync(migrationPath, migrationFileContent);
        console.log("successfully created migration");
        console.log(migrationPath);
    } catch (e) {
        console.log(`creating migration failed: ${e}`);
    }
};

const parseArgv = () => {
    const args = minimist(process.argv.slice(2), {
        string: "name",
        alias: { n: "name" }
    });

    // arg validation
    for (const key of Object.keys(args)) {
        if (!["_", "name", "n"].includes(key)) throw new Error(`${key} is not a valid arg, use name => npm run migration:create -- (--name=x | --name x | --n=x | --n x)`);
    }
    if (args._ && args._.length) {
        throw new Error(`parsing args failed: '${JSON.stringify(extra)}' ${extra.length > 1 ? "are" : "is"} invalid`);
    }
    if (!/^[a-zA-Z0-9]+$/.test(args.name)) {
        throw new Error("name has to meet /^[a-zA-Z0-9]+$/");
    }

    return {
        name: args.name
    };
};

const createFileName = (name) => {
    const timestamp = new Date().getTime();
    const migrationFileName = `${timestamp}_${name}.ts`;
    return migrationFileName;
};

create();