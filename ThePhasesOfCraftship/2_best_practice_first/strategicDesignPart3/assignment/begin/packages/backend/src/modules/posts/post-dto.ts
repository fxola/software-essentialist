import { InvalidPostFilterException } from "./post-exception";

export class GetPostDTO {
  constructor(public sort: "recent") {}

  public static prepare(query: unknown) {
    const { sort } = query as { sort: unknown };

    if (sort !== "recent") {
      throw new InvalidPostFilterException(sort);
    }

    return new GetPostDTO(sort);
  }
}
