const app = require("./Src/App");
const connectDB = require("./Src/Config/Db");
const config = require("./Src/Config/config");
const PORT = process.env.PORT || 3000;

const startServer = async () => {

    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:",error);
        process.exit(1);
    }
};

startServer();