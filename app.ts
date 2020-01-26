import {startServices, endServices} from "./src/services";


startServices().catch(e => {
    if (process.env.NODE_ENV === "production") {
        process.env.MONGO_URI = "mongodb://192.168.0.34:27017/leopold";
        process.env.PORT = '8080';
        process.env.HOST = "192.168.0.34"
    }
    console.error(e);
    process.exit(1);
});


process.on('SIGTERM', async () => {
    await endServices();
});
