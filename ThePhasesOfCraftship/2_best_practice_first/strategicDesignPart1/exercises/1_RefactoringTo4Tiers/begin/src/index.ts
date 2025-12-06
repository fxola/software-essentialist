import application from "./bootstrap";

const port = process.env.PORT || 3000;

application.start(Number(port));
