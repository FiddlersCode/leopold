import {startServices, endServices} from "./src/services";


startServices().catch(e => {
    console.error(e);
    process.exit(1);
});


process.on('SIGTERM', async () => {
    await endServices();
});
