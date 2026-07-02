import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
    console.info(`Fahad Jeweller server running on port ${env.port}`);
});
