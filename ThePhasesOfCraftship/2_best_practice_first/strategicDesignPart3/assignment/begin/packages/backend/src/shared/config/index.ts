type Environment = "production" | "development" | "test" | "staging" | "ci";
type Script = "start" | "test-e2e" | "test-infra" | "test-unit";

export class Config {
  env: Environment;
  script: Script;

  constructor(script: Script) {
    this.env = (process.env.NODE_ENV as Environment) || "development";
    this.script = script;
  }
}
