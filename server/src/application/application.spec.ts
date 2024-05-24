import { Test, TestingModule } from "@nestjs/testing";
import { ApplicationService } from "./application.service";

describe("Application", () => {
  let provider: ApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationService],
    }).compile();

    provider = module.get<ApplicationService>(ApplicationService);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
