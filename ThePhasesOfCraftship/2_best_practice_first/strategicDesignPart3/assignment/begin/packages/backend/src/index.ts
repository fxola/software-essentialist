import { app } from "./shared/bootstrap";

const port = process.env.PORT || 3000;

app.start(Number(port));
