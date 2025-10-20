import { Database } from "../../shared/database";
import {
  EmailInUseException,
  UsernameTakenException,
  UserNotFoundException,
} from "./user-exception";
import { CreateUserDTO, GetUserByEmailDTO } from "./user-dto";

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

  getByEmail = async (dto: GetUserByEmailDTO) => {
    const user = await this.db.users.findByEmail(dto.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  };
}
