import { CompositionRoot } from "../composition-root";
import { Config } from "../config";

const config = new Config("start");
const compositionRoot = CompositionRoot.createCompositionRoot(config);
export const dbConnection = compositionRoot.getDbConnection();
export const app = compositionRoot.getApplication();
