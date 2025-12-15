import { createAPIClient } from "@dddforum/shared/src/api";
import { CompositionRoot } from "../../src/shared/compositionRoot";
import { Config } from "../../src/shared/config";

describe("Marketing API", () => {
  const apiClient = createAPIClient("http://localhost:3000");
  const config = new Config("test:infra");
  const composition = CompositionRoot.createCompositionRoot(config);
  const server = composition.getWebServer();
  const application = composition.getApplication();

  let addEmailToListSpy: jest.SpyInstance;

  beforeAll(async () => {
    await server.start();
    addEmailToListSpy = jest.spyOn(application.marketing, "addEmailToList");
  });

  afterEach(() => {
    addEmailToListSpy.mockClear();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("Can add user email to list successfully", async () => {
    const userEmail = "sam@gmail.com";

    await apiClient.marketing.addEmailToList(userEmail);

    expect(addEmailToListSpy).toHaveBeenCalledTimes(1);
    expect(addEmailToListSpy).toHaveBeenCalledWith(userEmail);
  });

  it("Can fail to add email to list when invalid email is provided", async () => {
    const userEmail = "invalidemailaddress";

    await apiClient.marketing.addEmailToList(userEmail);

    expect(addEmailToListSpy).toHaveBeenCalledTimes(0);
  });
});
