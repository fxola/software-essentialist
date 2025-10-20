import application from "./bootstrap";

const PORT = Number(process.env.PORT || 3000);

application.start(PORT);
