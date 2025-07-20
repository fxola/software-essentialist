import { Database } from "../../shared/database";
import { EmailInUseException, UsernameTakenException } from "./user-exception";
import { CreateUserDTO } from "./user-dto";

export class UserService {
  constructor(private db: Database) {}
  save = async (dto: CreateUserDTO) => {
    const { email, username } = dto;

    const foundEmail = await this.db.users.findByEmail(email);
    if (foundEmail) {
      throw new EmailInUseException();
    }

    const foundUsername = await this.db.users.findByUsername(username);
    if (foundUsername) {
      throw new UsernameTakenException();
    }

    const userDetails = await this.db.users.save(dto);

    return userDetails;
  };
}
