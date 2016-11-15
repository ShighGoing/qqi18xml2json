function parseArgv (argv) {
    console.log(process.argv)
    process.argv.forEach((val, index) => {
        console.log(`${index}: ${val}`);
    });
}

parseArgv()
